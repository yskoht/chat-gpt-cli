import fs from 'fs';
import {StateStorage} from 'zustand/middleware';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFileStorage<T extends Record<string, any>>(path: string) {
	let data = (() => {
		try {
			const text = fs.readFileSync(path, 'utf8');
			const data = JSON.parse(text) as T;
			return data;
		} catch (err) {
			return {} as T;
		}
	})();

	const fileStorage: StateStorage = {
		getItem: async (name: keyof T): Promise<string | null> => {
			return data[name] || null;
		},

		setItem: async (name: keyof T, value: string): Promise<void> => {
			data = {
				...data,
				[name]: value,
			};
			fs.writeFileSync(path, JSON.stringify(data));
		},

		removeItem: async (name: keyof T): Promise<void> => {
			delete data[name];
		},
	};

	return fileStorage;
}
