'use server';
/**
 * @fileOverview A crypto investment profit prediction AI agent.
 *
 * - predictCryptoProfit - A function that handles the crypto profit prediction process.
 */

import { ai } from '@/ai/genkit';
import {
  PredictCryptoProfitInputSchema,
  PredictCryptoProfitOutputSchema,
  type PredictCryptoProfitInput,
  type PredictCryptoProfitOutput
} from '@/ai/schemas/predict-crypto-profit.schema';


export async function predictCryptoProfit(input: PredictCryptoProfitInput): Promise<PredictCryptoProfitOutput> {
  return predictCryptoProfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCryptoProfitPrompt',
  input: { schema: PredictCryptoProfitInputSchema },
  output: { schema: PredictCryptoProfitOutputSchema },
  prompt: `You are a sophisticated financial analyst specializing in cryptocurrency markets. Your task is to predict the profit or loss of a crypto investment portfolio based on the user's initial investment and asset allocation.

Follow these steps:
1.  **Analyze the Portfolio**: Review the user's initial investment amount (in IDR) and their percentage allocation across the following assets: BTC, ETH, SOL, XRP, SUI.
2.  **Predict Price Changes**: For each asset in the portfolio, predict its potential price change percentage over the **next 7 days**. Your predictions should be realistic and based on current market trends, news, and technical analysis. Do not make overly dramatic or unrealistic predictions.
3.  **Calculate Profit/Loss**:
    - For each asset, calculate the investment amount: \`initialInvestment * (allocationPercentage / 100)\`.
    - Calculate the profit or loss for each asset: \`investmentInAsset * (predictedPriceChangePercentage / 100)\`.
    - Store these calculations in the \`breakdown\` array.
4.  **Calculate Totals**:
    - Sum the profit/loss from all assets to get the \`totalProfitLoss\`.
    - Calculate the \`finalValue\` of the portfolio: \`initialInvestment + totalProfitLoss\`.
    - Calculate the overall \`percentageChange\`: \`(totalProfitLoss / initialInvestment) * 100\`.
5.  **Provide Analysis**: In the \`thoughts\` field, provide a brief, insightful summary (2-3 sentences) explaining the reasoning behind your price predictions. Mention key factors influencing your forecast.
6.  **Format Output**: Return the entire analysis in the specified JSON format. Ensure all numerical calculations are correct.

User's Investment Data:
- Initial Investment: {{investment}} IDR
- Asset Allocations:
  - BTC: {{allocations.BTC}}%
  - ETH: {{allocations.ETH}}%
  - SOL: {{allocations.SOL}}%
  - XRP: {{allocations.XRP}}%
  - SUI: {{allocations.SUI}}%
`,
});

const predictCryptoProfitFlow = ai.defineFlow(
  {
    name: 'predictCryptoProfitFlow',
    inputSchema: PredictCryptoProfitInputSchema,
    outputSchema: PredictCryptoProfitOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a prediction.');
    }

    // Recalculate on the server to ensure accuracy and prevent model hallucinations.
    const { investment, allocations } = input;
    const { priceChanges } = output;
    
    let totalProfitLoss = 0;
    const breakdown = (['BTC', 'ETH', 'SOL', 'XRP', 'SUI'] as const).map(cryptoId => {
        const allocation = allocations[cryptoId];
        const investmentForCrypto = investment * (allocation / 100);
        const priceChange = priceChanges[cryptoId];
        const profitLoss = investmentForCrypto * (priceChange / 100);
        totalProfitLoss += profitLoss;
        return {
            name: cryptoId,
            allocation: allocation,
            priceChange: priceChange,
            profitLoss: profitLoss,
        };
    });

    const percentageChange = (totalProfitLoss / investment) * 100;
    const finalValue = investment + totalProfitLoss;

    return {
        ...output,
        totalProfitLoss,
        percentageChange,
        finalValue,
        breakdown,
    };
  }
);
