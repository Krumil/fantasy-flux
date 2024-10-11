'use client';

import { HeroDashboard } from '@/components/hero/HeroDashboard';

export default function HomePage() {
	return (
		<div className="container mx-auto p-8 bg-gray-950 min-h-screen">
			<HeroDashboard />
		</div>
	);
}