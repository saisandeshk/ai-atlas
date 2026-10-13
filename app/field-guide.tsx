'use client';

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  Copy,
  CornerDownRight,
  Download,
  Flag,
  FlaskConical,
  Hammer,
  LibraryBig,
  Lightbulb,
  ListChecks,
  Map,
  Play,
  Repeat2,
  Route,
  Sparkles,
  Target,
  TriangleAlert,
  Upload,
} from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { plain, tex } from '@/lib/math';

import { GlobalSearch, type SearchEntry } from './global-search';
import { ThemeToggle } from './theme-toggle';

type Scope = 'required' | 'optional' | 'depth' | 'later';
type ProgressStep = 'learned' | 'practised' | 'passed';
type TopicProgress = Record<ProgressStep, boolean>;
type ProgressState = Record<string, TopicProgress>;

type Resource = {
  id: string;
  role: string;
  priority: string;
  name: string;
  provider: string;
  url?: string;
  localPath?: string;
  access: string;
  use: string;
};

type Topic = { id: string; title: string; scope: Scope };

type UnitTarget = 'explain' | 'derive' | 'implement' | 'measure';
type StudyItem = {
  resource: string;
  title: string;
  url?: string;
  locator: string;
  depth?: string;
};
type PracticeItem = {
  name: string;
  url: string;
  locator: string;
  note?: string;
};
type Unit = {
  id: string;
  title: string;
  hours: number;
  target: UnitTarget[];
  topics: string[];
  outcomes: string[];
  why: string;
  next: Array<{ unit?: string; route?: string; note: string }>;
  study: StudyItem[];
  focus: string[];
  reproduce: string;
  traps: string[];
  selfTest: Array<{ q: string; a: string }>;
  practice: PracticeItem[];
  practiceNote?: string;
  stopWhen: string;
  fit: { verdict: string; note: string };
};
type RubricItem = { criterion: string; pass: string; strong: string };
type MiniProject = {
  title: string;
  hours: string;
  brief: string;
  units: string[];
  steps: string[];
  deliverables: string[];
  checks: Array<{
    kind: 'harness' | 'external-tests' | 'rubric';
    name: string;
    url?: string;
    command?: string;
    note?: string;
  }>;
  rubric: RubricItem[];
  feedsInto: string;
};

type Section = {
  index: string;
  id: string;
  title: string;
  why: string;
  topics: Topic[];
  resources: Resource[];
  checkpoint: string;
  leaveForLater: string[];
  units?: Unit[];
  miniProject?: MiniProject;
};

type Stage = {
  index: string;
  id: string;
  title: string;
  level: string;
  summary: string;
  sections: Section[];
  milestone: {
    title: string;
    description: string;
    deliverables: string[];
  };
  capstone?: { hours: string; rubric: RubricItem[] };
};

type AdvancedTrack = {
  index?: string;
  id: string;
  title: string;
  summary: string;
  level?: string;
  roadmapSource?: string;
  sections?: Section[];
  milestone?: Stage['milestone'];
  capstone?: Stage['capstone'];
};

export type Curriculum = {
  stages: Stage[];
  coreMap: Array<{
    index: string;
    id: string;
    title: string;
    level: string;
    summary: string;
  }>;
  advancedTracks: AdvancedTrack[];
};
// The progress key keeps its old name so saved progress survives the rename.
const storageKey = 'field-guide-progress-v1';
const placeStorageKey = 'ai-atlas-place-v1';
const lastUnitStorageKey = 'ai-atlas-last-unit-v1';

const scopeLabels: Record<Scope, string> = {
  required: 'Required',
  optional: 'Optional',
  depth: 'Depth',
  later: 'Later',
};

const progressLabels: Array<{
  key: ProgressStep;
  label: string;
  short: string;
}> = [
  { key: 'learned', label: 'Learned', short: 'Learn' },
  { key: 'practised', label: 'Practised', short: 'Practice' },
  { key: 'passed', label: 'Passed', short: 'Pass' },
];

function topicKey(sectionId: string, topicId: string) {
  return `${sectionId}:${topicId}`;
}

// Sections with study units track progress per unit, and one Done box for the
// mini-project and for the route capstone.
function unitKey(routeId: string, sectionId: string, unitId: string) {
  return `unit:${routeId}/${sectionId}/${unitId}`;
}

function miniKey(routeId: string, sectionId: string) {
  return `mini:${routeId}/${sectionId}`;
}

function capstoneKey(routeId: string) {
  return `capstone:${routeId}`;
}

const targetLabels: Record<UnitTarget, string> = {
  explain: 'Explain',
  derive: 'Derive',
  implement: 'Implement',
  measure: 'Measure',
};

const checkKindLabels: Record<MiniProject['checks'][number]['kind'], string> = {
  harness: 'Atlas lab',
  'external-tests': 'Public tests',
  rubric: 'Rubric',
};

function routeHasUnits(route: Stage) {
  return route.sections.some((section) => section.units?.length);
}

function emptyProgress(): TopicProgress {
  return { learned: false, practised: false, passed: false };
}

function progressFor(progress: ProgressState, key: string) {
  return progress[key] ?? emptyProgress();
}

function sanitizeProgress(
  value: unknown,
  validTopicKeys: ReadonlySet<string>,
): ProgressState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const sanitized: ProgressState = {};
  for (const [key, rawProgress] of Object.entries(value)) {
    if (
      !validTopicKeys.has(key) ||
      !rawProgress ||
      typeof rawProgress !== 'object' ||
      Array.isArray(rawProgress)
    ) {
      continue;
    }

    const candidate = rawProgress as Partial<TopicProgress>;
    const passed = candidate.passed === true;
    const practised = passed || candidate.practised === true;
    const learned = practised || candidate.learned === true;
    if (learned || practised || passed) {
      sanitized[key] = { learned, practised, passed };
    }
  }
  return sanitized;
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}

// Scroll once the expanded unit has rendered. Returns a cancel function.
function scrollToUnit(unitId: string) {
  const task = window.setTimeout(() => {
    document.getElementById(`unit-${unitId}`)?.scrollIntoView({
      behavior: preferredScrollBehavior(),
      block: 'start',
    });
  }, 0);
  return () => window.clearTimeout(task);
}

