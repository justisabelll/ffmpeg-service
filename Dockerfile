# 1) base layer for all build stages
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# 2) install all deps (dev + prod) once for caching
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 3) optional: copy full source, run tests/build
FROM deps AS build
COPY . .
# if you have tests:
# RUN bun test
# if you have a build step (e.g. bundling, tsc):
# RUN bun run build

# 4) final runtime image
FROM oven/bun:1 AS release

# install ffmpeg + tini
RUN apt-get update && apt-get install -y ffmpeg tini && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# copy only production node_modules
COPY --from=deps /usr/src/app/node_modules ./node_modules

# copy your source (built JS or raw TS if you use Bun’s TS support)
COPY . .

# run as non-root
USER bun

# expose the port your Hono server listens on
EXPOSE 8080

# ensure proper reaping and forwarding of signals
ENTRYPOINT ["tini", "--", "bun", "run", "src/index.ts"]