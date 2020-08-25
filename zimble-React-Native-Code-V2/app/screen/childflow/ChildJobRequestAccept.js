import React, { useState, useEffect } from 'react'
import { Alert, Animated, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";

import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'


import DeviceInfo from 'react-native-device-info';


import {  getTaskDetails, acceptTask, readNotification } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


var { height, width } = Dimensions.get('window');


const ChildJobRequestAccept = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})

    const [timerValue, setTimerValue] = useState(0)
    const [sppiner, setLoader] = useState(false)
 
    const { setLoggedInUserAuthToken } = props;



    useEffect(() => {
        getAllTaskList(route.params.taskId)
        setTaskIds(route.params.taskId)
        setNotificationIds(route.params.notificationId)
        onReadNotification(route.params.notificationId)

    }, [setLoggedInUserAuthToken])


    const getAllTaskList = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
            
            setLoader(false)
            // setEmail('')
            // setPassword('')
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)
                    if (result.details.timer > 0) {
                        let caretedDate = new Date(result.details.createdAt).getTime()
                        let consumetime = caretedDate + result.details.timer
                        let currentTime = new Date().getTime()
                        let totalTimeLeft = consumetime - currentTime
                      
                        if (totalTimeLeft > 0) {
                            setTimerValue(totalTimeLeft / 1000)

                        } else {
                            setTimerValue(0)

                        }
                    }
                } else {
                    props.navigation.goBack()
                }


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
        }
    }

    const onAccept = async (status) => {

        if ((status == '0' && taskDetails.timer > 0 && timerValue < 1) || taskDetails.status != '0') {
            props.navigation.goBack()
            return
        }
        let req = {
            taskId: taskIds,
            acceptStatus: status,
        }

        try {
            setLoader(true)
            const result = await acceptTask(req);
            
            setLoader(false)

            if (result && result.status == 'success') {
                
                setTimeout(() => {
                    let message = {}
                    message.message = 'Request submitted successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                    props.navigation.goBack()
                }, 500)


            } else {
                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 500)

            }
        } catch (error) {
            setLoader(false)
        }

    }

    const onReadNotification = async (id) => {
        let req = {
            notificationId: id ? id : notificationIds,
        }

        try {
            
            const result = await readNotification(req);
           
            if (result && result.status == 'success') {
              

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
        }

    }
    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

 


    let type = DeviceInfo.hasNotch();
   
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ }}
                    contentContainerStyle={styles.scrollview}
              
                >
                    <View style={[styles.content, { backgroundColor: colors.orangeChild, }]}>
                        <View colors={[colors.white, colors.white, colors.white]} style={[styles.linearGradient, { paddingTop: 200, paddingBottom: 100 }]}>

                            {sppiner && <Loder data={sppiner}></Loder>}
                            <NetConnectionScreen></NetConnectionScreen>




                            <View style={{ marginBottom: 0 }}>




                                <View style={{}}>


                                    <View style={{ width: width, alignItems: 'center' }}>



                                    </View>
                                    <View onPress={() => onLogin()} style={styles.cardfirst}>
                                        <View style={{
                                            // shadowColor: colors.gradientGreenThree,
                                            // shadowOffset: {
                                            //     width: 0,
                                            //     height: 2,
                                            // },
                                            // shadowOpacity: 0.25,
                                            // shadowRadius: 3.84,
                                            // zIndex: 999,
                                            //elevation: 5, 
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 999,
                                            position: 'absolute',
                                            top: -100,
                                            width: 200, height: 200, borderRadius: 100, backgroundColor: colors.white
                                        }}>

                                            <Image source={localImages.jobrequestbyother} style={{ width: 150, height: 150 * .80, }}></Image>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>

                                            <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 110, marginHorizontal:10 }}>{taskDetails.taskName}</Text>

                                        </View>
                                        <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                                            <Text style={{ marginVertical: 10, marginHorizontal: 10, color: '#696969', fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>{taskDetails.taskDescription}</Text>
                                        </View>
                                        {taskDetails.status == '0' ? <View style={[styles.card, { width: width - 80 }]}>
                                            <Text style={styles.heading}> Due Date</Text>

                                            <View style={[styles.cardPickerView]}>
                                                <View style={[styles.cardThree, { width: width - 60, alignItems: 'center' }]}>




                                                    <Text style={{ marginTop: 10, marginLeft: 10, color: colors.placeHolderColor, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>{taskDetails.dueDate.split('T')[0]}</Text>
                                                </View>






                                            </View>


                                        </View> : null}
                                       <View style={[styles.card, { width: width - 80,marginTop:20 }]}>
                                            <Text style={styles.heading}>Reward</Text>

                                            <View style={[styles.cardPickerView]}>
                                                <View style={[styles.cardThree, { width: width - 60, alignItems: 'center' }]}>




                                                    <Text style={{ marginTop: 10, marginLeft: 10, color: colors.placeHolderColor, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>{taskDetails.reward}</Text>
                                                    {taskDetails.monetaryReward ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.childblue, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>Accept : ${taskDetails.rewardAmount}</Text> : null}
                                                </View>






                                            </View>


                                        </View> 
                                        <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40, marginTop: 20, }}>

                                            {/* {taskDetails.monetaryReward ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.childblue, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>Accept : ${taskDetails.rewardAmount}</Text> : null} */}
                                        </View>


                                        <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                                            <ButtonWithoutShadow
                                                height={60}
                                                backgroundColor={colors.childblue}
                                                width={width - 94}
                                                borderRadius={30}
                                                marginTop={0}
                                                disabled={(taskDetails.timer > 0 && timerValue < 1) || taskDetails.status != '0' ? true : false}
                                                // marginBottom={100}
                                                label={taskDetails.status != '0' ? 'Already Accepted' : 'Accept'}
                                                labelColor={colors.white}
                                                onAction={() => onAccept('1')}
                                                fontFamily={fonts.robotoRegular}
                                                fontSize={19}
                                            ></ButtonWithoutShadow>
                                        </View>
                                    </View>


                                </View>


                                {/* </ScrollView> */}
                            </View>

                            <View style={{ alignItems: 'center', bottom: -30, justifyContent: 'center', width: width }}>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={'rgba(255, 255, 255, 0)'}
                                    width={width - 94}
                                    borderRadius={30}
                                    marginTop={20}
                                    // marginBottom={100}
                                    label={taskDetails.status != '0' ? 'Close' : 'Not Interested'}
                                    labelColor={colors.placeHolderColor}
                                    onAction={() => onAccept('0')}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </View>

        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
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
export default connect(mapStateToProps, mapDispatchToProps)(ChildJobRequestAccept)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.orangeChild,
    },
    scrollview: {
        flexGrow: 1,
        ///  marginBottom:90
    },
    cardfirst: {
        // height: 189,
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: colors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,

        // marginTop: -60

    },
    ImageBackground: {
        width: width - 40,
        height: 100
    },
    container: {
        ///alignSelf: 'center',
        /// marginTop: 100,
        alignItems: 'center',
        width: width,
        ///backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle
        // margin: 10,
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        /// backgroundColor: colors.white,
        //marginLeft: -80, // reposition the circle inside parent view
        position: 'absolute',
        bottom: 0, // show the bottom part of circle
        overflow: 'hidden', // hide not important part of image
    },
    image: {
        opacity: .6,
        height: 250, // same width and height for the container
        width: width,
        position: 'absolute', // position it in circle
        bottom: 0, // position it in circle
        marginLeft: width * 1.5, // center it in main view same value as marginLeft for circle but positive
    },
    containerCard: {
        //flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        height: (width - 60) * .63,
        marginTop: 20,
        marginBottom: 0
    },
    imageCard: {
        height: (width - 60) * .63,
        width: width - 60,
        // alignSelf: "center",
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

    tabBar: {

        backgroundColor: colors.white,
        shadowColor: colors.gradientGreenThree,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        // height: 60,
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        // minHeight: 60,
        // position:'absolute',
        // bottom:Platform.OS=='ios'? 30:0
        //marginBottom:30



    },
    cardfirst: {
        //height: (width-40)*.544+700,
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
        // marginTop: -60

    },
    heading: {
        fontFamily: fonts.robotoMedium,
        fontSize: 20,
        marginTop: 5,
        color: colors.titleText
    },

  
   


});