import CryptoJS from 'crypto-js';

const hasBuffer = typeof Buffer !== 'undefined';

/**
 * Generates SHA-256 hash for provided text.
 * @param {string} content
 * @returns {string}
 */
export const hashContent = (content = '') => CryptoJS.SHA256(content).toString();

/**
 * Encodes arbitrary UTF-8 text to base64 string.
 * Works in both browser and Node environments.
 * @param {string} text
 * @returns {string}
 */
export const encodeBase64 = (text = '') => {
  if (!text) return '';
  if (hasBuffer && typeof window === 'undefined') {
    return Buffer.from(text, 'utf-8').toString('base64');
  }
  return btoa(unescape(encodeURIComponent(text)));
};

/**
 * Decodes base64 string back into UTF-8 text.
 * @param {string} encoded
 * @returns {string}
 */
export const decodeBase64 = (encoded = '') => {
  if (!encoded) return '';
  if (hasBuffer && typeof window === 'undefined') {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
  return decodeURIComponent(escape(atob(encoded)));
};

/**
 * Verifies that provided content matches expected hash.
 * @param {string} content
 * @param {string} expectedHash
 * @returns {boolean}
 */
export const verifyHash = (content, expectedHash) => hashContent(content) === expectedHash;
