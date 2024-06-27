"use client";
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { tokenList } from "@/utils/tokenList";
import { Autocomplete, TextField } from "@mui/material";

const useStyles: any = makeStyles({
	autocompleteInput: {
		height: "35px",
		fontSize: "14px",
		paddingTop: "5px",
	},
});

const Filter = (props: any) => {
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("GOLD");
	const handleDropdown = () => {
		setDropdown(true);
	};
	const [filterOption, setFilterOption] = useState<any>(tokenList);
	const handleChangeFilter = (e: any) => {
		setFilter(e.target.value);
		setFilterOption(
			tokenList.filter((item: any) =>
				item.symbol.toLowerCase().includes(e.target.value.toLowerCase())
			)
		);
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
						value={filter}
					/>
					{filter.length > 0 && dropdown && (
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
								{filterOption.map((item: any, index: number) => {
									return (
										<button
											key={index}
											className="hover:bg-slate-200 h-[30px]"
											onClick={() => handleSetFilter(item)}>
											{item.symbol}
										</button>
									);
								})}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};
export default Filter;
