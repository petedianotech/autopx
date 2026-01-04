'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleGeneratePost, handleGenerateTopicIdeas } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { PostPreviewCard } from '@/components/post-preview-card';
import { createPostSchema } from '@/lib/types';
import { platformOptions, toneOptions } from '@/lib/constants';
import type { GenerateSocialMediaPostOutput } from '@/ai/flows/generate-social-media-post';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestingTopics, setIsSuggestingTopics] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<GenerateSocialMediaPostOutput | null>(null);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      topic: '',
      platform: 'both',
      tone: 'Casual',
    },
  });

  async function onSubmit(values: CreatePostFormValues) {
    setIsLoading(true);
    setGeneratedPosts(null);
    try {
      const result = await handleGeneratePost(values);
      if (result) {
        setGeneratedPosts(result);
        toast({
          title: 'Posts Generated!',
          description: 'Your new social media posts are ready.',
        });
      } else {
        throw new Error('AI did not return a valid response.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSuggestTopics() {
    setIsSuggestingTopics(true);
    setSuggestedTopics([]);
    try {
      const result = await handleGenerateTopicIdeas();
      if (result && result.topics.length > 0) {
        setSuggestedTopics(result.topics);
      } else {
        throw new Error('AI did not return any topic ideas.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not suggest topics',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSuggestingTopics(false);
    }
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Topic or Idea</FormLabel>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={onSuggestTopics}
                            disabled={isSuggestingTopics}
                          >
                            {isSuggestingTopics ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Lightbulb className="mr-2 h-4 w-4" />
                            )}
                            Suggest Topics
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., The future of renewable energy"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {platformOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {toneOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Posts
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 md:col-span-2">
          {isLoading && (
            <>
              <PostPreviewCard.Skeleton platform="facebook" />
              <PostPreviewCard.Skeleton platform="x" />
            </>
          )}
          {generatedPosts?.facebookPost && (
            <PostPreviewCard platform="facebook" content={generatedPosts.facebookPost} />
          )}
          {generatedPosts?.xPost && (
            <PostPreviewCard platform="x" content={generatedPosts.xPost} />
          )}
          {!isLoading && !generatedPosts && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full min-h-[400px] text-center p-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Your posts will appear here</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Fill out the form to generate your first posts with AI.</p>
              </div>
          )}
        </div>
      </div>
      <AlertDialog open={suggestedTopics.length > 0} onOpenChange={() => setSuggestedTopics([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suggested Topics</AlertDialogTitle>
            <AlertDialogDescription>
              Here are a few AI-generated topic ideas. Click one to use it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            {suggestedTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    form.setValue('topic', topic);
                    setSuggestedTopics([]);
                    toast({title: "Topic selected!"});
                  }}
                >
                  <p className="flex-1 text-sm font-medium">{topic}</p>
                </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
