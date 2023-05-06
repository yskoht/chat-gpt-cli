import {createStore, StoreApi} from 'zustand/vanilla';

import {nop} from '@/utilities/index.js';

import {FetchSize} from './types.js';

function calcPositionFromInnerTopMax(innerHeight: number, outerHeight: number) {
	return Math.max(innerHeight - outerHeight, 0);
}

type StoreCore = {
	outerHeight: number;
	innerHeight: number;
	positionFromInnerTop: number;
	setOuterHeight: (height: number) => void;
	setInnerHeight: (height: number) => void;
	scrollDown: (n?: number) => void;
	scrollUp: (n?: number) => void;
	scrollToTop: () => void;
	scrollToBottom: () => void;
	resize: () => void;
	fetchInnerHeight: () => void;
	fetchOuterHeight: () => void;
	setFetchInnerHeight: (fetchInnerHeight: FetchSize) => void;
	setFetchOuterHeight: (fetchOuterHeight: FetchSize) => void;
};
export type Store = StoreApi<StoreCore>;

const store = createStore<StoreCore>((set) => ({
	outerHeight: 0,
	innerHeight: 0,
	positionFromInnerTop: 0,
	setOuterHeight: (outerHeight) => set({outerHeight}),
	setInnerHeight: (innerHeight) => set({innerHeight}),
	scrollDown: (n = 1) =>
		set(({innerHeight, outerHeight, positionFromInnerTop}) => {
			const positionFromInnerTopMax = calcPositionFromInnerTopMax(
				innerHeight,
				outerHeight,
			);
			const nextPosition = Math.min(
				positionFromInnerTop + n,
				positionFromInnerTopMax,
			);
			return {
				positionFromInnerTop: nextPosition,
			};
		}),
	scrollUp: (n = 1) =>
		set(({positionFromInnerTop}) => {
			const nextPosition = Math.max(positionFromInnerTop - n, 0);
			return {
				positionFromInnerTop: nextPosition,
			};
		}),
	scrollToTop: () => set({positionFromInnerTop: 0}),
	scrollToBottom: () =>
		set(({innerHeight, outerHeight}) => {
			const positionFromInnerTopMax = calcPositionFromInnerTopMax(
				innerHeight,
				outerHeight,
			);
			return {positionFromInnerTop: positionFromInnerTopMax};
		}),
	resize: () =>
		set(({fetchInnerHeight, fetchOuterHeight}) => {
			fetchInnerHeight();
			fetchOuterHeight();
			return {};
		}),
	fetchInnerHeight: nop,
	fetchOuterHeight: nop,
	setFetchInnerHeight: (fetchInnerHeight) => set({fetchInnerHeight}),
	setFetchOuterHeight: (fetchOuterHeight) => set({fetchOuterHeight}),
}));

export default store;
