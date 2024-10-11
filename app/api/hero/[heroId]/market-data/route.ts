import { NextApiRequest, NextApiResponse } from 'next';
import { getHeroMarketData } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { heroId } = req.query;

	if (typeof heroId !== 'string') {
		return res.status(400).json({ error: 'Invalid heroId' });
	}

	try {
		const marketData = await getHeroMarketData(heroId);
		res.status(200).json(marketData);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch hero market data' });
	}
}