// Login cUser will be able to login into the platform by providing following details: 
// 	•	Email Id 
// 	•	Password

// Note: Email id should be the same email id by which user will be registered or performed the sign-up on the platform.

// Note: The email id and the password will be verified and after successful verification user will be redirected to the Home | Dashboard Screen.

// Forgot Password: User will be redirected to the Forgot password Screen. 



import React, { useState, useEffect } from 'react'
import { ImageBackground,StatusBar, TouchableOpacity,ScrollView, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, Alert } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'

import InputBox from '../../components/InputBox'



import {login, resendOtp, resendEmail } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'
import firebase from 'react-native-firebase';
import { useFocusEffect, CommonActions } from '@react-navigation/native';


var { height, width } = Dimensions.get('window');

const LoginPage = (props) => {

  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [initializing, setInitializing] = useState(true);
  var [userType, setUserType] = useState();
  var [fcmToken, setFcmToken] = useState(null);
  var [sppiner, setLoader] = useState(false)
  var [secureTextEntry, setSecureTextEntry] = useState(true)
  var { setLoggedInUserAuthToken } = props;
  var route = useRoute();
  var sharedClass = new SharedClass();


  useEffect(() => {
    checkPermission()
  
    var demo = route.params && route.params.userType ? route.params.userType : '1'
    console.log('hy', demo)
    setUserType(demo)
  }, [setLoggedInUserAuthToken])

  useFocusEffect(
    React.useCallback(() => {

      setEmail('')
      setPassword('')

      
    }, [])
  );
  
  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      
      getToken();
    } catch (e) {
      console.log(e)
      
    }
  }




  const getToken = async () => {
    
    var fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      
      setFcmToken(fcmToken)
      console.log('fcmToken_mental', fcmToken)
      
      try {
        
      } catch (e) { console.log(e) }

      
    }
    

  }

  const onLogin = async () => {
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

    if (!password) {
      message.message = 'Please enter password'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    setLoader(true)
    //console.log(loder)
    let req = {
      email: email,
      password: password,
      userType: userType,
      deviceToken: fcmToken ? fcmToken : 'dhfhdfhdfdhfhdfhdfdfhdfhdfh'
    }
    try {
      const result = await login(req);
      console.log(result)
      setLoader(false)
      if (result && result.status == 'success') {
       
        result.details.fromPage = 'login'
        props.setLoggedInUserDetails(result.details)
        props.setLoggedInUserAuthToken(result.details.userToken)
       
        if (result.details.userType == '1') {
          if (result.details.signUpState == '1' && result.details.userType == '1') {/// otp not verify


            setTimeout(() => {
              props.navigation.navigate('EmailVerificationPage', { email: email, resendOtp: 'yes' })
              setEmail('')
              setPassword('')
            }, 200);
          }
          else if (result.details.signUpState == '2' && result.details.userType == '1') {///faimly not created


            setTimeout(() => {
              props.navigation.navigate('CreateProfilePage', { email: email })
              setEmail('')
              setPassword('')
            }, 200);
          } else if (result.details.signUpState == '3' && result.details.userType == '1') {///subscription not done
            
            setTimeout(() => {
              props.setLoggedInUserStatus('parent')
              setEmail('')
              setPassword('')
            }, 200);

          } else {
            if(!result.details.cardDetail || result.details.cardDetail==0){
              props.navigation.navigate('SetupPayemntMethode')
            }
            else if(result.details.subscription.status=='0' || result.details.subscription.status==0){
                 props.navigation.navigate('SubscriptionPlan')
            }else{
              setTimeout(() => {
                props.setLoggedInUserStatus('parent')
                setEmail('')
                setPassword('')
              }, 1000);
            }
           
          }

        } else if (result.details.userType == '0') {


          setTimeout(() => {

            props.setLoggedInUserStatus('child')
            setEmail('')
            setPassword('')
          }, 1000);
          //  props.setLoggedInUserStatus('child')
        }

      } else {
        result.details.fromPage = 'login'
        props.setLoggedInUserDetails(result.details)
        props.setLoggedInUserAuthToken(result.details.userToken)
        props.setLoggedInUserType(result.details.userType)
        

          if (result.details.phoneOtpStatus == '0') {
            props.navigation.navigate('PhoneVerificationPage', { email: email, resendStatus: 'phone', phone: result.details.phone, page: 'login' })
            onResendOtp(result.details.phone)
          }

          else if (result.details.emailVerifyStatus == '0') {
            props.navigation.navigate('EmailVerificationPage', { email: email, resendStatus: 'email', phone: result.details.phone })
            onResendLink(email)
          }
          
        else {

          setTimeout(() => {

            message.message = result.message
            message.type = 'info'
            sharedClass.ShowSnakBar(message)
          }, 1000);

        }

      }
    } catch (error) {
      setLoader(false)
      setTimeout(() => {

        message.message = 'Something went wrong'
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }, 1000);

    }

  }

  const onResendOtp = async (emaillocal) => {
    console.log('hy', email)
    let message = {}



    //setLoader(true)
    //console.log(loder)

    let req = {
      phone: emaillocal
    }
    try {
      const result = await resendOtp(req);
      console.log(result)
      setLoader(false)
      setEmail('')
      setPassword('')
     
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    }
    
  }




  const onResendLink = async (emaillocal) => {
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


   
    let req = {
      email: email
    }
    try {
      const result = await resendEmail(req);
      console.log(result)
      setLoader(false)
      setEmail('')
      setPassword('')
      
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    }
    
  }
  const onSignup = () => {
    props.navigation.navigate('SignupPage')
  }

  const onForgot = () => {
    console.log('hy', email)
    props.navigation.navigate('ForgotPasswordPage')


  }


  return (
    <View style={styles.container}>
    <ImageBackground source={localImages.bg} style={styles.image} >
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{  }}
          contentContainerStyle={styles.scrollview}
        
        >
          <View style={[styles.mainContent,{alignItems:'center'}]}>
            {sppiner && <Loder data={sppiner}></Loder>}
            <NetConnectionScreen></NetConnectionScreen>
            <View style={{alignItems:'center', marginBottom:30}}>
            <View style={styles.card}>
              <Image source={localImages.logo} style={{ height: 100, width: 280.71 }} />
              <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 19, color: colors.blubutton }]}>Money Parenting Made Zimble</Text>
            </View>
            <InputBox
              height={60}
              backgroundColor={colors.inputBoxBackground}
              width={(width - 60)}
              borderRadius={30}
              marginTop={65}
              placeholder="Your Email"
              label="Email"
              labelColor={colors.labelColor}
              placeholderColor={colors.placeHolderColor}

              inputTextColor={colors.inputTextColor}
              secureTextEntry={false}
              // keyboardType={'numeric'}
              editable={true}
              value={email}
              maxLength={400}
              onChangeText={(text) => setEmail(text)}
            ></InputBox>

            <View style={{flexDirection:'row', alignItems:"center"}}>
              <InputBox
                height={60}
                backgroundColor={colors.inputBoxBackground}
                width={(width - 60)}
                borderRadius={30}
                marginTop={15}
                placeholder="Your password"
                label="Password"
                labelColor={colors.labelColor}
                placeholderColor={colors.placeHolderColor}

                inputTextColor={colors.inputTextColor}
                secureTextEntry={secureTextEntry}
                // keyboardType={'numeric'}
                editable={true}
                value={password}
                maxLength={400} 
                iconName={secureTextEntry?'eye':'eyeactive'}
                onIconCHange={()=>setSecureTextEntry(!secureTextEntry)}
                onChangeText={(text) => setPassword(text)}
              ></InputBox>
              <TouchableOpacity style={{position:'absolute', right:20}} onPress={()=>setSecureTextEntry(!secureTextEntry)}><Image source={secureTextEntry?localImages.eye:localImages.eyeactive} style={{height:30,width:30,marginTop:40, marginLeft:10}}></Image></TouchableOpacity>
            </View>
            <View style={{ width: width }}>
              <TouchableOpacity onPress={() => onForgot()} style={{ marginTop: 14, borderBottomWidth: 1, borderBottomColor: colors.childblue, position: 'absolute', right: 40 }}>
                <Text style={[styles.forgotPassword, { color: colors.childblue }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <ButtonWithoutShadow
              height={60}
              backgroundColor={colors.childblue}
              width={width - 60}
              borderRadius={30}
              marginTop={80}
              label="Login"
              labelColor={colors.white}
              onAction={onLogin}
              fontFamily={fonts.robotoRegular}
              fontSize={19}
            ></ButtonWithoutShadow>
            <View style={{ width: width, marginBottom:40 }}>
              <View style={{ flexDirection: 'row', position: 'absolute', right: 40 }}>
                <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, textAlign: 'center', marginTop: 14, }]}>
                  Don’t have an account? </Text>
                <TouchableOpacity onPress={() => onSignup()} style={{ marginTop: 14, borderBottomWidth: 1, borderBottomColor: colors.childblue, }}>
                  <Text style={[styles.forgotPassword, { color: colors.childblue }]}>Sign up now</Text>
                </TouchableOpacity>
              </View>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

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
   
},
mainContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 10,
},
  card: {
    height: 189,
    width: width - 40,
    marginHorizontal: 18,
    
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotPassword: {
    
    color: colors.placeHolderColor
  },
  robotoRegularText: {
    fontFamily: fonts.robotoRegular,
    color: colors.subTitleColor
  },
  robotoBoldText: {
    fontFamily: fonts.robotoBold,
    color: colors.grayColor
  },

});