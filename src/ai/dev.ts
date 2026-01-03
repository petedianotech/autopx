import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/adjust-post-tone.ts';
import '@/ai/flows/generate-social-media-post.ts';
import '@/ai/flows/optimize-for-platform.ts';
import '@/ai/flows/post-to-x.ts';
import '@/ai/flows/post-to-facebook.ts';
