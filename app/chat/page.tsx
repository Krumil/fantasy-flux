'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Message } from '@/components/message'
import { Moon, Sun, Send } from 'lucide-react';

export default function ChatPage() {
	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
		api: '/api/chat',
	});

	const [darkMode, setDarkMode] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [messages]);

	useEffect(() => {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		setDarkMode(isDarkMode);
		document.documentElement.classList.toggle('dark', isDarkMode);
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem('darkMode', newDarkMode.toString());
		document.documentElement.classList.toggle('dark', newDarkMode);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmit(e);
		inputRef.current?.focus();
	};

	return (
		<div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
			<div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-200">
				<header className="bg-blue-600 dark:bg-blue-800 text-white p-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold">Fantasy Game Assistant</h1>
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
						aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					>
						{darkMode ? <Sun size={24} /> : <Moon size={24} />}
					</button>
				</header>

				<main className="flex-1 overflow-auto p-4">
					<div className="max-w-3xl mx-auto space-y-4">
						{messages.map((message, index) => (
							<Message
								key={index}
								role={message.role as 'user' | 'assistant'}
								content={message.content}
								toolInvocations={message.toolInvocations}
							/>
						))}
						<div ref={messagesEndRef} />
					</div>
				</main>

				<footer className="p-4 border-t border-gray-200 dark:border-gray-700">
					<form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={handleInputChange}
							placeholder="Ask about heroes, cards, or players..."
							className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-gray-600 transition-colors duration-200"
							disabled={isLoading}
						/>
						<button
							type="submit"
							className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400 transition-colors duration-200"
							disabled={isLoading}
							aria-label="Send message"
						>
							<Send size={24} />
						</button>
					</form>
				</footer>
			</div>
		</div>
	);
}