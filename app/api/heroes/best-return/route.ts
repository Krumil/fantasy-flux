import { NextResponse } from 'next/server';
import { getHeroesBestReturn } from '@/lib/api';

export async function GET() {
	try {
		const topHeroes = await getHeroesBestReturn();
		return NextResponse.json(topHeroes);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch top heroes' }, { status: 500 });
	}
}