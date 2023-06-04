/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setLocalStorage(key, value){
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e){
        console.log('error: ', e);
        return;
    }
    // console.log("sucess store key: " + key + " value: " + value);
}

export async function getLocalStorage(key){
    let result = '';
    await AsyncStorage.getItem(key, (err, value) => {
        if (err) {
            console.log('error: ' + err);
            return;
        } else {
            if (JSON.parse(value) != null) {
                result = JSON.parse(value);
            }
        }
    })
    // console.log("get local value = " + result);
    return result;
}