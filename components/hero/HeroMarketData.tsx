import React from 'react';
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCoins, FaFireAlt, FaChartLine } from 'react-icons/fa';

interface PriceData {
	rarity: string;
	price: number | null;
}

interface CardSupply {
	rarity: string;
	amount: number;
	burnt: number;
	total: number;
}

interface MarketData {
	hero_id: string;
	name: string;
	floor_prices: PriceData[];
	highest_bids: PriceData[];
	card_supplies: CardSupply[];
	volume: number;
	last_sale: number;
}

interface HeroMarketDataProps {
	data: MarketData;
}

const formatPrice = (price: number | null): string => {
	if (price === null) return 'N/A';
	return `${(price / 1e18).toFixed(4)} ETH`;
};

const PriceTable: React.FC<{ data: PriceData[], title: string }> = ({ data, title }) => (
	<div className="mb-4">
		<h5 className="font-semibold mb-2 text-gray-300">{title}</h5>
		<table className="w-full text-sm">
			<thead>
				<tr>
					<th className="text-left text-gray-400">Rarity</th>
					<th className="text-right text-gray-400">Price</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item) => (
					<tr key={item.rarity}>
						<td className="text-gray-300">{item.rarity}</td>
						<td className="text-right text-gray-300">{formatPrice(item.price)}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

const CardSupplyTable: React.FC<{ data: CardSupply[] }> = ({ data }) => (
	<div className="mb-4">
		<h5 className="font-semibold mb-2 text-gray-300">Card Supply</h5>
		<table className="w-full text-sm">
			<thead>
				<tr>
					<th className="text-left text-gray-400">Rarity</th>
					<th className="text-right text-gray-400">Amount</th>
					<th className="text-right text-gray-400">Burnt</th>
					<th className="text-right text-gray-400">Total</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item) => (
					<tr key={item.rarity}>
						<td className="text-gray-300">{item.rarity}</td>
						<td className="text-right text-gray-300">{item.amount}</td>
						<td className="text-right text-gray-300">{item.burnt}</td>
						<td className="text-right text-gray-300">{item.total}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export const HeroMarketData: React.FC<HeroMarketDataProps> = ({ data }) => (
	<motion.div
		className="hero-market-data bg-transparent rounded-lg shadow-lg p-6"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<h4 className="text-2xl font-bold mb-4 flex items-center text-gray-100">
			<FaExchangeAlt className="mr-2" /> Market Data for {data.name}
		</h4>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<PriceTable data={data.floor_prices} title="Floor Prices" />
				<PriceTable data={data.highest_bids} title="Highest Bids" />
			</div>
			<div>
				<CardSupplyTable data={data.card_supplies} />
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h5 className="font-semibold mb-2 flex items-center text-gray-300">
							<FaCoins className="mr-2" /> Volume
						</h5>
						<p className="text-gray-300">{formatPrice(data.volume)}</p>
					</div>
					<div>
						<h5 className="font-semibold mb-2 flex items-center text-gray-300">
							<FaFireAlt className="mr-2" /> Last Sale
						</h5>
						<p className="text-gray-300">{formatPrice(data.last_sale)}</p>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
);