const ENCRYPTION_KEY = "weather_app_2024";

export function decrypt(encryptedText: string): string {
  try {
    const decoded = atob(encryptedText);
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode =
        decoded.charCodeAt(i) ^
        ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return "";
  }
}

export const ENCRYPTED_API_KEY = "QgEEQF9TRWdXSBVrBglTAE5cUkVcV0tsWEJFbgMACg==";

export function getApiKey(): string {
  return decrypt(ENCRYPTED_API_KEY);
}
