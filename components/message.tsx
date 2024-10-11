'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Markdown } from "./markdown";
import { ToolInvocation } from "ai";
import { IconAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { HeroInfo } from '../components/hero/HeroInfo';
import { HeroPerformanceChart } from '../components/hero/HeroPerformanceChart';
import { HeroMarketData } from '../components/hero/HeroMarketData';
import { HeroTournamentScores } from '../components/hero/HeroTournamentScores';
import { StarSwingsPrediction } from '../components/hero/StarSwingsPrediction';
import { Inventory } from '../components/player/Inventory';
const useDarkMode = () => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		setDarkMode(isDarkMode);

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'darkMode') {
				setDarkMode(e.newValue === 'true');
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	return darkMode;
};

interface MessageProps {
	role: 'user' | 'assistant';
	content: string;
	toolInvocations: Array<ToolInvocation> | undefined;
	isStreaming: boolean;
}

export const Message: React.FC<MessageProps> = ({
	role,
	content,
	toolInvocations,
	isStreaming,
}) => {
	const isUser = role === 'user';
	const darkMode = useDarkMode();

	const MessageWrapper = isUser ? UserMessage : BotMessage;

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<MessageWrapper toolInvocations={toolInvocations}>
				{content !== '' && (
					<motion.div
						className={cn(
							"rounded-lg p-4 w-full",
							isUser
								? darkMode
									? "bg-[#0e330d] text-gray-100"
									: "bg-indigo-100 text-gray-800"
								: darkMode
									? "bg-gray-800 text-gray-200"
									: "bg-gray-100 text-gray-800"
						)}
						initial={{ scale: 0.95 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.2 }}
					>
						<div className="flex flex-col gap-2">
							<Markdown>{content}</Markdown>
						</div>
					</motion.div>
				)}
				<AnimatePresence>
					{toolInvocations && toolInvocations.length > 0 && (
						<motion.div
							className={cn("space-y-4 w-full", darkMode ? "text-gray-200" : "text-gray-800")}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{toolInvocations.map((toolInvocation) => (
								<ToolInvocationComponent key={toolInvocation.toolCallId} toolInvocation={toolInvocation} />
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</MessageWrapper>
		</motion.div>
	);
};

const ToolInvocationComponent: React.FC<{ toolInvocation: ToolInvocation }> = ({ toolInvocation }) => {
	const { toolName, toolCallId, state } = toolInvocation;
	if (state === "result") {
		const { result } = toolInvocation;
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
	}
	return null;
};

function UserMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="group relative flex items-start justify-end">
			<div className="flex-1 space-y-2 overflow-hidden px-1">
				{children}
			</div>
			<div className="p-2 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-indigo-50 ml-4">
				<IconUser className="text-indigo-600" />
			</div>
		</div>
	);
}

function BotMessage({ children, toolInvocations }: { children: React.ReactNode, toolInvocations: Array<ToolInvocation> | undefined }) {
	const showAIIcon = !toolInvocations || toolInvocations.length === 0;

	return (
		<div className="group relative flex items-start">
			<div className="flex h-8 w-8 shrink-0 select-none items-center justify-center">
				{showAIIcon ? (
					<div className="rounded-md p-2 border shadow-sm bg-gray-100">
						<IconAI className="text-gray-600" />
					</div>
				) : (
					<div className="w-full h-full" />
				)}
			</div>
			<div className="flex-1 space-y-2 overflow-hidden px-1 ml-4">
				{children}
			</div>
		</div>
	);
}