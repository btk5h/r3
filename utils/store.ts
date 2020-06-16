import { GetState, StateCreator, StoreApi } from "zustand";
import { Draft, produce } from "immer";

export type ImmerSetter<T> = (producer: (state: Draft<T>) => void) => void;

type ImmerStateCreator<T> = (
  set: ImmerSetter<T>,
  get: GetState<T>,
  api: StoreApi<T>
) => T;

export function withImmer<T>(
  stateCreator: ImmerStateCreator<T>
): StateCreator<T> {
  return (set, get, api) =>
    // @ts-ignore
    stateCreator((fn) => set(produce(fn)), get, api);
}
