// User will be able to view following two options:
// 	•	Login: User will be redirected to the Login Screen.
// 	•	Sign Up: User will be redirected to the Sign-Up screen.

// Note: After selecting any of the screen user will be redirected to the respective screen as per the selection.

import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import Button from '../../components/Button'
import {SafeAreaView,StatusBar, ImageBackground,Image, View, Text, StyleSheet, Dimensions} from 'react-native'
var { height, width } = Dimensions.get('window');

const LandingLogin = (props) => {
  const { setLoggedInUserAuthToken } = props;
  useEffect(() => {
   
  }, [setLoggedInUserAuthToken])

 


  const onLogin=()=>{
    props.navigation.navigate('LoginPage')
  }

  const onSignup=()=>{
    props.navigation.navigate('SignupPage')
  }

  return (
<View style={styles.container}>
    <ImageBackground source={localImages.bg} style={styles.image} >
       <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
      <SafeAreaView style={{alignItems:'center'}}>
       
        <View style={styles.card}>
          <Image source={localImages.logo} style={{ height: 100, width: 280.71 }} />
           <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 19, color: colors.blubutton }]}>Money Parenting Made Zimble</Text>
        </View>
        <Button 
              height={60} 
              backgroundColor={colors.white} 
              width={width-94} 
              borderRadius={30} 
              marginTop={150}
              label="Login"
              labelColor={colors.childblue}
              onAction={onLogin}
              fontFamily={fonts.robotoRegular}
              fontSize={19}
              >
          </Button>
        <Button 
              height={60} 
              backgroundColor={colors.childblue} 
              width={width-94} 
              borderRadius={30} 
              marginTop={15}
              label="Signup"
              labelColor={colors.white} 
              onAction={onSignup}
              fontFamily={fonts.robotoRegular}
              fontSize={19}
              ></Button>
       
              
       
      </SafeAreaView>
      </ImageBackground>
      </View>


  )
}

const mapStateToProps = (state) => {
  console.log("check store data", state.localStates);
  return {
    loginStatus: state.localStates.loginStatus,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(actions.setLoggedInUserAuthToken(token));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LandingLogin)

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  card: {
    height: 189,
    width: width - 40,
    marginHorizontal: 18,
   
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

robotoRegularText: {
  fontFamily: fonts.robotoRegular,
  color: colors.subTitleColor
},
});