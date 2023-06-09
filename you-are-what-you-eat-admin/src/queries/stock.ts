
import {
    StockInfo,
    SurplusUpload
} from '@/models/stock_info'

import { GetApi, PostApi, DeleteApi } from "@/utils/requests"


class StockInfoApi {

    public async getStockInfo(amount?: number, date?: string, ing_name?: string, record_id?: string, surplus?: number) {
        return (await (GetApi("/IngredientRecords", {
            amount: amount,
            date: date,
            ing_name: ing_name,
            record_id: record_id,
            surplus: surplus,
        }))).data as StockInfo[];
    }




    public addStock: (stockinfo: StockInfo) => Promise<string> = async (stockinfo) => {
        const r = (await (PostApi("/IngredientRecords/AddIngredientRecord", stockinfo)));
        return r.statusText;
    }

    public updateStock = async (surplusUpload: SurplusUpload) => {
        return (await (PostApi("/IngredientRecords/UpdateIngredientRecord",
            surplusUpload
        ))).statusText as string
    }
    public delStock = async (record_id: number) => {
        return (await (DeleteApi("/IngredientRecords/Delete", {
            record_id
        }))).statusText as string
    }


}

export const stockInfoApi = new StockInfoApi();