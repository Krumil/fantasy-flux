import { NextResponse } from 'next/server';

interface Player {
	name: string;
	current_rank: number;
	fantasy_score: number;
	current_stars: number;
	predicted_stars: number;
	star_change: number;
	performance_change: number;
	recovery_potential: number;
	median_7_days: number;
	median_14_days: number;
	change_1_day: number;
	change_7_days: number;
}

interface ApiResponse {
	potential_losers: Player[];
	potential_gainers: Player[];
}

export async function GET() {
	try {
		const response = await fetch('http://localhost:8000/api/predict-star-swings/');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: ApiResponse = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error('Error in predict-star-swings API route:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}