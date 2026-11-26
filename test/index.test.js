'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const v = require('../index.js');

test('isValidPAN', () => {
  assert.equal(v.isValidPAN('ABCPE1234F'), true);
  assert.equal(v.isValidPAN('abcpe1234f'), true); // lowercase is accepted
  assert.equal(v.isValidPAN('  AAACB1234C '), true); // spaces around are trimmed
  assert.equal(v.isValidPAN('ABCDE1234F'), false); // 4th letter D is not a valid holder type
  assert.equal(v.isValidPAN('ABCP1234F'), false); // too short
  assert.equal(v.isValidPAN('12345ABCDE'), false);
  assert.equal(v.isValidPAN(''), false);
  assert.equal(v.isValidPAN(null), false);
  assert.equal(v.isValidPAN(12345), false);
});

test('isValidAadhaar', () => {
  assert.equal(v.isValidAadhaar('234123412346'), true);
  assert.equal(v.isValidAadhaar('2341 2341 2346'), true); // spaces allowed
  assert.equal(v.isValidAadhaar('2341-2341-2346'), true); // dashes allowed
  assert.equal(v.isValidAadhaar('499118521232'), true);
  assert.equal(v.isValidAadhaar('234123412347'), false); // wrong checksum
  assert.equal(v.isValidAadhaar('134123412346'), false); // cannot start with 1
  assert.equal(v.isValidAadhaar('034123412346'), false); // cannot start with 0
  assert.equal(v.isValidAadhaar('23412341234'), false); // 11 digits
  assert.equal(v.isValidAadhaar('23412341234A'), false);
  assert.equal(v.isValidAadhaar(undefined), false);
});

test('isValidIFSC', () => {
  assert.equal(v.isValidIFSC('SBIN0001234'), true);
  assert.equal(v.isValidIFSC('HDFC0ABC123'), true);
  assert.equal(v.isValidIFSC('icic0000001'), true); // lowercase is accepted
  assert.equal(v.isValidIFSC('SBIN1001234'), false); // 5th char must be 0
  assert.equal(v.isValidIFSC('SBI00001234'), false); // bank code must be 4 letters
  assert.equal(v.isValidIFSC('SBIN000123'), false); // too short
  assert.equal(v.isValidIFSC({}), false);
});

test('isValidGSTIN', () => {
  assert.equal(v.isValidGSTIN('27AAPFU0939F1ZV'), true);
  assert.equal(v.isValidGSTIN('27aapfu0939f1zv'), true); // lowercase is accepted
  assert.equal(v.isValidGSTIN('27AAPFU0939F1ZW'), false); // wrong checksum
  assert.equal(v.isValidGSTIN('27AAPFU0939F1AV'), false); // 14th char must be Z
  assert.equal(v.isValidGSTIN('00AAPFU0939F1ZV'), false); // state code 00 does not exist
  assert.equal(v.isValidGSTIN('27AAPFU0939F1Z'), false); // too short
  assert.equal(v.isValidGSTIN(null), false);
});

test('isValidPincode', () => {
  assert.equal(v.isValidPincode('560001'), true);
  assert.equal(v.isValidPincode(110001), true); // numbers are accepted
  assert.equal(v.isValidPincode('560 001'), true);
  assert.equal(v.isValidPincode('060001'), false); // cannot start with 0
  assert.equal(v.isValidPincode('56001'), false);
  assert.equal(v.isValidPincode('5600011'), false);
  assert.equal(v.isValidPincode('56000A'), false);
});

test('isValidMobile', () => {
  assert.equal(v.isValidMobile('9876543210'), true);
  assert.equal(v.isValidMobile('+919876543210'), true);
  assert.equal(v.isValidMobile('+91 98765 43210'), true);
  assert.equal(v.isValidMobile('09876543210'), true);
  assert.equal(v.isValidMobile('919876543210'), true);
  assert.equal(v.isValidMobile(6123456789), true); // numbers are accepted
  assert.equal(v.isValidMobile('5876543210'), false); // must start with 6-9
  assert.equal(v.isValidMobile('987654321'), false); // 9 digits
  assert.equal(v.isValidMobile('+19876543210'), false); // not an Indian prefix
  assert.equal(v.isValidMobile(''), false);
});
