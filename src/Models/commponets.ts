import { RecoilState } from "recoil";

export interface IOrbiterSelectItemType {value: string, label: string}

export interface IOrbiterStringAtomKeyType {
    atomKey: RecoilState<string>;
    disabled?: boolean
}

export interface IOrbiterSelectAtomKeyType {
    atomKey: RecoilState<IOrbiterSelectItemType>;
    disabled?: boolean
}


export interface IOrbiterInputType extends IOrbiterStringAtomKeyType {
    placeholder: string;
}

export interface IOrbiterDefaultSelectType extends IOrbiterSelectAtomKeyType {
    selectList: Array<IOrbiterSelectItemType>
}

export interface IOrbiterSelectType extends IOrbiterDefaultSelectType {
    placeholder: string;
    triggerClassName?: string
}

export interface IOrbiterMultipleSelectType extends IOrbiterStringAtomKeyType {
    label: string
    selectList: Array<IOrbiterSelectItemType>
}