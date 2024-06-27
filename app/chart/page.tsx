"use client";
import React, { useEffect, useRef, memo, useState, useMemo } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

function TradingViewWidget() {
	const container = useRef<HTMLDivElement>(null);
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		if (!container.current) return;
		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = `
			{
				"autosize": true,
				"symbol": "GOLD",
				"timezone": "Etc/UTC",
				"interval": "30",
				"theme": "dark",
				"style": "1",
				"locale": "en",
				"range": "YTD",
				"calendar": false,
				"hideideasbutton":true,
				"support_host": "https://www.tradingview.com"
				"allow_symbol_change": false,
			}
		`;
		container.current.appendChild(script);
	}, []);

	const toggleFullScreen = () => {
		if (!container.current) return;
		if (!document.fullscreenElement) {
			container.current.requestFullscreen();
			setIsFullScreen(true);
		} else {
			document.exitFullscreen();
			setIsFullScreen(false);
		}
	};

	return (
		<div
			className="tradingview-widget-container relative"
			ref={container}
			style={{ height: "100%", width: "100%" }}>
			<button
				onClick={toggleFullScreen}
				style={{ position: "absolute", zIndex: 1, right: "70px", top: "45px" }}>
				{isFullScreen ? (
					<FullscreenExitIcon
						sx={{ fontSize: 30 }}
						style={{ opacity: "0.5" }}
					/>
				) : (
					<FullscreenIcon sx={{ fontSize: 30 }} style={{ opacity: "0.5" }} />
				)}
			</button>
			<div
				className="tradingview-widget-container__widget"
				style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
			<div className="tradingview-widget-copyright">
				<a
					href="https://www.tradingview.com/"
					rel="noopener nofollow"
					target="_blank">
					<span className="blue-text">Track all markets on TradingView</span>
				</a>
			</div>
		</div>
	);
}

export default memo(TradingViewWidget);
