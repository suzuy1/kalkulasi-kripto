// This is a server-side file.
'use server';

/**
 * @fileOverview Simulates different investment scenarios by generating potential return rates.
 *
 * - simulateInvestmentScenarios - A function that simulates investment scenarios.
 * - SimulateInvestmentScenariosInput - The input type for the simulateInvestmentScenarios function.
 * - SimulateInvestmentScenariosOutput - The return type for the simulateInvestmentScenarios function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateInvestmentScenariosInputSchema = z.object({
  numberOfScenarios: z
    .number()
    .describe('The number of investment scenarios to simulate.')
    .default(5),
});
export type SimulateInvestmentScenariosInput = z.infer<typeof SimulateInvestmentScenariosInputSchema>;

const SimulateInvestmentScenariosOutputSchema = z.object({
  scenarios: z.array(
    z.object({
      returnRate: z
        .number()
        .describe('The potential return rate for the investment scenario.'),
    })
  ),
});
export type SimulateInvestmentScenariosOutput = z.infer<typeof SimulateInvestmentScenariosOutputSchema>;

export async function simulateInvestmentScenarios(
  input: SimulateInvestmentScenariosInput
): Promise<SimulateInvestmentScenariosOutput> {
  return simulateInvestmentScenariosFlow(input);
}

const simulateInvestmentScenariosPrompt = ai.definePrompt({
  name: 'simulateInvestmentScenariosPrompt',
  input: {schema: SimulateInvestmentScenariosInputSchema},
  output: {schema: SimulateInvestmentScenariosOutputSchema},
  prompt: `Generate {{numberOfScenarios}} potential return rates for investment scenarios. Each return rate should be a floating point number between -0.5 and 1.0. Return the scenarios as a JSON array of objects with the returnRate field.`,
});

const simulateInvestmentScenariosFlow = ai.defineFlow(
  {
    name: 'simulateInvestmentScenariosFlow',
    inputSchema: SimulateInvestmentScenariosInputSchema,
    outputSchema: SimulateInvestmentScenariosOutputSchema,
  },
  async input => {
    const {output} = await simulateInvestmentScenariosPrompt(input);
    return output!;
  }
);
