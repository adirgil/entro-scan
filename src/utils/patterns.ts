// src/utils/patterns.ts

/**
 * Regex patterns for detecting exposed secrets, focusing on AWS credentials.
 *
 * We'll detect both AWS Access Keys and AWS Secret Keys.
 * - Access Key ID starts with "AKIA" or "ASIA" followed by 16 uppercase letters or digits.
 * - Secret Key is 40 chars long, usually alphanumeric plus /+=.
 */

export const awsaccesskeypattern = /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g;
export const awssecretkeypattern =
  /\b(?:aws|AWS)?[_-]?(secret|SECRET)?[_-]?(access|ACCESS)?[_-]?(key|KEY)?['"\s:=]+([A-Za-z0-9/+=]{40})\b/g;
