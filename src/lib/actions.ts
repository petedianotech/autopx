'use server';

import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { createPostSchema } from './types';
import { z } from 'zod';
import { postToX } from '@/ai/flows/post-to-x';
import { postToFacebook } from '@/ai/flows/post-to-facebook';
import { generateUniversalPost } from '@/ai/flows/generate-universal-post';
import { generateAudio } from '@/ai/flows/generate-audio';
import { generatePostTitles } from '@/ai/flows/generate-post-titles';
import { generateTopicIdeas } from '@/ai/flows/generate-topic-ideas';

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
            throw new Error(result.error || 'The API failed to post to Facebook.');
        }
        return result;
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        throw new Error('Failed to post to Facebook.');
    }
}

const universalPostSchema = z.object({
    topic: z.string(),
    includeLongForm: z.boolean(),
});

export async function handleGenerateUniversalPost(values: z.infer<typeof universalPostSchema>) {
    const validatedFields = universalPostSchema.safeParse(values);

    if (!validatedFields.success) {
      throw new Error('Invalid input.');
    }
  
    try {
      const result = await generateUniversalPost(validatedFields.data);
      return result;
    } catch (error) {
      console.error('Error generating universal post:', error);
      throw new Error('Failed to generate universal post with AI.');
    }
}

const audioSchema = z.string();

export async function handleGenerateAudio(script: string) {
    const validatedFields = audioSchema.safeParse(script);

    if (!validatedFields.success) {
        throw new Error('Invalid script for audio generation.');
    }

    try {
        const result = await generateAudio(validatedFields.data);
        return result;
    } catch (error) {
        console.error('Error generating audio:', error);
        throw new Error('Failed to generate audio with AI.');
    }
}

const titleGenSchema = z.object({
    postContent: z.string().min(1),
    platform: z.enum(['facebook', 'x']),
});

export async function handleGenerateTitles(values: z.infer<typeof titleGenSchema>) {
    const validatedFields = titleGenSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid input for title generation.');
    }

    try {
        const result = await generatePostTitles(validatedFields.data);
        return result;
    } catch (error) {
        console.error('Error generating titles:', error);
        throw new Error('Failed to generate titles with AI.');
    }
}

export async function handleGenerateTopicIdeas() {
    try {
        const result = await generateTopicIdeas();
        return result;
    } catch (error) {
        console.error('Error generating topic ideas:', error);
        throw new Error('Failed to generate topic ideas with AI.');
    }
}
