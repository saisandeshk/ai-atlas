import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Study units live beside the curriculum, one file per section, so parallel
// authors never edit the same file. See content/AUTHORING.md, "Study units".

export const allowedTargets = new Set([
  'explain',
  'derive',
  'implement',
  'measure',
]);
export const allowedVerdicts = new Set(['kept', 'added', 'replaced']);
export const allowedCheckKinds = new Set([
  'harness',
  'external-tests',
  'rubric',
]);
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function loadUnitFiles(projectRoot) {
  const root = path.join(projectRoot, 'content', 'units');
  const files = [];
  let routes = [];
  try {
    routes = await readdir(root, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const route of routes) {
    if (!route.isDirectory()) continue;
    const entries = await readdir(path.join(root, route.name));
    for (const name of entries.sort()) {
      if (!name.endsWith('.json')) continue;
      const file = path.join(root, route.name, name);
      files.push({
        route: route.name,
        name: name.replace(/\.json$/, ''),
        relative: path.relative(projectRoot, file),
        data: JSON.parse(await readFile(file, 'utf8')),
      });
    }
  }
  return files.sort((a, b) => a.relative.localeCompare(b.relative));
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function checkHttps(value, label, errors) {
  try {
    if (new URL(value).protocol !== 'https:')
      errors.push(`${label} must use HTTPS`);
  } catch {
    errors.push(`${label} is not a valid URL: ${value}`);
  }
}

function checkStrings(list, label, min, max, errors) {
  if (!Array.isArray(list) || list.length < min || list.length > max) {
    errors.push(`${label} needs ${min} to ${max} entries`);
    return;
  }
  list.forEach((item, index) => {
    if (!nonEmptyString(item)) errors.push(`${label}[${index}] is empty`);
  });
}

function checkResource(resource, label, errors) {
  for (const field of [
    'id',
    'role',
    'priority',
    'name',
    'provider',
    'access',
    'use',
    'url',
  ]) {
    if (!nonEmptyString(resource?.[field]))
      errors.push(`${label}.${field} is missing`);
  }
  if (resource?.priority === 'primary')
    errors.push(`${label} cannot be primary; a section keeps one primary`);
  if (resource?.url) checkHttps(resource.url, `${label}.url`, errors);
}

function checkRubric(rubric, label, min, errors) {
  if (!Array.isArray(rubric) || rubric.length < min) {
    errors.push(`${label} needs at least ${min} criteria`);
    return;
  }
  rubric.forEach((item, index) => {
    for (const field of ['criterion', 'pass', 'strong']) {
      if (!nonEmptyString(item?.[field]))
        errors.push(`${label}[${index}].${field} is missing`);
    }
  });
}

function rejectTodo(value, label, errors) {
  if (typeof value === 'string') {
    if (/\bTODO\b/.test(value)) errors.push(`${label} still says TODO`);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => rejectTodo(item, `${label}[${index}]`, errors));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value))
      rejectTodo(item, `${label}.${key}`, errors);
  }
}

function checkMiniProject(mini, unitIds, miniLabel, errors) {
  for (const field of ['title', 'hours', 'brief', 'feedsInto']) {
    if (!nonEmptyString(mini[field]))
      errors.push(`${miniLabel}.${field} is missing`);
  }
  if (!Array.isArray(mini.units) || mini.units.length === 0) {
    errors.push(`${miniLabel}.units is empty`);
  } else {
    for (const unitId of mini.units) {
      if (!unitIds.has(unitId))
        errors.push(`${miniLabel}: unknown unit ${unitId}`);
    }
  }
  checkStrings(mini.steps, `${miniLabel}.steps`, 2, 8, errors);
  checkStrings(mini.deliverables, `${miniLabel}.deliverables`, 1, 5, errors);
  if (!Array.isArray(mini.checks) || mini.checks.length === 0) {
    errors.push(`${miniLabel}.checks is empty`);
  } else {
    mini.checks.forEach((check, checkIndex) => {
      const checkLabel = `${miniLabel}.checks[${checkIndex}]`;
      if (!allowedCheckKinds.has(check?.kind))
        errors.push(`${checkLabel}.kind must be harness, external-tests or rubric`);
      if (!nonEmptyString(check?.name))
        errors.push(`${checkLabel}.name is missing`);
      if (check?.url) checkHttps(check.url, `${checkLabel}.url`, errors);
    });
  }
  checkRubric(mini.rubric, `${miniLabel}.rubric`, 3, errors);
}

