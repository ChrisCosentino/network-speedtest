import React from 'react';
import { NumberTicker } from './number-ticker';

export const Gauge = ({
	value = 0,
	size = 'small',
	showValue = true,
	type = 'download',
	maxValue = 100,
}) => {
	const getColor = (type, value) => {
		switch (type) {
			case 'download':
			case 'upload':
				// Higher is better for speeds
				if (value >= 70) return 'text-[hsla(131,41%,46%,1)]'; // Green
				if (value >= 30) return 'text-[hsla(45,93%,47%,1)]'; // Yellow
				return 'text-[hsla(0,91%,43%,1)]'; // Red

			case 'latency':
			case 'jitter':
				// Lower is better for latency/jitter
				if (value <= 20) return 'text-[hsla(131,41%,46%,1)]'; // Green
				if (value <= 50) return 'text-[hsla(45,93%,47%,1)]'; // Yellow
				return 'text-[hsla(0,91%,43%,1)]'; // Red

			default:
				return 'text-[hsla(131,41%,46%,1)]';
		}
	};

	const circumference = 332;
	const cappedValue = Math.min(value, maxValue);
	const valueInCircumference = (cappedValue / maxValue) * circumference;
	const strokeDasharray = `${circumference} ${circumference}`;
	const initialOffset = circumference;
	const strokeDashoffset = initialOffset - valueInCircumference;

	const sizes = {
		small: { width: '36', height: '36', textSize: 'text-xs' },
		medium: { width: '72', height: '72', textSize: 'text-lg' },
		large: { width: '144', height: '144', textSize: 'text-3xl' },
		extraLarge: { width: '220', height: '220', textSize: 'text-3xl' },
	};

	return (
		<div className='flex flex-col items-center justify-center relative'>
			<svg
				fill='none'
				shapeRendering='crispEdges'
				height={sizes[size].height}
				width={sizes[size].width}
				viewBox='0 0 120 120'
				strokeWidth='2'
				className='transform -rotate-90'>
				<circle
					className='text-[#333]'
					strokeWidth='12'
					stroke='currentColor'
					fill='transparent'
					shapeRendering='geometricPrecision'
					r='53'
					cx='60'
					cy='60'
				/>
				<circle
					className={`animate-gauge_fill ${getColor(
						type,
						(value / maxValue) * 100
					)}`}
					strokeWidth='12'
					strokeDasharray={strokeDasharray}
					strokeDashoffset={initialOffset}
					shapeRendering='geometricPrecision'
					strokeLinecap='round'
					stroke='currentColor'
					fill='transparent'
					r='53'
					cx='60'
					cy='60'
					style={{
						strokeDashoffset: strokeDashoffset,
						transition: 'stroke-dasharray 1s ease 0s,stroke 1s ease 0s',
					}}
				/>
			</svg>
			{showValue && (
				<div className='absolute flex opacity-0 animate-gauge_fadeIn'>
					<p className={sizes[size].textSize}>
						<NumberTicker value={value || 0} />
					</p>
				</div>
			)}
		</div>
	);
};
