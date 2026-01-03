'use server';

import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { createPostSchema } from './types';
import { z } from 'zod';
import { postToX } from '@/ai/flows/post-to-x';
import { postToFacebook } from '@/ai/flows/post-to-facebook';

export async function handleGeneratePost(values: z.infer<typeof createPostSchema>) {
  const validatedFields = createPostSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid input.');
  }

  try {
    const result = await generateSocialMediaPost(validatedFields.data);
    return result;
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post with AI.');
  }
}


export async function handlePostToX(content: string) {
    if (!content) {
        throw new Error('Content is required.');
    }

    try {
        const result = await postToX({ text: content });
        if (!result.success) {
            throw new Error('The API failed to post to X.');
        }
        return result;
    } catch (error) {
        console.error('Error posting to X:', error);
        throw new Error('Failed to post to X.');
    }
}


export async function handlePostToFacebook(content: string) {
    if (!content) {
        throw new Error('Content is required.');
    }

    try {
        const result = await postToFacebook({ text: content });
        if (!result.success) {
            throw new Error('The API failed to post to Facebook.');
        }
        return result;
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        throw new Error('Failed to post to Facebook.');
    }
}
