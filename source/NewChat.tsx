import React from 'react';
import {Box, Text, useFocus} from 'ink';

function NewChat() {
	const {isFocused} = useFocus({autoFocus: true});
	return (
		<Box paddingLeft={1}>
			<Text color={isFocused ? 'green' : 'white'}>+ New chat</Text>
		</Box>
	);
}

export default NewChat;
