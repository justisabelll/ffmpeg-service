import { Hono } from 'hono';
import 'typed-htmx';
import admin from './views/admin';
import { processing } from './endpoints/processing';

type Variables = {
  audioFile: File;
  args: string[];
  workDir: string;
};

const app = new Hono<{ Variables: Variables }>();

app.route('/', admin);
app.route('/processing', processing);

export default {
  port: 8080,
  fetch: app.fetch,
};

declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
