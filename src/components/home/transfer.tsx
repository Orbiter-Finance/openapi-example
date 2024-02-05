
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowBigDownDashIcon } from 'lucide-react';
import React from 'react';
import From from './from';
import To from './to';
import MakerRouter from './maker-router';
import Amount from './amount';
import Send from './send';

export default function Transfer() {

    return (
        <div className="w-full">
            <div className='w-full'>
                <From />
            </div>
            <div className='w-full flex justify-center items-center my-4'>
                <ArrowBigDownDashIcon />
            </div>
            <div className='w-full'>
                <To />
            </div>
            <MakerRouter />
            <Amount />
            <Send />
        </div>
    );
}
