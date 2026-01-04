'use server';
/**
 * @fileOverview Generates social media topic ideas.
 * 
 * - generateTopicIdeas - A function that generates topic ideas.
 * - GenerateTopicIdeasOutput - The return type for the generateTopicIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// No input schema needed for this flow

const GenerateTopicIdeasOutputSchema = z.object({
  topics: z.array(z.string()).describe('3-5 generated topic ideas.'),
});
export type GenerateTopicIdeasOutput = z.infer<typeof GenerateTopicIdeasOutputSchema>;

export async function generateTopicIdeas(): Promise<GenerateTopicIdeasOutput> {
  return generateTopicIdeasFlow();
}

const generateTopicIdeasPrompt = ai.definePrompt({
  name: 'generateTopicIdeasPrompt',
  output: { schema: GenerateTopicIdeasOutputSchema },
  prompt: `You are a Senior AI Educator and Technology Explainer for the brand Peterdamianohq. Your audience values clarity, intelligence, and practical insights about AI.

Your task is to generate 3-5 engaging topic ideas that would perform well on social media. The topics should be suitable for creating short-form videos or posts.

The topics MUST align with the brand's authority zones:
- AI mental models
- Tool selection frameworks
- Automation logic
- Productivity with AI
- Solo-builder systems
- AI misconceptions
- Future of work (non-speculative)
- Practical AI workflows
- Why tools fail
- Why people misuse AI

The topics should be framed as compelling statements or questions that create a cognitive gap.

Example Topic Ideas:
- "The difference between automation and augmentation"
- "Why your AI prompts are probably too long"
- "A simple framework for choosing the right AI tool"
- "How to stop collecting AI tools and start using them"

Generate the topic ideas now.
`,
});

const generateTopicIdeasFlow = ai.defineFlow(
  {
    name: 'generateTopicIdeasFlow',
    outputSchema: GenerateTopicIdeasOutputSchema,
  },
  async () => {
    const { output } = await generateTopicIdeasPrompt();
    return output!;
  }
);
