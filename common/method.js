/* eslint-disable prettier/prettier */

export function toJson(data) {
    return JSON.stringify(data, null, 2);
}

export function hasNum(str) {
    let result = str.match(/^(?=.*\d).+$/);
    if (result == null) {return false;}
    return true;
}

export function numberComma(num){
    let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(comma, ',');
}
