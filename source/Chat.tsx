import React, {useState, useCallback, useRef} from 'react';
import MultiLineTextInput from './MultiLineTextInput.js';
import {Key} from 'ink';

function Chat() {
	const [text, setText] = useState('');
	const onSubmit = useCallback(() => setText(''), []);
	const returnCount = useRef(0);

	const hittingEnterTwice = useCallback((_input: string, key: Key) => {
		if (key.return) {
			returnCount.current = (returnCount.current + 1) % 2;
			return returnCount.current === 0;
		}

		returnCount.current = 0;
		return false;
	}, []);

	return (
		<MultiLineTextInput
			value={text}
			onChange={setText}
			onSubmit={onSubmit}
			shouldSubmit={hittingEnterTwice}
		/>
	);
}

export default Chat;
