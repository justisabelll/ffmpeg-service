export interface Job {
  id: number;
  apiKeySource: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobResponse {
  lastPolledAt: Date;
  jobs: Job[];
}

export interface APIKey {
  name: string;
  id: number;
  key: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data-fetching functions.
// In a real application, you would fetch this from your database.
export function jobsQuery(): JobResponse {
  return {
    lastPolledAt: new Date(),
    jobs: [
      {
        id: 1,
        apiKeySource: 'local',
        status: 'completed',
        createdAt: '2023-10-27T10:00:00Z',
        updatedAt: '2023-10-27T10:05:00Z',
      },
      {
        id: 2,
        apiKeySource: 'local',
        status: 'running',
        createdAt: '2023-10-27T11:00:00Z',
        updatedAt: '2023-10-27T11:05:00Z',
      },
      {
        id: 3,
        apiKeySource: 'remote-worker-1',
        status: 'pending',
        createdAt: '2023-10-27T12:00:00Z',
        updatedAt: '2023-10-27T12:00:00Z',
      },
    ],
  };
}

export function getAPIKey(): APIKey[] {
  return [
    {
      id: 1,
      name: 'My Personal Key',
      key: 'rAnd0mSTR1NG-456-XYZ',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Production Key',
      key: 'pRodKey-789-ABC',
      createdAt: '2023-02-15T00:00:00Z',
      updatedAt: '2023-02-15T00:00:00Z',
    },
  ];
}
