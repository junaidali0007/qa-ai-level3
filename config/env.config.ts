export interface EnvConfig {
  baseUrl: string;
  aiProvider: string;
  aiModel: string;
  hasAiKey: boolean;
}

export function loadEnvConfig(): EnvConfig {
  return {
    baseUrl: (process.env.BASE_URL || 'https://automationexercise.com').replace(/\/+$/, ''),
    aiProvider: process.env.AI_PROVIDER || 'none',
    aiModel: process.env.AI_MODEL || '',
    hasAiKey: Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0),
  };
}
