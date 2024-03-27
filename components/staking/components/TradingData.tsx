"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import SelectTransactionType from "@/components/staking/components/shared/SelectTransactionType";
import PriceChart from "@/components/staking/components/shared/PriceChart";
import TransactionTable from "@/components/staking/components/shared/TransactionTable";
import TradingTable from "@/components/staking/components/shared/TradingTable";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const Filter = dynamic(() => import("@/components/staking/components/shared/Filter"))
const Component = (props: any) => {
  const [priceCurrency, setPriceCurrency] = useState<string>("gold");
  const [filter, setFilter] = useState<any>({})
  return (
    <>
      <div className="h-[945px] w-full justify-center rounded-[12px] bg-white shadow-md shadow-gray-400 border border-gray-200">
        <div className="w-full flex justify-center mt-[20px]">
          <div className="w-full mobile:w-[90%] flex justify-between">
            <div className="flex items-center">
              <Filter priceCurrency={priceCurrency} setPriceCurrency={setPriceCurrency} setFilter={setFilter}/>
            </div>
            <SelectTransactionType
              chartPrice={props.chartPrice}
              handleChangeChart={props.handleChangeChart}
              chartStakes={props.chartStakes}
              chartRewards={props.chartRewards}
              chartStatus={props.chartStatus}
            />
          </div>
        </div>
        <div className="mt-[25px] flex w-full items-center justify-center">
          {props.chartStatus === "stake" ? (
            <>
              <ReactApexChart
                // options={totalSupplyChartOption}
                options={props.totalSupplyChartOption}
                series={props.series}
                type="area"
                height={350}
                width={props.chartWidth}
              />
            </>
          ) : props.chartStatus === "reward" ? (
            <>
              <ReactApexChart
                // options={totalSupplyChartOption}
                options={props.rewardsAmountListCategories}
                series={props.rewardsSeries}
                type="area"
                height={350}
                width={props.chartWidth}
              />
            </>
          ) : (
            <>
              <PriceChart width={props.candleChartWidth} filter={filter}/>
            </>
          )}
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="h-[390px] w-full mobile:w-[90%]">
            {props.chartStatus === "stake" ? (
              <>
                <TransactionTable
                  tableData={props.transactionList?.filter(
                    (item: any) => item.type === "staking"
                  )}
                />
              </>
            ) : props.chartStatus === "reward" ? (
              <>
                <TransactionTable
                  tableData={props.transactionList?.filter(
                    (item: any) => item.type === "unstaking"
                  )}
                />
              </>
            ) : (
              <>
                <TradingTable
                  filter={filter}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Component;
