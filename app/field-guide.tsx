'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  CornerDownRight,
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
  Search,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
const storageKey = 'field-guide-progress-v1';

const scopeLabels: Record<Scope, string> = {
  required: 'Required',
  optional: 'Optional',
  depth: 'Depth',
  later: 'Later',
};

const progressLabels: Array<{ key: ProgressStep; label: string }> = [
  { key: 'learned', label: 'Learned' },
  { key: 'practised', label: 'Practised' },
  { key: 'passed', label: 'Passed' },
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
        <span className="access-tag">{resource.access}</span>
      </div>
      <h3>{resource.name}</h3>
      <p className="provider">{resource.provider}</p>
      <p>{resource.use}</p>
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
              <th scope="row">{item.criterion}</th>
              <td>{item.pass}</td>
              <td>{item.strong}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      {progressLabels.map(({ key: step, label: stepLabel }) => (
        <label key={step} title={stepLabel}>
          <span className="sr-only">
            {stepLabel}: {label}
          </span>
          <Checkbox
            checked={value[step]}
            onCheckedChange={(checked) => onChange(step, checked)}
            aria-label={`${stepLabel}: ${label}`}
          />
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
            <strong>{unit.title}</strong>
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
        <ProgressChecks label={unit.title} value={progress} onChange={onStep} />
      </div>

      {expanded && (
        <div className="unit-body" id={bodyId}>
          <p className="unit-why">{unit.why}</p>

          <div className="unit-columns">
            <section>
              <h4>You can now</h4>
              <ul>
                {unit.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
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
                      {topic.title}
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
                          {item.title}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      ) : (
                        <span>{item.title}</span>
                      )}
                      {resource && (
                        <span className={`priority-tag ${resource.priority}`}>
                          <i aria-hidden="true" />
                          {resource.name}
                        </span>
                      )}
                    </div>
                    <p>{item.locator}</p>
                    {item.depth && (
                      <p className="study-depth">
                        <strong>Depth:</strong> {item.depth}
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
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="unit-reproduce">
            <h4>
              <Repeat2 aria-hidden="true" /> Reproduce closed-book
            </h4>
            <p>{unit.reproduce}</p>
          </section>

          <section className="unit-traps">
            <h4>
              <TriangleAlert aria-hidden="true" /> Traps
            </h4>
            <ul>
              {unit.traps.map((trap) => (
                <li key={trap}>{trap}</li>
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
                      {item.name}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <p>{item.locator}</p>
                    {item.note && <p className="practice-note">{item.note}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{unit.practiceNote}</p>
            )}
          </section>

          <section className="unit-selftest">
            <h4>
              <ListChecks aria-hidden="true" /> Self-test
            </h4>
            <ol>
              {unit.selfTest.map((item) => (
                <li key={item.q}>
                  <p>{item.q}</p>
                  <details>
                    <summary>Show answer</summary>
                    <p>{item.a}</p>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          <section className="unit-stop">
            <h4>
              <Flag aria-hidden="true" /> Stop when
            </h4>
            <p>{unit.stopWhen}</p>
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
                  <span>{link.note}</span>
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
  mini,
  units,
  done,
  onDone,
}: {
  mini: MiniProject;
  units: Unit[];
  done: boolean;
  onDone: (checked: boolean) => void;
}) {
  const numberOf = (unitId: string) =>
    units.findIndex((unit) => unit.id === unitId) + 1;
  return (
    <article className={`mini-project${done ? ' done' : ''}`}>
      <header>
        <div className="checkpoint-icon">
          <Hammer aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">
            Section mini-project · about {mini.hours} hours
          </p>
          <h3>{mini.title}</h3>
          <p className="mini-uses">
            Uses {mini.units.map((unitId) => `U${numberOf(unitId)}`).join(', ')}
          </p>
        </div>
        <label className="mini-done">
          <span>Done</span>
          <Checkbox
            checked={done}
            onCheckedChange={(checked) => onDone(checked)}
            aria-label={`Done: ${mini.title}`}
          />
        </label>
      </header>
      <p className="mini-brief">{mini.brief}</p>
      <div className="unit-columns">
        <section>
          <h4>Steps</h4>
          <ol>
            {mini.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section>
          <h4>Deliverables</h4>
          <ul>
            {mini.deliverables.map((item) => (
              <li key={item}>{item}</li>
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
                    {check.name}
                  </a>
                ) : (
                  check.name
                )}
                {check.command && (
                  <code className="check-command">{check.command}</code>
                )}
                {check.note && <p>{check.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <h4>Rubric</h4>
      <RubricTable rubric={mini.rubric} />
      <p className="mini-feeds">
        <CornerDownRight aria-hidden="true" /> Feeds into: {mini.feedsInto}
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
  const [selectedStageId, setSelectedStageId] = useState(initialStage.id);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialStage.sections[0].id,
  );
  const [activeView, setActiveView] = useState('route');
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState<ProgressState>({});
  const [hydrated, setHydrated] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const stage =
    learningRoutes.find((entry) => entry.id === selectedStageId) ??
    initialStage;
  const isTrack = authoredTracks.some((entry) => entry.id === stage.id);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved)
          setProgress(sanitizeProgress(JSON.parse(saved), validTopicKeys));
      } catch {
        // A corrupt local value should never block the guide itself.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, [validTopicKeys]);

  // A link to #unit-<id> opens that unit, so a card can be shared or bookmarked.
  useEffect(() => {
    const match = /^#unit-(.+)$/.exec(window.location.hash);
    if (!match) return;
    const unitId = decodeURIComponent(match[1]);
    for (const route of learningRoutes) {
      const section = route.sections.find((entry) =>
        entry.units?.some((unit) => unit.id === unitId),
      );
      if (!section) continue;
      const task = window.setTimeout(() => {
        setSelectedStageId(route.id);
        setSelectedSectionId(section.id);
        setExpandedUnits((previous) =>
          new Set(previous).add(unitKey(route.id, section.id, unitId)),
        );
        scrollToUnit(unitId);
      }, 0);
      return () => window.clearTimeout(task);
    }
  }, [learningRoutes]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Progress remains usable for this session when storage is unavailable.
    }
  }, [progress, hydrated]);

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
      setActiveView('route');
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const selectedSection =
    stage.sections.find((section) => section.id === selectedSectionId) ??
    stage.sections[0];

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTopics = normalizedQuery
    ? selectedSection.topics.filter((topic) =>
        topic.title.toLowerCase().includes(normalizedQuery),
      )
    : selectedSection.topics;

  const stageUsesUnits = routeHasUnits(stage);
  const sectionUnits = selectedSection.units ?? [];
  const visibleUnits = normalizedQuery
    ? sectionUnits.filter(
        (unit) =>
          unit.title.toLowerCase().includes(normalizedQuery) ||
          unit.topics.some((topicId) =>
            selectedSection.topics
              .find((topic) => topic.id === topicId)
              ?.title.toLowerCase()
              .includes(normalizedQuery),
          ),
      )
    : sectionUnits;
  const sectionHours = sectionUnits.reduce((sum, unit) => sum + unit.hours, 0);
  const stageUnits = stage.sections.flatMap((section) =>
    (section.units ?? []).map((unit) => ({ section, unit })),
  );
  const stageHours = stageUnits.reduce((sum, { unit }) => sum + unit.hours, 0);
  const nextUnit = stageUnits.find(
    ({ section, unit }) =>
      !progressFor(progress, unitKey(stage.id, section.id, unit.id)).passed,
  );

  const totalTopics = stage.sections.reduce(
    (total, section) => total + section.topics.length,
    0,
  );
  const progressTotal = stageUsesUnits ? stageUnits.length : totalTopics;
  const requiredTopics = stage.sections.reduce(
    (total, section) =>
      total +
      section.topics.filter((topic) => topic.scope === 'required').length,
    0,
  );

  function updateProgress(key: string, step: ProgressStep, checked: boolean) {
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

  function toggleUnit(key: string) {
    setExpandedUnits((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function openUnit(routeId: string, sectionId: string, unitId: string) {
    const route = learningRoutes.find((entry) => entry.id === routeId);
    const section = route?.sections.find((entry) => entry.id === sectionId);
    if (!route || !section) return;
    setSelectedStageId(route.id);
    setSelectedSectionId(section.id);
    setQuery('');
    setActiveView('route');
    setExpandedUnits((previous) =>
      new Set(previous).add(unitKey(route.id, section.id, unitId)),
    );
    scrollToUnit(unitId);
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
    const nextStage = learningRoutes.find((entry) => entry.id === stageId);
    if (!nextStage) return;
    setSelectedStageId(nextStage.id);
    setSelectedSectionId(nextStage.sections[0].id);
    setQuery('');
    setActiveView('route');
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  }

  function selectSection(sectionId: string) {
    setSelectedSectionId(sectionId);
    setQuery('');
    window.setTimeout(() => {
      document.getElementById('section-title')?.scrollIntoView({
        behavior: preferredScrollBehavior(),
        block: 'start',
      });
    }, 0);
  }

  const passedCount = countProgress(stage, progress, 'passed');
  const routeIds = new Set(learningRoutes.map((route) => route.id));

  return (
    <main className="site-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          aria-label="ML/AI Field Guide home"
          onClick={() => selectStage(initialStage.id)}
        >
          <span className="brand-mark">
            <Route aria-hidden="true" />
          </span>
          <span>
            <strong>ML/AI Field Guide</strong>
            <small>Roadmap companion</small>
          </span>
        </a>

        <label className="global-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search the selected section</span>
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setActiveView('route')}
            placeholder={`Search ${selectedSection.title}`}
            aria-keyshortcuts="/"
          />
          <kbd>/</kbd>
        </label>

        <div className="review-status">
          <span className="status-dot" aria-hidden="true" />
          <span>
            <strong>
              {curriculum.stages.length} stages · {authoredTracks.length}{' '}
              {authoredTracks.length === 1 ? 'track' : 'tracks'}
            </strong>{' '}
            fully mapped
          </span>
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
                    onClick={() => selectStage(mapStage.id)}
                  >
                    <span>{mapStage.index}</span>
                    <strong>{mapStage.title}</strong>
                    <small>
                      {isCurrent ? 'Open' : isAuthored ? 'Ready' : 'Planned'}
                    </small>
                  </button>
                );
              })}
            </nav>
          )}

          <section className="stage-hero" aria-labelledby="stage-title">
            <div className="stage-number">{stage.index}</div>
            <div className="stage-copy">
              <span className="eyebrow">
                {isTrack ? 'Advanced track' : `${stage.level} · Core route`}
              </span>
              <h1 id="stage-title">{stage.title}</h1>
              <p>{stage.summary}</p>
              <div className="stage-facts">
                <span>
                  {stage.sections.length}{' '}
                  {isTrack ? 'track stages' : 'sections'}
                </span>
                {stageUsesUnits && (
                  <span>
                    {stageUnits.length} study units · about {stageHours} hours
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
                      <small>Next up</small>
                      <strong>
                        {nextUnit.section.index}.
                        {(nextUnit.section.units ?? []).indexOf(nextUnit.unit) +
                          1}{' '}
                        {nextUnit.unit.title}
                      </strong>
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
            </div>
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
                        <strong>{section.title}</strong>
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
                  <h2 id="section-title">{selectedSection.title}</h2>
                </div>
              </div>

              <div className="why-card">
                <span>Why</span>
                <p>{selectedSection.why}</p>
              </div>

              {sectionUnits.length > 0 ? (
                <>
                  <div className="topics-header">
                    <div>
                      <p className="rail-label">Study units, in order</p>
                      <p>
                        {visibleUnits.length} of {sectionUnits.length} units ·
                        about {sectionHours} hours · covers{' '}
                        {selectedSection.topics.length} topics
                      </p>
                    </div>
                    <div className="progress-column-labels" aria-hidden="true">
                      <span>Learn</span>
                      <span>Practice</span>
                      <span>Pass</span>
                    </div>
                  </div>

                  <ol className="unit-list">
                    {visibleUnits.map((unit) => {
                      const key = unitKey(
                        stage.id,
                        selectedSection.id,
                        unit.id,
                      );
                      return (
                        <UnitCard
                          key={unit.id}
                          unit={unit}
                          number={sectionUnits.indexOf(unit) + 1}
                          section={selectedSection}
                          progress={progressFor(progress, key)}
                          onStep={(step, checked) =>
                            updateProgress(key, step, checked)
                          }
                          expanded={expandedUnits.has(key)}
                          onToggle={() => toggleUnit(key)}
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

                  {visibleUnits.length === 0 && (
                    <div className="empty-search">
                      <Search aria-hidden="true" />
                      <p>No unit or topic matches “{query}” in this section.</p>
                    </div>
                  )}

                  {selectedSection.miniProject && (
                    <MiniProjectCard
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
                      <p>
                        {visibleTopics.length} of{' '}
                        {selectedSection.topics.length} topics shown
                      </p>
                    </div>
                    <div className="progress-column-labels" aria-hidden="true">
                      <span>Learn</span>
                      <span>Practice</span>
                      <span>Pass</span>
                    </div>
                  </div>

                  <ol className="topic-list">
                    {visibleTopics.map((topic) => {
                      const key = topicKey(selectedSection.id, topic.id);
                      const topicProgress = progressFor(progress, key);
                      return (
                        <li
                          key={topic.id}
                          className={
                            topic.scope === 'later' ? 'deferred' : undefined
                          }
                        >
                          <span className="topic-number">
                            {(selectedSection.topics.indexOf(topic) + 1)
                              .toString()
                              .padStart(2, '0')}
                          </span>
                          <div className="topic-copy">
                            <span>{topic.title}</span>
                            <small className={`scope-meta ${topic.scope}`}>
                              <i aria-hidden="true" />
                              {scopeLabels[topic.scope as Scope]}
                            </small>
                          </div>
                          <div className="topic-checks">
                            {progressLabels.map(({ key: step, label }) => (
                              <label key={step} title={label}>
                                <span className="sr-only">
                                  {label}: {topic.title}
                                </span>
                                <Checkbox
                                  checked={topicProgress[step]}
                                  onCheckedChange={(checked) =>
                                    updateProgress(key, step, checked)
                                  }
                                  aria-label={`${label}: ${topic.title}`}
                                />
                              </label>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {visibleTopics.length === 0 && (
                    <div className="empty-search">
                      <Search aria-hidden="true" />
                      <p>No topic matches “{query}” in this section.</p>
                    </div>
                  )}
                </>
              )}

              <article className="checkpoint-card">
                <div className="checkpoint-icon">
                  <CheckCircle2 aria-hidden="true" />
                </div>
                <div>
                  <p className="eyebrow">Section checkpoint</p>
                  <h3>Know when to leave</h3>
                  <p>{selectedSection.checkpoint}</p>
                </div>
              </article>

              <details className="later-card">
                <summary>Deliberately left for later</summary>
                <ul>
                  {selectedSection.leaveForLater.map((item) => (
                    <li key={item}>{item}</li>
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
                      className="resource-card local-resource"
                    >
                      <ResourceCardBody resource={resource} />
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>

          <section className="milestone" aria-labelledby="milestone-title">
            <div className="milestone-icon">
              <FlaskConical aria-hidden="true" />
            </div>
            <div className="milestone-copy">
              <p className="eyebrow">
                {isTrack ? 'Track milestone' : 'Stage milestone'}
              </p>
              <h2 id="milestone-title">{stage.milestone.title}</h2>
              <p>{stage.milestone.description}</p>
            </div>
            <div className="deliverables">
              {stage.milestone.deliverables.map((deliverable, index) => (
                <span key={deliverable}>
                  <i>{index + 1}</i>
                  {deliverable}
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
                      aria-label={`Done: ${stage.milestone.title}`}
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
                          <h2>{mapStage.title}</h2>
                        </div>
                        <span className="state-tag">
                          {isCurrent
                            ? 'Current'
                            : authoredStage
                              ? 'Ready'
                              : 'Planned'}
                        </span>
                      </div>
                      <p>{mapStage.summary}</p>
                      {authoredStage && (
                        <div className="map-section-pills">
                          {authoredStage.sections.map((section) => (
                            <span key={section.id}>{section.title}</span>
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
                    <h2>{track.title}</h2>
                    <p>{track.summary}</p>
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
          Local-first progress · curriculum source lives beside the roadmap
        </span>
      </footer>
    </main>
  );
}