function ResourceCardBody({ resource }: { resource: Resource }) {
  const priorityLabel =
    resource.priority === 'primary'
      ? 'Primary'
      : resource.priority === 'required'
        ? 'Required'
        : resource.priority === 'reference'
          ? 'Reference'
          : resource.priority === 'support'
            ? 'Support'
            : resource.priority === 'optional'
              ? 'Optional'
              : resource.priority === 'depth'
                ? 'Depth'
                : null;

  return (
    <>
      <div className="resource-tags">
        <span className={`role ${resource.role}`}>
          <i aria-hidden="true" />
          {resource.role}
        </span>
        {priorityLabel && (
          <span className={`priority-tag ${resource.priority}`}>
            <i aria-hidden="true" />
            {priorityLabel}
          </span>
        )}
      </div>
      <h3>{tex(resource.name)}</h3>
      <p className="provider">{resource.provider}</p>
      <p>{tex(resource.use)}</p>
      {resource.localPath && (
        <code className="local-path">{resource.localPath}</code>
      )}
      {resource.url && (
        <span className="resource-open">
          Open resource <ArrowUpRight aria-hidden="true" />
        </span>
      )}
    </>
  );
}

// A real table on wide containers; each row stacks into a card when the
// container is too narrow for three readable columns.
function RubricTable({ rubric }: { rubric: RubricItem[] }) {
  return (
    <div className="rubric-wrap">
      <table className="rubric">
        <thead>
          <tr>
            <th scope="col">Criterion</th>
            <th scope="col">Pass</th>
            <th scope="col">Strong</th>
          </tr>
        </thead>
        <tbody>
          {rubric.map((item) => (
            <tr key={item.criterion}>
              <th scope="row">{tex(item.criterion)}</th>
              <td>
                <span className="rubric-tag" aria-hidden="true">
                  Pass
                </span>
                {tex(item.pass)}
              </td>
              <td>
                <span className="rubric-tag" aria-hidden="true">
                  Strong
                </span>
                {tex(item.strong)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const task = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(task);
  }, [copied]);

  return (
    <div className="check-command">
      <code>{command}</code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(command).then(
            () => setCopied(true),
            () => undefined,
          );
        }}
        aria-label={copied ? 'Copied' : `Copy command: ${command}`}
        title={copied ? 'Copied' : 'Copy'}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
    </div>
  );
}

function ProgressChecks({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TopicProgress;
  onChange: (step: ProgressStep, checked: boolean) => void;
}) {
  return (
    <div className="topic-checks">
      {progressLabels.map(({ key: step, label: stepLabel, short }) => (
        <label key={step} title={stepLabel}>
          <span className="sr-only">
            {stepLabel}: {label}
          </span>
          <Checkbox
            checked={value[step]}
            onCheckedChange={(checked) => onChange(step, checked)}
            aria-label={`${stepLabel}: ${label}`}
          />
          <span className="check-tag" aria-hidden="true">
            {short}
          </span>
        </label>
      ))}
    </div>
  );
}

function UnitCard({
  unit,
  number,
  section,
  progress,
  onStep,
  expanded,
  onToggle,
  onFollow,
  canFollow,
}: {
  unit: Unit;
  number: number;
  section: Section;
  progress: TopicProgress;
  onStep: (step: ProgressStep, checked: boolean) => void;
  expanded: boolean;
  onToggle: () => void;
  onFollow: (link: Unit['next'][number]) => void;
  canFollow: (link: Unit['next'][number]) => boolean;
}) {
  const topicById = new globalThis.Map(
    section.topics.map((topic) => [topic.id, topic]),
  );
  const resourceById = new globalThis.Map(
    section.resources.map((resource) => [resource.id, resource]),
  );
  const bodyId = `unit-body-${unit.id}`;

  return (
    <li
      id={`unit-${unit.id}`}
      className={`unit-card${expanded ? ' open' : ''}${progress.passed ? ' passed' : ''}`}
    >
      <div className="unit-summary">
        <button
          type="button"
          className="unit-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          <span className="unit-number">U{number}</span>
          <span className="unit-heading">
            <strong>{tex(unit.title)}</strong>
            <small>
              <span className="unit-hours">
                <Clock aria-hidden="true" /> about {unit.hours} h
              </span>
              {unit.target.map((target) => (
                <span key={target} className={`target-chip ${target}`}>
                  {targetLabels[target]}
                </span>
              ))}
            </small>
          </span>
          <ChevronRight className="unit-chevron" aria-hidden="true" />
        </button>
        <ProgressChecks label={plain(unit.title)} value={progress} onChange={onStep} />
      </div>

      {expanded && (
        <div className="unit-body" id={bodyId}>
          <p className="unit-why">{tex(unit.why)}</p>

          <div className="unit-columns">
            <section>
              <h4>You can now</h4>
              <ul>
                {unit.outcomes.map((outcome) => (
                  <li key={outcome}>{tex(outcome)}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>Covers</h4>
              <ul className="unit-topics">
                {unit.topics.map((topicId) => {
                  const topic = topicById.get(topicId);
                  if (!topic) return null;
                  return (
                    <li key={topicId}>
                      {tex(topic.title)}
                      {topic.scope !== 'required' && (
                        <small className={`scope-meta ${topic.scope}`}>
                          <i aria-hidden="true" />
                          {scopeLabels[topic.scope]}
                        </small>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          <section className="unit-study">
            <h4>
              <BookOpen aria-hidden="true" /> Study, in this order
            </h4>
            <ol>
              {unit.study.map((item) => {
                const resource = resourceById.get(item.resource);
                const href = item.url ?? resource?.url;
                return (
                  <li key={`${item.resource}-${item.title}`}>
                    <div className="study-title">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tex(item.title)}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      ) : (
                        <span>{tex(item.title)}</span>
                      )}
                      {resource && (
                        <span className={`priority-tag ${resource.priority}`}>
                          <i aria-hidden="true" />
                          {resource.name}
                        </span>
                      )}
                    </div>
                    <p>{tex(item.locator)}</p>
                    {item.depth && (
                      <p className="study-depth">
                        <strong>Depth:</strong> {tex(item.depth)}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="unit-focus">
            <h4>
              <Lightbulb aria-hidden="true" /> Focus on
            </h4>
            <ul>
              {unit.focus.map((point) => (
                <li key={point}>{tex(point)}</li>
              ))}
            </ul>
          </section>

          <section className="unit-reproduce">
            <h4>
              <Repeat2 aria-hidden="true" /> Reproduce closed-book
            </h4>
            <p>{tex(unit.reproduce)}</p>
          </section>

          <section className="unit-traps">
            <h4>
              <TriangleAlert aria-hidden="true" /> Traps
            </h4>
            <ul>
              {unit.traps.map((trap) => (
                <li key={trap}>{tex(trap)}</li>
              ))}
            </ul>
          </section>

          <section className="unit-practice">
            <h4>
              <Hammer aria-hidden="true" /> Practice
            </h4>
            {unit.practice.length ? (
              <ul>
                {unit.practice.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tex(item.name)}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <p>{tex(item.locator)}</p>
                    {item.note && <p className="practice-note">{tex(item.note)}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{tex(unit.practiceNote)}</p>
            )}
          </section>

          <section className="unit-selftest">
            <h4>
              <ListChecks aria-hidden="true" /> Self-test
            </h4>
            <ol>
              {unit.selfTest.map((item) => (
                <li key={item.q}>
                  <p>{tex(item.q)}</p>
                  <details>
                    <summary>Show answer</summary>
                    <p>{tex(item.a)}</p>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          <section className="unit-stop">
            <h4>
              <Flag aria-hidden="true" /> Stop when
            </h4>
            <p>{tex(unit.stopWhen)}</p>
          </section>

          <section className="unit-next">
            <h4>Leads to</h4>
            <div>
              {unit.next.map((link) => (
                <button
                  key={`${link.unit ?? link.route}-${link.note}`}
                  type="button"
                  disabled={!canFollow(link)}
                  onClick={() => onFollow(link)}
                >
                  <ArrowRight aria-hidden="true" />
                  <span>{tex(link.note)}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </li>
  );
}

function MiniProjectCard({
  sectionId,
  mini,
  units,
  done,
  onDone,
}: {
  sectionId: string;
  mini: MiniProject;
  units: Unit[];
  done: boolean;
  onDone: (checked: boolean) => void;
}) {
  const numberOf = (unitId: string) =>
    units.findIndex((unit) => unit.id === unitId) + 1;
  return (
    <article
      id={`mini-${sectionId}`}
      className={`mini-project${done ? ' done' : ''}`}
    >
      <header>
        <div className="checkpoint-icon">
          <Hammer aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">
            Section mini-project · about {mini.hours} hours
          </p>
          <h3>{tex(mini.title)}</h3>
          <p className="mini-uses">
            Uses {mini.units.map((unitId) => `U${numberOf(unitId)}`).join(', ')}
          </p>
        </div>
        <label className="mini-done">
          <span>Done</span>
          <Checkbox
            checked={done}
            onCheckedChange={(checked) => onDone(checked)}
            aria-label={`Done: ${plain(mini.title)}`}
          />
        </label>
      </header>
      <p className="mini-brief">{tex(mini.brief)}</p>
      <div className="unit-columns">
        <section>
          <h4>Steps</h4>
          <ol>
            {mini.steps.map((step) => (
              <li key={step}>{tex(step)}</li>
            ))}
          </ol>
        </section>
        <section>
          <h4>Deliverables</h4>
          <ul>
            {mini.deliverables.map((item) => (
              <li key={item}>{tex(item)}</li>
            ))}
          </ul>
          <h4>How it is checked</h4>
          <ul className="mini-checks">
            {mini.checks.map((check) => (
              <li key={check.name}>
                <span className={`check-kind ${check.kind}`}>
                  {checkKindLabels[check.kind]}
                </span>{' '}
                {check.url ? (
                  <a href={check.url} target="_blank" rel="noopener noreferrer">
                    {tex(check.name)}
                  </a>
                ) : (
                  tex(check.name)
                )}
                {check.command && <CopyCommand command={check.command} />}
                {check.note && <p>{tex(check.note)}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <h4>Rubric</h4>
      <RubricTable rubric={mini.rubric} />
      <p className="mini-feeds">
        <CornerDownRight aria-hidden="true" /> Feeds into: {tex(mini.feedsInto)}
      </p>
    </article>
  );
}

function countProgress(
  stage: Stage,
  progress: ProgressState,
  step: ProgressStep,
) {
  if (routeHasUnits(stage)) {
    return stage.sections.reduce(
      (count, section) =>
        count +
        (section.units ?? []).filter(
          (unit) =>
            progressFor(progress, unitKey(stage.id, section.id, unit.id))[step],
        ).length,
      0,
    );
  }
  return stage.sections.reduce(
    (count, section) =>
      count +
      section.topics.filter(
        (topic) => progressFor(progress, topicKey(section.id, topic.id))[step],
      ).length,
    0,
  );
}

type UnitRef = { route: Stage; section: Section; unit: Unit; key: string };

function unitRefs(routes: Stage[]): UnitRef[] {
  return routes.flatMap((route) =>
    route.sections.flatMap((section) =>
      (section.units ?? []).map((unit) => ({
        route,
        section,
        unit,
        key: unitKey(route.id, section.id, unit.id),
      })),
    ),
  );
}

// "1.2" for the second unit of section 01.
function unitLabel(section: Section, unit: Unit) {
  const sectionNumber = section.index.replace(/^0+(?=\d)/, '');
  return `${sectionNumber}.${(section.units ?? []).indexOf(unit) + 1}`;
}

// The unit to work on next: the last one touched if it is not passed yet,
// otherwise the next unpassed unit in the same route, otherwise the first
// unpassed unit in the list.
function pickNextUnit(
  refs: UnitRef[],
  lastKey: string | null,
  progress: ProgressState,
) {
  const isOpen = (ref: UnitRef) => !progressFor(progress, ref.key).passed;
  const lastIndex = lastKey ? refs.findIndex((ref) => ref.key === lastKey) : -1;
  if (lastIndex >= 0) {
    const routeId = refs[lastIndex].route.id;
    const inRoute = (ref: UnitRef) => ref.route.id === routeId && isOpen(ref);
    const next =
      refs.slice(lastIndex).find(inRoute) ??
      refs.slice(0, lastIndex).find(inRoute);
    if (next) return next;
  }
  return refs.find(isOpen);
}

// Two link forms: #unit-<id> opens a unit, #/<route>/<section> opens a section.
function parseHash(hash: string): {
  unitId?: string;
  routeId?: string;
  sectionId?: string;
} {
  const unit = /^#unit-(.+)$/.exec(hash);
  if (unit) return { unitId: decodeURIComponent(unit[1]) };
  const place = /^#\/([^/]+)(?:\/([^/]+))?$/.exec(hash);
  if (place)
    return {
      routeId: decodeURIComponent(place[1]),
      sectionId: place[2] ? decodeURIComponent(place[2]) : undefined,
    };
  return {};
}

// Scroll a target into view and briefly highlight it.
function revealAnchor(id: string, block: ScrollLogicalPosition = 'center') {
  window.setTimeout(() => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: preferredScrollBehavior(), block });
    element.classList.add('flash');
    window.setTimeout(() => element.classList.remove('flash'), 1800);
  }, 0);
}

function ProjectPath({
  stage,
  progress,
  onSection,
  onCapstone,
}: {
  stage: Stage;
  progress: ProgressState;
  onSection: (sectionId: string) => void;
  onCapstone: () => void;
}) {
  const steps = stage.sections.flatMap((section) =>
    section.miniProject ? [{ section, mini: section.miniProject }] : [],
  );
  if (!steps.length) return null;
  const capstoneDone = progressFor(progress, capstoneKey(stage.id)).passed;

  return (
    <nav className="project-path" aria-label="Project path">
      <p className="rail-label">Project path</p>
      <ol>
        {steps.map(({ section, mini }) => {
          const units = section.units ?? [];
          const passed = units.filter(
            (unit) =>
              progressFor(progress, unitKey(stage.id, section.id, unit.id))
                .passed,
          ).length;
          const done = progressFor(progress, miniKey(stage.id, section.id))
            .passed;
          return (
            <li
              key={section.id}
              className={done ? 'done' : passed ? 'started' : undefined}
            >
              <button type="button" onClick={() => onSection(section.id)}>
                <span className="path-marker">
                  {done ? <Check aria-hidden="true" /> : section.index}
                </span>
                <span className="path-copy">
                  <strong>{tex(mini.title)}</strong>
                  <small>
                    {done
                      ? 'Done'
                      : `${passed}/${units.length} units passed`}
                  </small>
                </span>
              </button>
            </li>
          );
        })}
        {stage.capstone && (
          <li className={`path-final${capstoneDone ? ' done' : ''}`}>
            <button type="button" onClick={onCapstone}>
              <span className="path-marker">
                {capstoneDone ? (
                  <Check aria-hidden="true" />
                ) : (
                  <FlaskConical aria-hidden="true" />
                )}
              </span>
              <span className="path-copy">
                <strong>{tex(stage.milestone.title)}</strong>
                <small>
                  {capstoneDone
                    ? 'Done'
                    : `Final project · about ${stage.capstone.hours} h`}
                </small>
              </span>
            </button>
          </li>
        )}
      </ol>
    </nav>
  );
}

export default function FieldGuide({ curriculum }: { curriculum: Curriculum }) {
  const initialStage = curriculum.stages[0];
  const authoredTracks = useMemo(
    () =>
      curriculum.advancedTracks.filter((track): track is Stage =>
        Boolean(
          track.index &&
          track.level &&
          track.sections?.length &&
          track.milestone,
        ),
      ),
    [curriculum.advancedTracks],
  );
  const learningRoutes = useMemo(
    () => [...curriculum.stages, ...authoredTracks],
    [authoredTracks, curriculum.stages],
  );
  const validTopicKeys = useMemo(
    () =>
      new Set(
        learningRoutes.flatMap((route) => [
          ...route.sections.flatMap((section) => [
            ...section.topics.map((topic) => topicKey(section.id, topic.id)),
            ...(section.units ?? []).map((unit) =>
              unitKey(route.id, section.id, unit.id),
            ),
            ...(section.miniProject ? [miniKey(route.id, section.id)] : []),
          ]),
          ...(route.capstone ? [capstoneKey(route.id)] : []),
        ]),
      ),
    [learningRoutes],
  );
  const allUnitRefs = useMemo(() => unitRefs(learningRoutes), [learningRoutes]);
  const searchEntries = useMemo(() => {
    const entries: SearchEntry[] = [];
    const add = (
      entry: Omit<SearchEntry, 'titleText' | 'text'>,
      extra = '',
    ) => {
      const titleText = plain(entry.title).toLowerCase();
      entries.push({
        ...entry,
        titleText,
        text: `${titleText} ${plain(extra).toLowerCase()}`,
      });
    };
    const trackIds = new Set(authoredTracks.map((track) => track.id));
    for (const route of learningRoutes) {
      const routeLabel = `${trackIds.has(route.id) ? 'Track' : 'Stage'} ${route.index} ${route.title}`;
      for (const section of route.sections) {
        const sectionContext = `${routeLabel} · ${section.title}`;
        const units = section.units ?? [];
        const unitForTopic = new globalThis.Map<string, Unit>();
        for (const unit of units)
          for (const topicId of unit.topics)
            if (!unitForTopic.has(topicId)) unitForTopic.set(topicId, unit);
        const topicTitle = new globalThis.Map(
          section.topics.map((topic) => [topic.id, topic.title]),
        );

        add({
          id: `section:${route.id}/${section.id}`,
          kind: 'section',
          title: section.title,
          context: routeLabel,
          target: { routeId: route.id, sectionId: section.id },
        });
        for (const unit of units)
          add(
            {
              id: unitKey(route.id, section.id, unit.id),
              kind: 'unit',
              title: unit.title,
              context: `Unit ${unitLabel(section, unit)} · ${sectionContext}`,
              target: {
                routeId: route.id,
                sectionId: section.id,
                unitId: unit.id,
              },
            },
            unit.topics.map((topicId) => topicTitle.get(topicId)).join(' '),
          );
        if (section.miniProject)
          add({
            id: miniKey(route.id, section.id),
            kind: 'project',
            title: section.miniProject.title,
            context: `Mini-project · ${sectionContext}`,
            target: {
              routeId: route.id,
              sectionId: section.id,
              anchor: `mini-${section.id}`,
            },
          });
        for (const topic of section.topics) {
          const unit = unitForTopic.get(topic.id);
          add({
            id: `topic:${route.id}/${section.id}/${topic.id}`,
            kind: 'topic',
            title: topic.title,
            context: unit
              ? `In unit ${unitLabel(section, unit)} ${unit.title} · ${routeLabel}`
              : sectionContext,
            target: unit
              ? { routeId: route.id, sectionId: section.id, unitId: unit.id }
              : {
                  routeId: route.id,
                  sectionId: section.id,
                  anchor: `topic-${section.id}-${topic.id}`,
                },
          });
        }
        for (const resource of section.resources)
          add(
            {
              id: `resource:${route.id}/${section.id}/${resource.id}`,
              kind: 'resource',
              title: resource.name,
              context: `${resource.provider} · ${sectionContext}`,
              target: {
                routeId: route.id,
                sectionId: section.id,
                anchor: `res-${section.id}-${resource.id}`,
              },
            },
            resource.provider,
          );
      }
      add({
        id: `milestone:${route.id}`,
        kind: 'project',
        title: route.milestone.title,
        context: `Final project · ${routeLabel}`,
        target: { routeId: route.id, anchor: 'milestone' },
      });
    }
    return entries;
  }, [authoredTracks, learningRoutes]);

  const [selectedStageId, setSelectedStageId] = useState(initialStage.id);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialStage.sections[0].id,
  );
  const [activeView, setActiveView] = useState('route');
  const [progress, setProgress] = useState<ProgressState>({});
  const [lastUnitKey, setLastUnitKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [backupMessage, setBackupMessage] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const stage =
    learningRoutes.find((entry) => entry.id === selectedStageId) ??
    initialStage;
  const isTrack = authoredTracks.some((entry) => entry.id === stage.id);
  const selectedSection =
    stage.sections.find((section) => section.id === selectedSectionId) ??
    stage.sections[0];

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Progress remains usable for this session when storage is unavailable.
    }
  }, [progress, hydrated]);

  // Keep the address bar and the saved place on the open section, unless the
  // address already names a unit in it.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        placeStorageKey,
        JSON.stringify({ routeId: stage.id, sectionId: selectedSection.id }),
      );
    } catch {
      // The place is only a convenience.
    }
    const { unitId } = parseHash(window.location.hash);
    const unitIsHere = selectedSection.units?.some(
      (unit) => unit.id === unitId,
    );
    const hash = `#/${stage.id}/${selectedSection.id}`;
    if (!unitIsHere && window.location.hash !== hash)
      window.history.replaceState(null, '', hash);
  }, [hydrated, stage.id, selectedSection]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditing =
        target?.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
      if (
        event.key !== '/' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditing
      ) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const stageUsesUnits = routeHasUnits(stage);
  const sectionUnits = selectedSection.units ?? [];
  const sectionHours = sectionUnits.reduce((sum, unit) => sum + unit.hours, 0);
  const stageUnitRefs = allUnitRefs.filter((ref) => ref.route.id === stage.id);
  const stageHours = stageUnitRefs.reduce(
    (sum, { unit }) => sum + unit.hours,
    0,
  );
  const nextUnit = pickNextUnit(stageUnitRefs, lastUnitKey, progress);
  const continueUnit = hydrated
    ? pickNextUnit(allUnitRefs, lastUnitKey, progress)
    : undefined;

  const totalTopics = stage.sections.reduce(
    (total, section) => total + section.topics.length,
    0,
  );
  const progressTotal = stageUsesUnits ? stageUnitRefs.length : totalTopics;
  const requiredTopics = stage.sections.reduce(
    (total, section) =>
      total +
      section.topics.filter((topic) => topic.scope === 'required').length,
    0,
  );

  function rememberUnit(key: string) {
    setLastUnitKey(key);
    try {
      window.localStorage.setItem(lastUnitStorageKey, key);
    } catch {
      // Continue falls back to the first unit not yet passed.
    }
  }

  function updateProgress(key: string, step: ProgressStep, checked: boolean) {
    if (key.startsWith('unit:')) rememberUnit(key);
    setProgress((previous) => {
      const next = { ...progressFor(previous, key), [step]: checked };

      if (checked && step === 'practised') next.learned = true;
      if (checked && step === 'passed') {
        next.learned = true;
        next.practised = true;
      }
      if (!checked && step === 'learned') {
        next.practised = false;
        next.passed = false;
      }
      if (!checked && step === 'practised') next.passed = false;

      const updated = { ...previous };
      if (next.learned || next.practised || next.passed) updated[key] = next;
      else delete updated[key];
      return updated;
    });
  }

  function setDone(key: string, checked: boolean) {
    setProgress((previous) => {
      const updated = { ...previous };
      if (checked)
        updated[key] = { learned: true, practised: true, passed: true };
      else delete updated[key];
      return updated;
    });
  }

  function toggleUnit(key: string, unitId: string) {
    const opening = !expandedUnits.has(key);
    setExpandedUnits((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    if (opening) {
      rememberUnit(key);
      window.history.replaceState(null, '', `#unit-${unitId}`);
    }
  }

  // Select a route and section without scrolling, keeping the guided view.
  function goTo(routeId: string, sectionId?: string) {
    const route = learningRoutes.find((entry) => entry.id === routeId);
    if (!route) return false;
    const section =
      route.sections.find((entry) => entry.id === sectionId) ??
      route.sections[0];
    setSelectedStageId(route.id);
    setSelectedSectionId(section.id);
    setActiveView('route');
    return true;
  }

  function openUnit(routeId: string, sectionId: string, unitId: string) {
    if (!goTo(routeId, sectionId)) return;
    const key = unitKey(routeId, sectionId, unitId);
    setExpandedUnits((previous) => new Set(previous).add(key));
    rememberUnit(key);
    window.history.replaceState(null, '', `#unit-${unitId}`);
    scrollToUnit(unitId);
  }

  function applyHash(hash: string) {
    const { unitId, routeId, sectionId } = parseHash(hash);
    if (unitId) {
      const ref = allUnitRefs.find((entry) => entry.unit.id === unitId);
      if (!ref) return false;
      openUnit(ref.route.id, ref.section.id, unitId);
      return true;
    }
    return routeId ? goTo(routeId, sectionId) : false;
  }

  function goToSearchHit(entry: SearchEntry) {
    const { routeId, sectionId, unitId, anchor } = entry.target;
    if (unitId && sectionId) {
      openUnit(routeId, sectionId, unitId);
      return;
    }
    if (!goTo(routeId, sectionId)) return;
    if (anchor) revealAnchor(anchor);
    else revealAnchor('section-title', 'start');
  }

  function followLink(link: Unit['next'][number]) {
    if (link.unit) {
      const [routeId, sectionId, unitId] = link.unit.split('/');
      openUnit(routeId, sectionId, unitId);
    } else if (link.route) {
      selectStage(link.route);
    }
  }

  function selectStage(stageId: string) {
    if (!goTo(stageId)) return;
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  }

  function selectSection(sectionId: string) {
    setSelectedSectionId(sectionId);
    revealAnchor('section-title', 'start');
  }

  function exportProgress() {
    const payload = {
      app: 'ai-atlas',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
      lastUnit: lastUnitKey,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-atlas-progress-${payload.exportedAt.slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    const count = Object.keys(progress).length;
    setBackupMessage(
      `Saved ${count} ${count === 1 ? 'entry' : 'entries'} to a file.`,
    );
  }

  async function restoreProgress(file: File) {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const record =
        parsed && typeof parsed === 'object'
          ? (parsed as Record<string, unknown>)
          : {};
      const restored = sanitizeProgress(
        'progress' in record ? record.progress : parsed,
        validTopicKeys,
      );
      const count = Object.keys(restored).length;
      if (!count) {
        setBackupMessage('That file has no AI Atlas progress in it.');
        return;
      }
      if (
        !window.confirm(
          `Replace the progress in this browser with the ${count} entries in this file?`,
        )
      )
        return;
      setProgress(restored);
      if (
        typeof record.lastUnit === 'string' &&
        validTopicKeys.has(record.lastUnit)
      )
        rememberUnit(record.lastUnit);
      setBackupMessage(
        `Restored ${count} ${count === 1 ? 'entry' : 'entries'}.`,
      );
    } catch {
      setBackupMessage('That file could not be read as AI Atlas progress.');
    }
  }

  // Restore progress, then the place: a link in the address bar wins over
  // the place saved from the last visit.
  const restoreSession = useEffectEvent(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved)
        setProgress(sanitizeProgress(JSON.parse(saved), validTopicKeys));
      const lastUnit = window.localStorage.getItem(lastUnitStorageKey);
      if (lastUnit && validTopicKeys.has(lastUnit)) setLastUnitKey(lastUnit);
    } catch {
      // A corrupt local value should never block the guide itself.
    }
    if (!applyHash(window.location.hash)) {
      try {
        const place: unknown = JSON.parse(
          window.localStorage.getItem(placeStorageKey) ?? 'null',
        );
        if (place && typeof place === 'object') {
          const { routeId, sectionId } = place as Record<string, unknown>;
          if (typeof routeId === 'string')
            goTo(routeId, typeof sectionId === 'string' ? sectionId : undefined);
        }
      } catch {
        // Start from the first stage.
      }
    }
    setHydrated(true);
  });
  const followHash = useEffectEvent(() => {
    applyHash(window.location.hash);
  });

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => restoreSession(), 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    const onHashChange = () => followHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const passedCount = countProgress(stage, progress, 'passed');
  const routeIds = new Set(learningRoutes.map((route) => route.id));

  return (
    <main className="site-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          aria-label="AI Atlas home"
          onClick={(event) => {
            event.preventDefault();
            selectStage(initialStage.id);
          }}
        >
          <span className="brand-mark">
            <Route aria-hidden="true" />
          </span>
          <span>
            <strong>AI Atlas</strong>
            <small>Study route for ML and AI</small>
          </span>
        </a>

        <GlobalSearch
          entries={searchEntries}
          onSelect={goToSearchHit}
          inputRef={searchInputRef}
        />

        <div className="topbar-actions">
          <ThemeToggle />
          {continueUnit && (
            <button
              type="button"
              className="continue-button"
              onClick={() =>
                openUnit(
                  continueUnit.route.id,
                  continueUnit.section.id,
                  continueUnit.unit.id,
                )
              }
              title={`Continue: ${continueUnit.unit.title}`}
            >
              <Play aria-hidden="true" />
              <span>
                <small>
                  Continue · {continueUnit.route.index}{' '}
                  {continueUnit.route.title}
                </small>
                <strong>{continueUnit.unit.title}</strong>
              </span>
            </button>
          )}
        </div>
      </header>

      <Tabs
        value={activeView}
        onValueChange={setActiveView}
        className="workspace"
        id="top"
      >
        <div className="viewbar">
          <TabsList variant="line" aria-label="Guide views">
            <TabsTrigger value="route">
              <Route /> Guided route
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map /> Whole map
            </TabsTrigger>
            <TabsTrigger value="tracks">
              <LibraryBig /> Tracks
            </TabsTrigger>
          </TabsList>
          <p>One finite route. Exact scope. Resources with jobs.</p>
        </div>

        <TabsContent value="route">
          {isTrack ? (
            <nav
              className="track-return-bar"
              aria-label="Advanced track navigation"
            >
              <button type="button" onClick={() => setActiveView('tracks')}>
                <ChevronRight aria-hidden="true" />
                All advanced tracks
              </button>
              <span>Track {stage.index} · Fully mapped</span>
            </nav>
          ) : (
            <nav className="core-stage-switcher" aria-label="Core stage order">
              {curriculum.coreMap.map((mapStage) => {
                const isAuthored = curriculum.stages.some(
                  (entry) => entry.id === mapStage.id,
                );
                const isCurrent = mapStage.id === stage.id;
                return (
                  <button
                    key={mapStage.id}
                    type="button"
                    disabled={!isAuthored}
                    className={isCurrent ? 'current' : undefined}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => selectStage(mapStage.id)}
                  >
                    <span>{mapStage.index}</span>
                    <strong>{mapStage.title}</strong>
                  </button>
                );
              })}
            </nav>
          )}

          <section className="stage-hero" aria-labelledby="stage-title">
            <div className="stage-number">{stage.index}</div>
            <div className="stage-copy">
              <span className="eyebrow">
                {isTrack
                  ? 'Advanced track'
                  : stage.level.toLowerCase() === 'core'
                    ? 'Core route'
                    : `${stage.level} · Core route`}
              </span>
              <h1 id="stage-title">{tex(stage.title)}</h1>
              <p>{tex(stage.summary)}</p>
              <div className="stage-facts">
                <span>
                  {stage.sections.length}{' '}
                  {isTrack ? 'track stages' : 'sections'}
                </span>
                {stageUsesUnits && (
                  <span>
                    {stageUnitRefs.length} study units · about {stageHours}{' '}
                    hours
                  </span>
                )}
                <span>{requiredTopics} required topics</span>
                <span>
                  {totalTopics - requiredTopics} optional / depth / later
                </span>
              </div>
              {stageUsesUnits && (
                <button
                  type="button"
                  className="next-up"
                  disabled={!nextUnit}
                  onClick={() =>
                    nextUnit &&
                    openUnit(stage.id, nextUnit.section.id, nextUnit.unit.id)
                  }
                >
                  <Play aria-hidden="true" />
                  {nextUnit ? (
                    <span>
                      <small>
                        Next up · unit{' '}
                        {unitLabel(nextUnit.section, nextUnit.unit)}
                      </small>
                      <strong>{nextUnit.unit.title}</strong>
                    </span>
                  ) : (
                    <span>
                      <small>Stage done</small>
                      <strong>Every unit passed. Build the capstone.</strong>
                    </span>
                  )}
                </button>
              )}
            </div>
            <div
              className="stage-progress"
              aria-label={isTrack ? 'Track progress' : 'Stage progress'}
            >
              <div className="stage-progress-topline">
                <span>Passed</span>
                <strong>
                  {passedCount}/{progressTotal}
                  {stageUsesUnits ? ' units' : ''}
                </strong>
              </div>
              <Progress value={(passedCount / progressTotal) * 100} />
              <div className="progress-counts">
                {progressLabels.map(({ key, label }) => (
                  <span key={key}>
                    <i className={`progress-dot ${key}`} aria-hidden="true" />
                    <strong>{countProgress(stage, progress, key)}</strong>{' '}
                    {label}
                  </span>
                ))}
              </div>
              <div className="progress-backup">
                <span>Saved in this browser only.</span>
                <button type="button" onClick={exportProgress}>
                  <Download aria-hidden="true" /> Back up
                </button>
                <button
                  type="button"
                  onClick={() => restoreInputRef.current?.click()}
                >
                  <Upload aria-hidden="true" /> Restore
                </button>
                <input
                  ref={restoreInputRef}
                  type="file"
                  accept="application/json,.json"
                  hidden
                  aria-label="Progress file to restore"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) void restoreProgress(file);
                  }}
                />
              </div>
              <output className="backup-message">{backupMessage}</output>
            </div>
            {stageUsesUnits && (
              <ProjectPath
                stage={stage}
                progress={progress}
                onSection={(sectionId) => {
                  goTo(stage.id, sectionId);
                  revealAnchor(`mini-${sectionId}`, 'start');
                }}
                onCapstone={() => revealAnchor('milestone', 'start')}
              />
            )}
          </section>

          <div className="stage-workbench">
            <aside
              className="section-rail"
              aria-label={`${stage.title} ${isTrack ? 'track stages' : 'sections'}`}
            >
              <p className="rail-label">
                {isTrack ? 'Track stages' : 'Sections'}
              </p>
              <nav>
                {stage.sections.map((section) => {
                  const sectionUsesUnits = Boolean(section.units?.length);
                  const sectionPassed = sectionUsesUnits
                    ? (section.units ?? []).filter(
                        (unit) =>
                          progressFor(
                            progress,
                            unitKey(stage.id, section.id, unit.id),
                          ).passed,
                      ).length
                    : section.topics.filter(
                        (topic) =>
                          progressFor(progress, topicKey(section.id, topic.id))
                            .passed,
                      ).length;
                  const sectionTotal = sectionUsesUnits
                    ? (section.units ?? []).length
                    : section.topics.length;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className={
                        section.id === selectedSection.id ? 'active' : undefined
                      }
                      aria-current={
                        section.id === selectedSection.id ? 'step' : undefined
                      }
                      onClick={() => selectSection(section.id)}
                    >
                      <span>{section.index}</span>
                      <span className="section-link-copy">
                        <strong>{tex(section.title)}</strong>
                        <small>
                          {sectionPassed}/{sectionTotal}{' '}
                          {sectionUsesUnits ? 'units ' : ''}passed
                        </small>
                      </span>
                      <ChevronRight aria-hidden="true" />
                    </button>
                  );
                })}
              </nav>
              <div className="legend-card">
                <Target aria-hidden="true" />
                <p>
                  <strong>Finish line</strong> means you can explain, implement
                  and diagnose - not merely recognize.
                </p>
              </div>
            </aside>

            <section className="section-detail" aria-labelledby="section-title">
              <div className="section-heading">
                <span>
                  {selectedSection.index}/
                  {stage.sections.length.toString().padStart(2, '0')}
                </span>
                <div>
                  <p className="eyebrow">
                    {isTrack ? 'Current track stage' : 'Current section'}
                  </p>
                  <h2 id="section-title">{tex(selectedSection.title)}</h2>
                </div>
              </div>

              <div className="why-card">
                <span>Why</span>
                <p>{tex(selectedSection.why)}</p>
              </div>

              {sectionUnits.length > 0 ? (
                <>
                  <div className="topics-header">
                    <div>
                      <p className="rail-label">Study units, in order</p>
                      <p>
                        {sectionUnits.length} units · about {sectionHours}{' '}
                        hours · covers {selectedSection.topics.length} topics
                      </p>
                    </div>
                    <div className="progress-column-labels" aria-hidden="true">
                      <span>Learn</span>
                      <span>Practice</span>
                      <span>Pass</span>
                    </div>
                  </div>

                  <p className="unit-legend">
                    Tick <strong>Learn</strong> when you finish the study list,{' '}
                    <strong>Practice</strong> when the named practice passes,
                    and <strong>Pass</strong> when you meet Stop when without
                    notes.
                  </p>

                  <ol className="unit-list">
                    {sectionUnits.map((unit, index) => {
                      const key = unitKey(
                        stage.id,
                        selectedSection.id,
                        unit.id,
                      );
                      return (
                        <UnitCard
                          key={unit.id}
                          unit={unit}
                          number={index + 1}
                          section={selectedSection}
                          progress={progressFor(progress, key)}
                          onStep={(step, checked) =>
                            updateProgress(key, step, checked)
                          }
                          expanded={expandedUnits.has(key)}
                          onToggle={() => toggleUnit(key, unit.id)}
                          onFollow={followLink}
                          canFollow={(link) =>
                            link.unit
                              ? routeIds.has(link.unit.split('/')[0])
                              : routeIds.has(link.route ?? '')
                          }
                        />
                      );
                    })}
                  </ol>

                  {selectedSection.miniProject && (
                    <MiniProjectCard
                      sectionId={selectedSection.id}
                      mini={selectedSection.miniProject}
                      units={sectionUnits}
                      done={
                        progressFor(
                          progress,
                          miniKey(stage.id, selectedSection.id),
                        ).passed
                      }
                      onDone={(checked) =>
                        setDone(miniKey(stage.id, selectedSection.id), checked)
                      }
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="topics-header">
                    <div>
                      <p className="rail-label">Learn this much</p>
                      <p>{selectedSection.topics.length} topics</p>
                    </div>
                    <div className="progress-column-labels" aria-hidden="true">
                      <span>Learn</span>
                      <span>Practice</span>
                      <span>Pass</span>
                    </div>
                  </div>

                  <ol className="topic-list">
                    {selectedSection.topics.map((topic, index) => {
                      const key = topicKey(selectedSection.id, topic.id);
                      return (
                        <li
                          key={topic.id}
                          id={`topic-${selectedSection.id}-${topic.id}`}
                          className={
                            topic.scope === 'later' ? 'deferred' : undefined
                          }
                        >
                          <span className="topic-number">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="topic-copy">
                            <span>{tex(topic.title)}</span>
                            <small className={`scope-meta ${topic.scope}`}>
                              <i aria-hidden="true" />
                              {scopeLabels[topic.scope as Scope]}
                            </small>
                          </div>
                          <ProgressChecks
                            label={plain(topic.title)}
                            value={progressFor(progress, key)}
                            onChange={(step, checked) =>
                              updateProgress(key, step, checked)
                            }
                          />
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}

              <article className="checkpoint-card">
                <div className="checkpoint-icon">
                  <CheckCircle2 aria-hidden="true" />
                </div>
                <div>
                  <p className="eyebrow">Section checkpoint</p>
                  <h3>Know when to leave</h3>
                  <p>{tex(selectedSection.checkpoint)}</p>
                </div>
              </article>

              <details className="later-card">
                <summary>Deliberately left for later</summary>
                <ul>
                  {selectedSection.leaveForLater.map((item) => (
                    <li key={item}>{tex(item)}</li>
                  ))}
                </ul>
              </details>
            </section>

            <aside className="resource-rail" aria-label="Selected resources">
              <div className="resource-heading">
                <div>
                  <p className="rail-label">Resource route</p>
                  <h2>Use each for a job</h2>
                </div>
                <span>
                  {selectedSection.resources.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="route-note">
                <Sparkles aria-hidden="true" />
                <p>
                  Follow the <strong>Primary</strong> item in order and add each{' '}
                  <strong>Required</strong> companion at the point named on its
                  card.
                </p>
              </div>

              <div className="resource-list">
                {selectedSection.resources.map((resource) =>
                  resource.url ? (
                    <a
                      key={resource.id}
                      id={`res-${selectedSection.id}-${resource.id}`}
                      className="resource-card"
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ResourceCardBody resource={resource} />
                    </a>
                  ) : (
                    <article
                      key={resource.id}
                      id={`res-${selectedSection.id}-${resource.id}`}
                      className="resource-card local-resource"
                    >
                      <ResourceCardBody resource={resource} />
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>

          <section
            className="milestone"
            id="milestone"
            aria-labelledby="milestone-title"
          >
            <div className="milestone-icon">
              <FlaskConical aria-hidden="true" />
            </div>
            <div className="milestone-copy">
              <p className="eyebrow">
                {isTrack ? 'Track milestone' : 'Stage milestone'}
              </p>
              <h2 id="milestone-title">{tex(stage.milestone.title)}</h2>
              <p>{tex(stage.milestone.description)}</p>
            </div>
            <div className="deliverables">
              {stage.milestone.deliverables.map((deliverable, index) => (
                <span key={deliverable}>
                  <i>{index + 1}</i>
                  {tex(deliverable)}
                </span>
              ))}
            </div>
            {stage.capstone && (
              <div className="capstone">
                <div className="capstone-heading">
                  <div>
                    <p className="eyebrow">
                      Capstone rubric · about {stage.capstone.hours} hours
                    </p>
                    <p>
                      Built from the section mini-projects. Grade yourself
                      against Pass first; Strong is the bar for research and
                      engineering roles.
                    </p>
                  </div>
                  <label className="mini-done">
                    <span>Done</span>
                    <Checkbox
                      checked={
                        progressFor(progress, capstoneKey(stage.id)).passed
                      }
                      onCheckedChange={(checked) =>
                        setDone(capstoneKey(stage.id), checked)
                      }
                      aria-label={`Done: ${plain(stage.milestone.title)}`}
                    />
                  </label>
                </div>
                <RubricTable rubric={stage.capstone.rubric} />
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="map">
          <section className="map-view">
            <div className="view-intro">
              <p className="eyebrow">The whole core</p>
              <h1>A dependency-ordered spine</h1>
              <p>
                {curriculum.stages.length}{' '}
                {curriculum.stages.length === 1 ? 'stage is' : 'stages are'} now
                authored. Open any ready stage here or from Guided route.
              </p>
            </div>
            <div className="map-route">
              {curriculum.coreMap.map((mapStage, index) => {
                const authoredStage = curriculum.stages.find(
                  (entry) => entry.id === mapStage.id,
                );
                const isCurrent = mapStage.id === stage.id;
                return (
                  <article
                    key={mapStage.id}
                    className={`${authoredStage ? 'ready' : 'planned'} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="map-node">{mapStage.index}</div>
                    <button
                      type="button"
                      className="map-card"
                      disabled={!authoredStage}
                      onClick={() => selectStage(mapStage.id)}
                    >
                      <div className="map-card-heading">
                        <div>
                          <span className="level-tag">{mapStage.level}</span>
                          <h2>{tex(mapStage.title)}</h2>
                        </div>
                        <span className="state-tag">
                          {isCurrent
                            ? 'Current'
                            : authoredStage
                              ? 'Ready'
                              : 'Planned'}
                        </span>
                      </div>
                      <p>{tex(mapStage.summary)}</p>
                      {authoredStage && (
                        <div className="map-section-pills">
                          {authoredStage.sections.map((section) => (
                            <span key={section.id}>{tex(section.title)}</span>
                          ))}
                        </div>
                      )}
                    </button>
                    {index < curriculum.coreMap.length - 1 && (
                      <span className="map-line" />
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="tracks">
          <section className="tracks-view">
            <div className="view-intro">
              <p className="eyebrow">Advanced directions</p>
              <h1>Choose a track after the core</h1>
              <p>
                All {authoredTracks.length} specialization tracks are fully
                mapped. Open a ready track for its ordered scope, resources and
                finish gates.
              </p>
            </div>
            <div className="track-grid">
              {curriculum.advancedTracks.map((track, index) => {
                const authoredTrack = authoredTracks.find(
                  (entry) => entry.id === track.id,
                );
                return (
                  <button
                    key={track.id}
                    type="button"
                    className={authoredTrack ? 'ready' : 'planned'}
                    disabled={!authoredTrack}
                    onClick={() =>
                      authoredTrack && selectStage(authoredTrack.id)
                    }
                  >
                    <div className="track-index">
                      {track.index ?? (index + 1).toString().padStart(2, '0')}
                    </div>
                    <CircleDot aria-hidden="true" />
                    <h2>{tex(track.title)}</h2>
                    <p>{tex(track.summary)}</p>
                    <span>
                      {authoredTrack ? 'Open mapped track' : 'Route planned'}{' '}
                      <ChevronRight aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <footer>
        <BookOpen aria-hidden="true" />
        <span>
          Progress is saved in this browser only. Back it up from the progress
          panel. ·{' '}
          <a
            href="https://github.com/saisandeshk/ai-atlas"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </span>
      </footer>
    </main>
  );
}
