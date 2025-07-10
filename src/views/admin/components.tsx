import { jobsQuery, getAPIKey } from './shared';
import { randomBytes } from 'node:crypto';

export const Login = ({ error }: { error?: string } = {}) => {
  return (
    <>
      <div
        id="login"
        className="flex items-center justify-center min-h-screen bg-base-100"
      >
        <div className="w-full max-w-md px-4">
          <div className="glass rounded-lg p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-light tracking-wide text-base-content mb-3">
                FFMPEG Service
              </h1>
              <p className="text-base text-neutral-content">
                Admin Access Portal
              </p>
            </div>
            <form
              className="space-y-6"
              hx-post="/admin/login"
              hx-target="#login"
              hx-swap="innerHTML"
            >
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm uppercase tracking-wider text-neutral-content"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="input input-bordered input-lg w-full bg-base-200 border-neutral focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm uppercase tracking-wider text-neutral-content"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input input-bordered input-lg w-full bg-base-200 border-neutral focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Authenticate
              </button>
              {error && (
                <div className="text-error text-base text-center animate-pulse">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export const AdminDashboard = ({ username }: { username: string }) => {
  return (
    <>
      <div className="min-h-screen bg-base-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light tracking-wide text-base-content mb-3">
              FFMPEG Service
            </h1>
            <p className="text-base text-neutral-content">
              System Administrator:{' '}
              <span className="text-primary font-medium">{username}</span>
            </p>
          </header>

          <div className="space-y-12">
            {/* Jobs Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light tracking-wide">
                  Processing Jobs
                </h2>
                <div className="text-sm text-neutral-content">
                  Auto-refreshes every 30 seconds
                </div>
              </div>
              <div className="glass rounded-lg overflow-hidden">
                <div
                  hx-get="/admin/jobs"
                  hx-trigger="load, every 15s"
                  hx-swap="innerHTML"
                >
                  <JobsTable />
                </div>
              </div>
            </section>

            {/* API Keys Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light tracking-wide">API Keys</h2>
                <button
                  className="btn btn-primary"
                  hx-get="/admin/new-api-key"
                  hx-target="#modals-here"
                  hx-swap="innerHTML"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generate New Key
                </button>
              </div>
              <div className="glass rounded-lg overflow-hidden">
                <APIKeysTable />
              </div>
            </section>
          </div>
        </div>
      </div>
      <div id="modals-here" />
    </>
  );
};

export const JobsTable = async () => {
  const jobResponse = await jobsQuery();

  if (jobResponse.jobs.length === 0) {
    return (
      <div className="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-base">No jobs in the processing queue</p>
        <p className="text-sm mt-2">
          Jobs will appear here when submitted via the API
        </p>
      </div>
    );
  }

  const displayLimit = 100; // Show max 100 jobs in the scrollable area
  const displayJobs = jobResponse.jobs.slice(0, displayLimit);
  const hasMore = jobResponse.jobs.length > displayLimit;

  return (
    <div id="jobs-table-content">
      <div className="table-container fade-edges">
        <table className="minimal-table w-full">
          <thead>
            <tr className="text-sm uppercase tracking-wider text-neutral-content">
              <th className="px-6 py-5 text-left font-normal">Job ID</th>
              <th className="px-6 py-5 text-left font-normal">API Key</th>
              <th className="px-6 py-5 text-left font-normal">Status</th>
              <th className="px-6 py-5 text-left font-normal">Created</th>
              <th className="px-6 py-5 text-left font-normal">Completed</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {displayJobs.map((job) => (
              <tr
                key={job.id}
                className="border-t border-neutral/20 hover:bg-base-200/50 transition-colors"
              >
                <td className="px-6 py-5 font-mono text-sm">{job.id}</td>
                <td className="px-6 py-5 font-mono text-sm text-neutral-content">
                  {job.apiKeyId}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded ${
                      job.status === 'pending'
                        ? 'bg-warning/20 text-warning'
                        : job.status === 'running'
                        ? 'bg-info/20 text-info'
                        : 'bg-success/20 text-success'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-neutral-content">
                  {job.createdAt.toLocaleString()}
                </td>
                <td className="px-6 py-5 font-mono text-sm text-neutral-content">
                  {job.processedDoneAt
                    ? job.processedDoneAt.toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-neutral/20 flex items-center justify-between">
        <div className="text-sm text-neutral-content">
          {hasMore && (
            <span>
              Showing {displayLimit} of {jobResponse.jobs.length} jobs
            </span>
          )}
          {!hasMore && (
            <span>
              Total: {jobResponse.jobs.length} job
              {jobResponse.jobs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span className="text-sm text-neutral-content">
          Last updated: {jobResponse.lastPolledAt.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export const APIKeysTable = async () => {
  const apiKeys = await getAPIKey();

  if (apiKeys.length === 0) {
    return (
      <div id="api-keys-table">
        <div className="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          <p className="text-base">No API keys configured</p>
          <p className="text-sm mt-2">
            Create your first API key to start using the service
          </p>
        </div>
      </div>
    );
  }

  const sortedKeys = apiKeys.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const displayLimit = 50; // Show max 50 keys in the scrollable area
  const displayKeys = sortedKeys.slice(0, displayLimit);
  const hasMore = sortedKeys.length > displayLimit;

  return (
    <div id="api-keys-table">
      <div className="table-container fade-edges">
        <table className="minimal-table w-full">
          <thead>
            <tr className="text-sm uppercase tracking-wider text-neutral-content">
              <th className="px-6 py-5 text-left font-normal">Key ID</th>
              <th className="px-6 py-5 text-left font-normal">Name</th>
              <th className="px-6 py-5 text-left font-normal">Key</th>
              <th className="px-6 py-5 text-left font-normal">Created</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {displayKeys.map((apiKey) => (
              <tr
                key={apiKey.id}
                className="border-t border-neutral/20 hover:bg-base-200/50 transition-colors"
              >
                <td className="px-6 py-5 font-mono text-sm">{apiKey.id}</td>
                <td className="px-6 py-5 font-medium">{apiKey.nickname}</td>
                <td className="px-6 py-5 font-mono text-sm">
                  <code className="text-neutral-content bg-base-200 px-2 py-1 rounded">
                    {apiKey.key.slice(0, 8)}
                    {'•'.repeat(32)}
                    {apiKey.key.slice(-8)}
                  </code>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-neutral-content">
                  {apiKey.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="px-6 py-4 border-t border-neutral/20 text-sm text-neutral-content">
          Showing {displayLimit} of {sortedKeys.length} API keys
        </div>
      )}
    </div>
  );
};

export const NewAPIKeyModal = () => {
  const newApiKey = randomBytes(32).toString('hex');

  return (
    <div className="modal modal-open">
      <div className="modal-box glass max-w-2xl">
        <h3 className="text-2xl font-light tracking-wide mb-8">
          Generate API Key
        </h3>
        <form
          hx-post="/admin/add-api-key"
          hx-target="#modals-here"
          hx-swap="innerHTML"
        >
          <input type="hidden" name="api-key" value={newApiKey} />

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-5 mb-8">
            <p className="text-base text-warning flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              This key will only be displayed once. Store it securely.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm uppercase tracking-wider text-neutral-content mb-3 block">
                Generated Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="api-key"
                  className="input input-bordered input-lg flex-1 bg-base-200 font-mono text-sm"
                  value={newApiKey}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-square btn-lg btn-ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(newApiKey);
                  }}
                  title="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="text-sm uppercase tracking-wider text-neutral-content mb-3 block"
              >
                Key Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                className="input input-bordered input-lg w-full bg-base-200"
                placeholder="e.g., Production Server"
                required
              />
            </div>
          </div>

          <div className="modal-action mt-10">
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              hx-get="/admin/close-modal"
              hx-target="#modals-here"
              hx-swap="innerHTML"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              Create Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
