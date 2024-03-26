import * as React from 'react'
import ComboBox from '@/components/staking/components/StakingCombobox'
export default function Stake(props: any) {
  return (
    <>
      <div className="mt-[25px] w-full flex-row items-center justify-center text-black">
        <div className="flex h-[300px] w-full items-center justify-center mobile:h-[220px] desktop:h-[300px]">
          <div className="w-full flex-row">
            <div className="w-full flex-row items-center justify-center mobile:inline-flex">
              <div className="mx-auto w-[80%] mobile:mx-1 mobile:w-auto">
                <div className="ml-[10px] text-[12px]">Stake GOLD</div>
                <input
                  className="w-full rounded-[5px] border-[1px] border-slate-500 bg-transparent p-2 shadow-md outline-none mobile:w-[320px]"
                  onChange={props.handleChangeAmount}
                  disabled={props.disable}
                ></input>
              </div>
              <ComboBox
                period={props.period}
                stakingPeriod={props.stakingPeriod}
                setStakingPeriod={props.setStakingPeriod}
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <button
                className="mt-[40px] h-[45px] w-[80%] rounded-[7px] bg-slate-700 text-[17px] font-semibold text-white shadow-lg shadow-slate-800 hover:brightness-90 mobile:mt-[25px] mobile:w-[496px]"
                onClick={props.staking}
                disabled={props.disable}
              >
                {props.stakingButtonContext}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
