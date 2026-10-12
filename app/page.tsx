import curriculumSource from '@/content/curriculum.json';
import { unitFiles } from '@/content/units/index';
import { mergeUnits } from '@/lib/merge-units';
import FieldGuide, { type Curriculum } from './field-guide';

const curriculum = mergeUnits(
  structuredClone(curriculumSource) as unknown as Curriculum,
  unitFiles,
);

export default function Home() {
  return <FieldGuide curriculum={curriculum} />;
}
