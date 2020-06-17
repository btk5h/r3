import React, { useEffect } from "react";
import { ChartStoreHook } from "stores/chart";
import { encodeChart } from "utils/chartEncoding";

type ChartStateObserverProps = {
  useChartStore: ChartStoreHook;
};

const ChartStateObserver: React.FC<ChartStateObserverProps> = (props) => {
  const { useChartStore } = props;
  const chartState = useChartStore((state) => encodeChart(state));

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `?c=${encodeURIComponent(chartState)}`
    );
  }, [chartState]);

  return null;
};

export default ChartStateObserver;
