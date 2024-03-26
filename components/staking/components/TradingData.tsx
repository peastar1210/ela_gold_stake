import React from "react";
import dynamic from "next/dynamic";
import SelectTransactionType from "@/components/staking/components/shared/SelectTransactionType"
import PriceChart from "@/components/staking/components/shared/PriceChart"
import TransactionTable from "@/components/staking/components/shared/TransactionTable"
import TradingTable from "@/components/staking/components/shared/TradingTable"
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
const Component = (props:any) => {
  
  return (
    <>
      <div className="h-[945px] w-full justify-center rounded-[12px] bg-white shadow-md shadow-gray-400 border border-gray-200">
        <div className="relative ml-[40px] flex">
          <SelectTransactionType
            chartPrice={props.chartPrice}
            handleChangeChart={props.handleChangeChart}
            chartStakes={props.chartStakes}
            chartRewards={props.chartRewards}
            chartStatus={props.chartStatus}
          />
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
              <PriceChart width={props.candleChartWidth} />
            </>
          )}
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="h-[390px] w-full mobile:w-[90%]">
            {props.chartStatus === "stake" ? (
              <>
                <TransactionTable
                  tableData={props.transactionList?.filter(
                    (item:any) => item.type === "staking"
                  )}
                />
              </>
            ) : props.chartStatus === "reward" ? (
              <>
                <TransactionTable
                  tableData={props.transactionList?.filter(
                    (item:any) => item.type === "unstaking"
                  )}
                />
              </>
            ) : (
              <>
                <TradingTable
                  tableData={props.transactionList?.filter(
                    (item:any) => item.type === "staking"
                  )}
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
