import React, { useState, useEffect } from 'react'
import {StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, } from '../../components/Button'

var { height, width } = Dimensions.get('window');

const RegistrationSuccessPage = (props) => {


  const { setLoggedInUserAuthToken } = props;
  useEffect(() => {

  }, [setLoggedInUserAuthToken])

  const onLogin = () => {
    // console.log('hy', email)
    props.navigation.navigate('LoginPage')

  }


  return (
<SafeAreaView style={{ alignItems: 'center',backgroundColor:colors.white }}>
    <LinearGradient colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>
       <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        <View style={{ height: height - 40, justifyContent:'center', alignItems:'center'}}>
      <Image source={localImages.success} style={styles.socialImage}  />
        <Text style={styles.heading}>Success</Text>
        
        <Text style={{fontFamily:fonts.robotoBold, fontSize:15, color:colors.charcolCOlor,marginTop:42, marginHorizontal:30, textAlign:'center'}}>Your account is activated now, you can login and create child account.</Text>
      
        <ButtonWithoutShadow
          height={60}
          backgroundColor={colors.childblue}
          width={width - 94}
          borderRadius={30}
          marginTop={120}
          label="NEXT"
          labelColor={colors.white}
          onAction={onLogin}
          fontFamily={fonts.robotoRegular}
          fontSize={19}
        ></ButtonWithoutShadow>
        </View>
     
    </LinearGradient>
    </SafeAreaView>



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
    
    setLoggedInUserStatus: loginStatus => {
      dispatch(actions.setLoggedInUserStatus(loginStatus));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSuccessPage)

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
  linearGradient: {
   
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialImage:{
    height:134, width:134
  },

});