import React from 'react';
import {Text} from 'ink';

type Props = {
	mark: string;
	markColor: string;
};
function Mark({mark, markColor}: Props) {
	return <Text color={markColor}>{mark}</Text>;
}

export default Mark;
