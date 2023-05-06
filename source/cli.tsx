#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import React from 'react';

import Logger from '@/components/Logger/Logger.js';

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

render(
	<Logger debug={cli.flags.debug}>
		<App />
	</Logger>,
);
