/**
 * dsh-jev-adapter — Cordis plugin entry for DeepSeek Harness.
 *
 * Registers one model tool, `jev_decide`, that runs the Jev (System One)
 * decision-model paradigm over either:
 *   - channel "openai": any OpenAI-compatible chat endpoint (default), or
 *   - channel "typesafe": the official TypeSafe Jev API.
 *
 * Plain JavaScript only — this file runs inside the dsh plugin runtime.
 * @module dsh-jev-adapter
 */
import { buildTool } from './tool.js';

/** Cordis plugin identity shown in loader diagnostics. */
export const name = 'dsh-jev-adapter';

/** Services this plugin consumes; `tools` must exist before apply runs. */
export const inject = ['tools'];

/**
 * Register `jev_decide` on the Host tool registry.
 *
 * Cordis passes the loader row's `config` as the second argument. Reading
 * `ctx.config` is not part of the plugin API and throws before apply runs.
 *
 * @param ctx - context carrying the injected `tools` service.
 * @param config - the `dsh-jev-adapter` row config from `cordis.patch.yml`.
 */
export function apply(ctx, config = {}) {
  const cfg = config ?? {};
  const tool = buildTool({
    channel: cfg.channel,
    baseURL: cfg.baseURL,
    apiKey: cfg.apiKey,
    model: cfg.model,
    maxTokens: cfg.maxTokens,
    timeoutMs: cfg.timeoutMs,
    retries: cfg.retries,
  });
  ctx.tools.register(tool);
  ctx.logger.info(
    `dsh-jev-adapter: jev_decide registered (channel=${cfg.channel || 'openai'})`,
  );
}
