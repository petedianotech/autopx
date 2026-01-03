'use server';

/**
 * @fileOverview A Genkit flow for posting a message to a Facebook Page.
 * 
 * - postToFacebook - A function that posts a message.
 * - PostToFacebookInput - The input type for the postToFacebook function.
 * - PostToFacebookOutput - The return type for the postToFacebook function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PostToFacebookInputSchema = z.object({
  text: z.string().describe('The text content of the post.'),
});
export type PostToFacebookInput = z.infer<typeof PostToFacebookInputSchema>;

const PostToFacebookOutputSchema = z.object({
  success: z.boolean().describe('Whether the post was successful.'),
  postId: z.string().optional().describe('The ID of the created post.'),
});
export type PostToFacebookOutput = z.infer<typeof PostToFacebookOutputSchema>;


export async function postToFacebook(input: PostToFacebookInput): Promise<PostToFacebookOutput> {
    return postToFacebookFlow(input);
}

const postToFacebookFlow = ai.defineFlow(
  {
    name: 'postToFacebookFlow',
    inputSchema: PostToFacebookInputSchema,
    outputSchema: PostToFacebookOutputSchema,
  },
  async (input) => {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
        console.error('Facebook credentials are not configured.');
        return { success: false };
    }

    const url = `https://graph.facebook.com/v20.0/${pageId}/feed`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: input.text,
                access_token: accessToken,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Failed to post to Facebook:', result.error.message);
            return { success: false };
        }
      
      console.log('Facebook post successful:', result.id);
      return {
        success: true,
        postId: result.id,
      };
    } catch (e) {
        console.error('Failed to post to Facebook', e);
        return {
            success: false,
        }
    }
  }
);
