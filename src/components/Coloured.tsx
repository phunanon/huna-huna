import { JSX, ParentProps } from 'solid-js';
import './Coloured.module.css';

const hashCode = (s: string) =>
  s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
const pastel = (x: string, l = 87.5) =>
  `hsl(${hashCode(x) % 360}, 100%, ${l}%)`;

export type ColouredProps = ParentProps<JSX.HTMLAttributes<HTMLElement>> & {
  colourBy: string;
  luminosity?: number;
};

export default function Coloured(props: ColouredProps) {
  return (
    <coloured
      style={`--colour: ${pastel(props.colourBy, props.luminosity)}; ${
        props.style
      }`}
    >
      {props.children}
    </coloured>
  );
}
