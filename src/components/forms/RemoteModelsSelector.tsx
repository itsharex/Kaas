import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LIST_REMOTE_MODELS_KEY, useListRemoteModelsQuery } from '@/lib/hooks';

import { Button } from '../ui/button';
import { FormControl, FormField, FormItem } from '../ui/form';
import { LoadingIcon } from '../ui/icons/LoadingIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Props = {
  provider: string;
  apiKey: string;
  enabledByDefault: boolean;
};

export function RemoteModelsSelector({
  provider,
  apiKey,
  enabledByDefault,
}: Props) {
  const { t } = useTranslation(['error']);
  const form = useFormContext();
  const [enabled, setEnabled] = useState(enabledByDefault);
  const { data, isLoading, error } = useListRemoteModelsQuery({
    provider,
    apiKey,
    enabled,
    select: (raw) => raw.sort((a, b) => b.created - a.created),
  });
  const queryClient = useQueryClient();

  if (error) {
    form.setError('model', { type: 'custom', message: error.message });
  }

  const onClick = useCallback(() => {
    if (form.getValues('apiKey').length === 0) {
      form.setError('apiKey', {
        type: 'custom',
        message: t('error:validation:empty-api-key'),
      });
    } else {
      setEnabled(true);
    }
  }, [form, t]);

  const render = () => {
    if (isLoading) {
      return (
        <div className="flex h-9">
          <LoadingIcon className="my-auto h-6 self-start" />
        </div>
      );
    }
    if (data) {
      return (
        <FormField
          control={form.control}
          name="model"
          defaultValue={data[0].id}
          render={({ field }) => {
            return (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.map((m) => (
                      <SelectItem value={m.id} key={m.id}>
                        {m.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }}
        />
      );
    }
    return (
      <Button variant="secondary" type="button" onClick={onClick}>
        {t('generic:action:load-models')}
      </Button>
    );
  };

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: LIST_REMOTE_MODELS_KEY,
      exact: true,
    });
  }, [provider, apiKey, queryClient]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fieldValue = form.getValues('model') as string | undefined;
      if (!fieldValue || fieldValue.length === 0) {
        form.setValue('model', data[0].id);
      }
    }
  }, [data, form]);

  return render();
}