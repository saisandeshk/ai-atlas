"""Sampling, explicit AdamW, random-window loading and complete checkpoints."""
import math
from pathlib import Path
import random

import numpy as np
import torch

from .model import make_model, model_logits


def filter_probs(logits, temperature, top_k, top_p):
    if temperature == 0:
        return torch.nn.functional.one_hot(logits.argmax(-1), logits.shape[-1]).to(logits.dtype)
    probs = (logits / temperature).softmax(-1)
    sorted_probs, indices = probs.sort(descending=True, dim=-1)
    if top_k is not None:
        sorted_probs[..., min(top_k, logits.shape[-1]):] = 0
    sorted_probs = sorted_probs / sorted_probs.sum(-1, keepdim=True)
    if top_p is not None and top_p < 1:
        # Mass strictly before each token: keep the first crossing token.
        before = torch.cat((torch.zeros_like(sorted_probs[..., :1]),
                            sorted_probs.cumsum(-1)[..., :-1]), -1)
        sorted_probs = sorted_probs.masked_fill(before >= top_p, 0)
    sorted_probs = sorted_probs / sorted_probs.sum(-1, keepdim=True)
    return torch.zeros_like(probs).scatter(-1, indices, sorted_probs)


class AdamW:
    """No optimizer library shortcut: decay, moments and bias correction explicitly."""
    def __init__(self, parameters):
        self.parameters = list(parameters)
        self.m = [torch.zeros_like(p) for p in self.parameters]
        self.v = [torch.zeros_like(p) for p in self.parameters]
        self.step_number = 0

    def zero_grad(self):
        for p in self.parameters:
            p.grad = None

    @torch.no_grad()
    def step(self, lr):
        self.step_number += 1
        for p, m, v in zip(self.parameters, self.m, self.v):
            grad = p.grad
            m.mul_(.9).add_(grad, alpha=.1)
            v.mul_(.95).addcmul_(grad, grad, value=.05)
            corrected_m = m / (1 - .9 ** self.step_number)
            corrected_v = v / (1 - .95 ** self.step_number)
            p.mul_(1 - lr * .01)
            p.addcdiv_(corrected_m, corrected_v.sqrt().add_(1e-8), value=-lr)

    def state_dict(self):
        return {"m": self.m, "v": self.v, "step": self.step_number}

    def load_state_dict(self, state):
        self.m, self.v, self.step_number = state["m"], state["v"], state["step"]


def learning_rate(step):
    if step < 5:
        return .003 * (step + 1) / 5
    progress = min((step - 5) / 195, 1)
    return .0003 + .5 * (.003 - .0003) * (1 + math.cos(math.pi * progress))


def random_batch(tokens, context_length, generator):
    starts = torch.randint(len(tokens) - context_length, (16,), generator=generator)
    windows = tokens[starts[:, None] + torch.arange(context_length + 1)[None, :]]
    return windows[:, :-1], windows[:, 1:]


def train(config, tokens, steps, out_dir, resume_from, seed, *,
          unshifted_labels=False, restore_optimizer=True, restore_data=True):
    """Internal engine; switches let mutants express one realistic training bug."""
    random.seed(seed)
    np.random.seed(seed)
    model = make_model(config, seed)
    optimizer = AdamW(model.parameters())
    generator = torch.Generator().manual_seed(seed)
    global_step = 0
    if resume_from is not None:
        # Only load checkpoints you generated yourself; pickle is not safe for strangers.
        checkpoint = torch.load(resume_from, map_location="cpu", weights_only=False)
        model.load_state_dict(checkpoint["model"])
        if restore_optimizer:
            optimizer.load_state_dict(checkpoint["optimizer"])
        global_step = checkpoint["step"]
        torch.set_rng_state(checkpoint["torch_rng"])
        random.setstate(checkpoint["python_rng"])
        np.random.set_state(checkpoint["numpy_rng"])
        if restore_data:
            generator.set_state(checkpoint["data_rng"])
    corpus = torch.from_numpy(np.asarray(tokens, dtype=np.int64))
    losses = []
    model.train()
    for step in range(global_step, steps):
        x, y = random_batch(corpus, config.context_length, generator)
        if unshifted_labels:
            y = x
        optimizer.zero_grad()
        logits = model_logits(model, x)
        loss = torch.nn.functional.cross_entropy(logits.flatten(0, 1), y.flatten())
        loss.backward()
        # Explicit global norm clipping, including all trainable tensors.
        norm = torch.stack([p.grad.square().sum() for p in model.parameters()]).sum().sqrt()
        scale = torch.clamp(1.0 / (norm + 1e-6), max=1.0)
        for p in model.parameters():
            p.grad.mul_(scale)
        optimizer.step(learning_rate(step))
        losses.append(loss.item())
        global_step = step + 1
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    torch.save({"config": config, "model": model.state_dict(),
                "optimizer": optimizer.state_dict(), "step": global_step,
                "torch_rng": torch.get_rng_state(), "python_rng": random.getstate(),
                "numpy_rng": np.random.get_state(), "data_rng": generator.get_state()},
               Path(out_dir) / "checkpoint.pt")
    return losses


def run_training(config, tokens, steps, out_dir, resume_from, seed):
    return train(config, tokens, steps, out_dir, resume_from, seed)
