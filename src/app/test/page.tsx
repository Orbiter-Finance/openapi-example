"use client";


import { Button } from '@/components/ui/button';
import useZksyncLiteTransfers from '@/lib/zksyncLite';
import React, { useCallback } from 'react'

const chain = "ZKSYNC_TEST"
const token = "0x0000000000000000000000000000000000000000"
const userAddress = "0x0261Ef5449359A7C6114E1f82213932f51A13bFf"
const amount = "0.000001"

export default function Page() {

    const { ZksyncLiteTransfers } = useZksyncLiteTransfers()

    const transfer = useCallback(
    async  () => {
        const res = await ZksyncLiteTransfers({
            chain,
            token,
            userAddress,
            amount,
            id: ""
        })
      },
      [ZksyncLiteTransfers],
    )
    

  return (
    <div>
        <Button onClick={()=>{
            transfer()
        }}>111111</Button>
    </div>
  )
}
