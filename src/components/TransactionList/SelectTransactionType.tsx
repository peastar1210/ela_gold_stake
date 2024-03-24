import * as React from 'react'
import Link from 'next/link'
export default function SelectTransactionType(props: any) {
  return (
    <>
      <div className="absolute right-[10%] top-[40px] rounded bg-slate-700 px-1 py-[3px] text-[12px]">
        <button
          className={`mr-2 ${props.chartPrice} rounded-sm px-1 `}
          onClick={() => {
            props.handleChangeChart('price')
          }}
        >
          Price
        </button>
        <button
          className={`mr-2 ${props.chartStakes} rounded-sm px-1`}
          onClick={() => {
            props.handleChangeChart('staked')
          }}
        >
          Staked
        </button>
        <button
          className={`mr-2 ${props.chartRewards} rounded-sm px-1 `}
          onClick={() => {
            props.handleChangeChart('rewards')
          }}
        >
          Rewards
        </button>
      </div>
      <div className="mt-[40px]">
        {props.chartStatus === 'stake' ? (
          <div className="text-white">Total Gold Balance</div>
        ) : props.chartStatus === 'reward' ? (
          <div className="text-white">Total Rewards Amount</div>
        ) : (
          <div className="text-white">GOLD token price</div>
        )}
      </div>
    </>
  )
}
