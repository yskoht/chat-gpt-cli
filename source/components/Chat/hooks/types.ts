import {ROLE} from './constants.js';

type Role = keyof typeof ROLE;

export type Message = {
	role: Role;
	content: string;
};

export type Response = {
	id?: string;
	object?: string;
	created?: number;
	model?: string;
	choices: [
		{
			delta?: {
				content?: string;
			};
			index?: number;
			finish_reason?: string | null;
		},
	];
};
