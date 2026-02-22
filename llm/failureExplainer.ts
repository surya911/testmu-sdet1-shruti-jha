/**
 * LLM-powered failure explainer for test diagnostics
 *
 * OPTION A vs B: Chose Failure Explainer (A) over Flaky Test Classifier (B) because:
 * - Immediate value: developers get actionable feedback at the moment of failure, not after batch analysis
 * - Simpler integration: hooks into afterEach; no need to parse/aggregate logs post-run
 * - Direct debugging aid: "what broke and how to fix" is more useful during active development than
 *   bucketing failures after the fact. Flaky classification helps in CI/CD dashboards; failure
 *   explanation helps when you're in the middle of fixing a test.
 */

import { LLMClient } from './client';
import { llmConfig } from '../config/llm.config';
import * as fs from 'fs';
import * as path from 'path';

export interface FailureContext {
  testTitle: string;
  errorMessage: string;
  stackTrace?: string;
  tracePath?: string;
  screenshotPath?: string;
}

export async function explainFailure(context: FailureContext): Promise<string> {
  if (!llmConfig.enableFailureExplainer) {
    return 'Failure explainer is disabled.';
  }
  if (!llmConfig.apiKey) {
    return 'Failure explainer skipped: OPENAI_API_KEY not set.';
  }

  const client = new LLMClient();

  const systemPrompt = `You are an expert test automation engineer. Analyze test failures and provide:
1. Likely root cause
2. Suggested fixes
3. Relevant selectors or locators to check
4. Common pitfalls that might apply

Be concise and actionable.`;

  const userContent = [
    `Test: ${context.testTitle}`,
    `Error: ${context.errorMessage}`,
    context.stackTrace ? `Stack trace:\n${context.stackTrace}` : '',
    context.tracePath ? `Trace available at: ${context.tracePath}` : '',
    context.screenshotPath ? `Screenshot available at: ${context.screenshotPath}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const response = await client.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]);

  return response.content;
}

export async function saveAnalysis(testTitle: string, analysis: string): Promise<string> {
  const dir = path.resolve(llmConfig.reportDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const safeName = testTitle.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(dir, `${safeName}-${timestamp}.md`);

  fs.writeFileSync(filePath, analysis, 'utf-8');
  return filePath;
}