// strict: every section with units must also have its mini-project file.
// Authors of one file validate without it; the build is strict.
export function validateUnitFiles(curriculum, files, errors, { strict = false } = {}) {
  const routes = [
    ...curriculum.stages,
    ...curriculum.advancedTracks.filter((track) =>
      Array.isArray(track.sections),
    ),
  ];
  const routeById = new Map(routes.map((route) => [route.id, route]));
  const unitRefs = new Set();
  const pendingNext = [];

  const projectFiles = new Map(
    files
      .filter((file) => file.name.endsWith('.project'))
      .map((file) => [`${file.route}/${file.name.replace(/\.project$/, '')}`, file]),
  );
  for (const file of files) rejectTodo(file.data, file.relative, errors);

  for (const file of files) {
    if (file.name.endsWith('.project')) {
      const key = `${file.route}/${file.name.replace(/\.project$/, '')}`;
      if (!files.some((entry) => `${entry.route}/${entry.name}` === key))
        errors.push(`${file.relative}: no unit file for this section`);
      continue;
    }
    const route = routeById.get(file.route);
    if (!route) {
      errors.push(`${file.relative}: unknown route ${file.route}`);
      continue;
    }
    if (file.name === '_route') {
      const capstone = file.data.capstone;
      if (!nonEmptyString(capstone?.hours))
        errors.push(`${file.relative}: capstone.hours is missing`);
      checkRubric(
        capstone?.rubric,
        `${file.relative}: capstone.rubric`,
        4,
        errors,
      );
      continue;
    }

    const section = route.sections.find((entry) => entry.id === file.name);
    const label = file.relative;
    if (!section) {
      errors.push(`${label}: unknown section ${file.name} in ${route.id}`);
      continue;
    }
    if (file.data.section !== section.id)
      errors.push(`${label}: "section" must be ${section.id}`);

    const added = Array.isArray(file.data.addedResources)
      ? file.data.addedResources
      : [];
    added.forEach((resource, index) =>
      checkResource(resource, `${label}: addedResources[${index}]`, errors),
    );
    const pool = new Set([
      ...section.resources.map((resource) => resource.id),
    ]);
    for (const resource of added) {
      if (pool.has(resource.id))
        errors.push(`${label}: resource ID ${resource.id} is already used`);
      pool.add(resource.id);
    }

    const units = file.data.units;
    if (!Array.isArray(units) || units.length === 0) {
      errors.push(`${label}: units are missing`);
      continue;
    }
    const topicScope = new Map(
      section.topics.map((topic) => [topic.id, topic.scope]),
    );
    const owner = new Map();
    const unitIds = new Set();

    for (const [index, unit] of units.entries()) {
      const unitLabel = `${label}: unit ${unit?.id ?? index + 1}`;
      if (!idPattern.test(unit?.id ?? ''))
        errors.push(`${unitLabel}.id must be lowercase kebab case`);
      if (unitIds.has(unit.id)) errors.push(`${unitLabel} is a duplicate ID`);
      unitIds.add(unit.id);
      unitRefs.add(`${route.id}/${section.id}/${unit.id}`);

      for (const field of ['title', 'why', 'reproduce', 'stopWhen']) {
        if (!nonEmptyString(unit[field]))
          errors.push(`${unitLabel}.${field} is missing`);
      }
      if (!Number.isInteger(unit.hours) || unit.hours < 1 || unit.hours > 12)
        errors.push(`${unitLabel}.hours must be a whole number from 1 to 12`);
      if (
        !Array.isArray(unit.target) ||
        unit.target.length === 0 ||
        unit.target.some((target) => !allowedTargets.has(target))
      ) {
        errors.push(
          `${unitLabel}.target must list explain, derive, implement or measure`,
        );
      }

      if (!Array.isArray(unit.topics) || unit.topics.length === 0) {
        errors.push(`${unitLabel}.topics is empty`);
      } else {
        for (const topic of unit.topics) {
          const scope = topicScope.get(topic);
          if (!scope) errors.push(`${unitLabel}: unknown topic ${topic}`);
          else if (scope !== 'required' && scope !== 'optional')
            errors.push(`${unitLabel}: ${scope} topic ${topic} stays outside units`);
          if (owner.has(topic))
            errors.push(
              `${unitLabel}: topic ${topic} is already in unit ${owner.get(topic)}`,
            );
          owner.set(topic, unit.id);
        }
      }

      checkStrings(unit.outcomes, `${unitLabel}.outcomes`, 2, 4, errors);
      checkStrings(unit.focus, `${unitLabel}.focus`, 2, 4, errors);
      checkStrings(unit.traps, `${unitLabel}.traps`, 2, 3, errors);

      if (!Array.isArray(unit.next) || unit.next.length < 1 || unit.next.length > 3) {
        errors.push(`${unitLabel}.next needs 1 to 3 links`);
      } else {
        unit.next.forEach((link, linkIndex) => {
          const linkLabel = `${unitLabel}.next[${linkIndex}]`;
          if (!nonEmptyString(link?.note))
            errors.push(`${linkLabel}.note is missing`);
          if (nonEmptyString(link?.unit)) {
            pendingNext.push({ ref: link.unit, label: linkLabel });
          } else if (nonEmptyString(link?.route)) {
            if (!routeById.has(link.route))
              errors.push(`${linkLabel}: unknown route ${link.route}`);
          } else {
            errors.push(`${linkLabel} needs a unit or route reference`);
          }
        });
      }

      if (!Array.isArray(unit.study) || unit.study.length === 0) {
        errors.push(`${unitLabel}.study is empty`);
      } else {
        unit.study.forEach((item, itemIndex) => {
          const itemLabel = `${unitLabel}.study[${itemIndex}]`;
          if (!pool.has(item?.resource))
            errors.push(`${itemLabel}: unknown resource ${item?.resource}`);
          for (const field of ['title', 'locator']) {
            if (!nonEmptyString(item?.[field]))
              errors.push(`${itemLabel}.${field} is missing`);
          }
          if (item?.url) checkHttps(item.url, `${itemLabel}.url`, errors);
          if (item?.depth !== undefined && !nonEmptyString(item.depth))
            errors.push(`${itemLabel}.depth is empty; omit it instead`);
        });
      }

      if (
        !Array.isArray(unit.selfTest) ||
        unit.selfTest.length < 3 ||
        unit.selfTest.length > 5
      ) {
        errors.push(`${unitLabel}.selfTest needs 3 to 5 questions`);
      } else {
        unit.selfTest.forEach((item, itemIndex) => {
          if (!nonEmptyString(item?.q) || !nonEmptyString(item?.a))
            errors.push(`${unitLabel}.selfTest[${itemIndex}] needs q and a`);
        });
      }

      if (!Array.isArray(unit.practice)) {
        errors.push(`${unitLabel}.practice must be a list`);
      } else if (unit.practice.length === 0) {
        if (!nonEmptyString(unit.practiceNote))
          errors.push(
            `${unitLabel}: empty practice needs a practiceNote naming what covers it`,
          );
      } else {
        unit.practice.forEach((item, itemIndex) => {
          const itemLabel = `${unitLabel}.practice[${itemIndex}]`;
          for (const field of ['name', 'url', 'locator']) {
            if (!nonEmptyString(item?.[field]))
              errors.push(`${itemLabel}.${field} is missing`);
          }
          if (item?.url) checkHttps(item.url, `${itemLabel}.url`, errors);
        });
      }

      if (!allowedVerdicts.has(unit.fit?.verdict) || !nonEmptyString(unit.fit?.note))
        errors.push(`${unitLabel}.fit needs a verdict and a note`);
    }

    for (const topic of section.topics) {
      if (
        (topic.scope === 'required' || topic.scope === 'optional') &&
        !owner.has(topic.id)
      ) {
        errors.push(`${label}: topic ${topic.id} is in no unit`);
      }
    }

    const project = projectFiles.get(`${route.id}/${section.id}`);
    if (!project) {
      if (strict) errors.push(`${label}: ${section.id}.project.json is missing`);
      continue;
    }
    if (!project.data.miniProject) {
      errors.push(`${project.relative}: miniProject is missing`);
      continue;
    }
    checkMiniProject(project.data.miniProject, unitIds, `${project.relative}: miniProject`, errors);
  }

  for (const { ref, label } of pendingNext) {
    if (!unitRefs.has(ref))
      errors.push(`${label}: unknown unit ${ref} (use route/section/unit)`);
  }
}

// Merge the unit files into a curriculum object for the site and the reading
// copies. Added resources join the end of their section's pool.
export function mergeUnits(curriculum, files) {
  const routes = [...curriculum.stages, ...curriculum.advancedTracks];
  for (const file of files) {
    const route = routes.find((entry) => entry.id === file.route);
    if (!route?.sections) continue;
    if (file.name === '_route') {
      route.capstone = file.data.capstone;
      continue;
    }
    if (file.name.endsWith('.project')) {
      const section = route.sections.find(
        (entry) => entry.id === file.name.replace(/\.project$/, ''),
      );
      if (section) section.miniProject = file.data.miniProject;
      continue;
    }
    const section = route.sections.find((entry) => entry.id === file.name);
    if (!section) continue;
    section.resources = [
      ...section.resources,
      ...(file.data.addedResources ?? []),
    ];
    section.units = file.data.units;
  }
  return curriculum;
}
