/* eslint-disable jsx-a11y/alt-text */
'use client'
import React, { Children, SetStateAction, useEffect, useState } from 'react'
import { BigNumber, Contract, ethers, providers } from 'ethers'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import { parseFixed } from '@ethersproject/bignumber'
import Link from 'next/link'
import axios from 'axios'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import tokenAbi from '../tokenabi.json'
import contractAbi from '../abi.json'
import { v4 } from 'uuid'
import Web3 from 'web3'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import TransactionTable from 'components/TransactionTable'
import StakeListTable from 'components/StakeListTable'
import PriceCandleChart from 'components/PriceCandleChart'
import TradingTable from 'components/TradingTable'
import StatsComponent from 'components/StatsComponent'
import StakerList from 'components/StakerList'
import SelectTransactionType from 'components/TransactionList/SelectTransactionType'
import Stake from 'components/Stake'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
const GOLDTOKEN = '0x7647548A32B5f632f880B1F9c64b06E16433917D'
const ContractAddress = '0x964f10f9e30c69f5e49109eef8dfD09fE8374dD7'

export default function Home() {
  return (
    <div>
      <Staking />
    </div>
  )
}

const period = [
  { period: '0 Days', multiply: 100 },
  { period: '90 Days', multiply: 105 },
  { period: '180 Days', multiply: 115 },
  { period: '365 Days', multiply: 145 },
  { period: '730 Days', multiply: 200 },
]
function clientToSigner(client) {
    const { account, chain, transport } = client
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
  }
