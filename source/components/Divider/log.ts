import logger from '@/libraries/logger.js';

import {COMPONENT_NAME} from './constants.js';

function log() {
	return logger().child({component: COMPONENT_NAME});
}

export default log;
