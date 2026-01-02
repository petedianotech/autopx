import { TwitterApi } from 'twitter-api-v2';

if (
  !process.env.X_API_KEY ||
  !process.env.X_API_KEY_SECRET ||
  !process.env.X_ACCESS_TOKEN ||
  !process.env.X_ACCESS_TOKEN_SECRET
) {
  console.warn("X API credentials are not fully configured. Posting to X will not work.");
}


const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

export const xClient = client.readWrite;
