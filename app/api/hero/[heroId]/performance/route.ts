import { NextApiRequest, NextApiResponse } from 'next';
import { getHeroPerformance } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { heroId } = req.query;

	if (typeof heroId !== 'string') {
		return res.status(400).json({ error: 'Invalid heroId' });
	}

	try {
		const performanceData = await getHeroPerformance(heroId);
		res.status(200).json(performanceData);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch hero performance data' });
	}
}