import {Logger} from './logger.js';

export function createStubLogger(): Logger {
	return new Logger();
}
