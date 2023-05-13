import {useStdout} from 'ink';
import {useEffect, useState} from 'react';

import logger from '@/libraries/logger.js';

const COMPONENT_NAME = 'useDimension';
function log() {
	return logger().child({component: COMPONENT_NAME});
}

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
		const handler = () => {
			const dim = {
				width: stdout.columns,
				height: stdout.rows,
			};
			setDimension(dim);
			log().info({dimension: dim}, 'resized');
		};

		stdout.on('resize', handler);
		return () => {
			stdout.off('resize', handler);
		};
	}, [stdout]);

	return dimension;
}

export default useDimension;
