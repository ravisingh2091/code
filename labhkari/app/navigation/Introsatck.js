import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screen/onBoarding/LoginScreen'
import SignupScreen from '../screen/onBoarding/SignupScreen'
import CreateProfileScreen from '../screen/onBoarding/CreateProfileScreen'
import OtpVerificationScreen from '../screen/onBoarding/OtpVerificationScreen'
import ForgotPassScreen from '../screen/onBoarding/ForgotPassScreen'
import OtpLoginScreen from '../screen/onBoarding/OtpLoginScreen';
import ForgetPasSetScreen from '../screen/onBoarding/ForgetPassSetScreen';

const Stack = createStackNavigator();
const Introstack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false
    }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpLoginScreen" component={OtpLoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="ForgotPassScreen" component={ForgotPassScreen} />
      <Stack.Screen name="ForgetPasSetScreen" component={ForgetPasSetScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      <Stack.Screen name="CreateProfileScreen" component={CreateProfileScreen} />
    </Stack.Navigator>
  );

}

export default Introstack