import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import Login from '../screen/login'
import ParentStack from './ParentStack'
import ChildStack from './ChildStack'
import AuthenticationStack from './AuthenticationStack'
import Introstack from './Introsatck'
const Stack = createStackNavigator();
import { connect } from 'react-redux';
import {actions} from "../reduxActionAndReducer/reducer";
const RootNavigator=(props)=>{
    return (
        <Stack.Navigator screenOptions={{
           headerShown: false
          }}>
            {props.loginStatus=='child'?<Stack.Screen name="ChildStack" component={ChildStack} />:props.loginStatus=='parent'?<Stack.Screen name="ParentStack" component={ParentStack} />:props.introstatus?<Stack.Screen name="AuthenticationStack" component={AuthenticationStack} />:<Stack.Screen name="Introstack" component={AuthenticationStack} />}
            
        </Stack.Navigator>
      );

}
const mapStateToProps = (state) => {
    
    return {
      loginStatus: state.localStates.loginStatus,
      introstatus: state.localStates.introstatus,
    };
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      setLoggedInUserAuthToken: token => {
        dispatch(actions.setLoggedInUserAuthToken(token));
      },
    };
  };
export default connect(mapStateToProps, mapDispatchToProps)(RootNavigator)