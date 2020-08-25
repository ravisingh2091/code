// User will be able to create new child account by providing following details: 

// 	•	Child Name 
// 	•	Child Age
// 	•	Select country code
// 	•	Enter phone number 
// 	•	Enter email id 
// 	•	Enter password 
// 	•	Next: User will be redirected to the Select your card Screen.

// Select your card Screen
// User will be able to fill following details on the screen: 

// 	•	User will be able to select the card designs from the 3 available designs
// 	•	Enter Address line 1
// 	•	Enter Address line 2
// 	•	City 
// 	•	State 
// 	•	Country 
// 	•	Postal Code 
// 	•	Submit: User will be redirected to the Verify Account Screen.

// Verify Account 
// User will be able to enter the OTP verification code received on the email id of the child for the email id verification.

// Resend OTP: User will be able to click on resend OTP to receive the OTP again in case OTP will not be received on child’s email id.

// Note: After successful verification of the user account the process will be completed, and user will be redirected to the Complete Screen.

// Complete Screen
// User will be able to view the success message “Your Child account created successfully”

// Complete: user will be redirected to the Accounts Screen.

// Note: child account will be created on the platform and the selected card will be delivered on the provided address at the time of creation of the account by the matchmove and once card will be delivered user will be able to activate the card for his child by using proxy number on the card.



