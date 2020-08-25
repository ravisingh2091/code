import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from "react-redux";
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react'
import 'react-native-gesture-handler';

import store, { persistor } from './app/redux/index'
import RootNavigator from './app/navigation/RootNavigator'
import { navigationRef, isMountedRef } from './app/utils/navigationRef';

const App: () => React$Node = () => {
  useEffect(() => {
    SplashScreen.hide()
    isMountedRef.current = true;

    return () => (isMountedRef.current = false);
  })
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.gradientGreenThree} />
            <RootNavigator></RootNavigator>
          </PersistGate>

        </Provider>
      </NavigationContainer>
    </>
  );
};

export default App;

// https://www.getpostman.com/collections/444fa6333204310167c4
// ./gradlew assembleRelease