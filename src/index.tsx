import { Hono } from 'hono';
import 'typed-htmx';
import admin from './views/admin';
import { processing } from './endpoints/processing';

const app = new Hono();

app.route('/admin', admin);
app.route('/processing', processing);

app.get('/', (c) => {
  return c.text('Hello from FFMPEG Service!');
});

export default {
  port: 3000,
  fetch: app.fetch,
};

declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
