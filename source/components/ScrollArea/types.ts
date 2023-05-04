import {Key} from 'ink';

import {SCROLL_BAR_VISIBILITY} from './constants.js';

export type ScrollBarVisibility = keyof typeof SCROLL_BAR_VISIBILITY;
export type ScrollHandler = (input: string, key: Key) => void;
export type recalculateComponentSize = () => void;
