'use strict';

/**
 * india-id-validator
 * Zero-dependency validators for common Indian ID numbers and codes.
 */

// Turn any input into a clean string (or null if it is not a string).
function clean(value, { upper = false, stripSpaces = false } = {}) {
  if (typeof value !== 'string') return null;
  let s = value.trim();
  if (stripSpaces) s = s.replace(/[\s-]/g, '');
  if (upper) s = s.toUpperCase();
  return s;
}

/* ------------------------------------------------------------------ */
/* PAN (Permanent Account Number)                                      */
/* Format: 5 letters, 4 digits, 1 letter. e.g. ABCPE1234F             */
/* The 4th letter tells the holder type (P = person, C = company, …).  */
/* ------------------------------------------------------------------ */
const PAN_REGEX = /^[A-Z]{3}[ABCFGHJLPT][A-Z][0-9]{4}[A-Z]$/;

function isValidPAN(pan) {
  const s = clean(pan, { upper: true });
  return s !== null && PAN_REGEX.test(s);
}

/* ------------------------------------------------------------------ */
/* Aadhaar                                                             */
/* 12 digits, cannot start with 0 or 1, last digit is a Verhoeff       */
/* checksum. Spaces or dashes ("2341 2341 2346") are allowed.          */
/* ------------------------------------------------------------------ */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/** Returns true if the digit string passes the Verhoeff checksum. */
function verhoeffCheck(digits) {
  let c = 0;
  const reversed = digits.split('').reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][Number(reversed[i])]];
  }
  return c === 0;
}

function isValidAadhaar(aadhaar) {
  const s = clean(aadhaar, { stripSpaces: true });
  if (s === null || !/^[2-9][0-9]{11}$/.test(s)) return false;
  return verhoeffCheck(s);
}

/* ------------------------------------------------------------------ */
/* IFSC (bank branch code)                                             */
/* 4 letters (bank), the digit 0, then 6 letters/digits (branch).      */
/* e.g. SBIN0001234                                                    */
/* ------------------------------------------------------------------ */
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function isValidIFSC(ifsc) {
  const s = clean(ifsc, { upper: true });
  return s !== null && IFSC_REGEX.test(s);
}

/* ------------------------------------------------------------------ */
/* GSTIN (GST number)                                                  */
/* 2-digit state code + PAN + entity number + 'Z' + checksum char.     */
/* e.g. 27AAPFU0939F1ZV                                                */
/* ------------------------------------------------------------------ */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const GST_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GST_STATE_CODES = new Set([
  ...Array.from({ length: 38 }, (_, i) => String(i + 1).padStart(2, '0')), // 01-38
  '97', // Other Territory
  '99', // Centre Jurisdiction
]);

/** Computes the 15th (checksum) character of a GSTIN from its first 14. */
function gstinCheckChar(first14) {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const value = GST_CHARS.indexOf(first14[i]);
    const factor = i % 2 === 0 ? 1 : 2;
    const product = value * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  return GST_CHARS[(36 - (sum % 36)) % 36];
}

function isValidGSTIN(gstin) {
  const s = clean(gstin, { upper: true });
  if (s === null || !GSTIN_REGEX.test(s)) return false;
  if (!GST_STATE_CODES.has(s.slice(0, 2))) return false;
  return gstinCheckChar(s.slice(0, 14)) === s[14];
}

/* ------------------------------------------------------------------ */
/* PIN code (postal code)                                              */
/* 6 digits, first digit 1-9. e.g. 560001                              */
/* ------------------------------------------------------------------ */
function isValidPincode(pin) {
  if (typeof pin === 'number') pin = String(pin);
  const s = clean(pin, { stripSpaces: true });
  return s !== null && /^[1-9][0-9]{5}$/.test(s);
}

/* ------------------------------------------------------------------ */
/* Indian mobile number                                                */
/* 10 digits starting with 6, 7, 8 or 9. An optional +91, 91 or 0     */
/* prefix, spaces and dashes are allowed. e.g. +91 98765 43210         */
/* ------------------------------------------------------------------ */
function isValidMobile(mobile) {
  if (typeof mobile === 'number') mobile = String(mobile);
  const s = clean(mobile, { stripSpaces: true });
  return s !== null && /^(?:\+91|91|0)?[6-9][0-9]{9}$/.test(s);
}

module.exports = {
  isValidPAN,
  isValidAadhaar,
  isValidIFSC,
  isValidGSTIN,
  isValidPincode,
  isValidMobile,
};
