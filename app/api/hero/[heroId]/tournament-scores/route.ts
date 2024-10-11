import { NextApiRequest, NextApiResponse } from 'next';
import { getHeroTournamentScores } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { heroId } = req.query;

	if (typeof heroId !== 'string') {
		return res.status(400).json({ error: 'Invalid heroId' });
	}

	try {
		const tournamentScores = await getHeroTournamentScores(heroId);
		res.status(200).json(tournamentScores);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch hero tournament scores' });
	}
}