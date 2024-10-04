'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpIcon, ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { Skeleton } from "@/components/ui/skeleton";

interface Player {
	name: string;
	current_rank: number;
	fantasy_score: number;
	current_stars: number;
	predicted_stars: number;
	star_change: number;
	performance_change: number;
	recovery_potential: number;
	median_7_days: number;
	median_14_days: number;
	change_1_day: number;
	change_7_days: number;
}

interface ApiResponse {
	potential_losers: Player[];
	potential_gainers: Player[];
}

type SortKey = keyof Player;

export default function StarSwingsPage() {
	const [data, setData] = useState<ApiResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortKey, setSortKey] = useState<SortKey>('current_rank');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	useEffect(() => {
		fetch('/api/predictions')
			.then(response => response.json())
			.then((data: ApiResponse) => {
				setData(data);
				setIsLoading(false);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				setError('Failed to fetch data. Please try again later.');
				setIsLoading(false);
			});
	}, []);

	const handleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortKey(key);
			setSortOrder('asc');
		}
	};

	const sortedPlayers = (players: Player[]) => {
		return [...players].sort((a, b) => {
			if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
			if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});
	};

	const renderTable = (players: Player[]) => (
		<div className="overflow-x-auto rounded-lg shadow-lg">
			<Table className="w-full">
				<TableHeader>
					<TableRow className="bg-gray-800 text-gray-100">
						{Object.keys(players[0]).map((key) => (
							<TableHead
								key={key}
								className="cursor-pointer hover:bg-gray-700 transition-colors duration-200"
								onClick={() => handleSort(key as SortKey)}
							>
								<div className="flex items-center justify-between">
									<span>{key.replace(/_/g, ' ').toUpperCase()}</span>
									<CaretSortIcon className="ml-1" />
								</div>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedPlayers(players).map((player, index) => (
						<TableRow
							key={index}
							className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
						>
							{Object.entries(player).map(([key, value]) => (
								<TableCell key={key} className="py-3 text-gray-300">
									{key === 'star_change' ? (
										<span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
											{value > 0 ? <ArrowUpIcon className="inline mr-1" /> : <ArrowDownIcon className="inline mr-1" />}
											{Math.abs(value)}
										</span>
									) : typeof value === 'number' ? (
										value.toFixed(2)
									) : (
										value
									)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);

	const renderSkeleton = () => (
		<div className="space-y-4">
			{[...Array(5)].map((_, i) => (
				<Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-700" />
			))}
		</div>
	);

	return (
		<div className="container mx-auto p-8 bg-gray-950 min-h-screen">
			<Card className="bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-800">
				<CardHeader className="bg-gradient-to-r from-purple-900 to-indigo-900 text-gray-100 p-8">
					<CardTitle className="text-4xl font-extrabold text-center">Star Swings Prediction</CardTitle>
				</CardHeader>
				<CardContent className="px-8 py-4">
					<Tabs defaultValue="potential_losers" className="space-y-8">
						<TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent rounded-lg">
							<TabsTrigger
								value="potential_losers"
								className="py-3 px-6 rounded-md text-lg font-semibold transition-all duration-200 text-gray-300 hover:bg-purple-900 hover:text-gray-100 data-[state=active]:bg-purple-900 data-[state=active]:text-gray-100"
							>
								Potential Losers
							</TabsTrigger>
							<TabsTrigger
								value="potential_gainers"
								className="py-3 px-6 rounded-md text-lg font-semibold transition-all duration-200 text-gray-300 hover:bg-indigo-900 hover:text-gray-100 data-[state=active]:bg-indigo-900 data-[state=active]:text-gray-100"
							>
								Potential Gainers
							</TabsTrigger>
						</TabsList>
						{isLoading ? (
							renderSkeleton()
						) : error ? (
							<div className="text-center mt-8 text-red-400 text-xl">{error}</div>
						) : !data ? (
							<div className="text-center mt-8 text-gray-300 text-xl">No data available</div>
						) : (
							<>
								<TabsContent value="potential_losers">
									{renderTable(data.potential_losers)}
								</TabsContent>
								<TabsContent value="potential_gainers">
									{renderTable(data.potential_gainers)}
								</TabsContent>
							</>
						)}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}