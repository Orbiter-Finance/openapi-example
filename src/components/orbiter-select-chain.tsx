import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from '@/lib/utils';
import { useRecoilState } from 'recoil';
import { IOrbiterInputType } from '@/Models/commponets';


interface  IOrbiterSelectChainType extends IOrbiterInputType {
    list: any[];
    placeholder: string,
    changeCall?: (value: string)=> void
};

export default function OrbiterSelectChain({
    list,
    atomKey,
    placeholder,
    changeCall,
    disabled
}: IOrbiterSelectChainType) {

    const [value, setValue] = useRecoilState(atomKey)

    const [open, setOpen] = useState(false);

    const label = list.find((framework) => framework.value === value)?.label

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={!!disabled} className='w-full' asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {label ?? "Select Chain"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command value={value} filter={(val, search)=>{

                    const searchStr = search.toLocaleLowerCase()
                    const group = list.filter((item)=> item.value === val)[0]
                    const nameStr = group?.label?.toLocaleLowerCase() || ""

                    return +nameStr.includes(searchStr)
                }}>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup className='max-h-60	overflow-auto'>
                        {list.map((framework) => (
                            <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(value) => {
                                    setValue(framework.value);
                                    setOpen(false);
                                    changeCall && changeCall(value)
                                }}
                            >
                                {framework.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
