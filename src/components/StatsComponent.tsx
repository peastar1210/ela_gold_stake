import * as React from 'react'

export default function StatsComponent(props: any) {
  return (
    <>
      <div className="relative h-full w-full">
        <div className="text-[28px] mobile:mt-[25px]">Global Stats</div>
        <div className="mt-[20px] grid w-[90%] grid-cols-2 justify-between mobile:inline-flex">
          <div>
            <div className="text-[12px]">Total GOLD in Pool</div>
            <div className="text-[25px]">{parseFloat(props.totalBalance?.toFixed(5))}</div>
          </div>
          <div className="ml-[20px]">
            <div className="text-[12px]">Gold distributed last 180 days</div>
            <div className="text-[25px]">{parseFloat(props.distributedAmount?.toFixed(5))}</div>
          </div>
          <div className="ml-0 mobile:ml-[20px]">
            <div className="text-[12px]">ROI last year</div>
            <div className="text-[25px]">
              {props.totalStakedAmount === 0 ? (
                <>0</>
              ) : (
                <>
                  {parseFloat(
                    (((props.totalBalance - props.totalStakedAmount) / props.totalStakedAmount) * 100).toFixed(3)
                  )}
                  %
                </>
              )}
            </div>
          </div>
          <div className="ml-[20px]">
            <div className="text-[12px]">Stakers</div>
            <div className="text-[25px]">{props.stakersNum}</div>
          </div>
        </div>
        <div className="border-b-whtie mt-[25px] w-full border-[1px]"></div>
        <div className="mt-[25px] text-[28px]">Your stats</div>
        <div className="mt-[20px] inline-flex">
          <div className="mr-[70px] text-black">
            <div className="text-[12px]">Your GOLD</div>
            <div className="text-[25px]">{parseFloat(props.userStakedAmount.toFixed(4).toString())}</div>
          </div>
          <div>
            <div className="text-[12px]">Your rewards in last 180 days</div>
            <div className="text-[25px]">{parseFloat(props.totalRewardAmount.toFixed(4).toString())}</div>
          </div>
        </div>
      </div>
    </>
  )
}
