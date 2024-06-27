"use client";
import React, { useEffect, useRef, memo, useState, useMemo } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const symbols = {
	ela: "ela",
	gold: "gold",
	glide: "glide",
	eth: "eth",
	usdc: "usdc",
	husd: "husd",
	creda: "creda",
	mtrl: "mtrl",
	busd: "busd",
};

function TradingViewWidget({ symbol }: { symbol: string }) {
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
				"interval": "30",
				"timezone": "Etc/UTC",
				"theme": "dark",
				"style": "1",
				"locale": "en",
				"calendar": false,
				"allow_symbol_change": true,
				"hideideasbutton":true,
				"support_host": "https://www.geckoterminal.com/ela/pools/0x855642be48cf34ae451e97640af1724cea95df56"
			}
			`;
		container.current.appendChild(script);

		// Cleanup function to remove script element
		return () => {
			if (container.current) {
				container.current.removeChild(script);
			}
		};
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
						sx={{ fontSize: 30, filter: "invert(1)" }}
						style={{ opacity: "0.5" }}
					/>
				) : (
					<FullscreenIcon
						sx={{ fontSize: 30, filter: "invert(1)" }}
						style={{ opacity: "0.5" }}
					/>
				)}
			</button>
			<div
				className="tradingview-widget-container__widget"
				style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
		</div>
	);
}

export default memo(TradingViewWidget);
