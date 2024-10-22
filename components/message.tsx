'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Markdown } from "./markdown";
import { ToolInvocation } from "ai";
import { IconAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { HeroInfo } from './hero/HeroInfo';
import { HeroPerformanceChart } from './hero/HeroPerformanceChart';
import { HeroMarketData } from './hero/HeroMarketData';
import { HeroTournamentScores } from './hero/HeroTournamentScores';
import { StarSwingsPrediction } from './hero/StarSwingsPrediction';
import { Inventory } from './player/Inventory';

interface MessageProps {
	role: 'user' | 'assistant';
	content: string;
	toolInvocations?: Array<ToolInvocation>;
	isCompleted?: boolean;
}

export const Message: React.FC<MessageProps> = React.memo(({
	role,
	content,
	toolInvocations,
	isCompleted,
}) => {
	const isUser = role === 'user';

	const messageVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className={cn(
				"flex items-start space-x-4 py-4 w-full",
				isUser ? "justify-end" : "justify-start"
			)}
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.1,
					},
				},
			}}
		>
			{!isUser && (
				<motion.div
					className="flex-shrink-0"
					variants={messageVariants}
				>
					<div className="rounded-full bg-gray-800 p-2">
						<IconAI className="w-6 h-6 text-white" />
					</div>
				</motion.div>
			)}
			<motion.div
				className={cn(
					"flex flex-col space-y-2 w-full max-w-[80%]",
					isUser ? "items-end" : "items-start"
				)}
				variants={messageVariants}
			>
				<motion.div
					className={cn(
						"rounded-lg p-4 w-full",
						isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
					)}
					variants={messageVariants}
				>
					<Markdown>{content}</Markdown>
					{!isUser && isCompleted && toolInvocations && toolInvocations.map((invocation, index) => (
						<ToolInvocationComponent key={index} toolInvocation={invocation} />
					))}
				</motion.div>
			</motion.div>
			{isUser && (
				<motion.div
					className="flex-shrink-0"
					variants={messageVariants}
				>
					<div className="rounded-full bg-blue-600 p-2">
						<IconUser className="w-6 h-6 text-white" />
					</div>
				</motion.div>
			)}
		</motion.div>
	);
});

const ToolInvocationComponent: React.FC<{ toolInvocation: ToolInvocation }> = ({ toolInvocation }) => {
	const { toolName, state } = toolInvocation;

	if (state !== "result") return null;

	const { result } = toolInvocation;

	return (
		<motion.div
			className="mt-4 w-full bg-transparent rounded-lg shadow-lg"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			{(() => {
				switch (toolName) {
					case "getHero":
						return <HeroInfo hero={result} />;
					case "getHeroPerformance":
						return <HeroPerformanceChart data={result} />;
					case "getHeroMarketData":
						return <HeroMarketData data={result} />;
					case "getHeroTournamentScores":
						return <HeroTournamentScores scores={result.tournament_scores} heroName={result.name} />;
					case "predictStarSwings":
						return <StarSwingsPrediction predictions={result} />;
					case "searchHeroesByHandle":
						return <HeroInfo hero={result.heroes[0]} />;
					case "getCardsByOwner":
						return <Inventory cards={result} />;
					default:
						return null;
				}
			})()}
		</motion.div>
	);
};