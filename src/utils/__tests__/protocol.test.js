import { describe, expect, it } from 'vitest';
import { assembleQRFrames, createQRFrames } from '../protocol.js';

const collectFrames = (frames) => {
  const map = new Map();
  frames.forEach((payload) => {
    const frame = JSON.parse(payload);
    map.set(frame.i, payload);
  });
  return map;
};

describe('QR protocol', () => {
  it('chunks and reconstructs text', () => {
    const content = 'WriterDesk loves air-gapped workflows.';
    const { frames } = createQRFrames(content);
    const result = assembleQRFrames(collectFrames(frames));
    expect(result.text).toBe(content);
  });

  it('throws on corrupted data', () => {
    const content = 'hash mismatch should fail';
    const { frames } = createQRFrames(content);
    const map = collectFrames(frames);
    const first = JSON.parse(frames[0]);
    first.d = Buffer.from('tampered data', 'utf-8').toString('base64');
    map.set(0, JSON.stringify(first));
    expect(() => assembleQRFrames(map)).toThrow(/HASH_MISMATCH/);
  });
});
