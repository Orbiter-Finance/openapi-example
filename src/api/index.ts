import { IRouters } from "@/Models/chain";
import { BASE_URL } from "@/config/env";
import axiosService from "@/lib/request";
import { objToParams } from "@/utils/objToParams";


export interface Result<T> {
    status: string;
    message: string;
    result: T;
}

export interface BridgeCoinPriceData {
    [key: string]: string;
}

export interface BridgeCoinPriceResult {
    data: BridgeCoinPriceData;
}

export async function fetchChains(): Promise<any> {
    try {
        const res: Result<any> = await axiosService.get(`${BASE_URL}/sdk/chains`, {

        }).then((res: { data: any; }) => res.data);
        if (res.status === 'success') {
            return res.result;
        } else {
            return Promise.reject(res);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function fetchRoutes(params: any): Promise<IRouters[]> {
    try {
        const res: Result<IRouters[]> = await axiosService.get(`${BASE_URL}/sdk/routers` + objToParams(params), {

        }).then((res: { data: any; }) => res.data);
        if (res.status === 'success') {
            return res.result;
        } else {
            return Promise.reject(res);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function fetchTransactionStatus(hash: string): Promise<any> {
    try {
        const res: Result<any> = await axiosService.get(`${BASE_URL}/sdk/transaction/status/${hash}`, {

        }).then((res: { data: any; }) => res.data);
        if (res.status === 'success') {
            return res.result;
        } else {
            return Promise.reject(res);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}