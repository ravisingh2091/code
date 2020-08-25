import React, { useState, useEffect } from 'react'
import { ImageBackground, StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ScrollView, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages, variable } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'
import InputBox, { MaskedInputBox } from '../../components/InputBox'


import { signup, verifyOtp, resendOtp, setUpPaymentMethode } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import StepIndicator from 'react-native-step-indicator';


import { useFocusEffect, CommonActions, } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import CheckBox from 'react-native-check-box'
import Stripe from 'tipsi-stripe';
import Modal, {

  ModalContent,

  SlideAnimation,

} from 'react-native-modals';

var { height, width } = Dimensions.get('window');

const labels = ["Create Account", "Verify Account", "Payment Method"];
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



const SetupPayemntMethode = (props, { route }) => {


  const [currentPosition, setCurrentPosition] = useState(2)
  const [otp, setotp] = useState()
  const [familyName, setFamilyName] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [cardNumber, setCardNumber] = useState('4242424242424242')
  const [expriyDate, setExpriyDate] = useState('')
  const [cvvNubmer, setCvvNubmer] = useState('')
  const [termCondition, setTermCondition] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nationality,setNationality]= useState('')
  const [phone, setPhone] = useState('')
  const [referalCode, setFeferalCode] = useState('')
  const [countryCode, setCountryCode] = useState('SG')
  const [callingCode, setCallingCode] = useState('+65')
  const [sppiner, setLoader] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [withCountryNameButton, setWithCountryNameButton] = useState(
    false
  )
  const [withFlag, setWithFlag] = useState(true)
  const [withEmoji, setWithEmoji] = useState(false)
  const [withFilter, setWithFilter] = useState(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState(true)

  const [withCallingCode, setWithCallingCode] = useState(true)
  const { setLoggedInUserAuthToken } = props;
  var sharedClass = new SharedClass();
  useEffect(() => {
    Stripe.setOptions({
      publishableKey: variable.SECRET_KEY_STRIPE
    })
  }, [])

  useFocusEffect(
    React.useCallback(() => {

    }, [])
  );
  const onSelect = (country) => {
    console.log(country)
    setCountryCode(country.cca2)
    setCallingCode("+" + country.callingCode[0])
  }


  const onSignup = async () => {

    let regex = /^[a-zA-Z ]*$/;
    let message = {}

    if (!familyName.trim()) {
      message.message = 'Please enter Full Name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!regex.test(familyName)) {
      message.message = 'Full Name accept only alphabets'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    if (familyName.trim().split(' ').length < 2) {
      message.message = 'Please enter at least two words for Full Name'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    if (!callingCode) {
      message.message = 'Please enter Country Code'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!phone) {
      message.message = 'Please enter Phone Number'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!email) {
      message.message = 'Please enter Email Id'
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
      message.message = 'Please Enter Password'
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

    if (!nationality) {
      message.message = 'Please Enter Nationality'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    setLoader(true)

    let familyNameLocal = familyName.trim().split(' ')
    let lastNameLocl = familyNameLocal.pop()
    let firstNameLocal = familyName.replace(lastNameLocl, '')
    let req = {
      email: email.toLowerCase(),
      password: password,
      phone: callingCode + '-' + phone,
      familyName: familyName,
      firstName: firstNameLocal.trim(),
      lastName: lastNameLocl.trim(),
      referalCode: referalCode.toLowerCase(),
      nationality:nationality

    }
    try {
      const result = await signup(req);
      console.log(result)
      setLoader(false)
      if (result && result.status == 'success') {
        setCurrentPosition(1)

      } else {

        setTimeout(() => {
          message.message = result.message
          message.type = 'info'
          sharedClass.ShowSnakBar(message)
        }, 1000)


      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }

  }

  const onVerifyOtp = async () => {

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
      phone: callingCode + '-' + phone,
      otp: otp
    }
    try {

      const result = await verifyOtp(req);
      setLoader(false)

      console.log(result)

      if (result && result.status == 'success') {
        props.setLoggedInUserDetails(result.details)
        props.setLoggedInUserAuthToken(result.details.userToken)


        setCurrentPosition(2)


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
      phone: callingCode + '-' + phone,
    }
    try {
      const result = await resendOtp(req);
      console.log(result)
      setLoader(false)
      if (result && result.status == 'success') {
        setotp('')

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

  const onSubscription = async () => {




    let message = {}
    if (!nameOnCard) {
      message.message = 'Please enter name on card'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!cardNumber) {
      message.message = 'Please enter card number'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!expriyDate) {
      message.message = 'Please enter expire date'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!cvvNubmer) {
      message.message = 'Please enter cvv number'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!termCondition) {
      message.message = 'Please check term & condition '
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    try {
      const params = {
        // mandatory
        number: cardNumber,
        expMonth: Number.parseInt(expriyDate.split('/')[0]),
        expYear: Number.parseInt(expriyDate.split('/')[1]),
        cvc: cvvNubmer,
        name: nameOnCard,
      }
      setLoader(true)
     
      const data = await Stripe.createTokenWithCard(params);
      console.log(data);
      saveCredidCard(data.tokenId, nameOnCard, data.card)
      setLoader(false)
    } catch (error) {
      console.log(error.toString())
      setLoader(false)


      setTimeout(() => {
        // let message = {}
        message.message = error.toString()
        message.type = 'error'
        sharedClass.ShowSnakBar(message)
      }, 500)

    }
  }


  const saveCredidCard = async () => {
    console.log(expriyDate)

    let message = {}
    if (!nameOnCard) {
      message.message = 'Please enter name on card'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!cardNumber) {
      message.message = 'Please enter card number'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!expriyDate) {
      message.message = 'Please enter expire date'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }
    if (!cvvNubmer) {
      message.message = 'Please enter cvv number'
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }

    if (!termCondition) {
      message.message = 'Please check term & condition '
      message.type = 'error'
      sharedClass.ShowSnakBar(message)
      return
    }


    let req = {
     
      cardHolderName: nameOnCard,
      cardNumber: cardNumber.replace(/\s/g, ''),
      expDate: expriyDate,
      expMonth: Number.parseInt(expriyDate.split('/')[0]),
      expYear: Number.parseInt(expriyDate.split('/')[1]),
      cvv: cvvNubmer,
      name: nameOnCard,
      cardStatus: 'new'
    }
    try {
      setLoader(true)
      const result = await setUpPaymentMethode(req);
      console.log(result)

      setLoader(false)
      if (result && result.status == 'success') {

        props.navigation.navigate('SubscriptionPlan')

      } else {
        let message = {}
        message.message = result.message
        message.type = 'error'
        sharedClass.ShowSnakBar(message)
      }
    } catch (error) {
      setLoader(false)
      console.log("ERROR IN OFFER FETCH API", error);
    }
  }


  const fixCardNumber = (text) => {
    if (text.length >= 19) {
      text = text.substring(0, 19)
    }
    setCardNumber(text)
  }

  const fixExpiryText = (text) => {
    if (text.length == 2 && (expriyDate == 1 || expriyDate.substring(0.0) == 0)) {
      text += '/'
    } else if (text.length == 2 && expriyDate.length == 3) {
      text = text.substring(0, text.length - 1)
    } else if (text.length >= 4) {
      text = text.substring(0, 5)
    }
    setExpriyDate(text)
  }

  const fixCVVText = (text) => {

    if (text.length >= 3) {
      text = text.substring(0, 3)
    }
    setCvvNubmer(text)
  }



  return (
    <View style={styles.container}>
      <ImageBackground source={localImages.bg} style={styles.image} >
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
          <View style={{}}>
            <ScrollView
              style={{ paddingBottom: 90 }}

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
                  <Image source={currentPosition == 0 ? localImages.createAccount : currentPosition == 1 ? localImages.emailVerification : localImages.creditcard} style={{ height: 120, width: 120 }} />
                  <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.darkBlue, marginTop: 20, textAlign: 'center' }]}>

                    {currentPosition == 0 ? 'Create a Family Account' : currentPosition == 1 ? 'Verify Account' : 'Setup Payment Method'}
                  </Text>
                  <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 20, textAlign: 'center', marginBottom: 30 }]}>
                    {currentPosition == 0 ? 'This account will be the master admin that controls all permissions in the app.'
                      : currentPosition == 1 ? 'An email has been sent to your inbox. Click on the link to verify your email address.'
                        : 'Setup your payment method. This can be changed later inside the app but is required to setup the account.'}


                  </Text>
                </View>


                <View style={{ width: width - 40, marginLeft: 20, marginTop: 20 }}>
                  <StepIndicator
                    stepCount={3}
                    customStyles={customStyles}
                    currentPosition={currentPosition}
                    labels={labels}
                  />
                </View>
                {currentPosition == 0 ? <View style={{ width: width - 40, marginLeft: 20, }}>
                  <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={35}
                    placeholder="Full name"
                    label="Full name"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={false}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={familyName}
                    maxLength={400}
                    onChangeText={(text) => setFamilyName(text)}
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
                  <InputBox
                    height={60}
                    backgroundColor={colors.inputBoxBackground}
                    width={width - 40}
                    borderRadius={30}
                    marginTop={15}
                    placeholder="Nationality"
                    label="Nationality"
                    labelColor={colors.labelColor}
                    placeholderColor={colors.placeHolderColor}

                    inputTextColor={colors.inputTextColor}
                    secureTextEntry={true}
                    // keyboardType={'numeric'}
                    editable={true}
                    value={nationality}
                    maxLength={400}
                    onChangeText={(text) => setNationality(text)}
                  ></InputBox>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <InputBox
                      height={60}
                      backgroundColor={colors.inputBoxBackground}
                      width={width - 40}
                      borderRadius={30}
                      marginTop={15}
                      placeholder="Referrer Code"
                      label="Referrer Code"
                      labelColor={colors.labelColor}
                      placeholderColor={colors.placeHolderColor}

                      inputTextColor={colors.inputTextColor}
                      secureTextEntry={false}
                      // keyboardType={'numeric'}
                      editable={true}
                      value={referalCode}
                      maxLength={400}
                      onChangeText={(text) => setFeferalCode(text)}
                    ></InputBox>
                    <TouchableOpacity onPress={()=>setShowModal(true)} style={{position:'absolute', right:20}}>
                      <Image source={localImages.information} style={{height:30, width:30, marginTop:30, marginLeft:10}}>
                      </Image>
                      </TouchableOpacity>
                  </View>
                  <ButtonWithoutShadow
                    height={60}
                    backgroundColor={colors.childblue}
                    width={width - 60}
                    borderRadius={30}
                    marginTop={20}
                    label="NEXT"
                    labelColor={colors.white}
                    onAction={() => { onSignup() }}
                    fontFamily={fonts.robotoRegular}
                    fontSize={15}
                  ></ButtonWithoutShadow>
                </View>
                  : currentPosition == 1 ?

                    <View style={{ width: width - 40, marginLeft: 20, marginTop: 30, justifyContent: 'center' }}>
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
                      <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 70, textAlign: 'center' }]}>
                        Please enter the pin code that has been sent to your phone number.


                  </Text>
                      <ButtonWithoutShadow
                        height={40}
                        backgroundColor={'rgba(255,255,255,.1)'}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={10}
                        label="Resend OTP?"
                        labelColor={colors.childblue}
                        borderBottomWidth={1}
                        borderBottomColor={colors.childblue}
                        onAction={() => { onResendOtp() }}
                        fontFamily={fonts.robotoBold}
                        fontSize={18}
                      ></ButtonWithoutShadow>
                      <ButtonWithoutShadow
                        height={60}
                        backgroundColor={colors.childblue}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={60}
                        label="Next"
                        labelColor={colors.white}

                        onAction={() => { onVerifyOtp() }}
                        fontFamily={fonts.robotoRegular}
                        fontSize={19}
                      ></ButtonWithoutShadow>
                    </View>
                    : <View style={{ width: width - 40, marginLeft: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>

                      <InputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Name of card"
                        label="Name of card"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}
                        // keyboardType={'numeric'}
                        editable={true}
                        value={nameOnCard}
                        maxLength={400}
                        onChangeText={(text) => setNameOnCard(text)}
                      ></InputBox>

                      <MaskedInputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Card number"
                        label="Card number"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}
                        // keyboardType={'numeric'}
                        editable={true}
                        value={cardNumber}
                        maxLength={400}
                        onChangeText={(text) => fixCardNumber(text)}
                      ></MaskedInputBox>

                      <View
                        style={{ flexDirection: 'row' }}
                      >

                        <InputBox
                          height={60}
                          backgroundColor={colors.inputBoxBackground}
                          width={(width - 60) / 2}
                          borderRadius={30}
                          marginTop={15}
                          placeholder="Expiry Date"
                          label="Expiry Date"
                          labelColor={colors.labelColor}
                          placeholderColor={colors.placeHolderColor}

                          inputTextColor={colors.inputTextColor}
                          secureTextEntry={false}
                          // keyboardType={'numeric'}
                          editable={true}
                          value={expriyDate}
                          maxLength={400}
                          onChangeText={(text) => fixExpiryText(text)}
                        ></InputBox>
                        <View style={{ width: 20 }}></View>
                        <InputBox
                          height={60}
                          backgroundColor={colors.inputBoxBackground}
                          width={(width - 60) / 2}
                          borderRadius={30}
                          marginTop={15}
                          placeholder="CVV"
                          label="CVV Number"
                          labelColor={colors.labelColor}
                          placeholderColor={colors.placeHolderColor}

                          inputTextColor={colors.inputTextColor}
                          secureTextEntry={false}
                          // keyboardType={'numeric'}
                          editable={true}
                          value={cvvNubmer}
                          maxLength={400}
                          onChangeText={(text) => fixCVVText(text)}
                        ></InputBox>

                      </View>
                      <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 10 }}>
                        <CheckBox
                          style={{ flex: 1, padding: 10, width: 40, height: 40, borderRadius: 20 }}
                          onClick={() => {
                            setTermCondition(!termCondition)
                          }}
                          checkedCheckBoxColor={colors.titleText}
                          isChecked={termCondition}
                          rightText="I agree to Zimble Product etc….."
                          leftTextStyle={{ color: colors.textColorCechBox, fontFamily: fonts.robotoRegular }}
                        />
                      </View>
                      <ButtonWithoutShadow
                        height={60}
                        backgroundColor={colors.childblue}
                        width={width - 60}
                        borderRadius={30}
                        marginLeft={0}
                        marginRight={0}
                        marginTop={20}
                        label="NEXT"
                        labelColor={colors.white}
                        onAction={() => { onSubscription() }}
                        fontFamily={fonts.robotoRegular}
                        fontSize={15}
                      ></ButtonWithoutShadow>
                    </View>
                }
              </View>

            </ScrollView>
            <Modal
                    onDismiss={() => {
                        setShowModal(false)

                    }}
                    onTouchOutside={() => {


                            setShowModal(false)
                        
                    }}
                    onHardwareBackPress={() => {
                      
                            setShowModal(false)
                      
                        return true

                    }}
                    swipeDirection="down"
                    onSwipeOut={() => setShowModal(false)}
                    visible={showModal}
                    
                    modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                >
                    <ModalContent style={{ width: width - 40 }}>
                        <Text style={styles.robotoRegularText}>You can earn a 5$ reward using the referral code given by friends or family. Once you activate your card, the referral code gets added to your wallet balance.</Text>
                    </ModalContent>
                </Modal>
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
    setLoggedInUserDetails: token => {
      dispatch(actions.setLoggedInUserDetails(token));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SetupPayemntMethode)

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
  robotoRegularText: {
    fontFamily: fonts.robotoRegular,
    color: colors.subTitleColor
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

});