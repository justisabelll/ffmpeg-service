import { Hono } from 'hono';
import Layout from '../layout';
import {
  Login,
  AdminDashboard,
  JobsTable,
  NewAPIKeyModal,
  APIKeysTable,
} from './components';
import { addNewAPIKey } from './shared';

const admin = new Hono();

admin.get('/', (c) => {
  return c.html(
    <Layout>
      <AdminDashboard username="admin" />
    </Layout>
  );
});

admin.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const username = body['username'];
  const password = body['password'];

  if (username === 'admin' && password === 'admin') {
    return c.html(<AdminDashboard username={username as string} />);
  } else {
    return c.html(<Login error="Invalid username or password." />);
  }
});

admin.get('/jobs', (c) => {
  return c.html(<JobsTable />);
});

admin.get('/new-api-key', async (c) => {
  return c.html(<NewAPIKeyModal />);
});

admin.get('/close-modal', (c) => {
  return c.html(<></>);
});

admin.post('/add-api-key', async (c) => {
  const body = await c.req.parseBody();
  const apiKey = body['api-key'];
  const nickname = body['nickname'];

  await addNewAPIKey(apiKey as string, nickname as string);

  const newTable = await APIKeysTable();

  // OOB swap
  // Since the form submission targets the modal, we need to return the new table with hx-swap-oob
  return c.html(
    <>
      <div id="api-keys-table" hx-swap-oob="true">
        {newTable}
      </div>
    </>
  );
});

export default admin;
