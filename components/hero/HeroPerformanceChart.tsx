import React from 'react';
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine } from 'react-icons/fa';

interface PerformanceData {
	date: string;
	score: number;
}

interface HeroPerformanceChartProps {
	data: PerformanceData[];
}

export const HeroPerformanceChart: React.FC<HeroPerformanceChartProps> = ({ data }) => (
	<motion.div
		className="bg-white rounded-lg shadow-lg p-4"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<h4 className="text-xl font-bold mb-4 flex items-center">
			<FaChartLine className="mr-2" /> Performance Chart
		</h4>
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
			</LineChart>
		</ResponsiveContainer>
	</motion.div>
);