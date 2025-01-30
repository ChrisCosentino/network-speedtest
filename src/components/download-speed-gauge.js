import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DownloadSpeedGauge = ({ downloadSpeed }) => {
	const maxSpeed = 100; // Maximum speed in Mbps
	const speedMbps = Math.min(downloadSpeed / 1000000, maxSpeed);

	const data = [
		{ name: 'Speed', value: speedMbps },
		{ name: 'Remaining', value: maxSpeed - speedMbps },
	];

	const COLORS = ['#00C49F', '#ECEFF1'];
	const percentage = Math.round((speedMbps / maxSpeed) * 100);

	// Calculate the angle for the arrow
	const angle = 180 * (speedMbps / maxSpeed);

	return (
		<div className='w-full max-w-xs mx-auto relative'>
			<ResponsiveContainer width='100%' height={200}>
				<PieChart>
					<Pie
						data={data}
						cx='50%'
						cy='100%'
						startAngle={180}
						endAngle={0}
						innerRadius={60}
						outerRadius={80}
						paddingAngle={5}
						dataKey='value'>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
			{/* Arrow */}
			<div
				className='absolute bottom-0 left-1/2 w-1 h-16 bg-red-500 origin-bottom transform -translate-x-1/2'
				style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
			/>
			<div className='text-center mt-4'>
				<span className='text-3xl font-bold'>{speedMbps.toFixed(2)}</span>
				<span className='text-xl ml-1'>Mbps</span>
			</div>
			<div className='text-center text-gray-500'>
				Download Speed: {percentage}%
			</div>
		</div>
	);
};

export default DownloadSpeedGauge;
