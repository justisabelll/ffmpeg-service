import { Hono } from 'hono';
import Layout from '../layout';
import { Login, AdminDashboard, JobsTable } from './components';

const admin = new Hono();

admin.get('/', (c) => {
  return c.html(
    <Layout>
      <Login />
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

export default admin;
