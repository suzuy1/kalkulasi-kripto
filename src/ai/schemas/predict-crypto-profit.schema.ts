/**
 * @fileOverview Zod schemas and TypeScript types for the crypto profit predictor.
 */

import { z } from 'zod';

const assetSchema = z.object({
  BTC: z.number(),
  ETH: z.number(),
  SOL: z.number(),
  XRP: z.number(),
  SUI: z.number(),
});

export const PredictCryptoProfitInputSchema = z.object({
  investment: z.number().describe('The initial investment amount in IDR.'),
  allocations: assetSchema.describe('The percentage allocation for each asset.'),
});
export type PredictCryptoProfitInput = z.infer<typeof PredictCryptoProfitInputSchema>;


export const PredictCryptoProfitOutputSchema = z.object({
  priceChanges: assetSchema.describe('The predicted price change percentage for each asset.'),
  totalProfitLoss: z.number().describe('The total profit or loss in IDR.'),
  percentageChange: z.number().describe('The total portfolio percentage change.'),
  finalValue: z.number().describe('The final value of the portfolio in IDR.'),
  breakdown: z.array(z.object({
    name: z.string(),
    allocation: z.number(),
    priceChange: z.number(),
    profitLoss: z.number(),
  })).describe('A detailed breakdown of profit/loss for each asset.'),
   thoughts: z.string().describe('A brief analysis or thought process behind the prediction.'),
});
export type PredictCryptoProfitOutput = z.infer<typeof PredictCryptoProfitOutputSchema>;
