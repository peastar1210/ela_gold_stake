/* eslint-disable jsx-a11y/alt-text */
'use client'
import React, { Children, SetStateAction, useEffect, useState } from 'react'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { parseFixed } from '@ethersproject/bignumber'
import { BigNumber, Contract, ethers, providers } from 'ethers'
import ReactTooltip from 'react-tooltip'
import ComboBox from '../../components/comboBox'
import axios from 'axios'
import tokenAbi from '../tokenabi.json'
import elaAbi from '../abi.json'
import { right } from '@popperjs/core'
export default function Home() {
  return (
    <div>
      <Main />
    </div>
  )
}

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
const walletAddress = '0x0dC06F43d0e7fe94a8d2DB433055f4190007F7dF'
const GOLDTOKEN = '0xaA9691BcE68ee83De7B518DfCBBfb62C04B1C0BA'
function Main() {
  const [token, setToken] = useState({ symbol: 'GOLD', balance: '' })
  const [tokenList, setTokenList] = useState([
    { symbol: 'GOLD', balance: '' },
    { symbol: 'ELA', balance: '' },
  ])
  const [deposit, setDeposit] = useState<Number>(0)
  const [telegramId, setTelegramId] = useState<Number>(0)
  const chainId = useChainId()
  const { data: client } = useWalletClient({ chainId })
  const signer = React.useMemo(() => (client ? clientToSigner(client) : undefined), [client])
  const { address } = useAccount()
  const [disable, setDisable] = useState(false)
  const [process, setProcess] = useState(false)
  const [navbar, setNavbar] = useState('hidden')
  const handleDepositAmount = e => {
    setDeposit(e.target.value)
  }
  const handleTelegramId = e => {
    setTelegramId(e.target.value)
  }
  const handleChangeNavbar = () => {
    if (navbar === 'hidden') {
      setNavbar('block')
    } else {
      setNavbar('hidden')
    }
  }
  const handleDeposit = async () => {
    if (deposit === 0 || telegramId === 0) {
      toast('Invalid Input', {
        hideProgressBar: false,
        autoClose: 2000,
        type: 'error',
        position: 'bottom-right',
      })
    } else {
      setProcess(true)
      const response = await axios.post('https://ela-tipping-bot-113.onrender.com/api/deposit/progress', {
        // const response = await axios.post('https://telegram-tip-bot.onrender.com/api/deposit/progress', {
        id: telegramId,
        address: address,
      })
      const _id = response.data
      if (token.symbol === 'GOLD') {
        const amountToWei = parseFixed(deposit.toString(), 18)
        const tokenContract = new Contract(GOLDTOKEN, tokenAbi, signer)
        const tx = await tokenContract.transfer(walletAddress, amountToWei)
        const api2Response = await axios.post('https://ela-tipping-bot-113.onrender.com/api/deposit/pending', {
          // const api2Response = await axios.post('https://telegram-tip-bot.onrender.com/api/deposit/pending', {
          token: token.symbol,
          address: address,
          amount: deposit,
          id: telegramId,
          tx: tx.hash,
          _id: _id,
        })
        const txHash = await tx.wait()
        const response = await axios.post('https://ela-tipping-bot-113.onrender.com/api/deposit', {
          // const response = await axios.post('https://telegram-tip-bot.onrender.com/api/deposit', {
          token: token.symbol,
          address: address,
          amount: deposit,
          id: telegramId,
          tx: txHash.transactionHash,
          _id: _id,
        })
        if (response.data === 'success') {
          setProcess(false)
          const sendSuccessfulMessageData = await axios.post(
            'https://ela-tipping-bot-113.onrender.com/api/deposit/sendSuccessfulMessage',
            // const sendSuccessfulMessageData = await axios.post(
            //   'https://telegram-tip-bot.onrender.com/api/deposit/sendSuccessfulMessage',
            {
              id: telegramId,
              token: token.symbol,
              amount: deposit,
            }
          )
          toast('Success', {
            hideProgressBar: false,
            autoClose: 2000,
            type: 'success',
            position: 'bottom-right',
          })
        }
      } else {
        const amountToWei = parseFixed(deposit.toString(), 18)
        const transactionRequest = {
          to: walletAddress,
          value: amountToWei.toString(),
        }
        const receipt = await signer.sendTransaction(transactionRequest)
        const api2Response = await axios.post('https://ela-tipping-bot-113.onrender.com/api/deposit/pending', {
          // const api2Response = await axios.post('https://telegram-tip-bot.onrender.com/api/deposit/pending', {
          token: token.symbol,
          address: address,
          amount: deposit,
          id: telegramId,
          tx: receipt.hash,
          _id: _id,
        })
        const txHash = await receipt.wait()
        const response = await axios.post('https://ela-tipping-bot-113.onrender.com/api/deposit', {
          // const response = await axios.post('https://telegram-tip-bot.onrender.com/api/deposit', {
          token: token.symbol,
          address: address,
          amount: deposit,
          id: telegramId,
          tx: txHash.transactionHash,
          _id: _id,
        })
        if (response.data === 'success') {
          const sendSuccessfulMessageData = await axios.post(
            'https://ela-tipping-bot-113.onrender.com/api/deposit/sendSuccessfulMessage',
            // const sendSuccessfulMessageData = await axios.post(
            //   'https://telegram-tip-bot.onrender.com/api/deposit/sendSuccessfulMessage',
            {
              id: telegramId,
              token: token.symbol,
              amount: deposit,
            }
          )
          setProcess(false)
          toast('Success', {
            hideProgressBar: false,
            autoClose: 2000,
            type: 'success',
            position: 'bottom-right',
          })
        }
      }
    }
  }
  const getBalance = async (address: any) => {
    try {
      const response = await axios.get(
        `https://esc.elastos.io/api/?module=account&action=eth_get_balance&address=${address}`
      )
      const elaBalanceTemp = (parseInt(response.data.result, 16) / Math.pow(10, 18)).toString()
      const elaBalanceNumber = parseInt(response.data.result, 16) / Math.pow(10, 18)
      let elaAmountDecimalLength = 0
      let elaBalance = ''
      if (elaBalanceTemp.split('.').length > 1) {
        const sublength = elaBalanceTemp.split('.')[1]
        elaAmountDecimalLength = sublength.length
        if (elaAmountDecimalLength > 5) {
          elaBalance = elaBalanceTemp.split('.')[0] + "." + sublength.substring(0,5) + '...'
        } else {
          elaBalance = (parseInt(response.data.result, 16) / Math.pow(10, 18)).toString()
        }
      } else {
        elaBalance = (parseInt(response.data.result, 16) / Math.pow(10, 18)).toString()
      }

      const tokenContract = new Contract(GOLDTOKEN, tokenAbi, signer)
      const balance = await tokenContract.balanceOf(address).catch(err => {
        throw 'balance --->'
      })
      let goldBalance = ''
      let goldAmountDecimalLength = 0
      let goldBalanceTemp = (parseInt(balance.toString()) / Math.pow(10, 18)).toString()
      const goldBalanceNumber = parseInt(balance.toString()) / Math.pow(10, 18)
      if (goldBalanceTemp.split('.').length > 1) {
        const sublength = goldBalanceTemp.split('.')[1]
        goldAmountDecimalLength = sublength.length
        console.log("goldAmountDecimalLength-------->", goldAmountDecimalLength)
        if (goldAmountDecimalLength > 8) {
          goldBalance = goldBalanceTemp.split('.')[0] + "." + sublength.substring(0,8) + '...'
        } else {
          goldBalance = (parseInt(balance.toString()) / Math.pow(10, 18)).toString()
        }
      } else {
        goldBalance = (parseInt(balance.toString()) / Math.pow(10, 18)).toString()
      }
      setTokenList([
        { symbol: 'GOLD', balance: goldBalance.toString() },
        { symbol: 'ELA', balance: elaBalance.toString() },
      ])
      if (token.symbol === 'GOLD' && goldBalance !== null && elaBalance !== null) {
        setToken({ symbol: 'GOLD', balance: goldBalance.toString() })
      } else {
        setToken({ symbol: 'ELA', balance: elaBalance.toString() })
      }
    } catch (err) {
      console.log('err----------->', err)
    }
  }
  const setFormat = () => {
    setToken({ symbol: 'GOLD', balance: '' })
    setTokenList([
      { symbol: 'GOLD', balance: '' },
      { symbol: 'ELA', balance: '' },
    ])
  }
  useEffect(() => {
    if (address && signer) {
      getBalance(address)
      setDisable(false)
    } else {
      setDisable(true)
      setFormat()
    }
  }, [address, signer])
  return (
    <>
      <div className="absolute h-full w-full">
        <div className="relative z-10 flex h-[70px] w-full items-center bg-slate-800">
          <div className="absolute left-[20px] z-10 flex h-[70%] items-center">
            <img className="h-full" src="logo.png" />
            <button className="ml-[15px] inline-flex rounded-lg bg-slate-700 px-[12px] py-[9px] font-sans text-[100%]  font-bold text-white shadow-lg shadow-gray-800 hover:brightness-90">
              BACK HOME
            </button>
          </div>
          <div className="absolute  hidden h-[80px] w-full items-center justify-center font-sans text-[18px] font-bold text-white mobile:flex">
            TIP GOLD TO A FRIEND
          </div>
          <div className={`absolute right-[20px] inline-flex`}>
            <ConnectWallet />
          </div>
        </div>
        <div className="flex h-[91%] w-full justify-center">
          <div className="relative flex h-[700px] w-full items-center justify-center overflow-auto rounded-[12px] mobile:mt-[50px] mobile:w-[400px] mobile:border-[1px] mobile:border-gray-300 mobile:shadow-lg">
            <div className="w-[80%]">
              <div className="w-full flex-row">
                <div className="mb-[0px] flex w-full items-center justify-center text-[25px]">Tipbot Deposit</div>
                <div className="mb-[30px] flex w-full items-center justify-center text-[12px]">
                  {'( ' + 'for ElastosGoldTipbot' + ' )'}
                </div>
                <div className="ml-[10px] text-[12px]">Deposit Amount</div>
                <input
                  className="w-full rounded-[5px] border-[1px] border-slate-200 bg-transparent p-2 shadow-md outline-none"
                  onChange={handleDepositAmount}
                  placeholder="0123"
                />
                <ComboBox token={token} tokenList={tokenList} setToken={setToken} />
                <div className="relative ml-[10px] mt-[2px] inline-flex h-[20px] w-full align-text-bottom text-[12px]">
                  Telegram ID
                  <button className="has-tooltip ml-[5px] text-[12px]">
                    <span className="tooltip -mt-8 w-[245px] rounded bg-gray-100 p-1 text-left text-black shadow-lg">
                      You can find your telegram ID by pressing the deposit command in the tipbot. The link to the bot
                      can be found in the list at the bottom.
                    </span>
                    <button className="absolute bottom-[4px] rounded-[3px] bg-slate-500 px-2 font-bold text-white">
                      ?
                    </button>
                  </button>
                </div>
                <input
                  className="w-full rounded-[5px] border-[1px] border-slate-200 bg-transparent p-2 shadow-md outline-none"
                  onChange={handleTelegramId}
                  placeholder="xxxxxxxxx"
                />
                <div className="relative mt-[10px] w-full">
                  <button className="has-tooltip absolute right-[5px] text-[12px]">
                    <span className="tooltip -mt-8 ml-[-240px] max-w-[245px] rounded bg-gray-100 p-1 text-left font-normal text-black shadow-lg">
                      Connect your wallet and press Deposit once everything is filled out.
                      <br /> <br />
                      Be aware that you shall not interfere with API calls or change your IP address during the deposit
                      and sending process, as this likely results in loss of funds.
                    </span>
                    <button className="rounded-[3px] bg-slate-500 px-2 font-bold text-white">?</button>
                  </button>
                </div>

                {disable === true ? (
                  <>
                    <button
                      className="mt-[20px] h-[45px] w-full rounded-[7px] bg-gray-500 text-[17px] font-semibold text-white shadow-lg shadow-gray-600 hover:brightness-90"
                      onClick={handleDeposit}
                      disabled={disable}
                    >
                      <>Please Connect Wallet</>
                    </button>
                  </>
                ) : (
                  <>
                    {process === false ? (
                      <>
                        <button
                          className="mt-[20px] h-[45px] w-full rounded-[7px] bg-slate-700 text-[17px] font-semibold text-white shadow-lg shadow-slate-800 hover:brightness-90"
                          // onClick={handleDeposit}
                          onClick={handleDeposit}
                          disabled={process}
                        >
                          <>Deposit</>
                        </button>
                      </>
                    ) : (
                      <button
                        className="mt-[20px] h-[45px] w-full rounded-[7px] bg-slate-700 text-[17px] font-semibold text-white shadow-lg shadow-slate-800 hover:brightness-90"
                        onClick={handleDeposit}
                        disabled={process}
                      >
                        <>Processing...</>
                      </button>
                    )}
                  </>
                )}

                <div className="mt-[25px] w-full border-b-[1px] border-slate-800"></div>
                <div className="mt-[25px] inline-flex w-full items-center justify-center font-bold text-gray-700">
                  ElastosGoldTipbot
                  <button className="has-tooltip ml-[5px] text-[12px]">
                    <span className="tooltip -mt-8 max-w-[245px] rounded bg-gray-100 p-1 text-left font-normal text-black shadow-lg">
                      If you want to add tipping to your own telegram group, add this bot as admin.
                    </span>
                    <button className="rounded-[3px] bg-slate-500 px-2 font-bold text-white">?</button>
                  </button>
                </div>
                <div className="mt-[5px] flex w-full items-center justify-center">
                  <Link href={`https://t.me/ElastosGoldTipbot`} target="_blank">
                    {'https://t.me/ElastosGoldTipbot'}
                  </Link>
                </div>
                <div className="mt-[5px] flex w-full items-center justify-center font-bold text-gray-700">
                  Supported Chats
                </div>
                <div className="mt-[5px] flex w-full items-center justify-center">
                  <Link href={`https://t.me/elastosgold`} target="_blank">
                    {'https://t.me/elastosgold'}
                  </Link>
                </div>
                <div className="mt-[0px] flex w-full items-center justify-center">
                  <Link href={`https://t.me/elastosgroup`} target="_blank">
                    {'https://t.me/elastosgroup'}
                  </Link>
                </div>

                <div className="mt-[5px] flex w-full items-center justify-center font-bold text-gray-700">
                  Bot Address
                  <button className="has-tooltip ml-[5px] text-[12px]">
                    <span className="tooltip -mt-8 max-w-[245px] rounded bg-gray-100 p-1 text-left font-normal text-black shadow-lg">
                      Do not deposit to the bot address directly.
                    </span>
                    <button className="rounded-[3px] bg-slate-500 px-2 font-bold text-white">?</button>
                  </button>
                </div>
                <div className="relative mt-[5px] flex w-full items-center justify-center">
                  <a
                    href={`https://eth.elastos.io/address/${walletAddress}`}
                    target="_blank"
                    className="group relative"
                  >
                    {walletAddress.substring(0, 4)}...{walletAddress.substring(38, 43)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}
