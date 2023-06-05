/* eslint-disable prettier/prettier */
import * as baseAPI from './base.api';
const baseUrl = 'https://openapi.twse.com.tw/v1';
const day_avg_all = '/exchangeReport/STOCK_DAY_AVG_ALL';
const bwibbu_all = '/exchangeReport/BWIBBU_ALL';

export async function getDayAvgAll() {
    const result = await baseAPI.get(baseUrl + day_avg_all, '');
    return result;
}

export async function getBWIBBUAll() {
    const result = await baseAPI.get(baseUrl + bwibbu_all, '');
    return result;
}
