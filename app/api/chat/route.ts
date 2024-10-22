import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";
import {
	findRelevantContent,
	getCard,
	getCardsByOwner,
	getHero,
	getHeroMarketData,
	getHeroPerformance,
	getHeroTournamentScores,
	listCards,
	listHeroes,
	predictStarSwings,
	searchHeroesByHandle,
} from "@/lib/api";
export async function POST(request: Request) {
	const { messages } = await request.json();
	const stream = await streamText({
		model: openai("gpt-4o"),
		system: `
      - You are a knowledgeable assistant for a Twitter-influencer fantasy game
      - Use getRelevantContent tool to answer generic questions
      - Use other tools to answer specific questions
      - Incorporate retrieved information into concise, informative responses
      - If no relevant info found, use other tools or your understanding
      - Provide game details, explain mechanics, and offer strategy insights
      - Base predictions on available data and trends
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
			getRelevantContent: {
				description: "Retrieve relevant information from the knowledge base to answer the user's question.",
				parameters: z.object({
					query: z.string().describe("The user's question or query."),
				}),
				execute: async function ({ query }) {
					return await findRelevantContent(query);
				},
			},
		},
		onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
			console.log('onStepFinish', text, toolCalls, toolResults, finishReason, usage)
		},
	});
	return stream.toDataStreamResponse();
}