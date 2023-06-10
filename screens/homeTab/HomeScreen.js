/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {weiStyles} from '../../src/style';
import * as StockAPI from '../../api/stock.api';
import {useFocusEffect} from '@react-navigation/native';
import * as LocalStorageService from '../../services/LocalStorageService';
import {hasNum, numberComma} from '../../common/method';

export default function HomeScreen({navigation}) {
  const [dayAvgAll, setDayAvgAll] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [code, setCode] = useState();
  const [share, setShare] = useState();
  const [price, setPrice] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [stockCode, setStockCode] = useState();
  const [stockName, setStockName] = useState();
  const [stockShares, setStockShares] = useState();
  const [stockPrices, setStockPrices] = useState();
  const [stockBuyingPrice, setStockBuyingPrice] = useState();
  const [stockDayAvg, setStockDayAvg] = useState();
  const [stockNowPrice, setStockNowPrice] = useState();
  const [stockRate, setStockRate] = useState();

  useEffect(() => {
    navigation.setOptions({
      title: '帳務庫存',
      headerTintColor: '#000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getDayAvgAll();
      //抓localStorage的資料
      getLocalData();
      return () => {};
    }, []),
  );

  async function getDayAvgAll() {
    let result = await StockAPI.getDayAvgAll();
    if (result.success) {
      setDayAvgAll(result.response);
    }
  }

  async function getLocalData() {
    const data = await LocalStorageService.getLocalStorage('@myStocks');
    console.log('local: ', JSON.stringify(data));
    if (data) {
      setLocalData(data);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getLocalData();
    setRefreshing(false);
  }, []);

  async function buyButtonPress() {
    if (code && price && share) {
      if (!hasNum(price) && !hasNum(share)) {
        Alert.alert('請輸入有效數字');
        return;
      }
      let name = '';
      const dayAvgFiltered = dayAvgAll.filter(word => word.Code === code);
      if (dayAvgFiltered.length === 1) {
        name = dayAvgFiltered[0].Name;
      } else {
        Alert.alert('查無此股票');
        return;
      }
      const localFiltered = localData.findIndex(word => word.Code === code);
      if (localFiltered < 0) {
        // 本地沒有這筆, 創建資料
        const data = [
          {
            Code: code,
            Name: name,
            deal: [
              {
                shares: Number(share),
                prices: Number(price),
                timestamp: Date.now(),
              },
            ],
          },
        ];
        if (!localData.length) {
          // 本地沒任何資料
          await LocalStorageService.setLocalStorage('@myStocks', data);
          setLocalData(data);
        } else {
          // 本地有資料，往後新增
          let newData = await LocalStorageService.getLocalStorage('@myStocks');
          newData.push(data[0]);
          await LocalStorageService.setLocalStorage('@myStocks', newData);
          setLocalData(newData);
        }
      } else {
        // 本地有這筆, 新增資料
        let newData = localData;
        newData[localFiltered].deal.push({
          shares: Number(share),
          prices: Number(price),
          timestamp: Date.now(),
        });
        await LocalStorageService.setLocalStorage('@myStocks', newData);
        setLocalData(newData);
      }
    } else {
      Alert.alert('請填寫完整');
    }
  }

  async function sellButtonPress() {
    if (code && share && price) {
      if (!hasNum(price) && !hasNum(share)) {
        Alert.alert('請輸入有效數字');
        return;
      }
      let name = '';
      const dayAvgFiltered = dayAvgAll.filter(word => word.Code === code);
      if (dayAvgFiltered.length === 1) {
        name = dayAvgFiltered[0].Name;
      } else {
        Alert.alert('查無此股票');
        return;
      }
      const localFiltered = localData.findIndex(word => word.Code === code);
      if (localFiltered.length < 0) {
        Alert.alert('庫存裡沒有: ' + name);
        return;
      } else {
        let newData = localData;
        const newShare = 0 - Number(share);
        newData[localFiltered].deal.push({
          shares: newShare,
          prices: Number(price),
        });
        setLocalData(newData);
        await LocalStorageService.setLocalStorage('@myStocks', newData);
      }
    } else {
      Alert.alert('請填寫完整');
    }
  }

  const BottomView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!showInfo && <RecordView />}
        {showInfo && (
          <View
            style={[styles.infoView, weiStyles.itemBottom, weiStyles.itemTop]}>
            <StockInfo />
          </View>
        )}
      </ScrollView>
    );
  };

  const TitleView = () => {
    return (
      <View style={styles.recordViewItem}>
        <View style={{flex: 2, paddingLeft: 5}}>
          <Text style={styles.infoViewButtonTitle}>股名</Text>
        </View>
        <View style={styles.contentView}>
          <Text style={styles.infoViewButtonTitle}>總股數</Text>
        </View>
        <View style={styles.contentView}>
          <Text style={styles.infoViewButtonTitle}>報酬率</Text>
        </View>
      </View>
    );
  };

  const RecordView = () => {
    const shareALL = data => {
      return data.reduce(
        (accumulator, deal) => accumulator + Number(deal.shares),
        0,
      );
    };

    const rate = stock => {
      const dayAvgFiltered = dayAvgAll.filter(word => word.Code === stock.Code);
      if (dayAvgFiltered.length === 1) {
        const closingPrice = dayAvgFiltered[0].ClosingPrice;
        const totalPrice = stock.deal.reduce(
          (accumulator, deal) =>
            accumulator + Number(deal.shares) * Number(deal.prices),
          0,
        );
        const totalShare = stock.deal.reduce(
          (accumulator, deal) => accumulator + Number(deal.shares),
          0,
        );
        const priceAvg = totalPrice / totalShare;
        const rate =
          Math.round(((closingPrice - priceAvg) / priceAvg) * 10000) / 100;
        return rate;
      } else {
        return '-';
      }
    };
    const priceALL = data => {
      return data.reduce(
        (accumulator, deal) =>
          accumulator + Number(deal.shares) * Number(deal.prices),
        0,
      );
    };

    const yesterdayPrice = code => {
      const dayAvgFiltered = dayAvgAll.filter(word => word.Code === code);
      if (dayAvgFiltered.length === 1) {
        return dayAvgFiltered[0].ClosingPrice;
      } else {
        return 0;
      }
    };

    function stockPress(stock) {
      setShowInfo(true);
      const shareAll = shareALL(stock.deal);
      const priceAll = priceALL(stock.deal);
      const buyingPrice = priceAll / shareAll;
      const nowPrice = yesterdayPrice(stock.Code);
      setStockCode(stock.Code);
      setStockName(stock.Name);
      setStockShares(numberComma(shareAll));
      setStockPrices(numberComma(priceAll));
      setStockBuyingPrice(buyingPrice);
      setStockDayAvg(nowPrice);
      setStockNowPrice(numberComma(nowPrice * shareAll));
      setStockRate(rate(stock));
    }
    return (
      <View style={styles.recordView}>
        <TitleView />
        {localData.map((stock, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              stockPress(stock);
            }}>
            <View style={styles.recordViewItem}>
              <View style={{flex: 2, paddingLeft: 5}}>
                <Text style={styles.infoViewButtonTitle}>{stock.Name}</Text>
                <Text style={styles.infoViewButtonText}>{stock.Code}</Text>
              </View>
              <View style={styles.contentView}>
                <Text style={styles.infoViewButtonText}>
                  {shareALL(stock.deal)}
                </Text>
              </View>
              <View style={styles.contentView}>
                <Text
                  style={
                    rate(stock) >= 0
                      ? styles.rateHighColor
                      : styles.rateLowColor
                  }>
                  {rate(stock)} %
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {!localData.length && (
          <Text style={styles.infoViewButtonText}>尚未新增股號</Text>
        )}
      </View>
    );
  };

  const StockInfo = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.infoViewTitleView}>
          <View style={styles.nameView}>
            <Text style={styles.nameViewText}>{stockCode}</Text>
            <Text style={styles.nameViewText}>{stockName}</Text>
          </View>
          <View style={styles.addView}>
            <TouchableOpacity
              onPress={() => {
                setShowInfo(false);
              }}>
              <Text style={styles.infoViewButtonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[weiStyles.line, styles.line]} />
        <View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>成本價</Text>
            <Text style={styles.infoViewButtonText}>{stockBuyingPrice} 元</Text>
          </View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>昨收</Text>
            <Text style={styles.infoViewButtonText}>{stockDayAvg} 元</Text>
          </View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>付出成本</Text>
            <Text style={styles.infoViewButtonText}>{stockPrices} 元</Text>
          </View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>現值</Text>
            <Text
              style={
                stockRate >= 0 ? styles.rateHighColor : styles.rateLowColor
              }>
              {stockNowPrice} 元
            </Text>
          </View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>總股數</Text>
            <Text style={styles.infoViewButtonText}>{stockShares} 股</Text>
          </View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>報酬率</Text>
            <Text
              style={
                stockRate >= 0 ? styles.rateHighColor : styles.rateLowColor
              }>
              {stockRate} %
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.topViewTitle}>輸入股號</Text>
        <View style={[styles.input, weiStyles.itemBottom, weiStyles.itemTop]}>
          <TextInput
            onChangeText={text => setCode(text)}
            value={code}
            clearButtonMode="always"
          />
        </View>
        <View style={styles.topViewTextInputView}>
          <View style={styles.textInputView}>
            <Text style={styles.topViewTitle}>股數(1張=1000股)</Text>
            <View
              style={[
                styles.inputShort,
                weiStyles.itemBottom,
                weiStyles.itemTop,
              ]}>
              <TextInput
                onChangeText={text => setShare(text)}
                value={share}
                clearButtonMode="always"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.topViewTitle}>股價</Text>
            <View
              style={[
                styles.inputShort,
                weiStyles.itemBottom,
                weiStyles.itemTop,
              ]}>
              <TextInput
                onChangeText={text => setPrice(text)}
                value={price}
                clearButtonMode="always"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.topViewButtonView}>
          <TouchableOpacity
            onPress={() => {
              buyButtonPress();
            }}>
            <View
              style={[
                styles.topViewButton,
                weiStyles.itemBottom,
                weiStyles.itemTop,
                styles.buyButtonColor,
              ]}>
              <Text style={styles.topViewButtonText}>買入</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sellButtonPress();
            }}>
            <View
              style={[
                styles.topViewButton,
                weiStyles.itemBottom,
                weiStyles.itemTop,
                styles.sellButtonColor,
              ]}>
              <Text style={styles.topViewButtonText}>賣出</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[weiStyles.line, styles.line]} />
      </View>
      <BottomView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    width: weiStyles.deviceWidth * 0.9,
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: weiStyles.arrowColor,
    backgroundColor: weiStyles.itemColor,
  },
  topView: {
    alignItems: 'center',
  },
  topViewTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  infoView: {
    width: weiStyles.deviceWidth * 0.9,
    height: weiStyles.deviceWidth * 0.8,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: weiStyles.arrowColor,
    backgroundColor: weiStyles.itemColor,
  },
  topViewButtonView: {
    flexDirection: 'row',
    width: weiStyles.deviceWidth,
    justifyContent: 'space-around',
  },
  topViewButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: weiStyles.deviceWidth * 0.4,
  },
  topViewButtonText: {
    color: 'white',
  },
  buyButtonColor: {
    backgroundColor: '#FF3B3B',
    // backgroundColor: weiStyles.mainColor,
  },
  sellButtonColor: {
    backgroundColor: '#00B800',
    // backgroundColor: weiStyles.mainColor,
  },
  line: {
    margin: 10,
  },
  infoViewButtonText: {
    color: 'black',
    fontSize: 16,
  },
  infoViewButtonTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoViewTitleView: {
    flexDirection: 'row',
    margin: 5,
  },
  recordView: {
    alignItems: 'center',
  },
  addView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameView: {
    flex: 5,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  nameViewText: {
    fontSize: 20,
  },
  infoViewBodyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: weiStyles.deviceWidth * 0.8,
  },
  recordViewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: weiStyles.deviceWidth,
    backgroundColor: 'white',
  },
  topViewTextInputView: {
    flexDirection: 'row',
    width: weiStyles.deviceWidth * 0.9,
    height: weiStyles.deviceHeight * 0.1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  textInputView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputShort: {
    width: weiStyles.deviceWidth * 0.4,
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: weiStyles.arrowColor,
    backgroundColor: weiStyles.itemColor,
    justifyContent: 'center',
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateHighColor: {
    fontSize: 16,
    color: '#FF3B3B',
  },
  rateLowColor: {
    fontSize: 16,
    color: '#00B800',
  },
});
