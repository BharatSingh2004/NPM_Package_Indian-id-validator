# india-id-validator

Small, **zero-dependency** JavaScript functions to check Indian ID numbers and codes:

| Function | Checks | Example |
| --- | --- | --- |
| `isValidPAN` | PAN card number | `ABCPE1234F` |
| `isValidAadhaar` | Aadhaar number (format **and** Verhoeff checksum) | `2341 2341 2346` |
| `isValidIFSC` | Bank IFSC code | `SBIN0001234` |
| `isValidGSTIN` | GST number (format **and** checksum) | `27AAPFU0939F1ZV` |
| `isValidPincode` | 6-digit PIN code | `560001` |
| `isValidMobile` | Indian mobile number | `+91 98765 43210` |

Every function takes one value and returns `true` or `false`. It never throws, even for `null`, numbers or objects.

## Install

```bash
npm install india-id-validator
```

## Usage

```js
const {
  isValidPAN,
  isValidAadhaar,
  isValidIFSC,
  isValidGSTIN,
  isValidPincode,
  isValidMobile,
} = require('india-id-validator');

isValidPAN('ABCPE1234F');          // true
isValidPAN('ABCDE1234F');          // false (4th letter must be a holder type like P, C, H, F…)

isValidAadhaar('234123412346');    // true
isValidAadhaar('2341 2341 2346');  // true (spaces and dashes are fine)
isValidAadhaar('234123412347');    // false (checksum is wrong)

isValidIFSC('SBIN0001234');        // true
isValidIFSC('SBIN1001234');        // false (5th character must be 0)

isValidGSTIN('27AAPFU0939F1ZV');   // true
isValidGSTIN('27AAPFU0939F1ZW');   // false (checksum is wrong)

isValidPincode('560001');          // true
isValidPincode(110001);            // true (numbers work too)
isValidPincode('060001');          // false

isValidMobile('9876543210');       // true
isValidMobile('+91 98765 43210');  // true
isValidMobile('5876543210');       // false (must start with 6, 7, 8 or 9)
```

TypeScript users get types automatically (`index.d.ts` is included).

## Rules used

- **PAN**: 5 letters + 4 digits + 1 letter. The 4th letter must be a valid holder type (`A B C F G H J L P T`). Lowercase input is accepted.
- **Aadhaar**: 12 digits, first digit 2 to 9, and the last digit must match the [Verhoeff checksum](https://en.wikipedia.org/wiki/Verhoeff_algorithm). Spaces and dashes are ignored.
- **IFSC**: 4 letters (bank) + `0` + 6 letters or digits (branch).
- **GSTIN**: 2-digit state code (01 to 38, 97 or 99) + PAN + entity character + `Z` + checksum character. The checksum is computed with the official base-36 algorithm.
- **PIN code**: 6 digits, not starting with 0.
- **Mobile**: 10 digits starting with 6 to 9, with an optional `+91`, `91` or `0` in front. Spaces and dashes are ignored.

> These functions check that a value is **well formed**. They do not check that a PAN, Aadhaar or GSTIN is actually issued to someone. That needs an official government API.

## Run the tests

```bash
npm test
```

Tests use Node's built-in test runner, so there is nothing extra to install (Node 18 or newer).

## License

MIT
