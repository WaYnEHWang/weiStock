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
import {hasNum} from '../../common/method';

export default function HomeScreen({navigation}) {
  const [dayAvgAll, setDayAvgAll] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [code, setCode] = useState();
  const [share, setShare] = useState();
  const [price, setPrice] = useState();
  const [refreshing, setRefreshing] = useState(false);

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
    if (data) {
      console.log(JSON.stringify(data));
      setLocalData(data);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setRefreshing(false);
  }, []);

  const TopView = () => {
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
            {Code: code, Name: name, deal: [{shares: share, prices: price}]},
          ];
          if (!localData.length) {
            // 本地沒任何資料
            await LocalStorageService.setLocalStorage('@myStocks', data);
            setLocalData(data);
          } else {
            // 本地有資料，往後新增
            let newData = await LocalStorageService.getLocalStorage(
              '@myStocks',
            );
            newData.push(data);
            await LocalStorageService.setLocalStorage('@myStocks', newData);
            setLocalData(newData);
          }
        } else {
          // 本地有這筆, 新增資料
          let newData = localData;
          newData[localFiltered].deal.push({shares: share, prices: price});
          setLocalData(newData);
          await LocalStorageService.setLocalStorage('@myStocks', newData);
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
          const newShare = 0 - share;
          newData[localFiltered].deal.push({shares: newShare, prices: price});
          setLocalData(newData);
          await LocalStorageService.setLocalStorage('@myStocks', newData);
        }
      } else {
        Alert.alert('請填寫完整');
      }
    }
    return (
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
    );
  };

  const BottomView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <RecordView />
      </ScrollView>
    );
  };

  const RecordView = () => {
    return (
      <View style={styles.recordView}>
        {localData.map((stock, index) => (
          <View key={index} style={styles.recordViewItem}>
            <View style={{flex: 2, paddingLeft: 5}}>
              <Text style={styles.infoViewButtonTitle}>{stock.Name}</Text>
              <Text style={styles.infoViewButtonText}>{stock.Code}</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.infoViewButtonText}>月均價</Text>
              <Text style={styles.infoViewButtonText}>
                {stock.MonthlyAveragePrice}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.infoViewButtonText}>昨收</Text>
              <Text style={styles.infoViewButtonText}>
                {stock.ClosingPrice}
              </Text>
            </View>
          </View>
        ))}
        {!localData.length && (
          <Text style={styles.infoViewButtonText}>尚未新增股號</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopView />
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
    height: weiStyles.deviceWidth * 0.7,
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
    // backgroundColor: '#FF3B3B',
    backgroundColor: weiStyles.mainColor,
  },
  sellButtonColor: {
    // backgroundColor: '#00B800',
    backgroundColor: weiStyles.mainColor,
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
});
