/* eslint-disable prettier/prettier */

export function toJson(data) {
    return JSON.stringify(data, null, 2);
}

export function hasNum(str) {
    let result = str.match(/^(?=.*\d).+$/);
    if (result == null) {return false;}
    return true;
}