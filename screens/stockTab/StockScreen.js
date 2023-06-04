/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {weiStyles} from '../../src/style';
import * as StockAPI from '../../api/stock.api';
import * as LocalStorageService from '../../services/LocalStorageService';
import {useFocusEffect} from '@react-navigation/native';

export default function StockScreen({navigation}) {
  const [code, setCode] = useState();
  const [searchCode, setSearchCode] = useState();
  const [pending, setPending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLocalInfo, setShowLocalInfo] = useState(false);
  const [dayAvgAll, setDayAvgAll] = useState([]);
  const [name, setName] = useState('');
  const [closingPrice, setClosingPrice] = useState('');
  const [searchStock, setSearchStock] = useState({});
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: '即時報價',
      headerTintColor: '#000',
      headerBackTitleVisible: false,
    });
    getDayAvgAll();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
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
    const data = await LocalStorageService.getLocalStorage('@localStocks');
    if (data) {
      setLocalData(data);
    }
  }

  async function searchButton() {
    if (code) {
      const codeStr = code.toString();
      const result = dayAvgAll.filter(stock => stock.Code === codeStr);
      if (result[0]) {
        setShowInfo(true);
        setName(result[0].Name);
        setClosingPrice(result[0].ClosingPrice);
        setSearchStock(result[0]);
        setSearchCode(code);
      } else {
        Alert.alert('查無股號');
      }
    }
  }

  const RecordView = () => {
    function stockPress(stock) {
      setShowLocalInfo(true);
      setName(stock.Name);
      setClosingPrice(stock.ClosingPrice);
      setSearchStock(stock);
      setSearchCode(stock.Code);
    }
    return (
      <View style={styles.recordView}>
        {/*<View style={styles.recordViewItem}>
          <Text style={styles.infoViewButtonText}>股號</Text>
          <Text style={styles.infoViewButtonText}>名稱</Text>
          <Text style={styles.infoViewButtonText}>收盤價</Text>
    </View>*/}
        {localData.map((stock, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              stockPress(stock);
            }}>
            <View style={styles.recordViewItem}>
              <Text style={styles.infoViewButtonText}>{stock.Code}</Text>
              <Text style={styles.infoViewButtonText}>{stock.Name}</Text>
              <Text style={styles.infoViewButtonText}>
                {stock.ClosingPrice}
              </Text>
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
    async function addStock() {
      const result = localData.filter(
        stockObj => stockObj.Code === searchStock.Code,
      );
      if (result[0]) {
        Alert.alert('已有此股號');
      } else {
        let newLocalData = localData;
        newLocalData.push(searchStock);
        setLocalData(newLocalData);
        await LocalStorageService.setLocalStorage('@localStocks', newLocalData);
      }
      setShowInfo(false);
    }
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.infoViewTitleView}>
          <View style={styles.nameView}>
            <Text style={styles.nameViewText}>{searchCode}</Text>
            <Text style={styles.nameViewText}>{name}</Text>
          </View>
          <View style={styles.addView}>
            <TouchableOpacity
              onPress={() => {
                addStock();
              }}>
              <Text style={styles.infoViewButtonText}>新增</Text>
            </TouchableOpacity>
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
            <Text style={styles.infoViewButtonText}>收盤價</Text>
            <Text style={styles.infoViewButtonText}>{closingPrice}</Text>
          </View>
        </View>
      </View>
    );
  };

  const LocalStockInfo = () => {
    async function deleteStock() {
      const idx = localData.indexOf(searchStock);
      if (idx > -1) {
        let newLocalData = localData;
        newLocalData.splice(idx, 1);
        setLocalData(newLocalData);
        await LocalStorageService.setLocalStorage('@localStocks', newLocalData);
      }
      setShowLocalInfo(false);
    }

    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.infoViewTitleView}>
          <View style={styles.nameView}>
            <Text style={styles.nameViewText}>{searchCode}</Text>
            <Text style={styles.nameViewText}>{name}</Text>
          </View>
          <View style={styles.addView}>
            <TouchableOpacity
              onPress={() => {
                deleteStock();
              }}>
              <Text style={styles.infoViewButtonText}>刪除</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addView}>
            <TouchableOpacity
              onPress={() => {
                setShowLocalInfo(false);
              }}>
              <Text style={styles.infoViewButtonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[weiStyles.line, styles.line]} />
        <View>
          <View style={styles.infoViewBodyView}>
            <Text style={styles.infoViewButtonText}>收盤價</Text>
            <Text style={styles.infoViewButtonText}>{closingPrice}</Text>
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
        <TouchableOpacity
          onPress={() => {
            searchButton();
          }}>
          <View
            style={[
              styles.topViewButton,
              weiStyles.itemBottom,
              weiStyles.itemTop,
            ]}>
            <Text style={styles.topViewButtonText}>搜尋</Text>
          </View>
        </TouchableOpacity>
        <View style={[weiStyles.line, styles.line]} />
      </View>
      <ScrollView>
        {!showInfo && !showLocalInfo && <RecordView />}
        {showInfo && (
          <View
            style={[styles.infoView, weiStyles.itemBottom, weiStyles.itemTop]}>
            <StockInfo />
          </View>
        )}
        {showLocalInfo && (
          <View
            style={[styles.infoView, weiStyles.itemBottom, weiStyles.itemTop]}>
            <LocalStockInfo />
          </View>
        )}
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
  topViewButton: {
    backgroundColor: weiStyles.mainColor,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: weiStyles.deviceWidth * 0.8,
  },
  topViewButtonText: {
    color: 'white',
  },
  line: {
    margin: 10,
  },
  infoViewButtonText: {
    color: 'black',
    fontSize: 16,
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
    height: 40,
    width: weiStyles.deviceWidth,
    backgroundColor: 'white',
  },
});
