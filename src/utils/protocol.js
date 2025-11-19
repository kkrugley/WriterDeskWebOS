import { decodeBase64, encodeBase64, hashContent, verifyHash } from './crypto.js';

export const PROTOCOL_CONSTANTS = Object.freeze({
  CHUNK_SIZE: 250,
  FRAME_INTERVAL_MS: 400
});

const REQUIRED_FIELDS = ['d', 'i', 't', 'H'];

/**
 * Creates strongly typed frame object.
 * @param {string} chunk
 * @param {number} index
 * @param {number} total
 * @param {string} hash
 * @returns {{d:string,i:number,t:number,H:string,c:string}}
 */
const createFrame = (chunk, index, total, hash) => ({
  d: chunk,
  i: index,
  t: total,
  H: hash,
  c: hashContent(chunk).slice(0, 16)
});

/**
 * Breaks base64 data into consistent chunks.
 * @param {string} base64
 * @returns {string[]}
 */
const chunkify = (base64) => {
  const chunks = [];
  for (let i = 0; i < base64.length; i += PROTOCOL_CONSTANTS.CHUNK_SIZE) {
    chunks.push(base64.slice(i, i + PROTOCOL_CONSTANTS.CHUNK_SIZE));
  }
  return chunks.length ? chunks : [''];
};

/**
 * Serialises UTF-8 content into QR-ready JSON payloads.
 * @param {string} content
 * @returns {{frames:string[], hash:string, total:number}}
 */
export const createQRFrames = (content = '') => {
  const base64 = encodeBase64(content);
  const fileHash = hashContent(content);
  const chunks = chunkify(base64);
  const frames = chunks.map((chunk, index) => JSON.stringify(createFrame(chunk, index, chunks.length, fileHash)));
  return { frames, hash: fileHash, total: frames.length };
};

/**
 * Parses string payload and validates mandatory fields.
 * @param {string} payload
 * @returns {{d:string,i:number,t:number,H:string,c?:string}}
 */
export const parseFramePayload = (payload) => {
  const data = JSON.parse(payload);
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`PROTOCOL_INVALID_FRAME: missing ${field}`);
    }
  }
  return data;
};

/**
 * Assembles provided frames back into text while validating SHA-256 hash.
 * @param {Map<number,string>} framesMap
 * @returns {{text:string, hash:string}}
 */
export const assembleQRFrames = (framesMap) => {
  if (!framesMap || framesMap.size === 0) {
    throw new Error('PROTOCOL_EMPTY_STREAM');
  }

  const firstFrame = parseFramePayload(framesMap.values().next().value);
  const { t: total, H: hash } = firstFrame;

  if (framesMap.size !== total) {
    throw new Error(`PROTOCOL_INCOMPLETE: ${framesMap.size}/${total}`);
  }

  let base64 = '';
  for (let index = 0; index < total; index += 1) {
    const payload = framesMap.get(index);
    if (!payload) {
      throw new Error(`PROTOCOL_MISSING_FRAME: ${index}`);
    }
    const frame = parseFramePayload(payload);
    if (frame.i !== index || frame.t !== total) {
      throw new Error('PROTOCOL_INDEX_MISMATCH');
    }
    base64 += frame.d;
  }

  const text = decodeBase64(base64);
  if (!verifyHash(text, hash)) {
    throw new Error('PROTOCOL_HASH_MISMATCH');
  }
  return { text, hash };
};
