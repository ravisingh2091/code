
// An email verification link will be shared on the email id of the user from where user will be able to verify his email id.

// Note: It will be mandatory verification both the phone number as well as the email id to create the account successfully.

// After successful verification of email address and the phone number a wallet for the user will be created on the matchmove by using the APIs.

import React, { useState, useEffect } from 'react'
import {ImageBackground, StatusBar,TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'

var { height, width } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native'

import {resendEmail} from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

const EmailVerificationPage = (props) => {

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
 
  const [resend, setResendStatus]= useState(null)
 
  const { setLoggedInUserAuthToken } = props;
  const [sppiner, setLoader]= useState(false)
  const route = useRoute();
  var  sharedClass = new SharedClass();
  useEffect(() => {

    var demo =route.params.email
    console.log('hy', demo)
    setEmail(route.params.email)
    setPhone(route.params.phone)
    setResendStatus(route.params.resendStatus)
    console.log('hyy', email)
  }, [])



  const onSignup = async() => {
  
    props.navigation.goBack()
  }

  const onResendLink = async() => {
    console.log('hy', email)
    let message={}
    if(!email){
      message.message='Please enter email id'
      message.type='error'
      sharedClass.ShowSnakBar(message)
      return
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!reg.test(email)){
      message.message='Please enter valid email id'
      message.type='error'
      sharedClass.ShowSnakBar(message)
      return
    }

   
    setLoader(true)
    //console.log(loder)
    let req={
      email:email,
    }
    try {
    const result = await resendEmail(req);
    console.log(result)
    setLoader(false)
    if(result && result.status=='success'){
        
        setTimeout(() => {
          message.message='Verification link  sent successfully!'
          message.type='success'
          sharedClass.ShowSnakBar(message)
      }, 500)
      
         
    }else{
      setTimeout(() => {
        message.message=result.message
      message.type='info'
      sharedClass.ShowSnakBar(message)
    }, 500)
     
    }
  } catch (error) {
    console.log("ERROR IN OFFER FETCH API", error);
  }
    //props.navigation.navigate('CreateProfilePage')
  }


  return (
    <SafeAreaView style={{ 
      
     }}>
      {sppiner && <Loder data={sppiner}></Loder>}
      <LinearGradient colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <NetConnectionScreen></NetConnectionScreen>
        
        <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
                            <View style={{ marginLeft: 20 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={25} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 19 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
        <View style={{ height: height - 40, justifyContent:'center', alignItems:'center'}}>
          <Image source={localImages.success} style={styles.socialImage} />
          <Text style={styles.heading}>Check your email inbox for email verification</Text>

          <ButtonWithoutShadow
            height={40}
            backgroundColor={colors.white}
            width={width - 60}
            borderRadius={30}
            marginTop={10}
            label="Resend Verification Link?"
            labelColor={colors.childblue}
            onAction={onResendLink}
            fontFamily={fonts.robotoRegular}
            fontSize={19}
          ></ButtonWithoutShadow>

          <ButtonWithoutShadow
            height={60}
            backgroundColor={colors.childblue}
            width={width - 60}
            borderRadius={30}
            marginTop={100}
            label="Ok"
            labelColor={colors.white}
            onAction={onSignup}
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
    setLoggedInUserDetails: token => {
      dispatch(actions.setLoggedInUserDetails(token));
    },
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(EmailVerificationPage)

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  linearGradient: {
   
    height: height,
   
  },
 
  heading: {
    fontFamily: fonts.robotoMedium,
    fontSize: 20,
    marginTop: 33,
    color: colors.titleText,
    textAlign:'center',
    marginHorizontal:30
  },

  socialImage: {
    height: 134, width: 134
  },

});