import React, { useState, useEffect } from 'react'
import { StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ScrollView, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faChevronRight, faChevronLeft, faArrowLeft, faCoffee, faCheck, faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'
import InputBox, { MaskedInputBox } from '../../components/InputBox'


import {  getCards,sendOtp, emailVerifyChild, emailResendChild,getUserDetails } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import StepIndicator from 'react-native-step-indicator';


import { useFocusEffect, CommonActions, } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Swiper from 'react-native-swiper';

var { height, width } = Dimensions.get('window');

const labels = ["Create Account", "Select Card", "Verify Account","Complete"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.darkBlue,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: colors.darkBlue,
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: colors.tabGray,
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: colors.darkBlue,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: colors.white,
  labelColor: '#999999',
  labelSize: 13,
  labelFontFamily: fonts.robotoRegular,
  currentStepLabelColor: colors.darkBlue,
  
}



const AddMoreChildPage = (props, { route }) => {


  const [currentPosition, setCurrentPosition] = useState(0)
  const [otp, setotp] = useState()
  const [cardList, setCardList] = useState([])
  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('')
  const [selectedcard, setselectedcard] = useState()
  const [cardId, setCardId] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [fullAddress, setfullAddress] = useState('')
  const [line2Address, setLine2Address] = useState('')
  const [city, setcity] = useState('Singapore')
  const [state, setstate] = useState('Singapore')
  const [country, setcountry] = useState('')

  const [postalCode, setpostalCode] = useState('')
  //const [countryCode, setCountryCode] = useState('+96')
  const [countryCode, setCountryCode] = useState('SG')
  const [callingCode, setCallingCode] = useState('+65')

  const [countryCodeCountry, setCountryCodeCountry] = useState('SG')
  const [callingCodeCountry, setCallingCodeCountry] = useState('+65')


  const [sppiner, setLoader] = useState(false)
  const [withCountryNameButton, setWithCountryNameButton] = useState(
    false 
  )
  const [withFlag, setWithFlag] = useState(true)
  const [withEmoji, setWithEmoji] = useState(false)
  const [withFilter, setWithFilter] = useState(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState(true)
  const [withCallingCode, setWithCallingCode] = useState(true)
  const [userDetails, setUsersDetails] = useState('')
  const { setLoggedInUserAuthToken } = props;
  var sharedClass = new SharedClass();
  useEffect(() => {
    getCardDetails()
    getUserDetailsFun()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
       setCurrentPosition(0)
      
    }, [])
  );
  const onSelect = (country) => {name
    console.log(country)
    setCountryCode(country.cca2)
    setCallingCode("+" + country.callingCode[0])
  }
  const onSelectCountry = (country) => {
    console.log(country)
    setCountryCodeCountry(country.cca2)
    setCallingCodeCountry("+" + country.callingCode[0])
    setcountry(country.name)
  }
  const onLogin = () => {
    console.log('hy', email)
    props.navigation.navigate('SelectUserTypePage')

  }
  const getUserDetailsFun = async () => {


    try {
        setLoader(true)
        const result = await getUserDetails();
        console.log(result)
        setLoader(false)
      
        if (result && result.status == 'success') {
            setUsersDetails(result.details)

            if(result.details && result.details.address){
              setfullAddress(result.details.address.address_1?result.details.address.address_1:'')
              setLine2Address(result.details.address.address_2?result.details.address.address_2:'')
              setcity(result.details.address.city?result.details.address.city:'')
              setstate(result.details.address.state?result.details.address.state:'')
              setcountry(result.details.address.country?result.details.address.country:'')
              setpostalCode(result.details.address.postalCode?result.details.address.postalCode:'')
              setCountryCodeCountry(result.details.address.countryCode?result.details.address.countryCode:'')
            }
            props.setLoggedInUserDetails(result.details)

        } else {
            let message = {}
            message.message = result.message
            message.type = 'info'
            sharedClass.ShowSnakBar(message)
        }
    } catch (error) {
        setLoader(false)
        console.log("ERROR IN OFFER FETCH API", error);
    }
}
  const getCardDetails = async () => {


    try {
      setLoader(true)
      const result = await getCards();
      console.log(result)
      setLoader(false)
      if (result && result.status == 'success') {
        setCardList(result.details)

        if (result.details.length > 0) {
          setCardId(result.details[0]._id)
          setselectedcard(result.details[0]._id)


        }

      } else {
        let message = {}
        message.message = result.message
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }
  const onSignup = async () => {
    let message = {}
    if (selectedcard) {
      setCardId(selectedcard)
    } else {
      if (cardList.length > 0) {
        setCardId(cardList[0]._id)
      }
      
    }
    if (!otp) {
      message.message = 'Please enter otp'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!childName) {
      message.message = 'Please enter child name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!age) {
      message.message = 'Please enter age'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
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


    if (password.length < 6) {
      message.message = 'Please enter password of atleast 6 characters'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    if (!fullAddress) {
      message.message = 'Please enter  address line one'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!line2Address) {
      message.message = 'Please enter  address line two'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!city) {
      message.message = 'Please enter  city'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!state) {
      message.message = 'Please enter state'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!country) {
      message.message = 'Please enter country'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!postalCode) {
      message.message = 'Please enter postal code'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

   

    let req = {

      firstName: childName,
      otp:otp,
      email: email,
      password: password,
      age:age,
      phone: callingCode + '-' + phone,
      personisalizedCardId: cardId,
      address: {
        address_1: fullAddress,
        address_2:line2Address,
        city:city,
        state:state,
        country:country,
        postalCode: postalCode,
        countryCode:countryCodeCountry
      }
    }


    try {
      setLoader(true)
      const result = await emailVerifyChild(req);
      console.log(result)
      setLoader(false)

      if (result && result.status == 'success') {
       
        setCurrentPosition(3)

      } else {

        setTimeout(() => {
          let message = {}
          message.message = result.message
          message.type = 'info'
          sharedClass.ShowSnakBar(message)
        }, 100)

      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }
  const sendOtpOnMail = async () => {
    let message = {}
   
    if (selectedcard) {
      setCardId(selectedcard)
    } else {
      if (cardList.length > 0) {
        setCardId(cardList[0]._id)
      }
     
    }

    if (!childName) {
      message.message = 'Please enter child name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!age) {
      message.message = 'Please enter age'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
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


    if (password.length < 6) {
      message.message = 'Please enter password of atleast 6 characters'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    if (!fullAddress) {
      message.message = 'Please enter  address line one'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!line2Address) {
      message.message = 'Please enter  address line two'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!city) {
      message.message = 'Please enter  city'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!state) {
      message.message = 'Please enter state'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!country) {
      message.message = 'Please enter country'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!postalCode) {
      message.message = 'Please enter postal code'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

   

    let req = {

      firstName: childName,
      
      email: email,
      password: password,
      age:age,
      phone: callingCode + '-' + phone,
      personisalizedCardId: cardId,
      address: {
        address_1: fullAddress,
        address_2:line2Address,
        city:city,
        state:state,
        country:country,
        postalCode: postalCode,
        countryCode:countryCodeCountry

      }
    }
    try {
      setLoader(true)
      const result = await sendOtp(req);
      console.log(result)
      setLoader(false)
     
      if (result && result.status == 'success') {
        let message = {}
        message.message = 'Please check your child\'s mail for otp'
        message.type = 'success'
        sharedClass.ShowSnakBar(message)
        setCurrentPosition(2)
        

      } else {
        let message = {}
        message.message = result.message
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }


  const resendEmail = async () => {
    let message = {}
   
    if (selectedcard) {
      setCardId(selectedcard)
    } else {
      if (cardList.length > 0) {
        setCardId(cardList[0]._id)
      }
     
    }

    if (!childName) {
      message.message = 'Please enter child name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!age) {
      message.message = 'Please enter age'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
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


    if (password.length < 6) {
      message.message = 'Please enter password of atleast 6 characters'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    if (!fullAddress) {
      message.message = 'Please enter  address line one'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!line2Address) {
      message.message = 'Please enter  address line two'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!city) {
      message.message = 'Please enter  city'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!state) {
      message.message = 'Please enter state'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!country) {
      message.message = 'Please enter country'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!postalCode) {
      message.message = 'Please enter postal code'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

   

    let req = {

      firstName: childName,
      
      email: email,
      password: password,
      age:age,
      phone: callingCode + '-' + phone,
      personisalizedCardId: cardId,
      address: {
        address_1: fullAddress,
        address_2:line2Address,
        city:city,
        state:state,
        country:country,
        postalCode: postalCode,
        countryCode:countryCodeCountry
      }
    }
    try {
      setLoader(true)
      const result = await emailResendChild(req);
      console.log(result)
      setLoader(false)
    
      if (result && result.status == 'success') {
        let message = {}
        message.message = 'Please check your child\'s mail for otp'
        message.type = 'success'
        sharedClass.ShowSnakBar(message)
      

      } else {
        let message = {}
        message.message = result.message
        message.type = 'info'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }




  const onNextOne = () => {
    let message = {}
  
    if (!childName) {
      message.message = 'Please enter child name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!age) {
      message.message = 'Please enter age'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
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
    if (password.length < 6) {
      message.message = 'Please enter password of atleast 6 characters'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }



    setCurrentPosition(1)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ paddingBottom: 90 }}
          contentContainerStyle={styles.scrollview}
       
        >
          <View style={styles.content}>
          <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
            <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
              <View style={{ marginLeft: 20 }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                  <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                  <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                </TouchableOpacity>
              </View>

            </View>
            <View style={{ width: width - 40, marginLeft: 20, alignItems: 'center', marginTop: 50 }}>
              <Image source={currentPosition == 0 ? localImages.createAccount : currentPosition == 1 ? localImages.emailVerification : localImages.creditcard} style={{ height: 120, width: 120 }} />
              <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.darkBlue, marginTop: 20, textAlign: 'center' }]}>

                {currentPosition == 0 ? 'Create a New Account' : currentPosition == 1 ? 'Select your card' : currentPosition == 2 ?'Verify Account':'Invitation Sent'}
              </Text>
              <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 20, textAlign: 'center', marginBottom: 30 }]}>
                {currentPosition == 0 ? `This account will be the child's account`
                  : currentPosition == 1 ? 'Select your physical card attached to your account.'
                    : currentPosition == 2 ? `Please enter the pin code that has been sent to your  child's email id`
                      : 'Your child account created successfully'}


              </Text>
            </View>


            <View style={{ width: width - 40, marginLeft: 20, marginTop: 20 }}>
              <StepIndicator
                stepCount={4}
                customStyles={customStyles}
                currentPosition={currentPosition}
                labels={labels}
              />
            </View>
            {currentPosition == 0 ? <View style={{ width: width - 40, marginLeft: 20, marginBottom: 20 }}>
              <InputBox
                height={60}
                backgroundColor={colors.inputBoxBackground}
                width={width - 40}
                borderRadius={30}
                marginTop={35}
                placeholder="Name"
                label="Child name"
                labelColor={colors.labelColor}
                placeholderColor={colors.placeHolderColor}

                inputTextColor={colors.inputTextColor}
                secureTextEntry={false}
                // keyboardType={'numeric'}
                editable={true}
                value={childName}
                maxLength={400}
                onChangeText={(text) => setChildName(text)}
              ></InputBox>
              <InputBox
                height={60}
                backgroundColor={colors.inputBoxBackground}
                width={width - 40}
                borderRadius={30}
                marginTop={20}
                placeholder="Age"
                label="Child Age"
                labelColor={colors.labelColor}
                placeholderColor={colors.placeHolderColor}

                inputTextColor={colors.inputTextColor}
                secureTextEntry={false}
                keyboardType={'numeric'}
                editable={true}
                value={age}
                maxLength={2}
                onChangeText={(text) => setAge(text)}
              ></InputBox>
              <View style={{ flexDirection: 'row' }}>

                <View>
                  <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 15 }]}>Country</Text>
                  <View style={[styles.card, { marginRight: 10, marginTop: 0, width: 80, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.inputBoxBackground, borderRadius: 8 }]}>

                    <CountryPicker countryCode={'SG'} theme={DARK_THEME} {...{
                      countryCode,
                      withFilter,
                      withFlag,
                      withCountryNameButton,
                      withAlphaFilter,
                      withCallingCode,
                      withEmoji,
                      onSelect
                    }}
                    />
                  </View>
                </View>
                <InputBox
                  height={60}
                  backgroundColor={colors.inputBoxBackground}
                  width={width - 130}
                  borderRadius={30}
                  marginTop={15}
                  placeholder="Phone Number"
                  label="Phone"
                  labelColor={colors.labelColor}
                  placeholderColor={colors.placeHolderColor}

                  inputTextColor={colors.inputTextColor}
                  secureTextEntry={false}
                  // keyboardType={'numeric'}
                  editable={true}
                  value={phone}
                  maxLength={400}
                  onChangeText={(text) => setPhone(text)}
                ></InputBox>
              </View>
              <InputBox
                height={60}
                backgroundColor={colors.inputBoxBackground}
                width={width - 40}
                borderRadius={30}
                marginTop={15}
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
              <InputBox
                height={60}
                backgroundColor={colors.inputBoxBackground}
                width={width - 40}
                borderRadius={30}
                marginTop={15}
                placeholder="Your Password"
                label="Password"
                labelColor={colors.labelColor}
                placeholderColor={colors.placeHolderColor}

                inputTextColor={colors.inputTextColor}
                secureTextEntry={true}
                // keyboardType={'numeric'}
                editable={true}
                value={password}
                maxLength={400}
                onChangeText={(text) => setPassword(text)}
              ></InputBox>
              <ButtonWithoutShadow
                height={60}
                backgroundColor={colors.childblue}
                width={width - 60}
                borderRadius={30}
                marginTop={20}
                label="NEXT"
                labelColor={colors.white}
                onAction={() => { onNextOne() }}
                fontFamily={fonts.robotoRegular}
                fontSize={15}
              ></ButtonWithoutShadow>
            </View>
              :
              currentPosition == 1 ?
                <View style={{ alignItems: 'center' , marginBottom:20}}>

                  {cardList.length > 0 && <View style={styles.containerCard}>
                    <Swiper
                      index={0}
                      showsButtons
                      buttonWrapperStyle={{ backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 70, right: 20, flex: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: width - 140, color: colors.white }}
                      nextButton={<FontAwesomeIcon style={{marginLeft:30}} icon={faChevronRight} color={colors.white} size={30} />}
                      prevButton={<FontAwesomeIcon style={{}} icon={faChevronLeft} color={colors.white} size={30} />}
                      onIndexChanged={(index) => {
                        console.log(index)
                        const value = cardList[index]._id;
                        setselectedcard(value);
                        setCardId(value)
                      }}
                      showsPagination={false}
                      loop={false}
                    >
                      {
                        cardList.length > 0 &&
                        cardList.map((item, key) => {
                          return (
                            <Image
                              resizeMode={'contain'}
                              source={{ uri: item.image }}
                              style={styles.imageCard}
                              key={key} />
                          );
                        })}
                    </Swiper>
                  </View>}
                  <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="Address Line"
                    label="Address Line 1"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={fullAddress}
                    maxLength={400}
                    onChangeText={(text) => setfullAddress(text)}
                  ></InputBox>
                   <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="Address Line"
                    label="Address Line 2"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={line2Address}
                    maxLength={400}
                    onChangeText={(text) => setLine2Address(text)}
                  ></InputBox>
                   {/* <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="City"
                    label="City"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={city}
                    maxLength={400}
                    onChangeText={(text) => setcity(text)}
                  ></InputBox> */}
                   {/* <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="State"
                    label="State"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={state}
                    maxLength={400}
                    onChangeText={(text) => setstate(text)}
                  ></InputBox> */}
      
                  <View>
                  <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 15 }]}>Country</Text>
                  <View style={[styles.card, { marginRight: 5, marginTop: 0, width: width-40, height: 60, justifyContent: 'center', backgroundColor: colors.inputBoxBackground, borderRadius: 8  }]}>

                    <CountryPicker 
                    onSelect={onSelectCountry}
                    containerButtonStyle={{marginLeft:10, color:colors.inputTextColor}}
                    withCountryNameButton={true}
                    countryCode={countryCodeCountry}  
                    
                    {...{
                     
                      withFilter,
                      withAlphaFilter,
                      withCallingCode,
                      withEmoji,
                      
                    }}
                    />
                  </View>
                </View>
                  <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="PIN Code"
                    label="PIN Code"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={postalCode}
                    maxLength={400}
                    onChangeText={(text) => setpostalCode(text)}
                  ></InputBox>
                  <ButtonWithoutShadow
                    height={60}
                    backgroundColor={colors.childblue}
                    width={width - 60}
                    borderRadius={30}
                    marginTop={20}
                    label="NEXT"
                    labelColor={colors.white}
                    onAction={() => { sendOtpOnMail() }}
                    fontFamily={fonts.robotoRegular}
                    fontSize={15}
                  ></ButtonWithoutShadow>
                </View>

                : currentPosition == 2 ?

                  <View style={{ width: width - 40, marginLeft: 20, marginTop: 30, justifyContent: 'center', marginBottom: 20 }}>
                    <SmoothPinCodeInput
                      containerStyle={{ alignSelf: 'center' }}
                      cellSpacing={30}
                      cellSize={60}
                      password={false}
                      cellStyle={{
                        borderWidth: 1,
                        //borderRadius: 25,
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
                      onTextChange={pin => setotp(pin)}
                    //  onFulfill={() => this.onFocusNextInput()}
                    />
                    <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 50, textAlign: 'center' }]}>
                     


                  </Text>
                    <ButtonWithoutShadow
                      height={40}
                      backgroundColor={colors.white}
                      width={width - 40}
                      borderRadius={30}
                      marginTop={10}
                      label="Resend OTP?"
                      labelColor={colors.childblue}
                      borderBottomWidth={1}
                      borderBottomColor={colors.childblue}
                      onAction={() => { resendEmail() }}
                      fontFamily={fonts.robotoRegular}
                      fontSize={19}
                    ></ButtonWithoutShadow>
                    <ButtonWithoutShadow
                      height={60}
                      backgroundColor={colors.childblue}
                      width={width - 40}
                      borderRadius={30}
                      marginTop={60}
                      label="Next"
                      labelColor={colors.white}

                      onAction={() => { onSignup() }}
                      fontFamily={fonts.robotoRegular}
                      fontSize={19}
                    ></ButtonWithoutShadow>
                  </View>
                  : <View style={{ width: width - 40, marginLeft: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>


                    <ButtonWithoutShadow
                      height={60}
                      backgroundColor={colors.childblue}
                      width={width - 60}
                      borderRadius={30}
                      marginLeft={0}
                      marginRight={0}
                      marginTop={20}
                      label="Complete"
                      labelColor={colors.white}
                      onAction={() => { props.navigation.goBack() }}
                      fontFamily={fonts.robotoRegular}
                      fontSize={15}
                    ></ButtonWithoutShadow>
                  </View>
            }
          </View>

        </ScrollView>

      </View>

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
    setLoggedInUserDetails: userDetails => {
      dispatch(actions.setLoggedInUserDetails(userDetails));
  },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddMoreChildPage)

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    justifyContent: 'center',
   
    borderRadius: 8

  },

  imageCard: {
    height: (width - 80) * .52,
    width: width - 80,
    alignSelf: "center",
  },
  containerCard: {
    
    flexDirection: "row",
    justifyContent: "center",
    height: (width - 80) * .52,
    marginTop: 20,
    marginBottom: 0
  }

});