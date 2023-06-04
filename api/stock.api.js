/* eslint-disable prettier/prettier */
import * as baseAPI from './base.api';
const baseUrl = 'https://openapi.twse.com.tw/v1';
const day_avg_all = '/exchangeReport/STOCK_DAY_AVG_ALL';

export async function getDayAvgAll() {
    const result = await baseAPI.get(baseUrl + day_avg_all, '');
    return result;
}