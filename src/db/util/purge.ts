import { db } from '../db';
import { apiKeys, jobs } from '../schema';

export const purge = async () => {
  await db.delete(apiKeys);
  await db.delete(jobs);
};

console.log('Purging database...');
purge();
console.log('Database purged');
