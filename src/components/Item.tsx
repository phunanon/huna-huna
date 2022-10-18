import _ from 'lodash';
import ms from 'pretty-ms';
import { createSignal, For } from 'solid-js';
import { TranscriptItem } from '~/types';
import Coloured from './Coloured';
import './Item.module.css';
import Tag from './Tag';

export default function Item(p: TranscriptItem) {
  const [timeNow, setTimeNow] = createSignal(Date.now());

  setInterval(() => setTimeNow(Date.now()), 1000);

  return (
    <Coloured colourBy={p.tags.join(' ')} luminosity={10}>
      <item>
        <tags>
          <Tag tag="+" style="cursor: pointer;" />
          <For each={[...p.tags].sort()}>{x => <Tag tag={x} />}</For>
        </tags>
        <stamp>
          {ms(-(p.timestamp - timeNow()), { verbose: true, compact: true })} ago
        </stamp>
        <content>{p.content}</content>
      </item>
    </Coloured>
  );
}
