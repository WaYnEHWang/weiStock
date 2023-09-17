/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {weiStyles} from '../../src/style';
import * as StockAPI from '../../api/stock.api';
import {useFocusEffect} from '@react-navigation/native';
import * as LocalStorageService from '../../services/LocalStorageService';
import { numberComma } from '../../common/method';

export default function WeiStockScreen({navigation}) {
    const [stocks, setStocks] = useState([]);
    const [localData, setLocalData] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            title: '會漲股專區',
            headerTintColor: '#000',
            headerBackTitleVisible: false,
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            getStocks();
            //抓localStorage的資料
            getLocalData();
            return () => {};
        }, []),
    );

    async function getStocks() {
        let result = await StockAPI.getStocks();
        if (result) {
            // console.log(JSON.stringify(result));
            setStocks(result);
        }
    }

    async function getLocalData() {
        const data = await LocalStorageService.getLocalStorage('@myStocks');
        console.log('local: ', JSON.stringify(data));
        if (data) {
            setLocalData(data);
        }
    }

    const TitleView = () => {
        return (
            <View>
                <View style={styles.recordViewItem}>
                    <View style={styles.infoView}>
                        <Text style={styles.infoViewButtonTitle}>股名</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.infoViewButtonTitle}>總股數</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.infoViewButtonTitle}>成本均價</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.infoViewButtonTitle}>現價</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.infoViewButtonTitle}>漲幅</Text>
                    </View>
                </View>
                <View style={weiStyles.line} />
            </View>
        );
    };

    const Records = ({data}) => {

        const onPress = () => {
            console.log('');
        };

        return (
            <View>
                <TouchableOpacity onPress={() => onPress()}>
                    <View style={styles.recordViewItem}>
                        <View style={styles.infoView}>
                            <Text style={styles.infoViewButtonTitle}>{data.stockName}</Text>
                            <Text style={styles.infoViewButtonText}>{data.id}</Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {data.shares}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {data.avgPrices}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {data.shares}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {data.shares}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={weiStyles.line} />
            </View>
        );
    }


        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <TitleView/>
                    {stocks.map((stock, index) => <Records data={stock} key={index}/>)}
                </ScrollView>
            </View>
        );
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
    },
    recordViewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: weiStyles.deviceWidth,
        backgroundColor: 'white',
    },
    infoViewButtonTitle: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoViewButtonText: {
        color: 'black',
        fontSize: 16,
    },
    contentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingLeft: 5,
    },
    modalView: {
        width: weiStyles.deviceWidth * 0.9,
        height: weiStyles.deviceHeight * 0.7,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: weiStyles.arrowColor,
        backgroundColor: weiStyles.itemColor,
        borderRadius: 10,
    },
    modalTitleView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 5,
    },
    nameView: {
        flex: 5,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    nameViewText: {
        fontSize: 20,
    },
    addView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnView: {
        backgroundColor: weiStyles.mainColor,
        borderRadius: 5,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
        margin: 5,
    },
    line: {
        margin: 10,
    },
    scrollView: {
        alignItems: 'center',
    },
    lineView: {
        alignItems: 'center',
    },
    modalItemData: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItem: {
        flexDirection: 'row',
        flex: 1,
        marginVertical: 3,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemContent: {
        fontSize: 18,
    },
    itemLine: {
        height: 0,
        width: '90%',
        borderWidth: 0.5,
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    buyingColor: {
        color: '#FF3B3B',
    },
    sellingColor: {
        color: '#00B800',
    },
});
