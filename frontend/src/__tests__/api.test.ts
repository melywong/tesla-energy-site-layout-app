import { describe, it, expect, beforeEach } from 'vitest';
import { decodeConfigFromUrl } from '../utils/api';

describe('URL config encoding/decoding', () => {
  beforeEach(() => {
    // Reset hash before each test
    window.location.hash = '';
  });

  it('returns null when no hash present', () => {
    expect(decodeConfigFromUrl()).toBeNull();
  });

  it('returns null for invalid base64', () => {
    window.location.hash = '#not-valid-base64!!!';
    expect(decodeConfigFromUrl()).toBeNull();
  });

  it('returns null for valid base64 but invalid JSON', () => {
    window.location.hash = '#' + btoa('not json');
    expect(decodeConfigFromUrl()).toBeNull();
  });

  it('decodes valid config from hash', () => {
    const selections = [{ deviceId: 'megapack', quantity: 3 }];
    window.location.hash = '#' + btoa(JSON.stringify(selections));
    const result = decodeConfigFromUrl();
    expect(result).toEqual(selections);
  });

  it('decodes multiple device types', () => {
    const selections = [
      { deviceId: 'megapack-xl', quantity: 2 },
      { deviceId: 'powerpack', quantity: 5 },
    ];
    window.location.hash = '#' + btoa(JSON.stringify(selections));
    const result = decodeConfigFromUrl();
    expect(result).toEqual(selections);
  });
});
