import { JSX, ParentProps, splitProps } from 'solid-js';
import styles from './Coloured.module.css';

const hashCode = (s: string) =>
  s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
const pastel = (x: string, l = 87.5, a = 1) =>
  `hsla(${hashCode(x) % 360}, 100%, ${l}%, ${a})`;

export type ColouredProps = ParentProps<JSX.HTMLAttributes<HTMLElement>> & {
  colourBy: string;
  lux?: number;
  alpha?: number;
  gradient?: boolean;
};

export default function Coloured(props: ColouredProps) {
  const [p, rest] = splitProps(props, ['colourBy', 'lux', 'gradient', 'alpha']);
  return (
    <coloured
      style={`--colour: ${pastel(p.colourBy, p.lux, p.alpha)};`}
      classList={{ [styles.gradient]: p.gradient }}
      {...rest}
    >
      {props.children}
    </coloured>
  );
}
