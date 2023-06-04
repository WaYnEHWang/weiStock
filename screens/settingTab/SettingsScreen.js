import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {weiStyles} from '../../src/style';
import * as LocalStorageService from '../../services/LocalStorageService';

export default function SettingsScreen({navigation}) {
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            cleanLocalData();
          }}>
          <View
            style={[weiStyles.item, weiStyles.itemBottom, weiStyles.itemTop]}>
            <Text style={styles.itemText}>刪除即時報價所有資料</Text>
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
});
