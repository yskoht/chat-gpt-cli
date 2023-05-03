#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import React from 'react';

import App from './app.js';

meow(
	`
	Usage
	  $ chat-gpt-cli

	Options
		--name  Your name

	Examples
	  $ chat-gpt-cli --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {},
	},
);

render(<App />);
