import { NextApiRequest, NextApiResponse } from 'next';
import { getHero } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { heroId } = req.query;

	if (typeof heroId !== 'string') {
		return res.status(400).json({ error: 'Invalid heroId' });
	}

	try {
		const heroData = await getHero(heroId);
		res.status(200).json(heroData);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch hero data' });
	}
}