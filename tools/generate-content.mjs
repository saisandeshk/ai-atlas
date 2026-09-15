import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const curriculum = JSON.parse(
  await readFile(path.join(projectRoot, 'content', 'curriculum.json'), 'utf8'),
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
  return `${lines.join('\n')}\n`;
}

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
