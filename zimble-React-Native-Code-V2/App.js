/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Provider, connect } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from "./app/utils/store";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import  RootNavigator from './app/navigationStack/RootNavigator'
import SplashScreen from 'react-native-splash-screen'
// import firebase from '@react-native-firebase/app'
// import analytics from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-community/google-signin';
// import messaging from '@react-native-firebase/messaging';
import firebase from 'react-native-firebase';

import DeviceInfo from 'react-native-device-info';
import FlashMessage from "react-native-flash-message";

// const { accessToken, idToken } = await GoogleSignin.signIn();
//const dogsApp = firebase.app('zimble');
const App: () => React$Node = () => {
  useEffect(() => {
    SplashScreen.hide()    
    callOnLoad()
   },[])

    const callOnLoad =()=>{
      checkPermission()
      DeviceInfo.isEmulator().then(isEmulator => {
        // false
        console.log(isEmulator)
        if(!isEmulator){
          // registerDeviceWithFcm()
          // checkPermission()
        }
      });
      anaylaytics()
     
      GoogleSignin.configure({
        // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        // webClientId: '112083228693-5641pmoddplfd62cprnq1fudurc84583.apps.googleusercontent.com', // required
      });
    }
 

  const  checkPermission =async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  const requestPermission=async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (e) {
      console.log(e)
      // User has rejected permissions
      //console.log('permission rejected');
    }
  }




  const   getToken=async () => {
    // let fcmToken = await AsyncStorage.getItem('fcmToken_mental');
    // //console.log('fcmToken',fcmToken)
    // if (!fcmToken) {
   var  fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log('fcmToken_mental', fcmToken)
      ///storeData('fcmToken', fcmToken)
      // console.log('fcmToken new', fcmToken)
      try {
       // await addFcmToken(fcmToken);
      } catch (e) { console.log(e) }
     
      // await AsyncStorage.setItem('fcmToken_mental', fcmToken);
    }
    // }

  }
   const anaylaytics   = async()=>{
     
    await firebase.analytics().logEvent('product_view', {
      id: '123456789',
      color: 'red',
      via: 'ProductCatalog',
    });
   }
  return (
    <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
      
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientGreenThree} />
      
      <RootNavigator></RootNavigator>
      {/* <FlashMessage position="bottom" duration={2000} /> */}
      </NavigationContainer>
      </PersistGate>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
