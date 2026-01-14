// Generate a high-entropy random string (43-128 chars)
// Using unreserved characters: [A-Z], [a-z], [0-9], "-", ".", "_", "~"
export async function generateCodeVerifier() {
    const length = 64;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// SHA-256 hash of the verifier, Base64URL encoded
export async function generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);

    return base64UrlEncode(hash);
}

function base64UrlEncode(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
