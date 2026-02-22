/**
 * LLM configuration for AI-assisted test analysis and failure explanation
 * Free options: Google (GEMINI_API_KEY), Groq (GROQ_API_KEY)
 */

export const llmConfig = {
  provider: process.env.LLM_PROVIDER || 'google',
  model: process.env.LLM_MODEL || 'gemini-2.0-flash',
  apiKey:
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.LLM_API_KEY,
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1024', 10),
  temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.2'),
  enableFailureExplainer: process.env.ENABLE_FAILURE_EXPLAINER !== 'false',
  reportDir: process.env.LLM_REPORT_DIR || 'reports/llm-analysis',
} as const;

export type LLMConfig = typeof llmConfig;
