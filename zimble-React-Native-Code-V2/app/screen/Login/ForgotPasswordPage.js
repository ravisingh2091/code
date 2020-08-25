// Forgot Password
// User will be able to enter his registered email id in the text field.

// Note: User will be able to enter the email address which will undergo the verification process and after successful verification a password reset link will be shared on the email id of the user from where user will be able to reset his password and able to login by using new credentials.


import React, { useState, useEffect } from 'react'
import { ImageBackground,StatusBar, Image,TouchableOpacity, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ScrollView } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'
import InputBox from '../../components/InputBox'

import { forgetPassword } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'


var { height, width } = Dimensions.get('window');

const ForgotPasswordPage = (props) => {

  const [email, setEmail] = useState('')
  const [sppiner, setLoader] = useState(false)
  const { setLoggedInUserAuthToken } = props;
  var sharedClass = new SharedClass();
  useEffect(() => {

  }, [])


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
    
    try {
      const result = await forgetPassword({ email });
      console.log(result)
      setLoader(false)

      if (result && result.status == 'success') {
      
        setTimeout(() => {
          message.message = 'New Password reset link sent on your register email id'
          message.type = 'success'
          sharedClass.ShowSnakBar(message)
          props.navigation.goBack()
          setEmail('')
        }, 1000)

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
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{}}
          contentContainerStyle={styles.scrollview}
       
        >
          <View style={[styles.content,]}>
          <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
                            <View style={{ marginLeft: 20 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
            {sppiner && <Loder data={sppiner}></Loder>}
            <NetConnectionScreen></NetConnectionScreen>
            <View style={{alignItems:'center', marginTop:30}}>
            <Image source={localImages.emailVerification} style={styles.socialImage} />
            <Text style={styles.heading}>Enter Your Registered Email Id</Text>
            <InputBox
              height={60}
              backgroundColor={colors.inputBoxBackground}
              width={width - 60}
              borderRadius={30}
              marginTop={60}
              placeholder="Email Address"
              label="Email Address"
              placeholderColor={colors.placeHolderColor}
              color={colors.inputTextColor}
              labelColor={colors.labelColor}
              secureTextEntry={false}
              editable={true}
              value={email}
              onChangeText={(text) => setEmail(text)}
            >
            </InputBox>


            <ButtonWithoutShadow
              height={60}
              backgroundColor={colors.childblue}
              width={width - 60}
              borderRadius={30}
              marginTop={80}
              label="Submit"
              labelColor={colors.white}
              onAction={onResendOtp}
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage)

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