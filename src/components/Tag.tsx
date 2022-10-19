import { JSX, splitProps } from 'solid-js';
import classNames from 'classnames';
import Coloured from './Coloured';
import styles from './Tag.module.css';

export type TagProps = JSX.HTMLAttributes<HTMLElement> & {
  tag: string;
};

export default function Tag(props: TagProps) {
  const [p, rest] = splitProps(props, ['tag']);
  return (
    <Coloured {...rest} colourBy={p.tag} lux={20}>
      <tag class={classNames({ [styles.clickable]: !!rest.onClick })}>
        {p.tag}
      </tag>
    </Coloured>
  );
}
