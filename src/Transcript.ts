import { TranscriptItem } from './types';
import { Octokit } from '@octokit/rest';

export const tagRegex = /(?:^|\s)#([^\s]+)/gi;
export const extractTags = (content: string) =>
  [...content.matchAll(tagRegex)].map(m => m[1]);

const gist_id = '0eb81a14410da39ca69f71312f0ae939';

type Transcript = { error: string } | { transcript: TranscriptItem[] };
export async function downloadTranscript(): Promise<Transcript> {
  const octokit = new Octokit({
    auth: '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',
  });

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
  transcript: TranscriptItem[],
): Promise<void> {
  const octokit = new Octokit({
    auth: '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',
  });

  const content = transcript
    .map(item => `${item.timestamp}\n${item.content}`)
    .join('\n-----\n');

  await octokit.request('PATCH /gists/{gist_id}', {
    gist_id,
    files: { 'huna-huna.txt': { content } },
  });
}
