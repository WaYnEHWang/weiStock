/* eslint-disable prettier/prettier */
import { toJson } from '../common/method';

export class ResultInfo{
    constructor() {
        this.errorCode = '';
        this.statusText = '';
        this.message = '';
        this.success = true;
        this.response = '';
    }
}

function timeoutError() {
    let output = {};
    output.error_code = '9999';
    output.status_text = '';
    output.message = '伺服器維護中QQ';
    output.success = false;
    output.response = null;
    return output;

}
function checkSuccess(isSuccess, result) {
    let output = new ResultInfo();
    if (isSuccess === false) {
        output.errorCode = result.statusCode;
        output.success = false;
        output.response = result;
    } else {
        output.errorCode = result.statusCode;
        output.success = true;
        output.response = result;
    }
    return output;
}

const requestOptions = (method, token, data) => {
    const controller = new AbortController();
    setTimeout(() => {
        controller.abort();
    }, 5000);
    if (token.length > 0) {
        if (method === 'GET') {
            return {
                method: method,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: token,
                }),
                signal: controller.signal,
            };
        }
        return {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: token,
            }),
            body: toJson(data),
            signal: controller.signal,
        };
    } else {
        return {
            method: method,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            // body: toJson(data),
            signal: controller.signal,
        };
    }
};

export async function get(url, data) {
    try {
        let response = await fetch(url, requestOptions('GET', '', data));
        let result = await response.json();
        return checkSuccess(response.ok, result);
    } catch (err) {
        console.log(err);
        return checkSuccess(false, timeoutError());
    }
}

export async function getWithToken(url, token, data) {
    try {
        let response = await fetch(url, requestOptions('GET', token, data));
        let result = await response.json();
        return checkSuccess(response.ok, result);
    } catch (err) {
        console.log(err);
        return checkSuccess(false, timeoutError());
    }
}
