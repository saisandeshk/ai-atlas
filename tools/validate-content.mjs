import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const curriculumPath = path.join(projectRoot, 'content', 'curriculum.json');
const curriculum = JSON.parse(await readFile(curriculumPath, 'utf8'));
const errors = [];
const expectedCoreStages = 7;
const expectedAdvancedTracks = 8;
const allowedScopes = new Set(['required', 'optional', 'depth', 'later']);
const allowedPriorities = new Set([
  'primary',
  'required',
  'reference',
  'support',
  'optional',
  'depth',
]);

function requireValue(value, label) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    errors.push(`${label} is missing`);
  }
}

function unique(values, label) {
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index,
  );
  if (duplicates.length)
    errors.push(
      `${label} has duplicate IDs: ${[...new Set(duplicates)].join(', ')}`,
    );
}

async function validateSourceReference(source, label) {
  requireValue(source, label);
  if (!source) return;

  try {
    const url = new URL(source);
    if (url.protocol !== 'https:') {
      errors.push(`${label} must use HTTPS`);
    }
    return;
  } catch {
    // Non-URL sources must resolve within the authoring workspace.
  }

  try {
    await access(path.resolve(projectRoot, source));
  } catch {
    errors.push(`${label} does not resolve: ${source}`);
  }
}

requireValue(curriculum.product?.name, 'product.name');
requireValue(curriculum.product?.description, 'product.description');
if (
  !Array.isArray(curriculum.coreMap) ||
  curriculum.coreMap.length !== expectedCoreStages
) {
  errors.push(
    `coreMap must contain exactly ${expectedCoreStages} ordered core stages`,
  );
}
if (
  !Array.isArray(curriculum.advancedTracks) ||
  curriculum.advancedTracks.length !== expectedAdvancedTracks
) {
  errors.push(
    `advancedTracks must contain exactly ${expectedAdvancedTracks} Roadmap-Final specializations`,
  );
}
if (
  !Array.isArray(curriculum.stages) ||
  curriculum.stages.length !== expectedCoreStages
) {
  errors.push(
    `stages must contain all ${expectedCoreStages} authored core stages`,
  );
}

unique(
  curriculum.coreMap.map((stage) => stage.id),
  'coreMap',
);
unique(
  curriculum.advancedTracks.map((track) => track.id),
  'advancedTracks',
);
unique(
  curriculum.stages.map((stage) => stage.id),
  'stages',
);

for (const [index, mapStage] of curriculum.coreMap.entries()) {
  const label = `coreMap entry ${index + 1}`;
  for (const field of ['index', 'id', 'title', 'level', 'summary']) {
    requireValue(mapStage[field], `${label}.${field}`);
  }
  const expectedIndex = String(index + 1).padStart(2, '0');
  if (mapStage.index !== expectedIndex) {
    errors.push(
      `${label}.index must be ${expectedIndex}; found ${mapStage.index}`,
    );
  }
}

for (const [index, track] of curriculum.advancedTracks.entries()) {
  for (const field of [
    'index',
    'id',
    'title',
    'level',
    'summary',
    'roadmapSource',
  ]) {
    requireValue(
      track[field],
      `advanced track ${track.id ?? 'unknown'}.${field}`,
    );
  }
  const expectedIndex = String(index + 1).padStart(2, '0');
  if (track.index !== expectedIndex) {
    errors.push(
      `advanced track ${track.id ?? 'unknown'}.index must be ${expectedIndex}; found ${track.index}`,
    );
  }
  if (!Array.isArray(track.sections) || track.sections.length === 0) {
    errors.push(
      `advanced track ${track.id ?? 'unknown'} must be fully authored`,
    );
  }
}

const authoredTracks = curriculum.advancedTracks.filter((track) =>
  Array.isArray(track.sections),
);
if (authoredTracks.length !== expectedAdvancedTracks) {
  errors.push(
    `all ${expectedAdvancedTracks} advanced tracks must be fully authored`,
  );
}
unique(
  [...curriculum.stages, ...authoredTracks].map((route) => route.id),
  'authored routes',
);

const coreMapIds = curriculum.coreMap.map((stage) => stage.id);
const authoredCoreIds = curriculum.stages.map((stage) => stage.id);
if (coreMapIds.join('\n') !== authoredCoreIds.join('\n')) {
  errors.push('stages must match coreMap IDs and order exactly');
}

for (const sourceField of ['sourceRoadmap', 'sourceSurvey']) {
  const sourcePath = curriculum.product?.[sourceField];
  await validateSourceReference(sourcePath, `product.${sourceField}`);
}

function rejectLongDashes(value, label) {
  if (typeof value === 'string') {
    if (/[–—]/.test(value))
      errors.push(`${label} contains an en dash or em dash`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      rejectLongDashes(item, `${label}[${index}]`),
    );
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      rejectLongDashes(item, `${label}.${key}`);
    }
  }
}

rejectLongDashes(curriculum, 'curriculum');

