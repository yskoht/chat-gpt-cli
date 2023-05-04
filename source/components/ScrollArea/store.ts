import {createStore, StoreApi} from 'zustand/vanilla';

type StoreCore = {
	outerHeight: number;
	innerHeight: number;
	positionFromInnerTop: number;
	setOuterHeight: (height: number) => void;
	setInnerHeight: (height: number) => void;
	scrollDown: (n?: number) => void;
	scrollUp: (n?: number) => void;
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
			const positionFromInnerTopMax = Math.max(innerHeight - outerHeight, 0);
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
}));

export default store;
