"use client";
import React, { useEffect, useRef } from "react";
import Layout from "@/components/shared/klinechartlayout";
import { init, dispose, Chart, CandleType, LineType } from "klinecharts";
import generatedDataList from "../generatedDataList";
const KlineChart = (props: any) => {
  
  const chart = useRef<Chart | null>();
  const disableMove = (event:any) => {
    event.preventDefault(); // Prevent default behavior of touch move
  };
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
          className={`w-[${props.width}px] h-[350px] flex`}
        />
      </Layout>
    </>
  );
};
export default KlineChart;
