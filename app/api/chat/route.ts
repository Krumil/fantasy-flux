import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

async function fetchFromAPI(endpoint: string, params: object = {}) {
	try {
		const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
		return response.data;
	} catch (error) {
		console.error(`Error fetching from API: ${error}`);
		throw error;
	}
}

async function listHeroes() {
	return fetchFromAPI('/heroes/');
}

async function getHero(heroId: string) {
	return fetchFromAPI(`/heroes/${heroId}/`);
}

async function listCards() {
	return fetchFromAPI('/cards/');
}

async function getCard(cardId: string) {
	return fetchFromAPI(`/cards/${cardId}/`);
}

async function listPlayers() {
	return fetchFromAPI('/players/');
}

async function getPlayer(playerId: string) {
	return fetchFromAPI(`/players/${playerId}/`);
}

async function getHeroPerformance(heroId: string) {
	return fetchFromAPI(`/hero-performance/${heroId}/`);
}

async function getHeroMarketData(heroId: string) {
	return fetchFromAPI(`/hero-market-data/${heroId}/`);
}

async function getHeroTournamentScores(heroId: string) {
	return fetchFromAPI(`/hero-tournament-scores/${heroId}/`);
}

async function predictStarSwings() {
	return fetchFromAPI('/predict-star-swings/');
}

async function searchHeroesByHandle(handle: string) {
	return fetchFromAPI('/search-heroes-by-handle/', { handle });
}

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
			listPlayers: {
				description: "List all players",
				parameters: z.object({}),
				execute: async function () {
					return await listPlayers();
				},
			},
			getPlayer: {
				description: "Get detailed information about a specific player",
				parameters: z.object({
					playerId: z.string(),
				}),
				execute: async function ({ playerId }) {
					return await getPlayer(playerId);
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
	});
	return stream.toDataStreamResponse();
}