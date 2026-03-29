'use server';
/**
 * @fileOverview A Genkit flow for generating AI-driven explanations and material tradeoff scores for structural elements.
 *
 * - generateMaterialRecommendationExplanation - A function that handles the generation of material recommendations.
 * - MaterialRecommendationExplanationInput - The input type for the generateMaterialRecommendationExplanation function.
 * - MaterialRecommendationExplanationOutput - The return type for the generateMaterialRecommendationExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaterialRecommendationExplanationInputSchema = z.object({
  elementDescription: z
    .string()
    .describe(
      'A detailed description of the structural element, including its type, dimensions, current or proposed material, and function (e.g., "a 10x3x2 meter load-bearing concrete wall", "a 100x80 meter floor slab made of reinforced concrete").'
    ),
  context: z
    .string()
    .optional()
    .describe(
      'Additional context about the building or design constraints (e.g., "residential building in seismic zone", "eco-friendly design goals").'
    ),
});
export type MaterialRecommendationExplanationInput = z.infer<
  typeof MaterialRecommendationExplanationInputSchema
>;

const MaterialTradeoffSchema = z.object({
  material: z.string().describe('The name of the construction material.'),
  strengthScore: z
    .number()
    .min(1)
    .max(10)
    .describe('A score from 1 to 10 representing the strength of the material.'),
  costScore: z
    .number()
    .min(1)
    .max(10)
    .describe('A score from 1 to 10 representing the cost-effectiveness of the material (higher score means lower cost).'),
});

const MaterialRecommendationExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed AI-generated explanation and rationale for material suggestions for the structural element.'
    ),
  materialTradeoffs: z
    .array(MaterialTradeoffSchema)
    .describe(
      'An array of material tradeoff scores for different material options (Strength vs. Cost).'
    ),
});
export type MaterialRecommendationExplanationOutput = z.infer<
  typeof MaterialRecommendationExplanationOutputSchema
>;

export async function generateMaterialRecommendationExplanation(
  input: MaterialRecommendationExplanationInput
): Promise<MaterialRecommendationExplanationOutput> {
  return materialRecommendationExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'materialRecommendationExplanationPrompt',
  input: {schema: MaterialRecommendationExplanationInputSchema},
  output: {schema: MaterialRecommendationExplanationOutputSchema},
  prompt: `You are an expert Structural Engineer and Web3 UI/UX Architect tasked with providing material recommendations.
Your goal is to help a structural engineer understand the rationale behind material suggestions and make informed design decisions.
You need to generate an explanation and material tradeoff scores (Strength vs. Cost) for a given structural element.
The scores should be on a scale of 1 to 10:
- A higher strength score means greater structural integrity and load-bearing capacity.
- A higher cost score means more cost-effective (lower initial material cost).

Structural Element to Analyze:
Description: {{{elementDescription}}}
{{#if context}}
Context: {{{context}}}
{{/if}}

Please provide:
1.  A detailed, professional explanation (as a string for the 'explanation' field) covering the rationale behind suitable material suggestions, considering typical structural engineering practices, the element's function, and any provided context.
2.  An array of material tradeoff scores (as 'materialTradeoffs') for at least 3 common and relevant material options. For each material, provide a 'strengthScore' and a 'costScore' according to the definitions above. If specific material options are not provided in the input, suggest appropriate common materials based on the element type.
`,
});

const materialRecommendationExplanationFlow = ai.defineFlow(
  {
    name: 'materialRecommendationExplanationFlow',
    inputSchema: MaterialRecommendationExplanationInputSchema,
    outputSchema: MaterialRecommendationExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate material recommendation explanation.');
    }
    return output;
  }
);
