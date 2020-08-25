// User will be able to enter the OTP verification code that will be received on the provided mobile number. 

// Note: If user enters the correct OTP verification code on the screen then his mobile number will be verified successfully. 

import React, { useState, useEffect } from 'react'
import { ImageBackground, TouchableOpacity, StatusBar, ScrollView, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import { ButtonWithoutShadow } from '../../components/Button'
var { height, width } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native'

import { StackActions } from "@react-navigation/routers/src/StackRouter";
import { verifyOtp, resendOtp } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
const PhoneVerificationPage = (props) => {

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [resend, setResendStatus] = useState(null)
  const [otp, setOtp] = useState('')
  const [page, setPage] = useState('')
  const { setLoggedInUserAuthToken } = props;
  const [sppiner, setLoader] = useState(false)
  const route = useRoute();
  var sharedClass = new SharedClass();
  useEffect(() => {

    var demo = route.params.email
    console.log('hy', demo)
    setEmail(route.params.email)
    setPhone(route.params.phone)
    setResendStatus(route.params.resendStatus)
    setPage(route.params && route.params.page ? route.params.page : '')
    console.log('hyy', email)
  }, [])



  const onSignup = async () => {
    console.log('hy', email)
    let message = {}
    if (!email) {
      message.message = 'Please enter email id'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(email)) {
      message.message = 'Please enter valid email id'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!otp) {
      message.message = 'Please enter otp'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    setLoader(true)
    
    let req = {
      phone: phone,
      otp: otp
    }
    try {

      const result = await verifyOtp(req);
      setLoader(false)

      console.log(result)

      if (result && result.status == 'success') {
        props.setLoggedInUserDetails(result.details)
        props.setLoggedInUserAuthToken(result.details.userToken)
      

        if (result.details.emailVerifyStatus == '0') {

          if (page && page == 'login') {
            props.navigation.dispatch(
              StackActions.replace('EmailVerificationPage', {
                email: email,
                resendStatus: 'email',
                phone: phone
              })
            );
          } else {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LandingLogin',
                  },
                  {
                    name: 'EmailVerificationPage',
                    params: {
                      email: email,
                      resendStatus: 'email',
                      phone: phone
                    },
                  },
                ],
              })
            );
          }
        } else {
         
          props.navigation.goBack()
        }


      } else {
        message.message = result.message
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    }
   
  }

  const onResendOtp = async () => {
    console.log('hy', email)
    let message = {}
    if (!email) {
      message.message = 'Please enter email id'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(email)) {
      message.message = 'Please enter valid email id'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    setLoader(true)
   
    let req = {
      phone: phone,
    }
    try {
      const result = await resendOtp(req);
      console.log(result)
      setLoader(false)
      if (result && result.status == 'success') {
        
        message.message = 'OTP sent successfully!'
        message.type = 'success'
        sharedClass.ShowSnakBar(message)

      } else {
        message.message = result.message
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }

 

  return (
    <View style={styles.container}>
      <ImageBackground source={localImages.bg} style={styles.image} >
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
          <View style={{}}>
            <ScrollView
              style={{ paddingBottom: 90 }}
              contentContainerStyle={styles.scrollview}
            
            >
              <View style={[styles.content, { marginBottom: 20 }]}>
                <NetConnectionScreen></NetConnectionScreen>
                {sppiner && <Loder data={sppiner}></Loder>}
                <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
                  <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                      <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={25} />
                      <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 19 }]}>Back</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={{ width: width - 40, marginLeft: 20, alignItems: 'center', marginTop: 50 }}>
                  <Image source={localImages.emailVerification} style={styles.socialImage} />
                  <Text style={[styles.heading,{marginVertical:15}]}>{resend ? 'Enter the code sent on your phone' : 'Enter the code sent on your phone, Check your email inbox for email verification'}</Text>
              
                  <SmoothPinCodeInput
                    containerStyle={{ alignSelf: 'center' }}
                    cellSpacing={30}
                    cellSize={60}
                    password={false}
                    cellStyle={{
                      borderWidth: 1,
                      
                      backgroundColor: colors.inputBoxBackground,
                      borderColor: colors.lightGray,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 2,
                        height: 4,
                      },
                      shadowOpacity: 0.30,
                      shadowRadius: 4.65,
                      elevation: 8,
                      marginTop: 40
                    }}
                    cellStyleFocused={{
                      borderBottomWidth: 1.5,
                      borderColor: colors.greenText1,
                    }}
                    textStyle={{
                      color: '#3E455B',
                      fontSize: 20
                    }}
                    autoFocus
                    placeholder={''}
                    value={otp}
                    onTextChange={pin => setOtp(pin)}
                  
                  />

                  <ButtonWithoutShadow
                    height={40}
                    backgroundColor={'rgba(255,255,255,.1)'}
                    width={width - 60}
                    borderRadius={30}
                    marginTop={50}
                    label="Resend OTP?"
                    labelColor={colors.childblue}
                    onAction={onResendOtp}
                    fontFamily={fonts.robotoRegular}
                    fontSize={19}
                  ></ButtonWithoutShadow>

                  <ButtonWithoutShadow
                    height={60}
                    backgroundColor={colors.childblue}
                    width={width - 60}
                    borderRadius={30}
                    marginTop={100}
                    label="Verify Phone"
                    labelColor={colors.white}
                    onAction={onSignup}
                    fontFamily={fonts.robotoRegular}
                    fontSize={19}
                  ></ButtonWithoutShadow>
                </View>
              </View>

            </ScrollView>

          </View>

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
    setLoggedInUserDetails: userDetails => {
      dispatch(actions.setLoggedInUserDetails(userDetails));
    },
    setLoggedInUserStatus: loginStatus => {
      dispatch(actions.setLoggedInUserStatus(loginStatus));
    },
    setLoggedInUserType: loginType => {
      dispatch(actions.setLoggedInUserType(loginType));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerificationPage)

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
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,.2)',
  },
  scrollview: {
    flexGrow: 1,
    ///  marginBottom:90
  },
  heading: {
    fontFamily: fonts.robotoMedium,
    fontSize: 20,
    color: colors.titleText
  },

  socialImage: {
    height: 86, width: 86
  },
  robotoRegularText: {
    fontFamily: fonts.robotoRegular,
    color: colors.subTitleColor
  },

});