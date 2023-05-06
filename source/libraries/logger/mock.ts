/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-empty-function */
import {EventEmitter} from 'events';

export class Logger extends EventEmitter {
	child() {
		return new Logger();
	}

	// memo: Do not use these methods
	/*
	addStream() {}
	addSerializers() {}
	reopenFileStreams() {}

	level() {
		return 0;
	}
	levels(): number[];
	levels(name: number | string): number;
	levels(name: number | string, value: bunyan.LogLevel): void;
	levels(
		n: number | string | undefined = undefined,
		v: bunyan.LogLevel | undefined = undefined,
	) {
		if (n === undefined) return 0 as number;
		if (v === undefined) return [] as number[];
		return;
	}
	fields = null;
	src = false;
	*/

	trace(..._a: any[]) {
		return false;
	}
	debug(..._a: any) {
		return false;
	}
	info(..._a: any) {
		return false;
	}
	warn(..._a: any) {
		return false;
	}
	error(..._a: any) {
		return false;
	}
	fatal(..._a: any) {
		return false;
	}
}

export function createMockLogger(): Logger {
	return new Logger();
}
