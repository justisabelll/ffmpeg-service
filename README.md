# ffmpeg service

A simple web API that uses FFmpeg to process audio files.

Currently, it only works with audio files.

## Usage

Start the server:

```sh
bun run dev
```

### Example API Request

- body: multipart/form-data
  - file: `audioFile` The audio file to process
  - args: `args` JSON array of allowed FFmpeg arguments

```sh
curl -X POST http://localhost:8080/process \
    -F "audioFile=@/path/to/your/file.mp3" \
    -F "args=[\"-ar\", \"44100\", \"-f\", \"mp3\"]"
```
