/** Checks a PAN card number, e.g. "ABCPE1234F". */
export function isValidPAN(pan: unknown): boolean;
/** Checks a 12-digit Aadhaar number, including its Verhoeff checksum. Spaces/dashes allowed. */
export function isValidAadhaar(aadhaar: unknown): boolean;
/** Checks a bank IFSC code, e.g. "SBIN0001234". */
export function isValidIFSC(ifsc: unknown): boolean;
/** Checks a 15-character GSTIN, including its checksum, e.g. "27AAPFU0939F1ZV". */
export function isValidGSTIN(gstin: unknown): boolean;
/** Checks a 6-digit Indian PIN code, e.g. "560001". */
export function isValidPincode(pin: unknown): boolean;
/** Checks an Indian mobile number, e.g. "9876543210" or "+91 98765 43210". */
export function isValidMobile(mobile: unknown): boolean;
