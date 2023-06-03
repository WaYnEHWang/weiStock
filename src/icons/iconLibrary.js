/* eslint-disable prettier/prettier */
import React from 'react';
import {AntDesign} from '@expo/vector-icons';

export const UserIcon = ({state}) => {
    switch (state) {
        case 'focused':
            return <AntDesign name="user" size={26} color="yellow" />;
        case 'unFocused':
            return <AntDesign name="user" size={26} color="black" />;
    }
};
