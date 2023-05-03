import {useStdout} from 'ink';
import {useEffect, useState} from 'react';

type Dimension = {
	width: number;
	height: number;
};

function useDimension() {
	const {stdout} = useStdout();
	const [dimension, setDimension] = useState<Dimension>({
		width: stdout.columns,
		height: stdout.rows,
	});

	useEffect(() => {
		const handler = () =>
			setDimension({
				width: stdout.columns,
				height: stdout.rows,
			});
		stdout.on('resize', handler);
		return () => {
			stdout.off('resize', handler);
		};
	}, [stdout]);

	return dimension;
}

export default useDimension;
