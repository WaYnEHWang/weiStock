import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {weiStyles} from '../../src/style';
import * as LocalStorageService from '../../services/LocalStorageService';

export default function SettingsScreen({navigation}) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: '設定',
      headerTintColor: '#000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  async function cleanLocalData() {
    await LocalStorageService.setLocalStorage('@localStocks', []);
  }

  async function cleanMyData() {
    await LocalStorageService.setLocalStorage('@myStocks', []);
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {showButton && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('WeiStock');
            }}>
            <View
              style={[
                weiStyles.item,
                weiStyles.itemBottom,
                weiStyles.itemTop,
                styles.itemView,
              ]}>
              <Text style={styles.itemText}>會長股專區</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onLongPress={() => {
            setShowButton(!showButton);
          }}
          onPress={() => {
            cleanLocalData();
          }}>
          <View
            style={[
              weiStyles.item,
              weiStyles.itemBottom,
              weiStyles.itemTop,
              styles.itemView,
            ]}>
            <Text style={styles.itemText}>刪除即時報價所有資料</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            cleanMyData();
          }}>
          <View
            style={[
              weiStyles.item,
              weiStyles.itemBottom,
              weiStyles.itemTop,
              styles.itemView,
            ]}>
            <Text style={styles.itemText}>刪除帳務庫存所有資料</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  itemView: {
    marginTop: 10,
  },
});
