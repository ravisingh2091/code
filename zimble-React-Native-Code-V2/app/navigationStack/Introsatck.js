import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';


import Introduction from '../screen/Login/Introduction'

const Stack = createStackNavigator();
const Introstack = (props) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
       
     
      
      <Stack.Screen name="Introduction" component={Introduction} />
      

    </Stack.Navigator>
  );

}

export default Introstack