import curriculumSource from '@/content/curriculum.json';
import FieldGuide, { type Curriculum } from './field-guide';

const curriculum = curriculumSource as unknown as Curriculum;

export default function Home() {
  return <FieldGuide curriculum={curriculum} />;
}
