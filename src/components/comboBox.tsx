import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
export default function ComboBox(props: any) {
  return (
    <div className="z-[9999] mt-[25px] h-[45px] w-full rounded-[5px] text-black mb-[15px]">
      <Listbox value={props.token.symbol} onChange={props.setToken}>
        <div className="relative mt-1 bg-transparent">
          <Listbox.Button className="sm:text-sm relative w-full inline-flex cursor-default rounded-lg border-[1px] border-slate-200 bg-transparent py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300">
            <span className="truncate relative inline-flex"><div>{props.token.symbol}</div></span>
            <div className='absolute right-7'>{props.token.balance}</div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="sm:text-sm absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {props.tokenList.map((token, tokeIdx) => (
                <Listbox.Option
                  key={tokeIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sky-100 text-slate-900' : 'text-gray-900'
                    }`
                  }
                  value={token}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'} relative w-full inline-flex`}>
                        <div>{token.symbol}</div>
                        <div className='absolute right-3'>{token.balance}</div>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
