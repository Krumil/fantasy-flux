import React from 'react';
import { motion } from "framer-motion";
import { FaTrophy } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TournamentScore {
	index: number;
	score: number;
}

interface HeroTournamentScoresProps {
	scores: TournamentScore[];
	heroName: string;
}

export const HeroTournamentScores: React.FC<HeroTournamentScoresProps> = ({ scores, heroName }) => {
	const reversedScores = scores.slice().reverse();
	return (
		<motion.div
			className="hero-tournament-scores bg-transparent rounded-lg shadow-lg p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h4 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
				<FaTrophy className="mr-3 text-yellow-500" /> {heroName}'s Tournament Scores
			</h4>

			<div className="h-64">
				<h5 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Score Trend</h5>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={reversedScores}>
						<XAxis dataKey={(data) => data.index + 5} />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};