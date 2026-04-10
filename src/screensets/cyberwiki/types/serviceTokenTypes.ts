/**
 * Service Token Types
 * Unified types for all service token configuration (Git providers, JIRA, Custom Headers, etc.)
 */

// Unified service type for all tokens
export type ServiceType =
  | 'github'
  | 'bitbucket_server'
  | 'jira'
  | 'custom_header';

// Unified service token interface
export interface ServiceToken {
  id: number;
  service_type: ServiceType;
  base_url?: string;
  username?: string;
  header_name?: string;  // For custom header tokens
  name?: string;         // For custom header tokens
  created_at: string;
  updated_at: string;
}

// Unified create/update request
export interface ServiceTokenCreateRequest {
  service_type: ServiceType;
  base_url?: string;
  token: string;
  username?: string;
  header_name?: string;  // For ZTA
  name?: string;         // For ZTA
}

// Legacy types for backward compatibility (deprecated)
/** @deprecated Use ServiceType instead */
export type ServiceProvider = 'github' | 'bitbucket_server';
/** @deprecated Use ServiceType instead */
export type GenericServiceType = 'jira' | 'zta';
/** @deprecated Use ServiceToken instead */
export interface GenericServiceToken extends ServiceToken {}
/** @deprecated Use ServiceTokenCreateRequest instead */
export interface GenericServiceTokenCreateRequest extends ServiceTokenCreateRequest {}

export interface ServiceTokenFormData {
  provider: ServiceProvider;
  base_url: string;
  token: string;
  username?: string;
  confluence_url?: string;
  confluence_token?: string;
  jira_url?: string;
  jira_email?: string;
  jira_token?: string;
  additional_token?: string;
}
