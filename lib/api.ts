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

async function getCardsByOwner(ownerAddress: string) {
	const response = await fetchFromAPI('/cards/');
	const filteredResponse = response.filter((card: any) => card.owner === ownerAddress);
	return filteredResponse;
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

async function getAllHeroes() {
	return fetchFromAPI('/all-heroes-basic-info/');
}

async function getHeroesBestReturn() {
	return fetchFromAPI('/hero-best-return/');
}

export {
	listHeroes,
	getHero,
	listCards,
	getCard,
	getCardsByOwner,
	getHeroPerformance,
	getHeroMarketData,
	getHeroTournamentScores,
	predictStarSwings,
	searchHeroesByHandle,
	getAllHeroes,
	getHeroesBestReturn
};