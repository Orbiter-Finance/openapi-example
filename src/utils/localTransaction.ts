import { GLOBAL_LOCAL_TRANSACTION_KEY } from "@/constants";

export const updateLocalTransaction = (parmas: { [key: string]: string; }) => {
    if (typeof window !== "undefined") {
        window.sessionStorage.setItem(GLOBAL_LOCAL_TRANSACTION_KEY, JSON.stringify(parmas));
    }

};

export const readLocalTransaction = (): { [key: string]: string; } => {
    let data: { [key: string]: string; } = {};
    if (typeof window !== "undefined") {
        data  = JSON.parse(globalThis.sessionStorage.getItem(GLOBAL_LOCAL_TRANSACTION_KEY) || JSON.stringify({}));
    }
    return data
};