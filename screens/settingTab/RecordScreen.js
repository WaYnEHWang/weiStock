/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import {Text, View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useCallback} from 'react';
import {weiStyles} from '../../src/style';
import {useFocusEffect} from '@react-navigation/native';
import * as LocalStorageService from '../../services/LocalStorageService';

export default function RecordScreen({navigation}) {
    const [localData, setLocalData] = useState([]);
    const [deal, setDeal] = useState([]);
    const [show, setShow] = useState(false);

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
            title: '交易紀錄',
            headerTintColor: '#000',
            headerBackTitleVisible: false,
            });
            getLocalData();
            return () => {};
        }, [navigation]),
    );

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
                </View>
                <View style={weiStyles.line} />
            </View>
        );
    };

    const Records = ({data}) => {
        const totalShare = () => {
            let shares = 0;
            data.deal.forEach(element => {
                shares += element.shares;
            });
            return shares;
        }

        const averagePrice = () => {
            let shares = 0;
            let price = 0;
            data.deal.forEach(element => {
                shares += element.shares;
                price += element.shares * element.prices;
            });
            return price / shares;
        }

        const onPress = () => {
            setDeal(data);
            setShow(true);
        }

        return (
            <View>
                <TouchableOpacity onPress={() => onPress()}>
                    <View style={styles.recordViewItem}>
                        <View style={styles.infoView}>
                            <Text style={styles.infoViewButtonTitle}>{data.Name}</Text>
                            <Text style={styles.infoViewButtonText}>{data.Code}</Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {totalShare()}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.infoViewButtonText}>
                                {averagePrice()}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={weiStyles.line} />
            </View>
        );
    }

    const Modal = () => {
        const InfoTitle = () => {
            return (
                <View style={styles.modalItem}>
                    <View style={styles.modalItemData}>
                        <Text>
                            時間
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            操作
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            股數
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            均價
                        </Text>
                    </View>
                </View>
            );
        }
        const Info = ({item}) => {
            const toDate = () => {
                let dateFormat = new Date(item.timestamp);
                return dateFormat.getFullYear() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getDate();
            }

            return (
                <View style={styles.modalItem}>
                    <View style={styles.modalItemData}>
                        <Text>
                            {toDate()}
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            {item.shares >= 0 ? '買入' : '賣出'}
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            {item.shares}
                        </Text>
                    </View>
                    <View style={styles.modalItemData}>
                        <Text>
                            {item.prices}
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.modalView}>
                <View style={styles.modalTitleView}>
                    <View style={styles.nameView}>
                        <Text style={styles.nameViewText}>{deal.Code}</Text>
                        <Text style={styles.nameViewText}>{deal.Name}</Text>
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
                <View style={styles.scrollView}>
                    <View style={[weiStyles.line, styles.line]} />
                </View>
                <ScrollView>
                    <InfoTitle/>
                    {deal.deal.map((item, index) => <Info key={index} item={item}/>)}
                </ScrollView>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TitleView/>
                {!show && localData.map((record, index) => <Records data={record} key={index}/>)}
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
        fontSize: 18,
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
        flex: 2,
        paddingLeft: 5,
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
    modalItemData: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItem: {
        flexDirection: 'row',
        flex: 1,
    }
});
