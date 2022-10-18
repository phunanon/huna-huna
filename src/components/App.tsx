import { createSignal, For } from 'solid-js';
import _, { orderBy, filter, sumBy, lowerCase } from 'lodash';
import styles from './App.module.css';
import Item from './Item';
import { TranscriptItem } from '~/types';

declare module 'solid-js' {
  export namespace JSX {
    interface IntrinsicElements {
      [tag: string]: HTMLAttributes<HTMLElement>;
    }
  }
}

const actions = ['Add', 'Remove'];

const transcript: TranscriptItem[] = [
  {
    tags: ['milestone', 'household', 'humidity'],
    timestamp: 1665550000000,
    content:
      'Began using dehumidifier less due to power consumption reaching over 4kWh each day.',
  },
  {
    tags: ['meal', 'household'],
    timestamp: 1665685000000,
    content: 'Mushroom stir-fry! Such a wonderful woman my wife is.',
  },
  {
    tags: ['meal', 'household'],
    timestamp: 1665870000000,
    content: 'Made apple crumble. Wifey didn\'t like the sourness of the apple.',
  },
  {
    tags: ['household', 'humidity'],
    timestamp: 1665700000000,
    content:
      'Tried the dehumidifier on the stool, on the countertop. Was just a nuisance.',
  },
  {
    tags: ['YouTube', 'learning', 'survival'],
    timestamp: 1665796000000,
    content:
      'Watched a video about stealth camping. Snugpak is a tiny tent which looks nice.',
  },
];

const numIntersections = (content: string[], queries: string[]) =>
  sumBy(content, x => sumBy(queries, y => Number(x.includes(y))));

function filterAndSortItems(query: string, transcript: TranscriptItem[]) {
  type WeightedItem = TranscriptItem & { weight: number };
  if (query) {
    const orGroup = (transcript: WeightedItem[], query: string) => {
      const queries = lowerCase(query.trim()).split(' ');
      if (!queries[0]) {
        return transcript;
      }
      const weighed = transcript.map(item => {
        const weight =
          numIntersections(item.tags.map(lowerCase), queries) +
          numIntersections(lowerCase(item.content).split(' '), queries);
        return { ...item, weight };
      });
      const filtered = filter(weighed, x => x.weight > 0);
      return orderBy(filtered, 'timestamp', 'desc');
    };
    return query.split('&').reduce(orGroup, transcript);
  }
  return orderBy(transcript, 'timestamp', 'desc');
}

function filterAndSortTags(query: string, transcript: TranscriptItem[]) {
  const tags = new Set(_.uniqBy(transcript, 'tags').flatMap(x => x.tags));
  const filtered = filter(Array.from(tags), x => x.includes(query));
  return orderBy(filtered, ['asc']);
}

export default function App() {
  const [query, setQuery] = createSignal('');

  const filteredTranscript = () => filterAndSortItems(query(), transcript);
  const filteredTags = () => filterAndSortTags(query(), transcript);

  return (
    <app class={styles.app}>
      <input value={query()} oninput={e => setQuery(e.currentTarget.value)} />
      <transcript>
        <For each={filteredTranscript()}>{item => <Item {...item} />}</For>
      </transcript>
    </app>
  );
}
