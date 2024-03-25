import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import candleData from '../../pricejson/pricejson.json'
let wheelFlag = false
export default function PriceCandleChart(props: any) {
  const [seriesData, setSeriesData] = useState([])
  const [dailyButton, setDailyButton] = useState('bg-gray-700')
  const [weeklyButton, setWeeklyButton] = useState('bg-gray-600')
  const [monthlyButton, setMonthlyButton] = useState('bg-gray-600')
  const [interval, setInterval] = useState('day')
  const [priceButton, setPriceButton] = useState('bg-gray-700')
  const [volumeButton, setVolumeButton] = useState('bg-gray-600')
  const [chartType, setChartType] = useState('price')
  const [volume, setVolume] = useState([])
  const volumeOptions = {
    chart: {
      height: 350,
      width: props.width,
      color: 'white',
      border: 'white',
      panning: true, // Enable panning
      pinchType:"x",
      zooming: {
        pinchType: "x"
      },
    },
    rangeSelector: {
      selected: 1, 
      buttons: [],
    },
    series: [
      {
        name: 'GOLD token price',
        type: 'spline',
        data: volume,
        pointPlacement: 0.1,
      },
    ],
    navigator: {
      enabled: false,
    },
    xAxis: {
      lineColor: '#333333',
      gridLineColor: '#333333',
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'black', // Set the x-axis text color
        },
      },
    },
    yAxis: {
      lineColor: '#333333',
      gridLineColor: '#333333',
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'black', // Set the y-axis text color
        },
      },
    },
    accessibility: { enabled: false },
  }
  const options = {
    chart: {
      height: 350,
      width: props.width,
      backgroundColor: "white",
      color: 'white',
      border: 'white',
      panning: true, // Enable panning
      panKey: 'shift', // Allow panning only when the Ctrl key is pressed
      pinchType:"x",
      zooming: {
        pinchType: "x"
      },
      // zoomType: "x"
    },
    events: {
      mouseWheel: function (e: any) {
        if (e.shiftKey) {
          var delta = e.wheelDelta || -e.detail;
          this.chart.scroll(-delta, e.chartX, e.chartY);
          e.preventDefault();
        }
      }
    },
    rangeSelector: {
      selected: 1,
      buttons: [],
    },
    scrollbar: {
      enabled: false,
    },
    scrollablePlotArea: {
      minWidth: 300,
      maxWidth: 300,
    },
    series: [
      {
        name: 'GOLD token price',
        type: 'candlestick',
        data: seriesData,
        dataGrouping: {
          units: [['week', [1]]],
          enabled: false,
        },
      },
    ],
    navigator: {
      enabled: false,
    },
    plotOptions: {
      candlestick: {
        upColor: '#089981',
        color: '#f23645',
        pointPadding: 0,
        groupPadding: chartType === 'price' && interval === 'month' ? 0.003 : 0.01,
        upLineColor: '#089981',
        lineColor: '#f23645',
      },
    },
    xAxis: {
      lineColor: 'black',
      gridLineColor: 'black',
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'black',
        },
      },
    },
    yAxis: {
      lineColor: 'black',
      gridLineColor: 'black',
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'black',
        },
      },
    },
    accessibility: { enabled: false },
  };
  
  
  
  const handlePriceType = (data: any) => {
    if (data === 'price') {
      setPriceButton('bg-gray-700')
      setVolumeButton('bg-gray-600')
      setChartType('price')
    } else {
      setPriceButton('bg-gray-600')
      setVolumeButton('bg-gray-700')
      setChartType('volume')
    }
  }
  const handleInterval = date => {
    if (date === 'daily') {
      setDailyButton('bg-gray-700')
      setWeeklyButton('bg-gray-600')
      setMonthlyButton('bg-gray-600')
      setInterval('day')
    } else if (date === 'weekly') {
      setDailyButton('bg-gray-600')
      setWeeklyButton('bg-gray-700')
      setMonthlyButton('bg-gray-600')
      setInterval('week')
    } else {
      setDailyButton('bg-gray-600')
      setWeeklyButton('bg-gray-600')
      setMonthlyButton('bg-gray-700')
      setInterval('month')
    }
  }
  useEffect(() => {
    const getPriceData = async (interval: any) => {
      const response = await axios.get(
        'https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/ohlcv/day?limit=1000&currency=usd'
      )
      // const response = await axios.get("https://api.geckoterminal.com/api/v2/networks/ela/pools/0xc9d4ab43d81466f336d37b9e10ace1c9ae994bcc/ohlcv/day?before_timestamp=1708104984&limit=1000&currency=USD")
      console.log("response---->", response.data)
      const terminalData = response.data.data.attributes.ohlcv_list;
      console.log("terminalData------>", terminalData[terminalData.length - 1])
      let data = []
      let volume = []
      for (let i = 1; i < candleData.length; i++) {
        const element = [
          candleData[i].time,
          candleData[i - 1].close,
          candleData[i].high,
          candleData[i].low,
          candleData[i].close,
        ]
        data.push(element)
        const volumeData = [
          candleData[i].time,
          parseFloat(candleData[i].volume.toFixed(2)),
        ]
        volume.push(volumeData)
      }
      let counter = 0;
      for(let i = terminalData.length - 1; i >= 0; i--){
        if(terminalData[i][0] > 1708128000) {
          if(counter === 0){
            const element = [
              terminalData[i][0] * 1000,
              data[data.length - 1][1],
              terminalData[i][2],
              terminalData[i][3],
              terminalData[i][4]
            ]
            data.push(element)
            counter ++;
          } else {
            const element = [
              terminalData[i][0] * 1000,
              terminalData[i][1],
              terminalData[i][2],
              terminalData[i][3],
              terminalData[i][4]
            ]
            data.push(element)
          }
          
          const volumeData = [
            terminalData[i][0] * 1000,
            parseFloat(terminalData[i][5].toFixed(2))
          ]
          volume.push(volumeData)
        }
      }
      if (interval === 'day') {
        setSeriesData(data)
        setVolume(volume)
      } else if (interval === 'week') {
        const weeklyData = []
        const weeklyVolume = []
        let weekStartIndex = 0
        let weekEndIndex = 6
        while (weekEndIndex < data.length - 1) {
          const weeklyElement = [
            data[weekStartIndex][0], // Use the timestamp of the first day of the week
            data[weekStartIndex][1], // Calculate the weekly average of the open prices
            Math.max(...data.slice(weekStartIndex, weekEndIndex).map(day => day[2])), // Find the highest high price within the week
            Math.min(...data.slice(weekStartIndex, weekEndIndex).map(day => day[3])), // Find the lowest low price within the week
            data[weekEndIndex + 1][1], // Use the close price of the last day of the week
          ]
          const weeklyVolumeData = [
            volume[weekStartIndex][0],
            volume.slice(weekStartIndex, weekEndIndex + 1).reduce((sum, day) => sum + day[1], 0) / 7,
          ]
          weeklyVolume.push(weeklyVolumeData)

          // Push the weekly data to the weeklyData array
          weeklyData.push(weeklyElement)

          // Move to the next week
          weekStartIndex += 7
          weekEndIndex += 7
        }
        setSeriesData(weeklyData)
        setVolume(weeklyVolume)
      } else {
        const monthlyData = []
        const monthlyVolume = []
        let monthStartIndex = 0
        let monthEndIndex = 0
        while (monthEndIndex < data.length - 2) {
          // Find the end index of the current month
          const currentMonth = new Date(data[monthStartIndex][0]).getMonth()
          while (monthEndIndex < data.length - 2 && new Date(data[monthEndIndex][0]).getMonth() === currentMonth) {
            monthEndIndex++
          }{
            if (data[monthEndIndex]) {
              // Calculate the monthly OHLCV values
              const monthlyElement = [
                data[monthStartIndex][0], // Use the timestamp of the first day of the month
                data[monthStartIndex][1], // Calculate the monthly average of the open prices
                Math.max(...data.slice(monthStartIndex, monthEndIndex).map(day => day[2])), // Find the highest high price within the month
                Math.min(...data.slice(monthStartIndex, monthEndIndex).map(day => day[3])), // Find the lowest low price within the month
                data[monthEndIndex][1], // Use the close price of the last day of the month
              ]
              const monthlyVolumeData = [
                volume[monthStartIndex][0],
                volume.slice(monthStartIndex, monthEndIndex).reduce((sum, day) => sum + day[1], 0) /
                  (monthEndIndex - monthStartIndex),
              ]
              monthlyVolume.push(monthlyVolumeData)
              // Push the monthly data to the monthlyData array
              monthlyData.push(monthlyElement)
  
              // Move to the next month
              monthStartIndex = monthEndIndex
            } 
          }
        }
        setSeriesData(monthlyData)
        setVolume(monthlyVolume)
      }
    }
    getPriceData(interval)
  }, [interval, chartType])
  const handleScroll = event => {
    if (event.deltaY > 0) {
      this.decreaseValue()
    } else {
      this.increaseValue()
    }
  }
  const preventDefault = (e: Event) => {
    if (e.preventDefault && wheelFlag) {
      e.preventDefault()
    }
    
  }
  const enableScroll = () => {
    wheelFlag = false
    document.removeEventListener('wheel', preventDefault)
  }
  const disableScroll = () => {
    wheelFlag = true
    document.addEventListener('wheel', preventDefault, {
      passive: false,
    })
  }
  return (
    <>
      <div className="flex-row bg-white">
        <div className="mb-[12px] inline-flex w-full text-[12px] text-white">
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${priceButton} mr-[5px]`}
            onClick={() => {
              handlePriceType('price')
            }}
          >
            Price
          </button>
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${volumeButton}`}
            onClick={() => {
              handlePriceType('daily')
            }}
          >
            Volume
          </button>
        </div>
        <div className="inline-flex text-[12px] text-white">
          <button
            className={`rounded-md bg-gray-600 px-2 py-1 ${dailyButton}`}
            onClick={() => {
              handleInterval('daily')
            }}
          >
            Daily
          </button>
          <button
            className={`ml-[5px] rounded-md bg-gray-600 px-2 py-1 ${weeklyButton}`}
            onClick={() => {
              handleInterval('weekly')
            }}
          >
            Weekly
          </button>
          <button
            className={`ml-[5px] rounded-md bg-gray-600 px-2 py-1 ${monthlyButton}`}
            onClick={() => {
              handleInterval('monthly')
            }}
          >
            Monthly
          </button>
        </div>
        {props ? (
          <>
            {chartType === 'price' ? (
              <>
                {seriesData.length > 0 && (
                  <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      constructorType={'stockChart'}
                      options={options}
                      height={350}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {seriesData.length > 0 && (
                  <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      constructorType={'spline'}
                      options={volumeOptions}
                      height={350}
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
    </>
  )
}
