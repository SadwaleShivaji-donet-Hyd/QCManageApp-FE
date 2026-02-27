import { post } from "./api";
import { logger } from "../utils/logger";

export interface CreateSampleResponse {
  sample_id: string;
  error?: string;
  details?: string;
}

export interface CreateSlideResponse {
  slide_id: string;
  sample_id: string;
}

export interface CreateBatchResponse {
  batch_id: string;
  slide_count: number;
  error?: string;
  details?: string;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Retry helper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: unknown;
  let delay = RETRY_CONFIG.initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`[${label}] Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warn(`[${label}] Attempt ${attempt} failed`, error);

      if (attempt < maxRetries) {
        logger.info(`[${label}] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= RETRY_CONFIG.backoffMultiplier;
      }
    }
  }

  logger.error(`[${label}] Failed after ${maxRetries} attempts`, lastError);
  throw lastError;
}

/**
 * Create a sample
 * POST /samples
 */
export const createSample = async (
  sampleId: string
): Promise<CreateSampleResponse> => {
  logger.info(`Creating sample: ${sampleId}`);
  return withRetry(
    () =>
      post<CreateSampleResponse>("/samples", { sample_id: sampleId }),
    `CreateSample(${sampleId})`
  );
};

/**
 * Create a slide for a sample
 * POST /samples/{sampleId}/slides
 */
export const createSlide = async (
  sampleId: string,
  slideId: string
): Promise<CreateSlideResponse> => {
  logger.info(`Creating slide: ${slideId} for sample: ${sampleId}`);
  return withRetry(
    () =>
      post<CreateSlideResponse>(`/samples/${sampleId}/slides`, {
        slide_id: slideId,
      }),
    `CreateSlide(${slideId})`
  );
};

/**
 * Create a batch with sample IDs
 * POST /batches
 */
export const createBatch = async (
  sampleIds: string[]
): Promise<CreateBatchResponse> => {
  logger.info(`Creating batch with ${sampleIds.length} samples`, sampleIds);
  return withRetry(
    () =>
      post<CreateBatchResponse>("/batches", { sample_ids: sampleIds }),
    `CreateBatch`,
    2 // Lower retry count for batch creation
  );
};
