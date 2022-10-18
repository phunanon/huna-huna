import { JSX, splitProps } from 'solid-js';
import Coloured from './Coloured';
import './Tag.module.css';

export type TagProps = JSX.HTMLAttributes<HTMLElement> & {
  tag: string;
};

export default function Tag(props: TagProps) {
  const [p, rest] = splitProps(props, ['tag']);
  return (
    <Coloured {...rest} colourBy={p.tag}>
      <tag>{p.tag}</tag>
    </Coloured>
  );
}
