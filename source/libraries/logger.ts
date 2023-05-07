import bunyan from 'bunyan';

const LOG_FILE_PATH = '.';
const LOG_FILE_PREFIX = 'chat-gpt-cli';
const EXT = 'log';

function timestamp() {
	const date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');

	return `${year}${month}${day}-${hour}${minute}${second}`;
}

function logFileName() {
	const _timestamp = timestamp();
	return `${LOG_FILE_PREFIX}-${_timestamp}.${EXT}`;
}

function logFilePath() {
	const _logFileName = logFileName();
	return `${LOG_FILE_PATH}/${_logFileName}`;
}

let _logger: bunyan | null = null;

export function initializeLogger(debug: boolean) {
	const _logFilePath = logFilePath();

	const stream = debug
		? {path: _logFilePath, level: 'debug' as const}
		: {stream: process.stderr, level: 99};

	_logger = bunyan.createLogger({
		name: 'chat-gpt-cli',
		streams: [stream],
	});
}

function logger() {
	if (!_logger) {
		throw new Error('Logger is not initialized');
	}

	return _logger;
}

export default logger;
