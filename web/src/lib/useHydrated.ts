import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during server rendering and hydration, true afterwards, so client-only values never cause a mismatch. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
