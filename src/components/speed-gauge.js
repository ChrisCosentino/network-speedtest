import { Gauge } from './ui/gauge';

export function SpeedGauge({ value = 0, label = '' }) {
	return (
		<div className='flex flex-col justify-center items-center'>
			<Gauge value={value} size='extraLarge' showValue={true} />
			<div className='text-lg'>{label}</div>
		</div>
	);
}
