"use client";
import React, { useEffect, useRef } from "react";
import Layout from "@/components/shared/klinechartlayout";
import { init, dispose, Chart, CandleType, LineType } from "klinecharts";
import { KLineChartPro, DefaultDatafeed } from '@klinecharts/pro'
import '@klinecharts/pro/dist/klinecharts-pro.css'



const KlineChart = (props: any) => {
  const handleTouchStart = (event:any) => {
    event.stopPropagation(); // Stop the touch event from propagating to other elements
    // Your touch start logic here
  };
  const chart = useRef<Chart | null>();
  useEffect(() => {
    chart.current = init("real-time-k-line", {
      styles: { grid: { horizontal: { style: LineType.Dashed } } },
    });
    chart.current?.applyNewData(props.data);
    chart.current?.resize();
    chart.current &&
      chart.current.setStyles({
        candle: {
          type: "candle_solid" as CandleType,
        },
      });
    // chart.current?.zoomAtTimestamp(100,10000000000000,5000000000000);
    return () => {
      dispose("real-time-k-line");
    };
  }, [props.data]);
  return (
    <>
      <Layout>
        <div
          id="real-time-k-line"
          className={`w-[${props.width}px] h-[350px] flex touch-auto`}
          onTouchStart={handleTouchStart}
        />
      </Layout>
    </>
  );
};
export default KlineChart;
