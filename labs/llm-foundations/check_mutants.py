"""Run the complete lab once per listed mutant; only real test failures kill it."""
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET


MUTANTS = (
    "mask_crosses_documents", "pack_drops_eos", "dedup_skips_nfc", "contamination_off_by_one",
    "gqa_repeat_not_interleave", "causal_mask_off_by_one", "rope_ignores_offset", "tied_head_double_counted",
    "top_p_excludes_crossing_token", "no_renormalize", "temperature_after_softmax", "labels_not_shifted",
    "resume_without_optimizer_state", "resume_reseeds_data_order", "flops_counts_macs",
    "params_missing_final_norm", "adamw_bytes_without_grads", "bootstrap_unpaired",
    "cache_rope_restarts_at_zero", "kv_bytes_uses_query_heads", "decode_recomputes_prefix",
)


def main():
    root = Path(__file__).resolve().parent
    temporary_root = Path("/tmp/opencode")
    temporary_root.mkdir(parents=True, exist_ok=True)
    problems = []
    print("mutant | failing tests (parameter cases grouped)", flush=True)
    print("--- | ---", flush=True)
    with tempfile.TemporaryDirectory(prefix="atlas-mutants-", dir=temporary_root) as directory:
        for name in MUTANTS:
            report = Path(directory) / f"{name}.xml"
            env = dict(os.environ, ATLAS_LAB_IMPL=f"mutants.{name}")
            try:
                result = subprocess.run(
                    [sys.executable, "-m", "pytest", "-q", f"--junitxml={report}"],
                    cwd=root, env=env, capture_output=True, text=True, timeout=120,
                )
            except subprocess.TimeoutExpired:
                problems.append(name)
                print(f"{name} | ERROR: timed out", flush=True)
                continue
            if not report.exists():
                problems.append(name)
                print(f"{name} | ERROR: no pytest report\n{result.stdout}\n{result.stderr}", flush=True)
                continue
            cases = list(ET.parse(report).getroot().iter("testcase"))
            failures = [case for case in cases if case.find("failure") is not None]
            errors = [case for case in cases if case.find("error") is not None]
            skipped = [case for case in cases if case.find("skipped") is not None]
            names = sorted({case.get("name", "").split("[")[0] for case in failures})
            valid = result.returncode == 1 and failures and not errors and not skipped
            print(f"{name} | {', '.join(names) if names else 'SURVIVED / ERROR'}", flush=True)
            if not valid:
                problems.append(name)
                print(result.stdout + result.stderr, flush=True)
    if problems:
        print("Mutation check failed: " + ", ".join(problems))
        return 1
    print(f"All {len(MUTANTS)} mutants caught by assertion failures.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
