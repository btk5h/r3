import React, { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ChartStoreHook } from "stores/chart";
import { encodeChart } from "utils/chartEncoding";

type ChartStateObserverProps = {
  useChartStore: ChartStoreHook;
};

const ChartStateObserver: React.FC<ChartStateObserverProps> = (props) => {
  const { useChartStore } = props;
  const chartState = useChartStore((state) => encodeChart(state));
  const [debouncedChartState] = useDebounce(chartState, 1000);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `?c=${encodeURIComponent(debouncedChartState)}`
    );
  }, [debouncedChartState]);

  return null;
};

export default ChartStateObserver;
