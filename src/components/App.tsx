import { createEffect, createSignal, For } from 'solid-js';
import { orderBy, filter, sumBy, lowerCase, reject } from 'lodash-es';
import { zipObject } from 'lodash-es';
import styles from './App.module.css';
import Item from './Item';
import type { TranscriptItem } from '../Transcript';
import { downloadTranscript, Settings, uploadTranscript } from '../Transcript';
import { extractTags } from '../Transcript';
import { createStoredSignal } from '../hooks/createStoredSignal';

declare module 'solid-js' {
  export namespace JSX {
    interface IntrinsicElements {
      [tag: string]: HTMLAttributes<HTMLElement>;
    }
  }
}

const numIntersections = (content: string[], queries: string[]) =>
  sumBy(content, x => sumBy(queries, y => Number(x.includes(y))));

function filterAndSortItems(query: string, transcript: TranscriptItem[]) {
  if (query) {
    const orGroup = (transcript: TranscriptItem[], query: string) => {
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
      return orderBy(filtered as TranscriptItem[], 'timestamp', 'desc');
    };
    return query.split('&').reduce(orGroup, transcript);
  }
  return orderBy(transcript, 'timestamp', 'desc');
}

export default function App() {
  const [settings, setSettings] = createStoredSignal<Settings>('settings');
  const [query, setQuery] = createSignal('');
  const [transcript, setTranscript] = createSignal<TranscriptItem[]>([]);

  //Consume settings
  createEffect(() => {
    const [auth, gist_id] = query().split(':');
    if (auth && auth.length > 32 && gist_id?.length === 32) {
      setSettings({ auth, gist_id });
      setQuery('');
    }
  });

  //Download transcript
  createEffect(async () => {
    const config = settings();
    if (!config) {
      return;
    }
    const response = await downloadTranscript(config);
    if ('error' in response) {
      console.error(response.error);
      return;
    }
    setTranscript(response.transcript);
  });

  const filteredTranscript = () => filterAndSortItems(query(), transcript());

  const handleCommit = (timestamp?: number) => {
    return (content: string) => {
      const config = settings();
      if (!config) {
        return;
      }
      timestamp ??= Date.now() - 1100;
      const current = transcript();
      const time2item = zipObject(
        current.map(x => x.timestamp),
        current,
      );
      time2item[timestamp] = { timestamp, content, tags: extractTags(content) };
      const newTranscript = Object.values(time2item);
      setTranscript(newTranscript);
      uploadTranscript(config, newTranscript);
    };
  };

  const handleDelete = (timestamp: number) => () => {
    const config = settings();
    if (!config) {
      return;
    }
    const newTranscript = reject(transcript(), { timestamp });
    setTranscript(newTranscript);
    uploadTranscript(config, newTranscript);
  };

  return (
    <app class={styles.app}>
      <input
        value={query()}
        oninput={e => setQuery(e.currentTarget.value)}
        placeholder={!settings() ? 'Enter AuthToken:GistID' : ''}
      />
      <transcript>
        {!query() && <Item content="" tags={[]} onCommit={handleCommit()} />}
        <For each={filteredTranscript()}>
          {item => (
            <Item
              {...item}
              onCommit={handleCommit(item.timestamp)}
              onDelete={handleDelete(item.timestamp)}
            />
          )}
        </For>
      </transcript>
    </app>
  );
}
