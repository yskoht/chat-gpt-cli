#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import React from 'react';

import {initializeLogger} from '@/libraries/logger.js';

import App from './app.js';

const cli = meow(
	`
	Usage
	  $ cgc

	Options
		--debug  Output debug log
`,
	{
		importMeta: import.meta,
		flags: {
			debug: {
				type: 'boolean',
				default: false,
			},
		},
	},
);

initializeLogger(cli.flags.debug);

render(<App />);
