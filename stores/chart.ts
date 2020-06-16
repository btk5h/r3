import create, { StoreApi, UseStore } from "zustand";
import { withImmer } from "utils/store";
import { Draft } from "immer";

export type DataPoint = {
  name: string;
  position: [number, number, number];
};

export type ChartStoreState = {
  axisLabels: {
    xPlus: string;
    xMinus: string;
    yPlus: string;
    yMinus: string;
    zPlus: string;
    zMinus: string;
  };
  points: DataPoint[];
};

type ChartStoreReducers = {
  set: (producer: (state: Draft<ChartStoreType>) => void) => void;
  createPoint: () => void;
  deletePoint: (i: number) => void;
};

type ChartStoreType = ChartStoreState & ChartStoreReducers;
type ChartStoreInstance = [UseStore<ChartStoreType>, StoreApi<ChartStoreType>];
export type ChartStoreHook = ChartStoreInstance[0];
export type ChartStoreAPI = ChartStoreInstance[1];

const defaultState: ChartStoreState = {
  axisLabels: {
    xPlus: "",
    xMinus: "",
    yPlus: "",
    yMinus: "",
    zPlus: "",
    zMinus: "",
  },
  points: [{ name: "", position: [0, 0, 0] }],
};

function createChartStore(
  initialState?: Partial<ChartStoreState>
): ChartStoreInstance {
  return create(
    withImmer((set) => ({
      ...defaultState,
      ...initialState,
      set,
      createPoint: () => {
        set((state) => {
          state.points.push({ name: "", position: [0, 0, 0] });
        });
      },
      deletePoint: (i) => {
        set((state) => {
          state.points.splice(i, 1);
        });
      },
    }))
  );
}

let storeInstance: ChartStoreInstance;

export function getChartStore(
  initialState?: Partial<ChartStoreState>
): ChartStoreInstance {
  if (!process.browser) {
    return createChartStore(initialState);
  }

  if (!storeInstance) {
    storeInstance = createChartStore(initialState);
  }

  return storeInstance;
}
