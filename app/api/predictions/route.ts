import { NextApiRequest, NextApiResponse } from 'next';
import { predictStarSwings } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const predictions = await predictStarSwings();
		res.status(200).json(predictions);
	} catch (error) {
		res.status(500).json({ error: 'Failed to predict star swings' });
	}
}