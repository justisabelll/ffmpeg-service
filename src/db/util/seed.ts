import { db } from '../db';
import { apiKeys, jobs } from '../schema';
import { randomBytes } from 'node:crypto';
import { purge } from './purge';

function generateFakeJobData(apiKeyId: number): typeof jobs.$inferInsert {
  const statuses = ['pending', 'processing', 'completed', 'failed'];
  const commands = [
    'ffmpeg -i input.mp4 -c:v libx264 -c:a aac -b:a 192k output.mp4',
    'ffmpeg -i input.mp4 -vf "scale=1280:720" -c:v libx265 -c:a copy output_720p.mp4',
    'ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:05 -c copy clip.mp4',
    'ffmpeg -i input.mp4 -vn -acodec copy audio.aac',
    'ffmpeg -i input.mp4 -vf "hue=s=0" -c:a copy grayscale.mp4',
    'ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 1M -c:a libopus output.webm',
    'ffmpeg -i input.mp4 -vf "transpose=1" -c:a copy rotated.mp4',
    'ffmpeg -i input.mp4 -c:v libx264 -preset veryslow -crf 22 -c:a aac -b:a 128k compressed.mp4',
  ];

  return {
    apiKeyId,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    command: commands[Math.floor(Math.random() * commands.length)],
    createdAt: new Date(),
    processedDoneAt: new Date(),
    error: '',
  };
}

function generateFakeApiKeyData(): typeof apiKeys.$inferInsert {
  return {
    key: randomBytes(32).toString('hex'),
    nickname: `API Key ${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date(),
  };
}

export const seed = async () => {
  const apiKeyData: (typeof apiKeys.$inferInsert)[] = [];
  const jobData: (typeof jobs.$inferInsert)[] = [];

  // First, generate 10 API keys
  for (let i = 0; i < 10; i++) {
    apiKeyData.push(generateFakeApiKeyData());
  }

  // Insert API keys and get their IDs
  const insertedApiKeys = await db
    .insert(apiKeys)
    .values(apiKeyData)
    .returning({ id: apiKeys.id });

  // For each API key, generate a random number of jobs (1-3)
  for (const apiKey of insertedApiKeys) {
    const numJobs = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numJobs; j++) {
      jobData.push(generateFakeJobData(apiKey.id));
    }
  }

  await db.insert(jobs).values(jobData);
};

console.log('Cleaning database before seeding...');
(async () => {
  await purge();
  console.log('Seeding database...');
  await seed();
})();
