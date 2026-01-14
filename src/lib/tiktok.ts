// Logic ported from n8n workflow
// WARNING: Storing client_secret in frontend is not secure for production.
// This is for local personal use only as requested.

const CLIENT_KEY = "sbawwmi043ldszzl4r";
const CLIENT_SECRET = "a6R4akOwP9AriXNB5xcqdkzapIpPw1zX";
const REDIRECT_URI = window.location.origin + "/tiktok-callback";

interface TikTokTokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
}

export interface TikTokUser {
  open_id: string;
  display_name: string;
  avatar_url: string;
}

export const getTikTokUserInfo = async (accessToken: string): Promise<TikTokUser> => {
  const response = await fetch('/api/tiktok/info', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const data = await response.json();
  return data.data.user; // TikTok response structure: { data: { user: { ... } } }
};

export const exchangeCodeForToken = async (code: string, codeVerifier: string): Promise<TikTokTokenResponse> => {
  const url = "https://open.tiktokapis.com/v2/oauth/token/";

  const params = new URLSearchParams();
  params.append("client_key", CLIENT_KEY);
  params.append("client_secret", CLIENT_SECRET);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code_verifier", codeVerifier);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TikTok Auth Failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};

export const refreshTikTokToken = async (refreshToken: string): Promise<TikTokTokenResponse> => {
  const url = "https://open.tiktokapis.com/v2/oauth/token/";
  const params = new URLSearchParams();
  params.append("client_key", CLIENT_KEY);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TikTok Refresh Failed: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const initVideoUpload = async (accessToken: string, videoUrl: string) => {
  // Use our local Proxy to call TikTok API (avoids CORS)
  const url = "/api/tiktok/init";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessToken,
        videoUrl
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Try parsing JSON error
      try {
        const jsonErr = JSON.parse(errorText);
        console.error("TikTok Proxy Error:", jsonErr);
      } catch (e) { }
      throw new Error(`Upload Init Failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error initiating upload:", error);
    throw error;
  }
};
