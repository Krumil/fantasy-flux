'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Message as MessageComponent } from '@/components/message'
import { Send, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
	const [showSuggestions, setShowSuggestions] = useState(true);
	const [suggestionClicked, setSuggestionClicked] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(new Set());

	const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
		api: '/api/chat',
		onFinish: (message) => {
			setCompletedMessageIds((prev) => new Set(prev).add(message.id));
			console.log(message);
		}
	});

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 100);

		if (messages.length > 0) {
			setShowSuggestions(false);
		}
	}, [messages]);

	useEffect(() => {
		document.documentElement.classList.add('dark');
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmit(e);
		inputRef.current?.focus();
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
		setSuggestionClicked(true);
		inputRef.current?.focus();
	};

	useEffect(() => {
		if (suggestionClicked) {
			handleFormSubmit(new Event('submit') as unknown as React.FormEvent);
			setSuggestionClicked(false);
		}
	}, [input, suggestionClicked]);

	const suggestions = [
		"What are the recent scores of 0xMakesy?",
		"Tell me about the top-ranked hero this week",
		"Explain the rules of the fantasy game",
		"What's the best strategy for beginners?",
	];

	const getGroupedMessages = (messages: any[]) => {
		const groupedMessages = [];
		let currentGroup = null;

		for (let message of messages) {
			if (message.role === 'user') {
				if (currentGroup) {
					groupedMessages.push(currentGroup);
					currentGroup = null;
				}
				groupedMessages.push(message);
			} else {
				if (currentGroup) {
					currentGroup.content += message.content;
					currentGroup.groupId = message.id;
					if (message.toolInvocations) {
						currentGroup.toolInvocations = (currentGroup.toolInvocations || []).concat(message.toolInvocations);
					}
				} else {
					currentGroup = {
						...message,
						groupId: message.id,
					};
				}
			}
		}

		if (currentGroup) {
			groupedMessages.push(currentGroup);
		}

		return groupedMessages;
	};

	const renderMessages = () => {
		const groupedMessages = getGroupedMessages(messages);

		if (groupedMessages.length === 0) {
			return null;
		}

		return (
			<>
				{groupedMessages.map((message, index) => (
					<motion.div
						key={`message-${index}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<MessageComponent
							role={message.role as 'user' | 'assistant'}
							content={message.content}
							toolInvocations={message.toolInvocations}
							isCompleted={message.groupId ? completedMessageIds.has(message.groupId) : true}
						/>
					</motion.div>
				))}
			</>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col h-screen dark"
		>
			<div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 to-black transition-colors duration-500">
				<header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
					<h1 className="text-2xl font-bold tracking-wide">FantasyFlux</h1>
					<button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-full p-2">
						<User size={24} />
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
									className="grid grid-cols-2 gap-4 mb-8"
								>
									{suggestions.map((suggestion, index) => (
										<motion.button
											key={index}
											onClick={() => handleSuggestionClick(suggestion)}
											className="text-left bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 truncate shadow-md"
											whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
											whileTap={{ scale: 0.98 }}
										>
											<Sparkles size={18} className="inline-block mr-2 text-yellow-300" />
											{suggestion}
										</motion.button>
									))}
								</motion.div>
							)}
							{renderMessages()}
						</AnimatePresence>
						<div ref={messagesEndRef} />
					</div>
				</main>

				<footer className="bg-gray-900 bg-opacity-50 backdrop-blur-lg transition-colors duration-500 border-t border-gray-800">
					<div className="max-w-4xl mx-auto p-4">
						<div className="relative">
							<motion.textarea
								ref={inputRef}
								value={input}
								onChange={handleInputChange}
								placeholder="Ask about heroes, cards, or players..."
								className="w-full p-4 pr-16 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white transition-all duration-200 resize-none shadow-inner"
								disabled={isLoading}
								rows={1}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										handleFormSubmit(e);
									}
								}}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
								<motion.button
									type="submit"
									onClick={handleFormSubmit}
									className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg"
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