import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';




import LandingLogin from '../screen/Login/LandingLogin'
import SubscriptionPlan from '../screen/Signup/SubscriptionPlan'
import LoginPage from '../screen/Login/LoginPage'
import SetupPayemntMethode from '../screen/Signup/SetupPayemntMethode'
// import SelectUserTypePage from '../screen/Login/SelectUserTypePage'
import ForgotPasswordPage from '../screen/Login/ForgotPasswordPage'


import SignupPage from '../screen/Signup/SignupPage'
import EmailVerificationPage from '../screen/Signup/EmailVerificationPage'
import RegistrationSuccessPage from '../screen/Signup/RegistrationSuccessPage'
import PhoneVerificationPage from '../screen/Signup/PhoneVerificationPage'


// import CreateProfilePage from '../screen/CreateFamilyAccount/CreateProfilePage'
// import SetupAllowancePage from '../screen/CreateFamilyAccount/SetupAllowancePage'
// import SetupLimitPage from '../screen/CreateFamilyAccount/SetupLimitPage'
// import SubscriptionPage from '../screen/CreateFamilyAccount/SubscriptionPage'
// import InitialTopUpPage from '../screen/CreateFamilyAccount/InitialTopUpPage'


// import ChildProfileCreatePage from '../screen/CreateChildAccount/ChildProfileCreatePage'
// import ChildCardDetailsPage from '../screen/CreateChildAccount/ChildCardDetailsPage'
// import ChildOtpPage from '../screen/CreateChildAccount/ChildOtpPage'

const Stack = createStackNavigator();
const AuthenticationStack = (props) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
    
      <Stack.Screen name="LandingLogin" component={LandingLogin} />
      <Stack.Screen name="SetupPayemntMethode" component={SetupPayemntMethode} />
      <Stack.Screen name="SubscriptionPlan" component={SubscriptionPlan} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} />
      <Stack.Screen name="SignupPage" component={SignupPage} />
      <Stack.Screen name="RegistrationSuccessPage" component={RegistrationSuccessPage} />
      <Stack.Screen name="EmailVerificationPage" component={EmailVerificationPage} />
      <Stack.Screen name="PhoneVerificationPage" component={PhoneVerificationPage} />




    </Stack.Navigator>
  );

}

export default AuthenticationStack