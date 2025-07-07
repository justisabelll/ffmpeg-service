export const allowedFFmpegArgs = new Set([
  '-ar', // set audio sampling rate
  '-ac', // set number of audio channels
  '-b:a', // set audio bitrate
  '-af', // set audio filters
  '-ss', // start time offset
  '-t', // duration of audio to process
  '-f', // set output format
  '-y', // overwrite output file without asking
]);

export function validateArgs(raw: unknown): string[] {
  if (!raw) throw new Error('Arguments missing');

  let parsed: unknown;
  try {
    parsed = JSON.parse(Array.isArray(raw) ? raw[0] : (raw as string));
  } catch {
    throw new Error('Args must be valid JSON array');
  }

  if (!Array.isArray(parsed) || !parsed.every((s) => typeof s === 'string')) {
    throw new Error('Args must be string array');
  }

  for (const token of parsed) {
    // Only tokens that begin with `-` need to be in the allow-list
    if (token.startsWith('-') && !allowedFFmpegArgs.has(token)) {
      throw new Error(`Invalid FFmpeg flag: ${token}`);
    }

    // Optional extra safety for value tokens
    if (
      !token.startsWith('-') &&
      /[\s;&|$()`]/.test(token) // crude shell-meta check
    ) {
      throw new Error(`Suspicious value: ${token}`);
    }
  }

  return parsed as string[];
}
