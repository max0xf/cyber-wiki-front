/**
 * Service Token Form Component
 * Form for configuring service tokens (Git providers, Atlassian services, etc.)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
} from '@hai3/uikit';
import { ButtonVariant } from '@hai3/uikit';
import type { ServiceToken } from '../../../types/serviceTokenTypes';

const serviceTokenFormSchema = z.object({
  provider: z.enum(['github', 'bitbucket_server']),
  base_url: z.string().url({ message: 'Must be a valid URL' }).min(1, { message: 'Base URL is required' }),
  token: z.string().min(1, { message: 'Token is required' }),
  username: z.string().optional(),
  confluence_url: z.string().optional(),
  confluence_token: z.string().optional(),
  jira_url: z.string().optional(),
  jira_email: z.string().optional(),
  jira_token: z.string().optional(),
  additional_token: z.string().optional(),
});

type ServiceTokenFormValues = z.infer<typeof serviceTokenFormSchema>;

export interface ServiceTokenFormProps {
  t: (key: string) => string;
  onSubmit: (values: ServiceTokenFormValues) => void;
  onCancel?: () => void;
  initialData?: ServiceToken;
  isLoading?: boolean;
  error?: string | null;
}

export function ServiceTokenForm({
  t,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  error = null,
}: ServiceTokenFormProps) {
  const form = useForm<ServiceTokenFormValues>({
    resolver: zodResolver(serviceTokenFormSchema),
    defaultValues: {
      provider: (initialData?.service_type as any) || 'github',
      base_url: initialData?.base_url || '',
      token: '',
      username: '',
      confluence_url: '',
      confluence_token: '',
      jira_url: '',
      jira_email: '',
      jira_token: '',
      additional_token: '',
    },
  });

  const selectedProvider = form.watch('provider');
  const showUsernameField = selectedProvider === 'bitbucket_server';

  function handleSubmit(values: ServiceTokenFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('form_section_git_provider')}</h3>

          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_provider_label')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading || !!initialData}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form_provider_placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="bitbucket_server">Bitbucket Server</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t('form_provider_description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="base_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_base_url_label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form_base_url_placeholder')}
                    {...field}
                    disabled={isLoading || !!initialData}
                  />
                </FormControl>
                <FormDescription>
                  {t('form_base_url_description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_token_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('form_token_placeholder')}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  {t('form_token_description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {showUsernameField && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_username_label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_username_placeholder')}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('form_username_description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4 opacity-50">
          <h3 className="text-lg font-semibold">{t('form_section_atlassian')}</h3>
          <p className="text-sm text-muted-foreground">{t('form_section_atlassian_coming_soon')}</p>

          <FormField
            control={form.control}
            name="confluence_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_confluence_url_label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form_confluence_url_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confluence_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_confluence_token_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('form_confluence_token_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jira_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_jira_url_label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form_jira_url_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jira_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_jira_email_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('form_jira_email_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jira_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_jira_token_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('form_jira_token_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 opacity-50">
          <h3 className="text-lg font-semibold">{t('form_section_additional')}</h3>
          <p className="text-sm text-muted-foreground">{t('form_section_additional_coming_soon')}</p>

          <FormField
            control={form.control}
            name="additional_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_additional_token_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('form_additional_token_placeholder')}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormDescription>
                  {t('form_additional_token_description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant={ButtonVariant.Default} disabled={isLoading}>
            {isLoading ? t('form_saving') : (initialData ? t('form_update_button') : t('form_submit_button'))}
          </Button>
          {onCancel && (
            <Button type="button" variant={ButtonVariant.Outline} onClick={onCancel} disabled={isLoading}>
              {t('form_cancel_button')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
