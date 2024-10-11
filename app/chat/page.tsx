'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { Message as MessageComponent } from '@/components/message'
import { Moon, Sun, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
	const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
	const [allMessages, setAllMessages] = useState<Message[]>([]);
	const [finishedStream, setFinishedStream] = useState(false);
	const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
		api: '/api/chat',
		onFinish: () => {
			setFinishedStream(true);
		},
	});

	const [darkMode, setDarkMode] = useState(true);
	const [showSuggestions, setShowSuggestions] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setAllMessages(messages);
	}, [messages]);

	useEffect(() => {
		if (finishedStream) {
			setVisibleMessages(prevMessages => {
				const newMessages: Message[] = [];
				let currentGroup: Message[] = [];
				let hasContent = false;

				for (let i = allMessages.length; i < allMessages.length; i++) {
					const message = allMessages[i];
					if (message.role === 'user') {
						if (currentGroup.length > 0) {
							newMessages.push(...currentGroup);
							currentGroup = [];
							hasContent = false;
						}
						newMessages.push(message);
					} else if (message.role === 'assistant') {
						if (message.content !== '') {
							if (!hasContent) {
								currentGroup.unshift(message);
								hasContent = true;
							} else {
								currentGroup.push(message);
							}
						} else if (message.toolInvocations) {
							const relevantToolNames = [
								'getHeroPerformance',
								'getHeroMarketData',
								'getHeroTournamentScores',
								'predictStarSwings',
								'getCardsByOwner',
								'getHero',
							];

							if (message.toolInvocations[0] &&
								relevantToolNames.includes(message.toolInvocations[0].toolName)) {
								currentGroup.push(message);
							}
						}
					}
				}

				if (currentGroup.length > 0) {
					newMessages.push(...currentGroup);
				}

				return [...prevMessages, ...newMessages];
			});
			setFinishedStream(false);
		} else {
			const newMessages = allMessages.filter(message =>
				message.role === 'user' ||
				(message.role === 'assistant' && message.content !== '')
			);

			setVisibleMessages(prevMessages => {
				const updatedMessages = prevMessages.map(prevMessage => {
					const newMessage = newMessages.find(msg => msg.id === prevMessage.id);
					if (newMessage) {
						return { ...prevMessage, content: newMessage.content };
					}
					return prevMessage;
				});

				const newUniqueMessages = newMessages.filter(newMsg =>
					!prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
				);

				// Find the last message with non-empty content
				const lastContentMessage = [...updatedMessages, ...newUniqueMessages]
					.reverse()
					.find(msg => msg.content !== '');

				// Filter out duplicate content messages, keeping only the last one
				const finalMessages = [...updatedMessages, ...newUniqueMessages].filter(
					(msg, index, array) =>
						msg.content === '' ||
						msg === lastContentMessage ||
						msg.id !== lastContentMessage?.id
				);

				return finalMessages;
			});
		}
	}, [finishedStream, allMessages]);

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 100);
	}, [visibleMessages]);

	useEffect(() => {
		const isDarkMode = localStorage.getItem('darkMode') === 'false';
		setDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark', !isDarkMode);
	}, []);

	useEffect(() => {
		// Hide suggestions after the first message
		if (visibleMessages.length > 0) {
			setShowSuggestions(false);
		}
	}, [visibleMessages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem('darkMode', (!newDarkMode).toString());
		document.documentElement.classList.toggle('dark', newDarkMode);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmit(e);
		inputRef.current?.focus();
	};

	const suggestions = [
		"What are the recent scores of 0xMakesy?",
		"Tell me about the top-ranked hero this week",
		"Explain the rules of the fantasy game",
		"What's the best strategy for beginners?",
	];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}
		>
			<div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 dark:from-black dark:to-zinc-900 transition-colors duration-500">
				<header className="bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-900 dark:to-purple-900 text-white p-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold">FantasyFlux</h1>
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200"
						aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					>
						{darkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</header>

				<main className="flex-1 overflow-auto p-6">
					<div className="max-w-4xl mx-auto space-y-6">
						<AnimatePresence>
							{showSuggestions && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									className="grid grid-cols-2 gap-4 mb-4"
								>
									{suggestions.map((suggestion, index) => (
										<motion.button
											key={index}
											onClick={() => setInput(suggestion)}
											className="text-left bg-gray-700 dark:bg-zinc-800 text-gray-200 dark:text-gray-300 p-3 rounded-lg hover:bg-gray-600 dark:hover:bg-zinc-700 transition-colors duration-200 truncate"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Sparkles size={16} className="inline-block mr-2" />
											{suggestion}
										</motion.button>
									))}
								</motion.div>
							)}
							{visibleMessages.map((message, index) => (
								<motion.div
									key={`${message.id}-${index}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									<MessageComponent
										role={message.role as 'user' | 'assistant'}
										content={message.content}
										toolInvocations={message.toolInvocations}
										isStreaming={isLoading && index === visibleMessages.length - 1}
									/>
								</motion.div>
							))}
						</AnimatePresence>
						<div ref={messagesEndRef} />
					</div>
				</main>

				<footer className="bg-transparent transition-colors duration-500">
					<div className="max-w-4xl mx-auto p-4">
						<div className="relative">
							<motion.textarea
								ref={inputRef}
								value={input}
								onChange={handleInputChange}
								placeholder="Ask about heroes, cards, or players..."
								className="w-full p-4 pr-4 border-2 border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 dark:bg-zinc-800 text-white transition-all duration-200 resize-none"
								disabled={isLoading}
								rows={1}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleFormSubmit(e);
									}
								}}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
								<motion.button
									type="submit"
									onClick={handleFormSubmit}
									className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
									disabled={isLoading}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									aria-label="Send message"
								>
									<Send size={20} />
								</motion.button>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</motion.div>
	);
}