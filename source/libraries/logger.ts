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

export function createLogger() {
	const _logFilePath = logFilePath();
	const logger = bunyan.createLogger({
		name: 'chat-gpt-cli',
		streams: [
			{
				path: _logFilePath,
			},
		],
	});
	return logger;
}
