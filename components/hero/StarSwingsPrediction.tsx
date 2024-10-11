import React from 'react';
import { motion } from "framer-motion";
import { FaStar } from 'react-icons/fa';

interface StarSwingPrediction {
	hero: string;
	swing: number;
}

interface StarSwingsPredictionProps {
	predictions: StarSwingPrediction[];
}

export const StarSwingsPrediction: React.FC<StarSwingsPredictionProps> = ({ predictions }) => (
	<motion.div
		className="star-swings-prediction bg-white rounded-lg shadow-lg p-4"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<h4 className="text-xl font-bold mb-4 flex items-center">
			<FaStar className="mr-2" /> Predicted Star Swings
		</h4>
		<ul className="space-y-2">
			{predictions.map((pred, index) => (
				<li key={index} className="flex justify-between items-center bg-gray-100 rounded p-2">
					<span className="font-medium">{pred.hero}</span>
					<span className={`font-semibold ${pred.swing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
						{pred.swing >= 0 ? '+' : ''}{pred.swing}
					</span>
				</li>
			))}
		</ul>
	</motion.div>
);