// Merge the study-unit files (content/units, see content/AUTHORING.md) into
// the curriculum. Mirrors mergeUnits in tools/units.mjs, which builds the
// Markdown reading copies from the same files.

type UnitFile = { route: string; name: string; data: unknown };

type MergeableSection = {
  id: string;
  resources: unknown[];
  units?: unknown;
  miniProject?: unknown;
};

type MergeableRoute = {
  id: string;
  sections?: MergeableSection[];
  capstone?: unknown;
};

export function mergeUnits<
  T extends { stages: MergeableRoute[]; advancedTracks: MergeableRoute[] },
>(curriculum: T, files: UnitFile[]): T {
  const routes = [...curriculum.stages, ...curriculum.advancedTracks];
  for (const file of files) {
    const route = routes.find((entry) => entry.id === file.route);
    if (!route?.sections) continue;
    const data = file.data as {
      capstone?: unknown;
      miniProject?: unknown;
      units?: unknown;
      addedResources?: unknown[];
    };
    if (file.name === '_route') {
      route.capstone = data.capstone;
      continue;
    }
    if (file.name.endsWith('.project')) {
      const section = route.sections.find(
        (entry) => entry.id === file.name.replace(/\.project$/, ''),
      );
      if (section) section.miniProject = data.miniProject;
      continue;
    }
    const section = route.sections.find((entry) => entry.id === file.name);
    if (!section) continue;
    section.resources = [...section.resources, ...(data.addedResources ?? [])];
    section.units = data.units;
  }
  return curriculum;
}
