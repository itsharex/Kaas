import { useQueryClient } from '@tanstack/react-query';
import { SendHorizonal } from 'lucide-react';
import { useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  LIST_CONVERSATIONS_KEY,
  useCreateConversationMutation,
} from '@/lib/hooks';
import { conversationFormSchema } from '@/lib/schemas';
import { useAppStateStore } from '@/lib/store';
import type { UnsavedConversation } from '@/lib/types';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function NewConversationForm() {
  const { models } = useAppStateStore();
  const form = useForm<UnsavedConversation>();
  const inputRef = useRef<HTMLInputElement>(null);
  const createConversationMutation = useCreateConversationMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation(['page-conversations']);

  // Callbacks
  const onSubmit: SubmitHandler<UnsavedConversation> = (formData) => {
    const validation = conversationFormSchema.safeParse(formData);
    if (validation.success) {
      createConversationMutation.mutate(validation.data, {
        onSuccess: async (conversation) => {
          navigate(`/conversations/${conversation.id}`);
          return queryClient.invalidateQueries({
            queryKey: LIST_CONVERSATIONS_KEY,
          });
        },
      });
    } else {
      inputRef.current?.focus();
      toast.warning(
        "Input can't be empty. Type something to start a new conversation."
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-semibold tracking-tight">
        {t('page-conversations:labels.start-new')}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6 box-border flex h-[72px] w-[720px] items-center rounded-2xl border border-input bg-transparent hover:border-input-hover">
            <FormField
              control={form.control}
              name="message"
              defaultValue=""
              render={({ field }) => (
                <FormItem className="ml-4 grow">
                  <FormControl>
                    <Input
                      placeholder="Ask anything..."
                      {...field}
                      className="border-0 px-0"
                      ref={inputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelId"
              defaultValue={models[0].id}
              render={({ field }) => (
                <FormItem className="ml-4 w-40">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem value={model.id.toString()} key={model.id}>
                          {model.provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mx-4">
              <SendHorizonal className="size-4" />
            </Button>
          </div>
          <div className="col-span-3 col-start-2">
            <FormMessage />
          </div>
        </form>
      </Form>
    </div>
  );
}
