/* eslint-disable prettier/prettier */
import {StatusBar, Dimensions, Platform} from 'react-native';
var {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export const weiStyles = {
    containerBackgroundColor: '#F5F5F5',
    photoDefaultBackgroundColor: 'grey',
    titleSize: 18,
    itemTitleSize: 16,
    mainColor: '#5599FF',
    focusColor: '#0066FF',
    arrowColor: '#DCDCDC',
    itemColor: '#FFFFFF',
    item: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        flexDirection: 'row',
        width: deviceWidth * 0.9,
    },
    itemTop: {
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
    },
    itemBottom: {
        borderBottomStartRadius: 15,
        borderBottomEndRadius: 15,
    },
    line: {
        height: 0,
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    bar: {
        height: STATUSBAR_HEIGHT,
        backgroundColor: '#F5F5F5',
    },
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth,
};
