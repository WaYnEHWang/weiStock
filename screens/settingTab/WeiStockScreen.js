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
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState();

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
            result.sort((a, b) => Number(b.rate.slice(0, -1)) - Number(a.rate.slice(0, -1)));
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
                        <Text style={styles.infoViewButtonTitle}>成本價</Text>
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

    const Modal = () => {
        const InfoTitle = () => {
            return (
                <View style={styles.modalItem}>
                    <View style={[styles.modalItemData, {flex: 4}]}>
                        <Text style={styles.itemTitle}>
                            時間
                        </Text>
                    </View>
                    <View style={[styles.modalItemData, {flex: 2}]}>
                        <Text style={styles.itemTitle}>
                            操作
                        </Text>
                    </View>
                    <View style={[styles.modalItemData, {flex: 3}]}>
                        <Text style={styles.itemTitle}>
                            股數
                        </Text>
                    </View>
                    <View style={[styles.modalItemData, {flex: 3}]}>
                        <Text style={styles.itemTitle}>
                            均價
                        </Text>
                    </View>
                </View>
            );
        };
        return (
            <View style={styles.modalView}>
                <View style={styles.modalTitleView}>
                    <View style={styles.nameView}>
                        <Text style={styles.nameViewText}>{modalData.name}</Text>
                        <Text style={styles.nameViewText}>{modalData.id}</Text>
                        <Text style={styles.nameViewText}>{modalData.sellPrices}</Text>
                    </View>
                    <View style={styles.addView}>
                        <TouchableOpacity
                            onPress={() => {
                                setShow(false);
                            }}>
                            <View style={styles.closeBtnView}>
                                <Text style={styles.closeText}>關閉</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.lineView}>
                    <View style={[weiStyles.line, styles.line]} />
                </View>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>會長總股數</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22}}>{modalData.targetShares}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>會長成本價</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22}}>{modalData.targetAvgPrices}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>會長損益</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22, color: Number(modalData.targetRate.slice(0, -1)) >= 0 ? '#FF3B3B' : '#00B800'}}>
                                {modalData.targetRate.length >= 7 ? modalData.targetRate.slice(0, 5) + modalData.targetRate.slice(-1) : modalData.targetRate}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 50}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>我的總股數</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22}}>{modalData.myShares}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>我的成本價</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22}}>{modalData.myAvgPrices}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>我的損益</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 22, color: Number(modalData.sellPrices / modalData.myAvgPrices) >= 0 ? '#FF3B3B' : '#00B800'}}>
                                {modalData.myAvgPrices > 0 ? modalData.sellPrices / modalData.myAvgPrices * 100 + '%' : 0}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const Records = ({data}) => {

        const onPress = () => {
            const totalShare = (data) => {
                let shares = 0;
                data.forEach(element => {
                    shares += element.shares;
                });
                return numberComma(shares);
            };

            const averagePrice = (data) => {
                let shares = 0;
                let price = 0;
                data.forEach(element => {
                    shares += element.shares;
                    price += element.shares * element.prices;
                });
                const avgPrice = Math.round((price / shares) * 100) / 100;
                return avgPrice;
            };

            const newModalData = {
                name: data.stockName,
                id: data.id,
                targetShares: data.shares,
                targetAvgPrices: data.avgPrices,
                sellPrices: data.sellPrices,
                targetRate: data.rate,
            };
            const result = localData.filter(stock => stock.Code === data.id);
            if (result.length > 0){
                newModalData.myShares = totalShare(result[0].deal);
                newModalData.myAvgPrices = averagePrice(result[0].deal);
            } else {
                newModalData.myShares = 0;
                newModalData.myAvgPrices = 0;
            }

            setModalData(newModalData);
            setShow(true);
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
                                {data.sellPrices}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={[styles.infoViewButtonText, Number(data.rate.slice(0, -1)) >= 0 ? styles.buyingColor : styles.sellingColor]}>
                                {data.rate.length >= 7 ? data.rate.slice(0, 5) + data.rate.slice(-1) : data.rate}
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
                    {!show && stocks.map((stock, index) => <Records data={stock} key={index}/>)}
                    {show && <Modal/>}
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
