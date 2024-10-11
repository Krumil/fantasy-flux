import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HeroCard } from './HeroCard';
import { HeroInfo } from './HeroInfo';
import { HeroMarketData } from './HeroMarketData';
import { HeroPerformanceChart } from './HeroPerformanceChart';
import { HeroTournamentScores } from './HeroTournamentScores';
import { StarSwingsPrediction } from './StarSwingsPrediction';

interface Hero {
	id: string;
	name: string;
	handle: string;
	stars: number;
	current_score: number;
	followers_count: number;
	current_rank: number;
	fantasy_score: number;
	change_1_day: number;
	change_7_days: number;
	return_ratio: number;
}

interface HeroDashboardProps {
	heroId?: string;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({ heroId }) => {
	const [heroes, setHeroes] = useState<Hero[]>([]);
	const [topHeroes, setTopHeroes] = useState<Hero[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchHeroes();
		fetchTopHeroes();
	}, []);

	const fetchHeroes = async () => {
		try {
			const response = await fetch('/api/heroes');
			const data = await response.json();
			setHeroes(data.heroes.heroes);
			setIsLoading(false);
		} catch (error) {
			setError('Failed to fetch heroes');
			setIsLoading(false);
		}
	};

	const fetchTopHeroes = async () => {
		try {
			const response = await fetch('/api/heroes/best-return');
			const data = await response.json();
			setTopHeroes(data);
		} catch (error) {
			console.error('Failed to fetch top heroes', error);
		}
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const filteredHeroes = heroes.filter(hero =>
		hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		hero.handle.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading) {
		return (
			<motion.div
				className="loading"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				Loading...
			</motion.div>
		);
	}

	if (error) {
		return <div className="error">{error}</div>;
	}

	return (
		<div className="hero-dashboard p-6 space-y-6">
			<h1 className="text-3xl font-bold mb-6">Hero Dashboard</h1>

			<Card>
				<CardHeader>
					<CardTitle>Top Performing Heroes</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Handle</TableHead>
								<TableHead>Stars</TableHead>
								<TableHead>Return Ratio</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topHeroes.map((hero) => (
								<TableRow key={hero.id}>
									<TableCell>{hero.name}</TableCell>
									<TableCell>{hero.handle}</TableCell>
									<TableCell>{hero.stars}</TableCell>
									<TableCell>{hero.return_ratio.toFixed(2)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>All Heroes</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						type="text"
						placeholder="Search heroes..."
						value={searchTerm}
						onChange={handleSearch}
						className="mb-4"
					/>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Handle</TableHead>
								<TableHead>Current Score</TableHead>
								<TableHead>Rank</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredHeroes.map((hero) => (
								<TableRow key={hero.id}>
									<TableCell>{hero.name}</TableCell>
									<TableCell>{hero.handle}</TableCell>
									<TableCell>{hero.current_score}</TableCell>
									<TableCell>{hero.current_rank}</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<Button onClick={() => setSelectedHero(hero)}>View Details</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>{hero.name} Details</DialogTitle>
												</DialogHeader>
												<div className="grid gap-4 py-4">
													{selectedHero && (
														<>
															<HeroCard
																id={selectedHero.id}
																owner={selectedHero.handle}
																hero_id={selectedHero.id}
																rarity={1}
																token_id={selectedHero.id}
																season={1}
																picture={`/hero-images/${selectedHero.id}.png`}
															/>
															<HeroInfo hero={{
																name: selectedHero.name,
																handle: selectedHero.handle,
																followers_count: selectedHero.followers_count,
																stars: selectedHero.stars,
																status: 'Active'
															}} />
															{/* Add other components here as needed */}
														</>
													)}
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};