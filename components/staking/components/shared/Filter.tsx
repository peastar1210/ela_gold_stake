"use client";
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { tokenList } from "@/utils/tokenList";
import { Autocomplete, Skeleton, TextField } from "@mui/material";
import axios from "axios";

const useStyles: any = makeStyles({
	autocompleteInput: {
		height: "35px",
		fontSize: "14px",
		paddingTop: "5px",
	},
});

const Filter = (props: any) => {
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [filterLoading, setFilterLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("GOLD");
	const handleDropdown = async () => {
		setDropdown(true);
		setFilterLoading(true);
		try {
			const filteredTokens = tokenList
				.filter((item: any) => item.symbol.startsWith(filter.toUpperCase()))
				.slice(0, 5);

			// Map through the filtered tokens to fetch volume data for each
			const tokensWithVolume = await Promise.all(
				filteredTokens.map(async (token: any) => {
					const response = await axios.get(
						`https://api.dexscreener.com/latest/dex/search?q=${token.poolAddress}`
					);

					const volume24h = response.data.pairs[0]?.volume?.h24 || 0;
					return { ...token, volume24h };
				})
			);

			// Sort the tokens by volume in descending order
			const sortedTokens = tokensWithVolume.sort(
				(a: any, b: any) => b.volume24h - a.volume24h
			);

			// Set filter option with the sorted tokens
			setFilterOption(sortedTokens);
		} catch (err) {
			console.log(err);
		}
		setFilterLoading(false);
	};
	const [filterOption, setFilterOption] = useState<any>(tokenList);
	const handleChangeFilter = async (e: any) => {
		setFilter(e.target.value);

		setFilterLoading(true);
		try {
			const filteredTokens = tokenList
				.filter((item: any) =>
					item.symbol.startsWith(e.target.value.toUpperCase())
				)
				.slice(0, 5);

			// Map through the filtered tokens to fetch volume data for each
			const tokensWithVolume = await Promise.all(
				filteredTokens.map(async (token: any) => {
					const response = await axios.get(
						`https://api.dexscreener.com/latest/dex/search?q=${token.poolAddress}`
					);

					const volume24h = response.data.pairs[0]?.volume?.h24 || 0;
					return { ...token, volume24h };
				})
			);

			// Sort the tokens by volume in descending order
			const sortedTokens = tokensWithVolume.sort(
				(a: any, b: any) => b.volume24h - a.volume24h
			);

			// Set filter option with the sorted tokens
			setFilterOption(sortedTokens);
		} catch (err) {
			console.log(err);
		}
		setFilterLoading(false);
	};
	const handleSetFilter = (item: any) => {
		console.log(item);
		setDropdown(false);
		setFilter(item.symbol);
		props.setFilter(item);
	};
	const Search = styled("div")(({ theme }) => ({
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	}));
	const SearchIconWrapper = styled("div")(({ theme }) => ({
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}));
	const StyledInputBase = styled(InputBase)(({ theme }) => ({
		color: "inherit",
		"& .MuiInputBase-input": {
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)})`,
			transition: theme.transitions.create("width"),
			width: "100%",
			[theme.breakpoints.up("md")]: {
				width: "20ch",
			},
		},
	}));
	const classes = useStyles();
	return (
		<>
			<div className="inline-flex">
				<button
					className={`rounded-md px-2 py-1 ${
						props.priceCurrency === "gold" ? "bg-gray-700" : "bg-gray-500"
					} mr-[5px] text-white`}
					onClick={() => {
						props.setPriceCurrency("gold");
						handleSetFilter(tokenList[7]);
					}}>
					Gold
				</button>
				<button
					className={`rounded-md px-2 py-1 ${
						props.priceCurrency === "ela" ? "bg-gray-700" : "bg-gray-500"
					} mr-[5px] text-white w-[50px]`}
					onClick={() => {
						props.setPriceCurrency("ela");
						handleSetFilter(tokenList[20]);
					}}>
					Ela
				</button>
				{/* <div className="w-[150px]">
					<Autocomplete
						freeSolo
						id="free-solo-2-demo"
						size="small"
						disableClearable
						getOptionDisabled={(option) => option === ""}
						options={filterOption.map(
							(item: any, index: number) => item.symbol
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label={
									<div style={{ display: "flex", alignItems: "center" }}>
										<SearchIcon style={{ marginRight: 8 }} />
										Token
									</div>
								}
								InputProps={{
									...params.InputProps,
									type: "search",
									// className: classes.autocompleteInput,
								}}
							/>
						)}
					/>
				</div> */}
				<div className="relative">
					<input
						className="absolute w-[100px] border-[1px] border-slate-500 rounded-[5px] outline-none px-[5px] py-[3px] z-[50]"
						onFocus={handleDropdown}
						onChange={handleChangeFilter}
						value={filter === "GOLD" || filter === "ELA" ? "" : filter}
					/>
					{filter && filter !== "GOLD" && filter !== "ELA" && dropdown && (
						<>
							<div
								className="fixed top-0 bottom-0 left-0 right-0"
								onClick={() => {
									setDropdown(false);
								}}></div>
							<div
								className={`absolute top-[40px] w-[100px] bg-white ${
									filterOption.length === 0
										? "border-white"
										: "border-slate-500"
								} rounded-[5px] border-[1px] z-[50] flex flex-col shadow-md`}>
								{filterLoading ? (
									<Skeleton
										variant="rectangular"
										width="full"
										height="30px"
										style={{ margin: "3px" }}
									/>
								) : (
									filterOption
										.filter(
											(item: any) =>
												item.symbol !== "GOLD" && item.symbol !== "ELA"
										)
										.map((item: any, index: number) => {
											return (
												<button
													key={index}
													className="hover:bg-slate-200 h-[30px]"
													onClick={() => {
														props.setPriceCurrency("item");
														handleSetFilter(item);
													}}>
													{item.symbol}
												</button>
											);
										})
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};
export default Filter;
