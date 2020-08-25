// Refers
// User will be able to refer a friend to get the bonus. 
// User will be able to view the referral code on the screen.
// Or 
// User will be able to share the link over various social networking platforms.

// Note: User will get some benefits for sharing referral code to another user if that user enters the referral code at the time of sign-up.


import React, { useState, useEffect } from 'react'
import { Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faShareAlt, } from '@fortawesome/free-solid-svg-icons'



import { colors, fonts, localImages } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';

import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import Share from 'react-native-share';




var { height, width } = Dimensions.get('window');



const HEADER_EXPANDED_HEIGHT = 80;
const HEADER_COLLAPSED_HEIGHT = 0;
const ReferralPage = (props) => {
    var sharedClass = new SharedClass();
    const [topupamount, setTopupamount] = useState(null);





    const [sppiner, setLoader] = useState(false)

    const { setLoggedInUserAuthToken } = props;





    useEffect(() => {
    }, [setLoggedInUserAuthToken])







    const onshare = () => {

        let shareOptions = {
            title: 'Share via',
            message: `Hey, install zimble and use my refrel code ${props.loginuserData.referalCode ? props.loginuserData.referalCode : ''}`,
            url: 'https://www.mobulous.com/',

        };
        Share.open(shareOptions);
    }
    let type = DeviceInfo.hasNotch();
    console.log(type)
    return (
        <SafeAreaView style={{ alignItems: 'center', backgroundColor: colors.white, color: colors.white }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.gradientGreenThree} />
            <View colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>


                <View style={{  flexDirection: 'row', zIndex: 999,height:60, backgroundColor:colors.white, justifyContent:'center' , alignItems:'center'}}>
                    <View style={{ width: 80, marginLeft: 20, }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                            <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                            <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                        </TouchableOpacity>
                    </View>
                   
                    <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                    </View>
                   
                    <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                    </View>
                </View>
            


                <View style={{}}>
                {sppiner && <Loder data={sppiner}></Loder>}
                <NetConnectionScreen></NetConnectionScreen>


                    <ScrollView contentContainerStyle={styles.scrollContainer}
                    >
                        <View style={{ alignItems: 'center' }}>
                             <View style={{width:width, backgroundColor:'#FFFFFF', alignItems:'center', padding:10}}>
                               <Image source={localImages.child}  style={{width:150*1.25, height:150, marginTop:10}}></Image>
                             </View>
                             <Text style={[styles.heading,{color:colors.black, fontSize:15}]}>Refer a friend and get a bonus!</Text>
                            <View style={styles.card}>

                                
                                <Text style={styles.subheading}>Use the Code</Text>
                                <Text style={[styles.refreelcode,{fontSize:25, color:colors.childblue }]}>{props.loginuserData.referalCode ? props.loginuserData.referalCode : 'FJHA10'}</Text>

                                <View style={{ marginHorizontal: 30, width: width - 90, flexDirection: 'row' }}>
                                    <View style={styles.borderViewFirst}>

                                    </View>
                                    <View style={styles.borderViewSecond}>
                                        <Text style={styles.or}>Or</Text>
                                    </View>
                                    <View style={styles.borderViewFirst}>

                                    </View>
                                </View>
                                <Text style={styles.subheading}>Send them a link to join</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                                    <TouchableOpacity onPress={() => onshare()} style={{ marginHorizontal: 10, height: 50, width: 100, borderRadius: 5, backgroundColor: colors.Purple, justifyContent: 'center', alignItems: 'center', flexDirection:'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faShareAlt} color={colors.white} Size={40} />
                                        <Text style={[styles.subheading,{marginTop:10, marginLeft:10, color:colors.white}]}>Share</Text>
                                    </TouchableOpacity >



                                </View>
                            </View>

                        </View>


                    </ScrollView>
                </View>







            </View>
        </SafeAreaView>


    )
}

const mapStateToProps = (state) => {
    console.log("check store data", state.localStates);
    return {
        loginStatus: state.localStates.loginStatus,
        loginuserData: state.localStates.userDetails,
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
export default connect(mapStateToProps, mapDispatchToProps)(ReferralPage)

var styles = StyleSheet.create({
    linearGradient: {

        height: height,
        backgroundColor: 'rgba(223, 234, 252, 0.4)'

    },
    scrollContainer: {
        paddingBottom: 30

    },
    headingTwo: {
        fontFamily: fonts.robotoRegular,
        fontSize: 13,
        color: colors.titleText,
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center'
    },
    refreelcode: {
        fontFamily: fonts.robotoRegular,
        fontSize: 65,
        color: colors.titleText,
        marginTop: 25,
        marginBottom: 30,
        textAlign: 'center'
    },
    heading: {
        fontFamily: fonts.robotoRegular,
        fontSize: 25,
        color: colors.titleText,
        marginTop: 35,
        marginBottom: 10,
        textAlign: 'center'
    },
    subheading: {
        fontFamily: fonts.robotoRegular,
        fontSize: 15,
        color: colors.timeSelectedColor,
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center'
    },
    card: {
        // height: 189,
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: colors.gradientGreenThree,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 46
    },
    borderViewFirst: {
        width: (width - 90) / 3 + 15,
        height: 1,
        backgroundColor: colors.titleText
    },
    borderViewSecond: {
        width: (width - 90) / 3 - 30,
        alignItems: 'center'
        //borderWidth:1
    },
    or: {
        fontFamily: fonts.robotoRegular,
        fontSize: 20,
        color: colors.titleText
    },
    socialImage: {
        width: 100,
        height: 100
    }

});