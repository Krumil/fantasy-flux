import React from 'react';
import { motion } from "framer-motion";
import { FaUserCircle, FaHeart, FaStar, FaUser } from 'react-icons/fa';

interface Hero {
	name: string;
	handle: string;
	followers_count: number;
	stars: number;
	status: string;
}

interface HeroInfoProps {
	hero: Hero;
}

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: number | string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
	<motion.div
		className="flex flex-col items-center bg-white bg-opacity-10 rounded-lg p-3"
		whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
		whileTap={{ scale: 0.95 }}
	>
		<div className="text-3xl mb-2">{icon}</div>
		<div className="text-sm opacity-80">{label}</div>
		<div className="font-semibold">{value}</div>
	</motion.div>
);

export const HeroInfo: React.FC<HeroInfoProps> = ({ hero }) => (
	<motion.div
		className="hero-info bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg p-6 shadow-lg text-white"
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.5 }}
	>
		<motion.h3
			className="text-2xl font-bold mb-4 flex items-center"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2, duration: 0.5 }}
		>
			<FaUserCircle className="mr-2" /> {hero.name} <span className="text-lg font-normal ml-2">(@{hero.handle})</span>
		</motion.h3>
		<motion.div
			className="grid grid-cols-3 gap-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.4, duration: 0.5 }}
		>
			<InfoItem icon={<FaHeart />} label="Followers" value={hero.followers_count} />
			<InfoItem icon={<FaStar />} label="Stars" value={hero.stars} />
			<InfoItem icon={<FaUser />} label="Status" value={hero.status} />
		</motion.div>
	</motion.div>
);