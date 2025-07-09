import { jobsQuery, getAPIKey } from './shared';
import type { Job, APIKey } from './shared';

export const Login = ({ error }: { error?: string } = {}) => {
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

export const AdminDashboard = ({ username }: { username: string }) => {
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

export const JobsTable = () => {
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
          {jobResponse.jobs.map((job: Job, idx: number) => (
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

export const APIKeysTable = () => {
  const apiKeys = getAPIKey();

  if (apiKeys.length === 0) {
    return <div>No API keys found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-base-100">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-base-300 text-lg text-base-content">
            <th className="py-4 px-6 border-b border-base-300 text-left">ID</th>
            <th className="py-4 px-6 border-b border-base-300 text-left">
              Name
            </th>
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
          {apiKeys.map((apiKey: APIKey, idx: number) => (
            <tr
              key={apiKey.id}
              className={
                idx % 2 === 0
                  ? 'bg-base-200 hover:bg-base-300'
                  : 'bg-base-100 hover:bg-base-200'
              }
            >
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {apiKey.id}
              </td>
              <td className="py-4 px-6 border-b border-base-300">
                {apiKey.name}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {apiKey.key}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {apiKey.createdAt}
              </td>
              <td className="py-4 px-6 border-b border-base-300 font-mono">
                {apiKey.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
