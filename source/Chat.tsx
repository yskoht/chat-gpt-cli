import React, {useState, useCallback} from 'react';
import MultiLineTextInput from './MultiLineTextInput.js';

function Chat() {
	const [text, setText] = useState('');
	const onSubmit = useCallback(() => setText(''), []);

	return (
		<MultiLineTextInput value={text} onChange={setText} onSubmit={onSubmit} />
	);
}

export default Chat;
