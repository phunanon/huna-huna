import { TranscriptItem } from './types';
import { Octokit } from '@octokit/rest';

export const tagRegex = /(?:^|\s)#([^\s]+)/gi;
export const extractTags = (content: string) =>
  [...content.matchAll(tagRegex)].map(m => m[1]);

export type Settings = { auth: string; gist_id: string };

type Transcript = { error: string } | { transcript: TranscriptItem[] };
export async function downloadTranscript({
  auth,
  gist_id,
}: Settings): Promise<Transcript> {
  const octokit = new Octokit({ auth });

  const response = await octokit.request('GET /gists/{gist_id}', { gist_id });
  if (!response.data.files) {
    return { error: "Couldn't load transcript (no files)" };
  }
  const file = Object.values(response.data.files)[0];
  const content = file?.content;
  if (!content) {
    return { error: "Couldn't load transcript (empty)" };
  }

  const transcript: TranscriptItem[] = [];

  const items = content.trim().split('\n-----\n');
  items.forEach(item => {
    const [timestamp, ...lines] = item.trim().split('\n');
    if (!timestamp) {
      return;
    }
    const content = lines.join('\n');
    const tags = extractTags(content);
    transcript.push({ timestamp: Number(timestamp), content, tags });
  });

  return { transcript };
}

export async function uploadTranscript(
  { auth, gist_id }: Settings,
  transcript: TranscriptItem[],
): Promise<void> {
  const octokit = new Octokit({ auth });

  const content = transcript
    .map(item => `${item.timestamp}\n${item.content}`)
    .join('\n-----\n');

  await octokit.request('PATCH /gists/{gist_id}', {
    gist_id,
    files: { 'huna-huna.txt': { content } },
  });
}
