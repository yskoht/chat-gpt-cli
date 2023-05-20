import fs from 'fs';
import os from 'os';

const HOME_DIR = os.homedir();
const CONFIG_PATH = `${HOME_DIR}/.config/chat-gpt-cli`;

try {
	fs.mkdirSync(CONFIG_PATH, {recursive: true});
} catch (err) {
	console.error('Failed to create config directory');
	process.exit(1);
}

export function configPath(filename: string): string {
	return `${CONFIG_PATH}/${filename}`;
}
