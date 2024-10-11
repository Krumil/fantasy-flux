import { NextResponse } from 'next/server';
import { getAllHeroes } from '@/lib/api';

export async function GET() {
	try {
		const heroes = await getAllHeroes();
		return NextResponse.json({ heroes });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch heroes' }, { status: 500 });
	}
}