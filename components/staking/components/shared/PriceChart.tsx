"use client";
import { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import candleData from "@/utils/GoldPrice.json";
import KlineChart from "@/components/staking/components/shared/KindleChart";
let wheelFlag = false;
export default function PriceCandleChart(props: any) {
  const [seriesData, setSeriesData] = useState([]);
  const [dailyButton, setDailyButton] = useState("bg-gray-700");
  const [weeklyButton, setWeeklyButton] = useState("bg-gray-600");
  const [monthlyButton, setMonthlyButton] = useState("bg-gray-600");
  const [interval, setInterval] = useState("day");
  const [priceButton, setPriceButton] = useState("bg-gray-700");
  const [volumeButton, setVolumeButton] = useState("bg-gray-600");
  const [chartType, setChartType] = useState("price");
  const [volume, setVolume] = useState([]);

  const volumeOptions = {
    chart: {
      height: 350,
      width: props.width,
      color: "white",
      border: "white",
      panning: true, // Enable panning
      pinchType: "x",
      zooming: {
        pinchType: "x",
        followTouchMove: false,
      },
      followTouchMove: true,
    },
    tooltip: {
      followTouchMove: true,
    },
    rangeSelector: {
      selected: 1,
      buttons: [],
    },
    series: [
      {
        name: "GOLD token price",
        type: "spline",
        data: volume,
        pointPlacement: 0.1,
      },
    ],
    navigator: {
      enabled: false,
    },
    xAxis: {
      lineColor: "#333333",
      gridLineColor: "#333333",
      gridLineWidth: 1,
      labels: {
        style: {
          color: "black", // Set the x-axis text color
        },
      },
    },
    yAxis: {
      lineColor: "#333333",
      gridLineColor: "#333333",
      gridLineWidth: 1,
      labels: {
        style: {
          color: "black", // Set the y-axis text color
        },
      },
    },
    accessibility: { enabled: true },
    followTouchMove: true,
  };

  const handlePriceType = (data: any) => {
    if (data === "price") {
      setPriceButton("bg-gray-700");
      setVolumeButton("bg-gray-600");
      setChartType("price");
    } else {
      setPriceButton("bg-gray-600");
      setVolumeButton("bg-gray-700");
      setChartType("volume");
    }
  };
  const handleInterval = (date: any) => {
    if (date === "daily") {
      setDailyButton("bg-gray-700");
      setWeeklyButton("bg-gray-600");
      setMonthlyButton("bg-gray-600");
      setInterval("day");
    } else if (date === "weekly") {
      setDailyButton("bg-gray-600");
      setWeeklyButton("bg-gray-700");
      setMonthlyButton("bg-gray-600");
      setInterval("week");
    } else {
      setDailyButton("bg-gray-600");
      setWeeklyButton("bg-gray-600");
      setMonthlyButton("bg-gray-700");
      setInterval("month");
    }
  };
  useEffect(() => {
    const getPriceData = async (interval: any) => {
      // const response = await axios.get(
      //   "https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/ohlcv/day?limit=1000&currency=usd"
      // );
      // // const response = await axios.get("https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/ohlcv/day?before_timestamp=1708104984&limit=1000&currency=USD")
      // console.log("response---->", response.data);
      // const terminalData = response.data.data.attributes.ohlcv_list;
      // console.log("terminalData------>", terminalData[terminalData.length - 1]);
      let data: any = [];
      let volume: any = [];
      for (let i = 1; i < candleData.length; i++) {
        let element = {};
        if (candleData[i - 1].close > candleData[i].high) {
          element = {
            timestamp: candleData[i].time,
            open: candleData[i - 1].close,
            high: candleData[i - 1].close,
            low: candleData[i].low,
            close: candleData[i].close,
          };
        } else {
          if (candleData[i - 1].close < candleData[i].low) {
            element = {
              timestamp: candleData[i].time,
              open: candleData[i - 1].close,
              high: candleData[i].high,
              low: candleData[i - 1].close,
              close: candleData[i].close,
            };
          } else {
            element = {
              timestamp: candleData[i].time,
              open: candleData[i - 1].close,
              high: candleData[i].high,
              low: candleData[i].low,
              close: candleData[i].close,
            };
          }
        }

        data.push(element);
        const volumeData = [
          candleData[i].time,
          parseFloat(candleData[i].volume.toFixed(2)),
        ];
        volume.push(volumeData);
      }
      // let counter = 0;
      // for (let i = terminalData.length - 1; i >= 0; i--) {
      //   if (terminalData[i][0] > 1708128000) {
      //     if (counter === 0) {
      //       const element: any = {
      //         timestamp:terminalData[i][0] * 1000,
      //         // open:data[i][1],
      //         open:data[data.length - 1].close,
      //         high:terminalData[i][2],
      //         low:terminalData[i][3],
      //         close:terminalData[i][4],
      //       };
      //       data.push(element);
      //       counter++;
      //     } else {
      //       console.log("counter---->", counter)
      //       const element = {
      //         timestamp:terminalData[i][0] * 1000,
      //         open:terminalData[i+1][1],
      //         // open:terminalData[i+1][4],
      //         high:terminalData[i][2],
      //         low:terminalData[i][3],
      //         close:terminalData[i][4],
      //       };
      //       data.push(element);
      //     }

      //     const volumeData = [
      //       terminalData[i][0] * 1000,
      //       parseFloat(terminalData[i][5].toFixed(2)),
      //     ];
      //     volume.push(volumeData);
      //   }
      // }
      if (interval === "day") {
        setSeriesData(data);
        setVolume(volume);
      } else if (interval === "week") {
        const weeklyData: any = [];
        const weeklyVolume: any = [];
        let weekStartIndex = 0;
        let weekEndIndex = 6;
        while (weekEndIndex < data.length - 1) {
          const weeklyElement = {
            timestamp: data[weekStartIndex].timestamp, // Use the timestamp of the first day of the week
            open: data[weekStartIndex].open, // Calculate the weekly average of the open prices
            high: Math.max(
              ...data
                .slice(weekStartIndex, weekEndIndex)
                .map((day: any) => day.high)
            ), // Find the highest high price within the week
            low: Math.min(
              ...data
                .slice(weekStartIndex, weekEndIndex)
                .map((day: any) => day.low)
            ), // Find the lowest low price within the week
            close: data[weekEndIndex + 1].open, // Use the close price of the last day of the week
          };
          const weeklyVolumeData = [
            volume[weekStartIndex][0],
            volume
              .slice(weekStartIndex, weekEndIndex + 1)
              .reduce((sum: any, day: any) => sum + day[1], 0) / 7,
          ];
          weeklyVolume.push(weeklyVolumeData);

          // Push the weekly data to the weeklyData array
          weeklyData.push(weeklyElement);

          // Move to the next week
          weekStartIndex += 7;
          weekEndIndex += 7;
        }
        setSeriesData(weeklyData);
        setVolume(weeklyVolume);
      } else {
        const monthlyData: any = [];
        const monthlyVolume: any = [];
        let monthStartIndex = 0;
        let monthEndIndex = 0;
        while (monthEndIndex < data.length - 2) {
          // Find the end index of the current month
          const currentMonth = new Date(
            data[monthStartIndex].timestamp
          ).getMonth();
          while (
            monthEndIndex < data.length - 2 &&
            new Date(data[monthEndIndex].timestamp).getMonth() === currentMonth
          ) {
            monthEndIndex++;
          }
          {
            if (data[monthEndIndex]) {
              // Calculate the monthly OHLCV values
              const monthlyElement = {
                timestamp: data[monthStartIndex].timestamp, // Use the timestamp of the first day of the month
                open: data[monthStartIndex].open, // Calculate the monthly average of the open prices
                high: Math.max(
                  ...data
                    .slice(monthStartIndex, monthEndIndex)
                    .map((day: any) => day.high)
                ), // Find the highest high price within the month
                low: Math.min(
                  ...data
                    .slice(monthStartIndex, monthEndIndex)
                    .map((day: any) => day.low)
                ), // Find the lowest low price within the month
                close: data[monthEndIndex].open, // Use the close price of the last day of the month
              };
              const monthlyVolumeData = [
                volume[monthStartIndex][0],
                volume
                  .slice(monthStartIndex, monthEndIndex)
                  .reduce((sum: any, day: any) => sum + day[1], 0) /
                  (monthEndIndex - monthStartIndex),
              ];
              monthlyVolume.push(monthlyVolumeData);
              // Push the monthly data to the monthlyData array
              monthlyData.push(monthlyElement);

              // Move to the next month
              monthStartIndex = monthEndIndex;
            }
          }
        }
        setSeriesData(monthlyData);
        setVolume(monthlyVolume);
      }
    };
    getPriceData(interval);
  }, [interval, chartType]);
  const preventDefault = (e: Event) => {
    if (e.preventDefault && wheelFlag) {
      e.preventDefault();
    }
  };
  const disableMove = (event:any) => {
    event.preventDefault(); // Prevent default behavior of touch move
  };
  const enableClick = () => {
    console.log("----->")
    wheelFlag = false;
    document.removeEventListener("wheel", preventDefault);
    document.removeEventListener("click", preventDefault);
    document.removeEventListener("auxclick", preventDefault);
  };
  const disableClick = () => {
    console.log("========>")
    wheelFlag = true;
    document.addEventListener("wheel", preventDefault, {
      passive: false,
    });
    document.addEventListener("click", preventDefault, {
      passive: false,
    });
    document.addEventListener("auxclick", preventDefault, {
      passive: false,
    });
  };
  return (
    <>
      <div className="flex-row bg-white w-full mobile:w-[90%]">
        <div className="mb-[12px] inline-flex w-full text-[12px] text-white">
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${priceButton} mr-[5px]`}
            onClick={() => {
              handlePriceType("price");
            }}
          >
            Price
          </button>
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${volumeButton}`}
            onClick={() => {
              handlePriceType("daily");
            }}
          >
            Volume
          </button>
        </div>
        <div className="inline-flex text-[12px] text-white">
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${dailyButton}`}
            onClick={() => {
              handleInterval("daily");
            }}
          >
            Daily
          </button>
          <button
            className={`ml-[5px] rounded-md bg-gray-600 px-2 py-1 ${weeklyButton}`}
            onClick={() => {
              handleInterval("weekly");
            }}
          >
            Weekly
          </button>
          <button
            className={`ml-[5px] rounded-md bg-gray-600 px-2 py-1 ${monthlyButton}`}
            onClick={() => {
              handleInterval("monthly");
            }}
          >
            Monthly
          </button>
        </div>
        {props && (
          <>
            {chartType === "price" ? (
              <>
                {seriesData.length > 0 && (
                  <div onMouseEnter={disableClick} onMouseLeave={enableClick} onTouchMove={disableMove}>
                    <KlineChart data={seriesData} width={props.width} />
                  </div>
                  //   <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
                  //     <HighchartsReact
                  //       highcharts={Highcharts}
                  //       constructorType={'stockChart'}
                  //       options={options}
                  //       height={350}
                  //       ref={chartRef}
                  //     />
                  //   </div>
                )}
              </>
            ) : (
              <>
                {seriesData.length > 0 && (
                  <div
                    onMouseEnter={disableClick}
                    onMouseLeave={enableClick}
                    className="w-full h-[350px]"
                  >
                    <HighchartsReact
                      highcharts={Highcharts}
                      constructorType={"stockChart"}
                      options={volumeOptions}
                      height={350}
                      width={600}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
