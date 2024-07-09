"use client";
import React, { useEffect, useRef, memo, useState, useMemo } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// const symbols: any = {
// 	ELA: "6077b7990d3d0dfb5a50f1d207f67ac5955b999d",
// 	GOLD: "c9d4ab43d81466f336d37b9e10ace1c9ae994bcc",
// 	GLIDE: "beeaab15628329c2c89bc9f403d34b31fbcb3085",
// 	ETH: "a86883c2405f4557d2242df47b220c54d0d611e4",
// 	USDC: "6077b7990d3d0dfB5A50f1D207f67ac5955B999d",
// 	HUSD: "B0917F2595A2c4C56498f6da2C52690a3EF558D2",
// 	CREDA: "922BfF1d745e88DEDEe5f38776cFe343bd843A7c",
// 	MTRL: "825872e7AB3EE8ABf1f1239711375e4F2b587220",
// 	BUSD: "9ad2439CaE9440427f3dFF53A11A57A5a7211152",
// 	STELA: "e1349b31d91c1e00175343df9e60a1981086787a",
// 	BUNNY: "2f45c6df50e7f8517dac64943a2161bbcfba1182",
// 	HT: "c6734784ee598855200dabc8d8b1fa1f11f14c90",
// 	PLA: "b9e0823bdfdc42e77ab5b630d37a704615c4c741",
// 	FILDA: "0577ebaf26bad994ae8889f86e0c4763521bfd61",
// 	BEER: "fda63a04d71c35e01d697615dd078e5b8af98ef9",
// 	DIA: "d5f335fdbad481b9da52f3d987c202349b3fe3c8",
// 	CLUBBNAIR: "c941703f4632e69b1f89a83eab30c016e66823c4",
// 	ELK: "59adb497691a71831cdc07258cccaa5294e68996",
// 	EAGLE: "f78ab562d6b1854dfb8bf06bf2dee7e96920e61e",
// 	ETF: "ffde634eec6c546f777b77cc6e6dfbf2863fe321",
// 	SLOTH: "3dce3e9c2dbe687ab1794e89e48ad0947c4ae48f",
// };

function TradingViewWidget({ poolAddress }: { poolAddress: string }) {
	const widgetContainer = useRef<HTMLIFrameElement>(null);

	return (
		<iframe
			ref={widgetContainer}
			height="100%"
			width="100%"
			id="geckoterminal-embed"
			title="GeckoTerminal Embed"
			src={`https://www.geckoterminal.com/ela/pools/${poolAddress}?embed=1&info=0&swaps=0`}
			allow="clipboard-write"
			allowFullScreen></iframe>
	);
}

export default memo(TradingViewWidget);