async function validateRoute(stage, routeKind, requireCoreMap) {
  const stageLabel = `${routeKind} ${stage.id}`;
  for (const field of ['index', 'title', 'level', 'summary', 'roadmapSource']) {
    requireValue(stage[field], `${stageLabel}.${field}`);
  }

  if (
    requireCoreMap &&
    !curriculum.coreMap.some((entry) => entry.id === stage.id)
  ) {
    errors.push(`${stageLabel} is absent from coreMap`);
  }

  await validateSourceReference(
    stage.roadmapSource,
    `${stageLabel}.roadmapSource`,
  );

  if (!Array.isArray(stage.sections) || stage.sections.length === 0) {
    errors.push(`${stageLabel} has no sections`);
    return;
  }

  unique(
    stage.sections.map((section) => section.id),
    `${stageLabel}.sections`,
  );

  for (const section of stage.sections) {
    const sectionLabel = `${stageLabel} / section ${section.id}`;
    for (const field of ['index', 'id', 'title', 'why', 'checkpoint']) {
      requireValue(section[field], `${sectionLabel}.${field}`);
    }
    if (
      !Array.isArray(section.leaveForLater) ||
      section.leaveForLater.length === 0
    ) {
      errors.push(
        `${sectionLabel} must name what is deliberately left for later`,
      );
    } else {
      section.leaveForLater.forEach((item, index) =>
        requireValue(item, `${sectionLabel}.leaveForLater[${index}]`),
      );
    }
    if (!Array.isArray(section.topics) || section.topics.length === 0) {
      errors.push(`${sectionLabel} has no topics`);
      continue;
    }
    unique(
      section.topics.map((topic) => topic.id),
      `${sectionLabel}.topics`,
    );
    unique(
      section.topics.map((topic) => topic.title.trim().toLowerCase()),
      `${sectionLabel}.topic titles`,
    );
    for (const topic of section.topics) {
      requireValue(topic.id, `${sectionLabel} / topic unknown.id`);
      requireValue(topic.title, `${sectionLabel} / topic ${topic.id}.title`);
      if (!allowedScopes.has(topic.scope)) {
        errors.push(
          `${sectionLabel} / topic ${topic.id} has invalid scope ${topic.scope}`,
        );
      }
    }

    if (!Array.isArray(section.resources) || section.resources.length === 0) {
      errors.push(`${sectionLabel} has no resource route`);
      continue;
    }
    unique(
      section.resources.map((resource) => resource.id),
      `${sectionLabel}.resources`,
    );
    const primaryCount = section.resources.filter(
      (resource) => resource.priority === 'primary',
    ).length;
    if (primaryCount !== 1) {
      errors.push(
        `${sectionLabel} must have exactly one primary resource; found ${primaryCount}`,
      );
    }
    if (section.resources[0]?.priority !== 'primary') {
      errors.push(`${sectionLabel} must list its primary resource first`);
    }

    for (const resource of section.resources) {
      const resourceLabel = `${sectionLabel} / resource ${resource.id}`;
      for (const field of [
        'id',
        'role',
        'priority',
        'name',
        'provider',
        'access',
        'use',
      ]) {
        requireValue(resource[field], `${resourceLabel}.${field}`);
      }
      if (!allowedPriorities.has(resource.priority)) {
        errors.push(
          `${resourceLabel} has invalid priority ${resource.priority}`,
        );
      }
      if (!resource.url) {
        errors.push(`${resourceLabel} needs an HTTPS URL`);
      }
      if (resource.localPath) {
        errors.push(
          `${resourceLabel}.localPath is not allowed; use an HTTPS URL`,
        );
      }
      if (resource.url) {
        try {
          const url = new URL(resource.url);
          if (url.protocol !== 'https:')
            errors.push(`${resourceLabel}.url must use HTTPS`);
        } catch {
          errors.push(`${resourceLabel}.url is invalid: ${resource.url}`);
        }
      }
    }
  }

  requireValue(stage.milestone?.title, `${stageLabel}.milestone.title`);
  requireValue(
    stage.milestone?.description,
    `${stageLabel}.milestone.description`,
  );
  if (
    !Array.isArray(stage.milestone?.deliverables) ||
    stage.milestone.deliverables.length === 0
  ) {
    errors.push(`${stageLabel}.milestone must include deliverables`);
  }
  if (stage.milestone?.deliverables?.length !== 3) {
    errors.push(
      `${stageLabel}.milestone must contain exactly three deliverables`,
    );
  }
  stage.milestone?.deliverables?.forEach((deliverable, index) =>
    requireValue(deliverable, `${stageLabel}.milestone.deliverables[${index}]`),
  );
}

for (const stage of curriculum.stages) {
  await validateRoute(stage, 'stage', true);
}

for (const track of authoredTracks) {
  await validateRoute(track, 'track', false);
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const sectionCount = curriculum.stages.reduce(
  (total, stage) => total + stage.sections.length,
  0,
);
const topicCount = curriculum.stages.reduce(
  (total, stage) =>
    total +
    stage.sections.reduce((sum, section) => sum + section.topics.length, 0),
  0,
);
const resourceCount = curriculum.stages.reduce(
  (total, stage) =>
    total +
    stage.sections.reduce((sum, section) => sum + section.resources.length, 0),
  0,
);

const trackSectionCount = authoredTracks.reduce(
  (total, track) => total + track.sections.length,
  0,
);
const trackTopicCount = authoredTracks.reduce(
  (total, track) =>
    total +
    track.sections.reduce((sum, section) => sum + section.topics.length, 0),
  0,
);
const trackResourceCount = authoredTracks.reduce(
  (total, track) =>
    total +
    track.sections.reduce((sum, section) => sum + section.resources.length, 0),
  0,
);

const stageLabel = curriculum.stages.length === 1 ? 'stage' : 'stages';
const trackLabel = authoredTracks.length === 1 ? 'track' : 'tracks';
console.log(
  `Content valid: ${curriculum.stages.length} ${stageLabel}, ${sectionCount} sections, ${topicCount} topics, ${resourceCount} resources; ${authoredTracks.length} authored ${trackLabel}, ${trackSectionCount} stages, ${trackTopicCount} topics, ${trackResourceCount} resources.`,
);