function Staking() {
  const [stakingPeriod, setStakingPeriod] = useState(period[0])
  const [amount, setAmount] = useState<string>('0')
  const chainId = useChainId()
  const { data: client } = useWalletClient({ chainId })
  const signer = React.useMemo(() => (client ? clientToSigner(client) : undefined), [client])
  const { address } = useAccount()
  const [disable, setDisable] = useState(false)
  const [userStakedList, setUserStakedList] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [userStakedAmount, setUserStakedAmount] = useState(0)
  const [totalStakedAmount, setTotalStakedAmount] = useState(0)
  const [stakersNum, setStakersNum] = useState(0)
  const [distributedAmount, setDistributedAmount] = useState(0)
  const [stakersList, setStakersList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [chartWidth, setChartWidth] = useState(0)
  const [chartStakes, setChartStakes] = useState('text-white')
  const [chartRewards, setChartRewards] = useState('text-white')
  const [chartPrice, setChartPrice] = useState('bg-slate-500 text-white')
  const [chartStatus, setChartStatus] = useState('price')
  const [stakingListStatus, setStakingListStatus] = useState('active')
  const [stakingActive, setStakingActive] = useState('bg-slate-500')
  const [stakingHistory, setStakingHistory] = useState('bg-slate-700')
  const [userUnstakeList, setUserUnstakeList] = useState([])
  const [usdPrice, setUsdPrice] = useState('0')
  const [totalRewardAmount, setTotalRewardAmount] = useState(0)
  const [totalSupplyList, setTotalSupplyList] = useState([])
  const [totalSupplyChartOption, setTotalSupplyChartOption] = useState({})
  const [series, setSeries] = useState([])
  const [rewardsAmountListCategories, setRewardsAmountListCategories] = useState({})
  const [rewardsSeries, setRewardsSeries] = useState([])
  const [candleChartWidth, setCandleChartWidth] = useState(0)
  const [stakingButtonContext, setStakingButtonContext] = useState('Staking')
  const [windowWidth, setWindowWidth] = useState(0)

  async function approve(amount: any) {
    // const response = await axios.get(
    //   `https://esc-testnet.elastos.io/api?module=account&action=tokenbalance&contractaddress=${GOLDTOKEN}&address=${address}`
    // )
    const amountToWei = parseFixed(amount.toString(), 18)
    // const amountToWei = ethers.constants.MaxUint256
    const tokenContract = new Contract(GOLDTOKEN, tokenAbi, signer)
    const tx = await tokenContract.approve(ContractAddress, amountToWei)
    await tx.wait()
  }
  const handleChangeAmount = (e: { target: { value: SetStateAction<string> } }) => {
    setAmount(e.target.value)
  }
  const getTotalSupplyList = async () => {
    const web3 = new Web3('https://api-testnet.elastos.io/eth')
    const contract = new web3.eth.Contract(contractAbi, ContractAddress)
    const balance = await contract.methods.getContractTokenBalance().call()
    convertBigNumberToInt(balance)
    const response = await axios.post('https://elastos-backend.onrender.com/api/stakes/getTotalSupplyList', {
      totalSupply: convertBigNumberToInt(balance),
    })
    setTotalSupplyList(response.data)
  }
  const getUsdBalance = async () => {
    const response = await axios.get(
      'https://api.dexscreener.com/latest/dex/tokens/0xaA9691BcE68ee83De7B518DfCBBfb62C04B1C0BA'
    )
    setUsdPrice(response.data.pairs[0].priceUsd)
  }
  const toPeriod = (multiply: number) => {
    if (multiply === 100) {
      return 'None'
    } else if (multiply === 105) {
      return '3 Month'
    } else if (multiply === 115) {
      return '6 Month'
    } else if (multiply === 145) {
      return '12 Month'
    } else {
      return '24 Month'
    }
  }
  async function getStakingInfo() {
    if (address) {
      const web3 = new Web3('https://api-testnet.elastos.io/eth')
      const contract = new web3.eth.Contract(contractAbi, ContractAddress)
      let stakedTempList = []
      stakedTempList = await contract.methods.getStakeInfo(address).call()
      
      let stakedList = []
      for (let i = 0; i < stakedTempList[0].length; i++) {
        const element = {
          amount: convertBigNumberToInt(stakedTempList[0][i].amount),
          multiply: convertBigNumberToInt(stakedTempList[0][i].multiply) * Math.pow(10, 18),
          period: toPeriod(convertBigNumberToInt(stakedTempList[0][i].multiply) * Math.pow(10, 18)),
          uuid: stakedTempList[0][i].uuid,
          unlockTimeToSec:
            convertBigNumberToInt(stakedTempList[0][i].unlockTime) * Math.pow(10, 18) -
            convertBigNumberToInt(stakedTempList[1]) * Math.pow(10, 18),
          unlockTime: new Date(
            new Date().getTime() +
              (convertBigNumberToInt(stakedTempList[0][i].unlockTime) * Math.pow(10, 18) -
                convertBigNumberToInt(stakedTempList[1]) * Math.pow(10, 18)) *
                1000
          ),
        }
        stakedList[i] = element
      }
      let totalStakedAmount = 0
      for (let i = 0; i < stakedList.length; i++) {
        totalStakedAmount += stakedList[i].amount
      }
      setUserStakedAmount(totalStakedAmount)
      setUserStakedList(stakedList)
    }
  }
  async function getStakedAmount() {
    const web3 = new Web3('https://api-testnet.elastos.io/eth')
    const contract = new web3.eth.Contract(contractAbi, ContractAddress)
    const stakedAmount = await contract.methods.getStakedAmount().call()
    setTotalStakedAmount(convertBigNumberToInt(stakedAmount))
  }
  const handleChangeStakingList = (data: any) => {
    if (data === 'active') {
      setStakingActive('bg-slate-500')
      setStakingHistory('bg-slate-700')
      setStakingListStatus('active')
    } else {
      setStakingActive('bg-slate-700')
      setStakingHistory('bg-slate-500')
      setStakingListStatus('history')
    }
  }
  const handleUnstake = (uuid: any, previousAmount: number) => {
    const stakingContract = new Contract(ContractAddress, contractAbi, signer)
    const calldata = stakingContract.interface.encodeFunctionData('unstake', [uuid])
    signer
      .estimateGas({
        to: ContractAddress,
        from: address,
        data: calldata,
      })
      .then(res => {
        return res.toNumber()
      })
      .then(est => {
        return signer.sendTransaction({
          from: address,
          to: ContractAddress,
          data: calldata,
          gasPrice: '20000000000',
          gasLimit: est.toString(),
        })
      })
      .then(res => {
        res.wait().then(() => {
          setDisable(false)
          getTotalSupply()
          getStakedAmount()
          getStakingInfo()
          createStakingResult(res.hash, 'unstaking', uuid, previousAmount)
        })
      })
  }
  const convertBigNumberToInt = (value: any) => {
    return Number(value) / Math.pow(10, 18)
  }
  async function getTotalSupply() {
    const web3 = new Web3('https://api-testnet.elastos.io/eth')
    const contract = new web3.eth.Contract(contractAbi, ContractAddress)
    const balance = await contract.methods.getContractTokenBalance().call()
    setTotalBalance(convertBigNumberToInt(balance))
  }
  async function createStakingResult(hash: string, type: string, uuid: string, previousAmount: number) {
    let stakingData = {}
    if (type === 'staking') {
      stakingData = {
        transactionHash: hash,
        address: address,
        amount: parseFloat(amount),
        multiply: stakingPeriod.multiply,
        type: type,
        uuid: uuid,
        previousAmount: previousAmount,
      }
    } else {
      const transferData = await axios.get(`https://esc-testnet.elastos.io/tx/${hash}/token-transfers?type=JSON`)
      const htmlContent = transferData.data.items[0]
      const regexResult =
        /<span class="tile-title">\n\n(.*?)\n <a data-test="token_link" href="\/token\/.*?">(.*?)<\/a>\n\n/.exec(
          htmlContent
        )
      const unstakingAmount = regexResult[1]
      stakingData = {
        transactionHash: hash,
        address: address,
        amount: parseFloat(unstakingAmount),
        multiply: stakingPeriod.multiply,
        type: type,
        uuid: uuid,
        previousAmount: previousAmount,
      }
    }
    // const response = await axios.post('https://elastos-backend.onrender.com/api/stakes', stakingData)
    const response = await axios.post('https://elastos-backend.onrender.com/api/stakes', stakingData)
    await getTotalList()
  }
  async function getTotalList() {
    // const response = await axios.post('https://elastos-backend.onrender.com/api/stakes/totalList')
    const response = await axios.post('https://elastos-backend.onrender.com/api/stakes/totalList')
    setStakersNum(response.data.stakersList.length)
    setDistributedAmount(response.data.distributedAmount)
    setStakersList(response.data.stakersList)
    setTransactionList(response.data.transactions)
    setTotalSupplyList(response.data.totalSupplyList)
    let seriesTotalSupplyTemp = []
    let xiosTemp = []
    for (let i = 0; i < response.data.totalSupplyList.length; i++) {
      const supplyData = [
        Date.parse(response.data.totalSupplyList[i].updatedAt),
        parseFloat(response.data.totalSupplyList[i].totalSupply.toFixed(4)),
      ]
      seriesTotalSupplyTemp.push(supplyData)
      xiosTemp.push(response.data.totalSupplyList[i].date)
    }
    const totalSupplyChartOptions: ApexOptions = {
      chart: {
        height: 450,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      grid: {
        strokeDashArray: 0,
      },
      xaxis: {
        categories: xiosTemp,
      },
      colors: ['#008FFB'],
      yaxis: {
        opposite: true, // Move the y-axis to the right
      },
    }
    setTotalSupplyChartOption(totalSupplyChartOptions)
    const seriesTotalTemp = [
      {
        name: 'Total Gold Balance',
        data: seriesTotalSupplyTemp,
      },
    ]
    setSeries(seriesTotalTemp)

    let unstakeList = []
    let totalUnstakedAmount = 0
    for (let i = 0; i < response.data.transactions.length; i++) {
      if (response.data.transactions[i].address === address && response.data.transactions[i].type === 'unstaking') {
        unstakeList.push(response.data.transactions[i])
        totalUnstakedAmount += response.data.transactions[i].amount
      }
    }
    setUserUnstakeList(unstakeList)
    setTotalRewardAmount(totalUnstakedAmount)
    let rewardsCategories = []
    for (let i = 0; i < response.data.rewardsAmounts.length; i++) {
      rewardsCategories.push(response.data.rewardsAmounts[i].date)
    }
    const totalRewardChartOptions: ApexOptions = {
      chart: {
        height: 450,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      grid: {
        strokeDashArray: 0,
      },
      xaxis: {
        categories: rewardsCategories,
        labels: {
          style: {
            colors: '#ffffff', // Set the x-axis font color to white
          },
        },
      },
      yaxis: {
        opposite: true, // Move the y-axis to the right
      },
      colors: ['#00e396'],
    }
    setRewardsAmountListCategories(totalRewardChartOptions)
    let rewardsSeries = []
    for (let i = 0; i < response.data.rewardsAmounts.length; i++) {
      rewardsSeries.push(parseFloat(response.data.rewardsAmounts[i].amount.toFixed(4).toString()))
    }
    const rewardsSeriesTemp = [
      {
        name: 'Total Rewards Amount',
        data: rewardsSeries,
      },
    ]
    setRewardsSeries(rewardsSeriesTemp)
  }
  async function staking() {
    setDisable(true)
    setStakingButtonContext('Approving...')
    await approve(amount)
    setStakingButtonContext('Confirming...')
    const uuid = await v4()
    const amountToWei = parseFixed(amount, 18)
    const stakingContract = new Contract(ContractAddress, contractAbi, signer)
    const calldata = stakingContract.interface.encodeFunctionData('stake', [amountToWei, stakingPeriod.multiply, uuid])
    await signer
      .estimateGas({
        to: ContractAddress,
        from: address,
        data: calldata,
      })
      .then(res => {
        return res.toNumber()
      })
      .then(est => {
        return signer.sendTransaction({
          from: address,
          to: ContractAddress,
          data: calldata,
          gasPrice: '20000000000',
          gasLimit: est.toString(),
        })
      })
      .then(res => {
        res.wait().then(() => {
          getTotalSupply()
          getStakedAmount()
          getStakingInfo()
          setDisable(false)
          createStakingResult(res.hash, 'staking', uuid, parseFloat(amount))
          setStakingButtonContext('Staking')
        })
      })
  }
  useEffect(() => {
    getStakingInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])
  useEffect(() => {
    getTotalSupply()
    getStakedAmount()
    getTotalList()
    getUsdBalance()
    getTotalSupplyList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeChart = (data: any) => {
    if (data === 'staked') {
      setChartStakes('bg-slate-500 text-white')
      setChartRewards('bg-slate-700 text-white')
      setChartPrice('bg-slate-700 text-white')
      setChartStatus('stake')
    } else if (data === 'price') {
      setChartPrice('bg-slate-500 text-white')
      setChartStakes('bg-slate-700 text-white')
      setChartRewards('bg-slate-700 text-white')
      setChartStatus('price')
    } else {
      setChartStakes('bg-slate-700 text-white')
      setChartRewards('bg-slate-500 text-white')
      setChartPrice('bg-slate-700 text-white')
      setChartStatus('reward')
    }
  }
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      setWindowWidth(windowWidth)
      if (windowWidth > 1280) {
        setChartWidth((850 * windowWidth) / 1920)
        setCandleChartWidth((820 * windowWidth) / 1920)
      } else {
        setChartWidth((900 * windowWidth) / 1280)
        setCandleChartWidth((1020 * windowWidth) / 1280)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize() // Initial margin calculation

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`absolute w-full bg-white font-sans text-white`}>
      <div className="relative flex h-[100px] w-full items-center bg-slate-800">
        <div className="absolute left-[20px] flex h-[80%] items-center">
          <img className="h-full" src="logo.png" />
          <div className="ml-[15px] hidden font-sans text-[18px] font-bold text-white mobile:block">
            Earn GOLD Stake GOLD
          </div>
        </div>
        <div className={`absolute right-[20px] inline-flex h-[52px]`}>
          <ConnectWallet />
        </div>
      </div>
      <div className="mt-[40px] flex w-full items-center justify-center">
        <div className="w-full text-black mobile:w-[90%] desktop:flex ">
          <div className="w-full desktop:h-[945px] desktop:w-[43.8%]">
            <div className="relative w-full rounded-[12px] bg-white px-[40px] pb-[35px] pt-[35px] text-black shadow-md shadow-gray-400 mobile:h-[410px] mobile:pb-[10px] mobile:pt-[20px] border border-gray-200">
              <StatsComponent
                userStakedAmount={userStakedAmount}
                totalRewardAmount={totalRewardAmount}
                totalBalance={totalBalance}
                distributedAmount={distributedAmount}
                totalStakedAmount={totalStakedAmount}
                stakersNum={stakersNum}
              />
            </div>
            <div className="relative mt-[25px] w-full rounded-[12px] border border-gray-200 bg-white pb-[20px] shadow-lg shadow-gray-400 desktop:h-[1095px] desktop:pb-[0px]">
              <div className="relative w-full">
                <Stake
                  handleChangeAmount={handleChangeAmount}
                  disable={disable}
                  period={period}
                  stakingPeriod={stakingPeriod}
                  setStakingPeriod={setStakingPeriod}
                  staking={staking}
                  stakingButtonContext={stakingButtonContext}
                />
              </div>
              <div className="absolute right-[20px] inline-flex text-[12px] text-white">
                <button
                  className={`mr-[10px] rounded-md px-2 py-1 ${stakingActive}`}
                  onClick={() => handleChangeStakingList('active')}
                >
                  Active Stakes
                </button>
                <button
                  className={`rounded-md px-2 py-1 ${stakingHistory}`}
                  onClick={() => handleChangeStakingList('history')}
                >
                  Staking History
                </button>
              </div>
              <div className="mt-[70px] flex w-full justify-center">
                <div className="w-full mobile:w-[95%]">
                  <StakeListTable
                    userStakedList={userStakedList}
                    totalBalance={totalBalance}
                    totalStakedAmount={totalStakedAmount}
                    usdPrice={usdPrice}
                    handleUnstake={handleUnstake}
                    stakingListStatus={stakingListStatus}
                    userUnstakeList={userUnstakeList}
                    windowWidth={windowWidth}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-0 mt-[25px] w-full rounded-[12px] bg-white desktop:ml-[2%] desktop:mt-0 desktop:w-[54.2%]">
            <div className="h-[945px] w-full justify-center rounded-[12px] bg-white shadow-md shadow-gray-400 border border-gray-200">
              <div className="relative ml-[40px] flex w-full">
                <SelectTransactionType
                  chartPrice={chartPrice}
                  handleChangeChart={handleChangeChart}
                  chartStakes={chartStakes}
                  chartRewards={chartRewards}
                  chartStatus={chartStatus}
                />
              </div>
              <div className="mt-[25px] flex w-full items-center justify-center">
                {chartStatus === 'stake' ? (
                  <>
                    <ReactApexChart
                      // options={totalSupplyChartOption}
                      options={totalSupplyChartOption}
                      series={series}
                      type="area"
                      height={350}
                      width={chartWidth}
                    />
                  </>
                ) : chartStatus === 'reward' ? (
                  <>
                    <ReactApexChart
                      // options={totalSupplyChartOption}
                      options={rewardsAmountListCategories}
                      series={rewardsSeries}
                      type="area"
                      height={350}
                      width={chartWidth}
                    />
                  </>
                ) : (
                  <>
                    <PriceCandleChart width={candleChartWidth} />
                  </>
                )}
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="h-[390px] w-full mobile:w-[90%]">
                  {chartStatus === 'stake' ? (
                    <>
                      <TransactionTable tableData={transactionList?.filter(item => item.type === 'staking')} />
                    </>
                  ) : chartStatus === 'reward' ? (
                    <>
                      <TransactionTable tableData={transactionList?.filter(item => item.type === 'unstaking')} />
                    </>
                  ) : (
                    <>
                      <TradingTable tableData={transactionList?.filter(item => item.type === 'staking')} />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-[25px] w-full rounded-[12px] border-[1px] border-gray-200 bg-white p-[24px] shadow-md shadow-gray-300">
              <div className="mb-[15px] text-black">Gold Staker Rich List</div>
              <StakerList stakersList={stakersList} windowWidth={windowWidth} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[50px] flex h-[50px] w-full items-center justify-center bg-slate-800 backdrop-blur-sm">
        <div className="flex h-[45px] w-[90%] items-center justify-center text-white">
          Distribution Address:&nbsp;&nbsp;
          <Link href={`https://esc-testnet.elastos.io/address/${ContractAddress}`} target="_blank">
            {windowWidth > 574 ? (
              <>{ContractAddress}</>
            ) : (
              <>
                {ContractAddress.substring(0, 4)}...{ContractAddress.substring(38, 43)}
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
