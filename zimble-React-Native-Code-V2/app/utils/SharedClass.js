/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, Alert, ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, Picker, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';


var { height, width } = Dimensions.get('window');

import Snackbar from 'react-native-snackbar';
import { colors } from './constant'
class SharedClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelShow: false
        }

    }
    static navigationOptions = {
        header: null
        // title: 'CommonClass',
        // headerStyle: {
        //     backgroundColor: '#fff',
        // },
        // headerTintColor: '#4C1726',
        // headerTitleStyle: {
        //     textAlign: 'center',
        //     flex: 1,
        // },
        //headerRight: <View/>
    }

    HideSnakBar() {
      //  hideMessage()
    }

    ShowSnakBar({ message, type ,delay}) {



        setTimeout(() => {
            console.log('hy')
            Snackbar.show({
                text: message,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: type == 'success' ? colors.success : type == 'error' ? colors.error : colors.warning, // background color
                textColor: type == 'success' ? colors.white : type == 'error' ? colors.white : colors.inputTextColor,// text color
            });
        },delay?delay: 500)
        // showMessage({
        //     message:message,
        //    // description: "My message description",
        //    duration:2000,
        //     type: type,
        //     backgroundColor: type=='success'?colors.success:type=='error'?colors.error:colors.warning, // background color
        //     color: type=='success'?colors.white:type=='error'?colors.white:colors.inputTextColor,// text color
        // });

    }


}
export default SharedClass

