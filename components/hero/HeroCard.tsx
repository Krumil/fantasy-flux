import React from 'react';
import Image from 'next/image';

interface CardProps {
	id: string;
	owner: string;
	hero_id: string;
	rarity: number;
	token_id: string;
	season: number;
	picture: string;
}

const rarityColors = {
	1: 'bg-gray-200',
	2: 'bg-green-200',
	3: 'bg-blue-200',
	4: 'bg-purple-200',
	5: 'bg-yellow-200',
};

export const HeroCard: React.FC<CardProps> = ({ id, owner, hero_id, rarity, token_id, season, picture }) => {
	return (
		<div className={`rounded-lg overflow-hidden shadow-lg ${rarityColors[rarity as keyof typeof rarityColors]} p-4 m-2`}>
			<div className="relative w-full h-48">
				<Image src={picture} alt={`Card ${token_id}`} layout="fill" objectFit="contain" />
			</div>
			<div className="p-4">
				<h3 className="font-bold text-xl mb-2">Card #{token_id}</h3>
				<p className="text-gray-700 text-base">
					<strong>Hero ID:</strong> {hero_id}<br />
					<strong>Rarity:</strong> {rarity}<br />
					<strong>Season:</strong> {season}<br />
					<strong>Owner:</strong> {owner.slice(0, 6)}...{owner.slice(-4)}
				</p>
			</div>
		</div>
	);
};