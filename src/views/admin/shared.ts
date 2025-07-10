import { db } from '../../db/db';
import {
  Job as JobType,
  jobs,
  apiKeys,
  APIKey as APIKeyType,
} from '../../db/schema';

export interface JobResponse {
  lastPolledAt: Date;
  jobs: JobType[];
}

export async function jobsQuery(): Promise<JobResponse> {
  const jobsList = await db.select().from(jobs);

  return {
    lastPolledAt: new Date(),
    jobs: jobsList,
  };
}

export async function getAPIKey(): Promise<APIKeyType[]> {
  const apiKeysList = await db.select().from(apiKeys);
  return apiKeysList;
}

export const addNewAPIKey = async (apiKey: string, nickname: string) => {
  const newAPIKey = await db.insert(apiKeys).values({
    key: apiKey,
    nickname: nickname,
    createdAt: new Date(),
  });
  return newAPIKey;
};
