import { Hono } from "hono";
import { tmpdir } from "os";
import { mkdtemp, rm } from "fs/promises";
import * as path from "path";
import { validateArgs } from "./utils";

type Variables = {
  audioFile: File;
  args: string[];
  workDir: string;
};

const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// processing endpoint
app.post("/process", async (c) => {
  // get audio file
  const body = await c.req.parseBody();
  const audioFile = body["audioFile"] as File;
  if (!audioFile) return c.json({ error: "Audio file missing" }, 400);

  let args: string[];
  try {
    args = validateArgs(body["args"]);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }

  const workDir = await mkdtemp(path.join(tmpdir(), "ffwork-"));
  const inPath = path.join(workDir, audioFile.name);
  try {
    await Bun.write(inPath, Buffer.from(await audioFile.arrayBuffer()));

    const outExt = args.includes("-f") ? args[args.indexOf("-f") + 1] : "mp3";
    const outPath = path.join(workDir, `out.${outExt}`);

    const ff = Bun.spawn(["ffmpeg", "-y", "-i", inPath, ...args, outPath], {
      stderr: "pipe",
    });

    const code = await ff.exited;
    if (code !== 0)
      return c.json(
        {
          error: `FFmpeg exited with ${code}`,
          details: await ff.stderr.text(),
        },
        500,
      );

    const processedFileStream = Bun.file(outPath).stream();

    const [resStreeam, cleanUpStream] = processedFileStream.tee();

    cleanUpStream
      .getReader()
      .closed.then(() => rm(workDir, { recursive: true, force: true }));

    const res = c.body(resStreeam, 200, {
      "Content-Disposition": `attachment; filename="output.${outExt}"`,
      "Content-Type": `audio/${outExt}`,
    });

    return res;
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
