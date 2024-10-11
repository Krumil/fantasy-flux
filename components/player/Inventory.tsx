import React from 'react';
import { HeroCard } from '@/components/hero/HeroCard';

interface Card {
	id: string;
	owner: string;
	hero_id: string;
	rarity: number;
	hero_rarity_index: string;
	token_id: string;
	season: number;
	created_at: string;
	updated_at: string;
	tx_hash: string;
	blocknumber: number;
	timestamp: string;
	picture: string;
}

interface InventoryProps {
	cards: Card[];
}

export const Inventory: React.FC<InventoryProps> = ({ cards }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{cards.map((card) => (
				<HeroCard
					key={card.id}
					id={card.id}
					owner={card.owner}
					hero_id={card.hero_id}
					rarity={card.rarity}
					token_id={card.token_id}
					season={card.season}
					picture={card.picture}
				/>
			))}
		</div>
	);
};