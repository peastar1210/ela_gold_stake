import React, { useEffect } from "react";
import Layout from "@/components/shared/klinechartlayout";
import { KLineChartPro, DefaultDatafeed } from "@klinecharts/pro";
import "@klinecharts/pro/dist/klinecharts-pro.css";
import * as kline from "@klinecharts/pro";

const KlineChart = (props: any) => {
	let chart;
	let containerElement;
	useEffect(() => {
		containerElement = document.getElementById("real-time-k-line");
		if (containerElement) {
			containerElement.innerHTML = "";
			chart = new kline.KLineChartPro({
				container: containerElement as HTMLElement,
				symbol: {
					exchange: "XNYS",
					market: "stocks",
					name: "Alibaba Group Holding Limited American Depositary Shares, each represents eight Ordinary Shares",
					shortName: "BABA",
					ticker: "BABA",
					priceCurrency: "usd",
					type: "ADRC",
				},
				period: { multiplier: 15, timespan: "minute", text: "15m" },
				datafeed: new kline.DefaultDatafeed(`IR3qS2VjZ7kIDgnlqKxSmCRHqyBaMh9q`),
			});
		} else {
			console.error(
				"Element with ID 'real-time-k-line' not found in the document."
			);
		}
	}, []);

	return (
		<>
			<Layout>
				<div
					id="real-time-k-line"
					className={`w-[${props.width}px] h-[350px] flex touch-auto`}></div>
			</Layout>
		</>
	);
};

export default KlineChart;
