'use server';

/**
 * @fileOverview Provides AI-powered insights and suggestions on spending habits to identify savings opportunities and improve budget management.
 *
 * - getSpendingInsights - A function that handles the process of generating spending insights.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  income: z.number().describe('The user\'s total income for the period.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of the expense.'),
        amount: z.number().describe('The amount spent on the expense.'),
      })
    )
    .describe('A list of expenses with their categories and amounts.'),
    revenues: z
    .array(
      z.object({
        category: z.string().describe('The category of the revenue.'),
        amount: z.number().describe('The amount received from the revenue source.'),
      })
    )
    .describe('A list of revenue sources with their categories and amounts.'),
  budgetGoals: z
    .array(
      z.object({
        category: z.string().describe('The category of the budget goal.'),
        amount: z.number().describe('The target amount for the budget goal.'),
      })
    )
    .describe('A list of budget goals with their categories and amounts.'),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  insights: z
    .array(z.string())
    .describe('A list of insights and suggestions for the user.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(
  input: SpendingInsightsInput
): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

const spendingInsightsPrompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: {
    schema: z.object({
      income: z.number().describe('The user\'s total income for the period.'),
      expenses: z
        .array(
          z.object({
            category: z.string().describe('The category of the expense.'),
            amount: z.number().describe('The amount spent on the expense.'),
          })
        )
        .describe('A list of expenses with their categories and amounts.'),
        revenues: z
        .array(
          z.object({
            category: z.string().describe('The category of the revenue.'),
            amount: z.number().describe('The amount received from the revenue source.'),
          })
        )
        .describe('A list of revenue sources with their categories and amounts.'),
      budgetGoals: z
        .array(
          z.object({
            category: z.string().describe('The category of the budget goal.'),
            amount: z.number().describe('The target amount for the budget goal.'),
          })
        )
        .describe('A list of budget goals with their categories and amounts.'),
    }),
  },
  output: {
    schema: z.object({
      insights: z
        .array(z.string())
        .describe('A list of insights and suggestions for the user.'),
    }),
  },
  prompt: `You are a personal finance advisor. Analyze the user's income, expenses, and budget goals to provide insights and suggestions for better budget management.

Income: {{{income}}}

Expenses:
{{#each expenses}}
- Category: {{{category}}}, Amount: {{{amount}}}
{{/each}}

Revenues:
{{#each revenues}}
- Category: {{{category}}}, Amount: {{{amount}}}
{{/each}}

Budget Goals:
{{#each budgetGoals}}
- Category: {{{category}}}, Target: {{{amount}}}
{{/each}}

Provide specific, actionable insights and suggestions to help the user save money and improve their budget.
`,
});

const spendingInsightsFlow = ai.defineFlow<
  typeof SpendingInsightsInputSchema,
  typeof SpendingInsightsOutputSchema
>(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await spendingInsightsPrompt(input);
    return output!;
  }
);
