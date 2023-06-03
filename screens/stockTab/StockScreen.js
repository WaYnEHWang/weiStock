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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {weiStyles} from '../../src/style';

export default function StockScreen({navigation}) {
  const [code, setCode] = useState();
  const [pending, setPending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: '即時報價',
      headerTintColor: '#000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  function searchButton() {
    if (code) {
      setShowInfo(true);
    }
  }

  const RecordView = () => {
    return (
      <View style={styles.recordView}>
        <Text>會顯示保存的股票</Text>
      </View>
    );
  };

  const StockInfo = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.infoViewTitleView}>
          <View style={styles.nameView}>
            <Text style={styles.nameViewText}>{code}</Text>
            <Text style={styles.nameViewText}>顯示股名</Text>
          </View>
          <View style={styles.addView}>
            <TouchableOpacity
              onPress={() => {
                setShowInfo(false);
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
        {!showInfo && <RecordView />}
        {showInfo && (
          <View
            style={[styles.infoView, weiStyles.itemBottom, weiStyles.itemTop]}>
            <StockInfo />
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
});
