'use client'

import React from 'react';
import { motion } from "framer-motion";
import { Markdown } from "./markdown";
import { ToolInvocation } from "ai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUser, FaStar, FaHeart, FaRobot, FaUserCircle } from 'react-icons/fa';

interface Hero {
	name: string;
	handle: string;
	followers_count: number;
	stars: number;
	status: string;
}

interface HeroInfoProps {
	hero: Hero;
}

const HeroInfo: React.FC<HeroInfoProps> = ({ hero }) => (
	<motion.div
		className="hero-info bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 shadow-lg text-white"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<motion.h3
			className="text-2xl font-bold mb-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.2, duration: 0.5 }}
		>
			{hero.name} <span className="text-lg font-normal">(@{hero.handle})</span>
		</motion.h3>
		<motion.div
			className="grid grid-cols-3 gap-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.4, duration: 0.5 }}
		>
			<InfoItem icon={<FaHeart />} label="Followers" value={hero.followers_count} />
			<InfoItem icon={<FaStar />} label="Stars" value={hero.stars} />
			<InfoItem icon={<FaUser />} label="Status" value={hero.status} />
		</motion.div>
	</motion.div>
);

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: number | string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
	<motion.div
		className="flex flex-col items-center"
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
	>
		<div className="text-3xl mb-2">{icon}</div>
		<div className="text-sm opacity-80">{label}</div>
		<div className="font-semibold">{value}</div>
	</motion.div>
);

interface PerformanceData {
	date: string;
	score: number;
}

interface HeroPerformanceChartProps {
	data: PerformanceData[];
}

const HeroPerformanceChart: React.FC<HeroPerformanceChartProps> = ({ data }) => (
	<ResponsiveContainer width="100%" height={300}>
		<LineChart data={data}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="date" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Line type="monotone" dataKey="score" stroke="#8884d8" />
		</LineChart>
	</ResponsiveContainer>
);

interface MarketData {
	floor_price: number;
	highest_bid: number;
	volume: number;
}

interface HeroMarketDataProps {
	data: MarketData;
}

const HeroMarketData: React.FC<HeroMarketDataProps> = ({ data }) => (
	<div className="hero-market-data">
		<h4>Market Data</h4>
		<p>Floor Price: {data.floor_price}</p>
		<p>Highest Bid: {data.highest_bid}</p>
		<p>Volume: {data.volume}</p>
	</div>
);

interface HeroTournamentScoresProps {
	scores: number[];
}

const HeroTournamentScores: React.FC<HeroTournamentScoresProps> = ({ scores }) => (
	<div className="hero-tournament-scores">
		<h4>Tournament Scores</h4>
		<ul>
			{scores.map((score, index) => (
				<li key={index}>Round {index + 1}: {score}</li>
			))}
		</ul>
	</div>
);

interface StarSwingPrediction {
	hero: string;
	swing: number;
}

interface StarSwingsPredictionProps {
	predictions: StarSwingPrediction[];
}

const StarSwingsPrediction: React.FC<StarSwingsPredictionProps> = ({ predictions }) => (
	<div className="star-swings-prediction">
		<h4>Predicted Star Swings</h4>
		<ul>
			{predictions.map((pred, index) => (
				<li key={index}>{pred.hero}: {pred.swing}</li>
			))}
		</ul>
	</div>
);

interface MessageProps {
	role: 'user' | 'assistant';
	content: string | React.ReactNode;
	toolInvocations: Array<ToolInvocation> | undefined;
}

export const Message: React.FC<MessageProps> = ({
	role,
	content,
	toolInvocations,
}) => {
	const isUser = role === 'user';

	return (
		<motion.div
			className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
				<div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
					{isUser ? (
						<FaUserCircle className="w-8 h-8 text-blue-500" />
					) : (
						<FaRobot className="w-8 h-8 text-green-500" />
					)}
				</div>
				<div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
					<div
						className={`rounded-lg p-3 ${isUser
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-800'
							}`}
					>
						{content && (
							<div className="flex flex-col gap-2">
								<Markdown>{content as string}</Markdown>
							</div>
						)}
					</div>
					{toolInvocations && (
						<div className="mt-2 space-y-2">
							{toolInvocations.map((toolInvocation) => {
								const { toolName, toolCallId, state } = toolInvocation;
								if (state === "result") {
									const { result } = toolInvocation;
									return (
										<div key={toolCallId} className="bg-white rounded-lg shadow-md p-4">
											{toolName === "getHero" && <HeroInfo hero={result as Hero} />}
											{toolName === "getHeroPerformance" && <HeroPerformanceChart data={result as PerformanceData[]} />}
											{toolName === "getHeroMarketData" && <HeroMarketData data={result as MarketData} />}
											{toolName === "getHeroTournamentScores" && <HeroTournamentScores scores={result as number[]} />}
											{toolName === "predictStarSwings" && <StarSwingsPrediction predictions={result as StarSwingPrediction[]} />}
										</div>
									);
								}
								return null;
							})}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};