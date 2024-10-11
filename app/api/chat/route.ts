import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";
import { listHeroes, getHero, listCards, getCard, getCardsByOwner, getHeroPerformance, getHeroMarketData, getHeroTournamentScores, predictStarSwings, searchHeroesByHandle } from "@/lib/api";
export async function POST(request: Request) {
	const { messages } = await request.json();
	const stream = await streamText({
		model: openai("gpt-4o"),
		system: `
      - You are a friendly and knowledgeable assistant for a fantasy game based on Twitter influencers
      - Your responses are concise, informative, and tailored to the user's query
      - You can provide detailed information about heroes, cards, and players in the game
      - When discussing trends or performance, you proactively offer to use visualization tools for better insights
      - You can explain game mechanics and strategies to help players improve their performance
      - If asked about predictions or future outcomes, you base your responses on available data and trends
      - You maintain a positive and encouraging tone, especially when discussing player performance or game strategies
    `,
		messages: convertToCoreMessages(messages),
		maxToolRoundtrips: 3,
		tools: {
			listHeroes: {
				description: "List all heroes",
				parameters: z.object({}),
				execute: async function () {
					return await listHeroes();
				},
			},
			getHero: {
				description: "Get detailed information about a specific hero",
				parameters: z.object({
					heroId: z.string(),
				}),
				execute: async function ({ heroId }) {
					return await getHero(heroId);
				},
			},
			listCards: {
				description: "List all cards",
				parameters: z.object({}),
				execute: async function () {
					return await listCards();
				},
			},
			getCard: {
				description: "Get detailed information about a specific card",
				parameters: z.object({
					cardId: z.string(),
				}),
				execute: async function ({ cardId }) {
					return await getCard(cardId);
				},
			},
			getCardsByOwner: {
				description: "Get all cards owned by a specific Ethereum address",
				parameters: z.object({
					ownerAddress: z.string(),
				}),
				execute: async function ({ ownerAddress }) {
					return await getCardsByOwner(ownerAddress);
				},
			},
			getHeroPerformance: {
				description: "Get performance data for a specific hero",
				parameters: z.object({
					heroId: z.string(),
				}),
				execute: async function ({ heroId }) {
					return await getHeroPerformance(heroId);
				},
			},
			getHeroMarketData: {
				description: "Get market data for a specific hero",
				parameters: z.object({
					heroId: z.string(),
				}),
				execute: async function ({ heroId }) {
					return await getHeroMarketData(heroId);
				},
			},
			getHeroTournamentScores: {
				description: "Get tournament scores for a specific hero",
				parameters: z.object({
					heroId: z.string(),
				}),
				execute: async function ({ heroId }) {
					return await getHeroTournamentScores(heroId);
				},
			},
			predictStarSwings: {
				description: "Predict star swings for heroes",
				parameters: z.object({}),
				execute: async function () {
					return await predictStarSwings();
				},
			},
			searchHeroesByHandle: {
				description: "Search heroes by Twitter handle",
				parameters: z.object({
					handle: z.string(),
				}),
				execute: async function ({ handle }) {
					return await searchHeroesByHandle(handle);
				},
			},
		},
		onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
			console.log('onStepFinish', text, toolCalls, toolResults, finishReason, usage)
		},
	});
	return stream.toDataStreamResponse();
}