import {useStdin} from 'ink';
import keypress from 'keypress';
import {useEffect} from 'react';

export type Key = {
	name: string;
	ctrl: boolean;
	meta: boolean;
	shift: boolean;
	sequence: string;
};
type Handler = (input: string, key: Key | undefined) => void;

type Options = {
	isActive?: boolean;
};

function useKeypress(inputHandler: Handler, options: Options = {}) {
	const {stdin, setRawMode, internal_exitOnCtrlC} = useStdin();

	useEffect(() => {
		if (options.isActive === false) {
			return;
		}
		keypress(stdin);
		setRawMode(true);
		return () => {
			setRawMode(false);
		};
	}, [options.isActive, stdin, setRawMode]);

	useEffect(() => {
		if (options.isActive === false) {
			return;
		}

		const handleData = (input: string, key: Key | undefined) => {
			if (!(key && key.ctrl && key.name === 'c') || !internal_exitOnCtrlC) {
				inputHandler(input, key);
			}
		};

		stdin?.on('keypress', handleData);
		return () => {
			stdin?.off('keypress', handleData);
		};
	}, [options.isActive, stdin, internal_exitOnCtrlC, inputHandler]);
}

export default useKeypress;
