import React, {
	Children,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import axios from "axios";

interface Column {
	id:
		| "TXN"
		| "time"
		| "amount"
		| "address"
		| "type"
		| "priceEla"
		| "priceUSD"
		| "totalUSD"
		| "from"
		| "gold";
	label: string;
	minWidth?: number;
	align?: "left";
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ id: "time", label: "TIME", minWidth: 80 },
	{ id: "type", label: "TYPE", minWidth: 80 },
	{ id: "priceEla", label: "PRICE ELA", minWidth: 80 },
	{ id: "priceUSD", label: "PRICE USD", minWidth: 80 },
	{ id: "totalUSD", label: "TOTAL USD", minWidth: 80 },
	{ id: "gold", label: "GOLD", minWidth: 80 },
	{ id: "from", label: "FROM", minWidth: 80 },
	{ id: "TXN", label: "TXN", minWidth: 60, align: "left" },
];

interface Data {
	name: string;
	code: string;
	population: number;
	size: number;
	density: number;
}

export default function TradingTable(props: any) {
	const [page, setPage] = React.useState(0);
	const [tradingData, setTradingData] = React.useState([]);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleConvertRemainTime = (date: any) => {
		const pastDate = new Date(date).getTime();
		const currentDate = new Date().getTime();
		const timeDifferenceInSeconds = parseInt(
			((currentDate - pastDate) / 1000).toFixed(0)
		);
		if (timeDifferenceInSeconds < 60) {
			return `${timeDifferenceInSeconds}s ago`;
		} else if (
			timeDifferenceInSeconds >= 60 &&
			timeDifferenceInSeconds < 3600
		) {
			return `${(timeDifferenceInSeconds / 60).toFixed(0)}m ago`;
		} else if (
			timeDifferenceInSeconds >= 3600 &&
			timeDifferenceInSeconds < 86400
		) {
			return `${(timeDifferenceInSeconds / 3600).toFixed(0)}h ago`;
		} else {
			return `${(timeDifferenceInSeconds / 86400).toFixed(0)}d ago`;
		}
	};
	const getTradingData = async () => {
		try {
			if (props.filter.poolAddress) {
				const response = await axios.get(
					`https://api.geckoterminal.com/api/v2/networks/ela/pools/${props.filter.poolAddress}/trades`
				);
				setTradingData(response.data.data);
			} else {
				const response = await axios.get(
					"https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/trades"
				);
				setTradingData(response.data.data);
			}
		} catch (err) {
			console.log("Error:", err);
		}
		// const response = await axios.get(
		//   "https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/trades"
		// );
		// console.log("response---->", response.data)
		// setTradingData(response.data.data);
	};

	useEffect(() => {
		getTradingData();
	}, [props.filter]);

	const tableContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const tableContainer = tableContainerRef.current;
		if (!tableContainer) return;

		let startX = 0;
		let startY = 0;

		const touchStart = (event: any) => {
			startX = event.touches[0].clientX;
			startY = event.touches[0].clientY;
		};

		const touchMove = (event: any) => {
			const diffX = event.touches[0].clientX - startX;
			const diffY = event.touches[0].clientY - startY;

			// Adjust based on your needed resistance
			const RESISTANCE_FACTOR = 1;

			if (tableContainer.scrollLeft <= 0 && diffX > 0) {
				event.preventDefault();
				tableContainer.scrollLeft = 0;
			} else if (
				tableContainer.scrollLeft >=
					tableContainer.scrollWidth - tableContainer.clientWidth &&
				diffX < 0
			) {
				event.preventDefault();
				tableContainer.scrollLeft =
					tableContainer.scrollWidth - tableContainer.clientWidth;
			}

			if (tableContainer.scrollTop <= 0 && diffY > 0) {
				event.preventDefault();
				tableContainer.scrollTop = 0;
			} else if (
				tableContainer.scrollTop >=
					tableContainer.scrollHeight - tableContainer.clientHeight &&
				diffY < 0
			) {
				event.preventDefault();
				tableContainer.scrollTop =
					tableContainer.scrollHeight - tableContainer.clientHeight;
			}
		};

		const handleScroll = (event: any) => {
			if (tableContainer.scrollLeft <= 0) {
				event.preventDefault();
				tableContainer.scrollLeft = 0;
			} else if (
				tableContainer.scrollLeft >=
				tableContainer.scrollWidth - tableContainer.clientWidth
			) {
				event.preventDefault();
				tableContainer.scrollLeft =
					tableContainer.scrollWidth - tableContainer.clientWidth;
			}

			if (tableContainer.scrollTop <= 0) {
				event.preventDefault();
				tableContainer.scrollTop = 0;
			} else if (
				tableContainer.scrollTop >=
				tableContainer.scrollHeight - tableContainer.clientHeight
			) {
				event.preventDefault();
				tableContainer.scrollTop =
					tableContainer.scrollHeight - tableContainer.clientHeight;
			}
		};

		tableContainer.addEventListener("touchstart", touchStart, {
			passive: true,
		});
		tableContainer.addEventListener("touchmove", touchMove, { passive: true });
		tableContainer.addEventListener(
			"change",
			() => {
				console.log(tableContainer.scrollLeft);
			},
			{ passive: true }
		);
		// tableContainer.addEventListener("touchend", handleScroll, {
		// 	passive: true,
		// });
		// tableContainer.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			tableContainer.removeEventListener("touchstart", touchStart);
			tableContainer.removeEventListener("touchmove", touchMove);
			tableContainer.removeEventListener("change", () => {});
			// tableContainer.removeEventListener("touchend", handleScroll);
			// tableContainer.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<Paper
			// sx={{ width: '100%', overflow: 'hidden', backgroundColor: '#334155', color: '#d1d5db', borderRadius: 2 }}
			sx={{
				width: "100%",
				overflow: "hidden",
				borderRadius: 2,
				color: "black",
			}}
			className="mt-[10px]">
			<div className="p-0 m-0">
				<TableContainer
					ref={tableContainerRef}
					sx={{
						height: 355,
						borderRadius: "5px",
						"&::-webkit-scrollbar": {
							height: "3px",
							border: "none",
							width: "3px",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "gray",
							// borderRadius: '1px',
							border: "none",
							width: "2px !important",
						},
						"&::-webkit-scrollbar-track": {
							// borderRadius: '2px',
							border: "none",
							top: 0,
						},
						"&::scroll-behavior": "auto",
						touchAction: "manipulation",
					}}
					className="rounded-[5px] p-[0px]">
					<Table
						stickyHeader
						aria-label="sticky table"
						sx={{ borderRadius: "5px" }}
						className="rounded-[5px]">
						<TableHead>
							<TableRow>
								{columns.map((column, index) => (
									<TableCell
										key={index}
										align={column.align}
										// style={{ minWidth: column.minWidth, backgroundColor: '#334155', color: '#d1d5db' }}
										style={{
											minWidth: column.minWidth,
											backgroundColor: "#e6e6e6",
											color: "black",
										}}>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{tradingData
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row: any, index: any) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={index}>
											<TableCell align="left" className="text-nowrap">
												<div className="text-black">
													{handleConvertRemainTime(
														row.attributes.block_timestamp
													)}
												</div>
											</TableCell>
											<TableCell align="left">
												{row.attributes.kind === "buy" ? (
													<div className="rounded-full bg-green-200 text-center text-green-900">
														buy
													</div>
												) : (
													<div className="rounded-full bg-red-200 text-center text-red-900">
														sell
													</div>
												)}
											</TableCell>
											<TableCell align="left">
												<div className="text-black">
													{parseFloat(
														row.attributes.price_to_in_currency_token
													).toFixed(2)}
												</div>
											</TableCell>
											<TableCell align="left">
												<div className="text-black">
													{parseFloat(row.attributes.price_to_in_usd).toFixed(
														2
													)}
												</div>
											</TableCell>
											<TableCell align="left">
												{row.attributes.kind === "buy" ? (
													<>
														<div className="text-black">
															{parseFloat(
																parseFloat(
																	row.attributes.to_token_amount
																).toFixed(6)
															)}
														</div>
													</>
												) : (
													<>
														<div className="text-black">
															{parseFloat(
																parseFloat(
																	row.attributes.from_token_amount
																).toFixed(6)
															)}
														</div>
													</>
												)}
											</TableCell>
											<TableCell align="left">
												<div className="text-black">
													{parseFloat(row.attributes.volume_in_usd).toFixed(4)}
												</div>
											</TableCell>
											<TableCell align="left">
												<Link
													href={`https://esc.elastos.io/address/${row.attributes.tx_from_address}`}
													target="_blank">
													<div className="text-black">
														{"..." +
															row.attributes.tx_from_address.substring(36, 43)}
													</div>
												</Link>
											</TableCell>
											<TableCell align="left">
												<Link
													href={`https://esc.elastos.io/tx/${row.attributes.tx_hash}/token-transfers`}
													target="_blank">
													<img className="w-[21px]" src="transactionLink.svg" />
												</Link>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					style={{ color: "black" }}
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={tradingData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</div>
		</Paper>
	);
}
