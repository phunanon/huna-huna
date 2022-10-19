import { countBy } from 'lodash';
import ms from 'pretty-ms';
import { createSignal, For, splitProps } from 'solid-js';
import { tagRegex } from '~/Transcript';
import { TranscriptItem } from '~/types';
import Coloured from './Coloured';
import './Item.module.css';
import Tag from './Tag';

export type ItemProps = Omit<TranscriptItem, 'timestamp'> & {
  timestamp?: number;
  onCommit: (text: string) => void;
  onDelete?: () => void;
};

export default function Item(props: ItemProps) {
  const [c, p] = splitProps(props, ['onCommit']);
  const [timeNow, setTimeNow] = createSignal(Date.now());
  const [text, setText] = createSignal(p.content);
  const [revealTags, setRevealTags] = createSignal(false);
  const [confirmDelete, setConfirmDelete] = createSignal(false);

  setInterval(() => setTimeNow(Date.now()), 1000);

  const handleCommit = () => {
    const txt = text();
    txt !== p.content && c.onCommit(txt.replaceAll(/\n+/g, '\n').trim());
    setText('');
  };

  const handleDelete = () => {
    if (confirmDelete()) {
      p.onDelete?.();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const editing = () => text() !== p.content;
  const editButtons = () =>
    editing() && (
      <>
        <Tag onClick={handleCommit} tag="🖫" />
        <Tag onClick={() => setText(p.content)} tag="↩" />
      </>
    );

  const value = () => (revealTags() ? text() : text().replace(tagRegex, ''));
  const rows = () => countBy(value())['\n'] || 1;

  return (
    <Coloured colourBy={p.tags.join(' ')} lux={20} alpha={0.5} gradient>
      <item>
        <tags>
          {p.onDelete && !editing() && (
            <Tag onClick={handleDelete} tag={confirmDelete() ? '?' : '🗑'} />
          )}
          {editButtons()}
          <For each={[...p.tags].sort()}>{x => <Tag tag={x} />}</For>
        </tags>
        {p.timestamp && (
          <stamp>
            {ms(-(p.timestamp - timeNow()), { verbose: true, compact: true })}{' '}
            ago
          </stamp>
        )}
        <textarea
          onInput={e => setText(e.currentTarget.value ?? p.content)}
          onFocus={e => setRevealTags(true)}
          onBlur={e => setRevealTags(false)}
          rows={rows()}
          value={value()}
        />
      </item>
    </Coloured>
  );
}
