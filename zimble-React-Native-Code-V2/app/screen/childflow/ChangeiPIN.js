// Child will be able to change his iPIN that he needs to enter every time at the time of transaction.

// Child needs to follow following steps: 

// Verify OTP: A verification code will be shared on the email id of the child which he needs to enter on the platform.

// Create New iPIN: User will be able to re-create the iPIN on the platform.

// Note: User will be able to view a success message in case iPIN updated successfully.

import React, { useState, useEffect } from 'react'
import { StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ScrollView, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faChevronRight, faChevronLeft, faArrowLeft, faCoffee, faCheck, faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'
import InputBox, { MaskedInputBox } from '../../components/InputBox'


import { changeiPIN,geniPINOTP } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import StepIndicator from 'react-native-step-indicator';


import { useFocusEffect, CommonActions, } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Swiper from 'react-native-swiper';

var { height, width } = Dimensions.get('window');

const labels = ["Verify Otp", "New iPIN"];
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



const ChangeiPIN = (props, { route }) => {


    const [currentPosition, setCurrentPosition] = useState(0)
    const [otp, setotp] = useState()
    const [iPIN, setiPIN] = useState()
    const [sppiner, setLoader] = useState(false)

    const { setLoggedInUserAuthToken } = props;
    var sharedClass = new SharedClass();
    useEffect(() => {
        // getCardDetails()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setCurrentPosition(0)

        }, [])
    );


 const onReturn=()=>{

    if(currentPosition>0){
        setCurrentPosition(currentPosition-1)
    }else{
        props.navigation.goBack()
    }
 }

    const onNextOne = () => {
        let message = {}

        if (!otp) {
            message.message = 'Please enter otp'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        setCurrentPosition(1)
    }

    const onSubmit = async () => {
        let message = {}

        if (!otp) {
            message.message = 'Please enter otp'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!iPIN) {
            message.message = 'Please enter iPIN'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        try {
            let req = {
                otp: otp,
                ipin: iPIN
            }

            

            setLoader(true)
            const result = await changeiPIN(req);

            setLoader(false)


            setTimeout(() => {
               
                if (result && result.status == 'success') {
              
                    message.message = 'iPIN change successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                    props.navigation.goBack()
    
                } else {
    
                   
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
    
                }
            }, 500)


            
        } catch (error) {

            setLoader(false)

            setLoader(false)
            setTimeout(() => {
               
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
    }

    const onResend = async ()=>{
        try {
            setLoader(true)
            const result = await geniPINOTP();       
            setLoader(false)          
            if (result && result.status == 'success') {
                let message = {}
                message.message = 'OTP resend successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                setotp('')
                // props.navigation.navigate('ChangeiPIN')

            } else {



                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 200)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }

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
                                <TouchableOpacity onPress={() => onReturn()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ width: width - 40, marginLeft: 20, alignItems: 'center', marginTop: 50 }}>
                            <Image source={localImages.creditcard} style={{ height: 120, width: 120 }} />
                            <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.darkBlue, marginTop: 20, textAlign: 'center' }]}>

                                {currentPosition == 0 ? 'Verify OTP' : 'New iPIN'}
                            </Text>
                            <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 20, textAlign: 'center', marginBottom: 30 }]}>
                                {currentPosition == 0 ? `Please enter otp send to parent register mobile number`
                                    : 'Please enter new iPIN'}


                            </Text>
                        </View>


                        <View style={{ width: width - 40, marginLeft: 20, marginTop: 20 }}>
                            <StepIndicator
                                stepCount={2}
                                customStyles={customStyles}
                                currentPosition={currentPosition}
                                labels={labels}
                            />
                        </View>
                        {currentPosition == 0 ?

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
                                    onAction={() => { onResend() }}
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

                                    onAction={() => { onNextOne() }}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                            </View>
                            : <View style={{ width: width - 40, marginLeft: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>


                                <SmoothPinCodeInput
                                    containerStyle={{ alignSelf: 'center' }}
                                    cellSpacing={20}
                                    cellSize={45}
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
                                    value={iPIN}
                                    codeLength={6}
                                    onTextChange={pin => setiPIN(pin)}
                                //  onFulfill={() => this.onFocusNextInput()}
                                />
                                <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 50, textAlign: 'center' }]}>



                                </Text>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={60}
                                    label="Submit"
                                    labelColor={colors.white}

                                    onAction={() => { onSubmit() }}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangeiPIN)

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