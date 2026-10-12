import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadUnitFiles, mergeUnits } from './units.mjs';

const projectRoot = process.cwd();
const unitFiles = await loadUnitFiles(projectRoot);
const curriculum = mergeUnits(
  JSON.parse(
    await readFile(
      path.join(projectRoot, 'content', 'curriculum.json'),
      'utf8',
    ),
  ),
  unitFiles,
);
const stageOutputDirectory = path.join(projectRoot, 'content', 'stages');
const trackOutputDirectory = path.join(projectRoot, 'content', 'tracks');

function label(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function routeMarkdown(stage, routeKind) {
  const topicCount = stage.sections.reduce(
    (sum, section) => sum + section.topics.length,
    0,
  );
  const sectionLabel = routeKind === 'Track' ? 'track stages' : 'sections';
  const requiredCount = stage.sections.reduce(
    (sum, section) =>
      sum + section.topics.filter((topic) => topic.scope === 'required').length,
    0,
  );
  const lines = [
    '<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->',
    '',
    `# ${stage.index}. ${stage.title}`,
    '',
    `**Level:** ${stage.level}  `,
    `**Scope:** ${stage.sections.length} ${sectionLabel} · ${requiredCount} required topics · ${topicCount - requiredCount} optional, depth, or later topics`,
    '',
    stage.summary,
    '',
    '## Order',
    '',
    ...stage.sections.map((section) => `${section.index}. ${section.title}`),
    '',
  ];

  for (const section of stage.sections) {
    lines.push(
      `## ${section.index}. ${section.title}`,
      '',
      `**Why:** ${section.why}`,
      '',
      '### Learn this much',
      '',
    );
    for (const topic of section.topics) {
      lines.push(`- [ ] ${topic.title} _(${label(topic.scope)})_`);
    }

    if (section.units) lines.push('', ...unitsMarkdown(section));

    lines.push('', '### Resource route', '');
    for (const resource of section.resources) {
      const destination = resource.url ?? `../${resource.localPath}`;
      lines.push(
        `- **${label(resource.priority)} - ${label(resource.role)}:** [${resource.name}](${destination}) - ${resource.use}`,
      );
    }

    lines.push(
      '',
      '### Exit checkpoint',
      '',
      section.checkpoint,
      '',
      '<details>',
      '<summary>Deliberately left for later</summary>',
      '',
      ...section.leaveForLater.map((item) => `- ${item}`),
      '',
      '</details>',
      '',
    );
  }

  const capstoneRubric = stage.capstone?.rubric ?? [];
  lines.push(
    `## ${routeKind} milestone`,
    '',
    `### ${stage.milestone.title}`,
    '',
    stage.milestone.description,
    '',
    ...stage.milestone.deliverables.map((deliverable) => `- ${deliverable}`),
    '',
  );
  if (capstoneRubric.length) {
    lines.push(
      `**Capstone rubric** (about ${stage.capstone.hours} hours)`,
      '',
      ...rubricMarkdown(capstoneRubric),
      '',
    );
  }
  return `${lines.join('\n')}\n`;
}

const targetLabels = {
  explain: 'Explain',
  derive: 'Derive',
  implement: 'Implement',
  measure: 'Measure',
};

function rubricMarkdown(rubric) {
  return [
    '| Criterion | Pass | Strong |',
    '| --- | --- | --- |',
    ...rubric.map(
      (item) => `| ${item.criterion} | ${item.pass} | ${item.strong} |`,
    ),
  ];
}

function unitsMarkdown(section) {
  const topicTitle = new Map(
    section.topics.map((topic) => [topic.id, topic.title]),
  );
  const resourceName = new Map(
    section.resources.map((resource) => [resource.id, resource.name]),
  );
  const lines = ['### Study units', ''];
  section.units.forEach((unit, index) => {
    const targets = unit.target
      .map((target) => targetLabels[target])
      .join(' + ');
    lines.push(
      `#### U${index + 1}. ${unit.title}`,
      '',
      `**About ${unit.hours} h** · **Target:** ${targets}`,
      '',
      `Topics: ${unit.topics.map((topic) => topicTitle.get(topic)).join('; ')}`,
      '',
      unit.why,
      '',
      '**You can now**',
      '',
      ...unit.outcomes.map((outcome) => `- ${outcome}`),
      '',
      '**Study**',
      '',
      ...unit.study.map((item, itemIndex) => {
        const link = item.url ? `[${item.title}](${item.url})` : item.title;
        const depth = item.depth ? ` Depth: ${item.depth}` : '';
        return `${itemIndex + 1}. ${link} (${resourceName.get(item.resource)}) - ${item.locator}.${depth}`;
      }),
      '',
      '**Focus**',
      '',
      ...unit.focus.map((point) => `- ${point}`),
      '',
      `**Reproduce:** ${unit.reproduce}`,
      '',
      '**Traps**',
      '',
      ...unit.traps.map((trap) => `- ${trap}`),
      '',
      '**Practice**',
      '',
      ...(unit.practice.length
        ? unit.practice.map(
            (item) =>
              `- [${item.name}](${item.url}) - ${item.locator}${item.note ? `. ${item.note}` : ''}`,
          )
        : [`- ${unit.practiceNote}`]),
      '',
      `**Stop when:** ${unit.stopWhen}`,
      '',
      '<details>',
      '<summary>Self-test</summary>',
      '',
      ...unit.selfTest.flatMap((item, itemIndex) => [
        `${itemIndex + 1}. ${item.q}`,
        `   - ${item.a}`,
      ]),
      '',
      '</details>',
      '',
    );
  });
  // Only a strict build guarantees the mini-project; skip it while drafting.
  const mini = section.miniProject;
  if (!mini) return lines;
  lines.push(
    `### Mini-project: ${mini.title}`,
    '',
    `**About ${mini.hours} hours.** ${mini.brief}`,
    '',
    ...mini.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '**Deliverables**',
    '',
    ...mini.deliverables.map((item) => `- ${item}`),
    '',
    '**Checks**',
    '',
    ...mini.checks.map((check) => {
      const name = check.url ? `[${check.name}](${check.url})` : check.name;
      const command = check.command ? ` Run \`${check.command}\`.` : '';
      return `- ${check.kind}: ${name}.${command}${check.note ? ` ${check.note}` : ''}`;
    }),
    '',
    ...rubricMarkdown(mini.rubric),
    '',
    `Feeds into: ${mini.feedsInto}`,
  );
  return lines;
}

async function writeUnitIndex() {
  const imports = unitFiles.map(
    (file, index) =>
      `import unitFile${index} from './${file.route}/${file.name}.json';`,
  );
  const entries = unitFiles.map(
    (file, index) =>
      `  { route: '${file.route}', name: '${file.name}', data: unitFile${index} },`,
  );
  const source = [
    '// Generated by tools/generate-content.mjs from content/units. Do not edit.',
    ...imports,
    '',
    'export const unitFiles: Array<{ route: string; name: string; data: unknown }> = [',
    ...entries,
    '];',
    '',
  ].join('\n');
  const indexPath = path.join(projectRoot, 'content', 'units', 'index.ts');
  await mkdir(path.dirname(indexPath), { recursive: true });
  await writeFile(indexPath, source);
  console.log(`Generated ${path.relative(projectRoot, indexPath)}`);
}

await writeUnitIndex();

await mkdir(stageOutputDirectory, { recursive: true });
for (const stage of curriculum.stages) {
  const outputPath = path.join(stageOutputDirectory, `${stage.id}.md`);
  await writeFile(outputPath, routeMarkdown(stage, 'Stage'));
  console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
}

const authoredTracks = curriculum.advancedTracks.filter((track) =>
  Array.isArray(track.sections),
);
await mkdir(trackOutputDirectory, { recursive: true });
for (const track of authoredTracks) {
  const outputPath = path.join(trackOutputDirectory, `${track.id}.md`);
  await writeFile(outputPath, routeMarkdown(track, 'Track'));
  console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
}
