import { Hono } from 'hono';
import Layout from './layout';

const admin = new Hono();

admin.get('/', (c) => {
  return c.html(
    <Layout>
      <Login />
    </Layout>
  );
});

// htmx swap cheatsheet:
//   hx-swap="innerHTML"   // Replace the inside content of the target element
//   hx-swap="outerHTML"   // Replace the entire target element itself
//   hx-swap="beforebegin" // Insert content just before the target element
//   hx-swap="afterbegin"  // Insert content at the very start inside the target element
//   hx-swap="beforeend"   // Insert content at the very end inside the target element
//   hx-swap="afterend"    // Insert content just after the target element

const Login = ({ error }: { error?: string } = {}) => {
  return (
    <>
      <div
        id="login"
        className="flex flex-col items-center justify-center min-h-screen bg-base-200"
      >
        <div className="w-full max-w-md">
          <div className="card border-2 border-base-300 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-center">
                <h1 className="text-3xl font-semibold text-primary">
                  FFMPEG Service Admin Portal
                </h1>
                <p className="mt-2 text-sm text-base-content">
                  Sign in to manage and monitor your FFMPEG jobs.
                </p>
              </div>
              <form
                className="space-y-4 mt-6"
                hx-post="/login"
                hx-target="#login"
                hx-swap="innerHTML"
              >
                <div className="form-control">
                  <label htmlFor="username" className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full">
                    Login
                  </button>
                </div>
                {error && (
                  <div
                    className="alert alert-error mt-2 p-2 text-center animate-pulse"
                    id="login-error"
                  >
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

admin.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const username = body['username'];
  const password = body['password'];

  if (username === 'admin' && password === 'admin') {
    return c.html(<AdminDashboard username={username} />);
  } else {
    return c.html(<Login error="Invalid username or password." />);
  }
});

const AdminDashboard = ({ username }: { username: string }) => {
  return (
    <>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-base-content">
              Welcome, {username.slice(0, 1).toUpperCase() + username.slice(1)}!
            </p>
          </div>
          <div>
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-primary mb-6">Jobs</h2>
              <JobsTable />
            </div>
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-primary mb-6">API Keys</h2>
              <APIKeysTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

admin.get('/jobs', (c) => {
  return c.html(<JobsTable />);
});

interface JobResponse {
  lastPolledAt: Date;
  jobs: {
    id: number;
    apiKeySource: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const JobsTable = () => {
  const jobResponse = jobsQuery();

  if (jobResponse.jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <div
      hx-get="/jobs"
      hx-trigger="every 15s"
      hx-swap="outerHTML"
      className="overflow-x-auto rounded-xl shadow-lg bg-base-100"
    >
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-base-300 text-lg text-base-content">
            <th className="py-4 px-6 border-b border-base-300 text-left">ID</th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              API Key Source
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Status
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Created At
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody className="text-base text-base-content">
          {jobResponse.jobs.map((job, idx) => (
            <tr
              key={job.id}
              className={
                idx % 2 === 0
                  ? 'bg-base-200 hover:bg-base-300'
                  : 'bg-base-100 hover:bg-base-200'
              }
            >
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {job.id}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {job.apiKeySource}
              </td>
              <td className="py-4 px-6 border-b border-base-300">
                <span
                  className={`badge badge-lg ${
                    job.status === 'pending'
                      ? 'badge-warning'
                      : job.status === 'running'
                      ? 'badge-info'
                      : 'badge-success'
                  } badge-outline`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {job.status}
                </span>
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {job.createdAt}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {job.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 flex flex-col items-end">
        <span className="text-xs text-base-content/70">
          <span className="font-semibold">Last polled:</span>{' '}
          {jobResponse.lastPolledAt.toLocaleString()}
        </span>
        <span className="text-xs text-base-content/50 mt-1 italic">
          Data auto-refreshes every 30 seconds
        </span>
      </div>
    </div>
  );
};

interface APIKey {
  name: string;
  id: number;
  key: string;
  createdAt: string;
  updatedAt: string;
}

const APIKeysTable = () => {
  const apiKeys = getAPIKey();

  if (apiKeys.length === 0) {
    return <div>No API keys found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-base-100">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-base-300 text-lg text-base-content">
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Name
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">ID</th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Key
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Created At
            </th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody className="text-base text-base-content">
          {apiKeys.map((key: APIKey, idx: number) => (
            <tr
              key={key.id}
              className={
                idx % 2 === 0
                  ? 'bg-base-200 hover:bg-base-300'
                  : 'bg-base-100 hover:bg-base-200'
              }
            >
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {key.name}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {key.id}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {'*'.repeat(key.key.length - 8) + key.key.slice(-4)}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {key.createdAt}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {key.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function jobsQuery(): JobResponse {
  return {
    lastPolledAt: new Date(),
    jobs: [
      {
        id: 1,
        apiKeySource: 'apiKey1',
        status: 'pending',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
      },
      {
        id: 2,
        apiKeySource: 'apiKey2',
        status: 'running',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
      },
      {
        id: 3,
        apiKeySource: 'apiKey3',
        status: 'completed',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
      },
    ],
  };
}

function getAPIKey() {
  return [
    {
      name: 'API Key 1',
      id: 1,
      key: '1234567890',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
    },
    {
      name: 'API Key 2',
      id: 2,
      key: '1234567890',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
    },
    {
      name: 'API Key 3',
      id: 3,
      key: '1234567890',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
    },
  ];
}

export default admin;
