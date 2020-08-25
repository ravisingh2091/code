

// Wallet Screen
// Child will be able to view following details on the wallet screen: 
// 	•	Child Details:
// 	•	Name of the child 
// 	•	Profile picture of the Child 
// 	•	Email id of the Child

// 	•	Available balance in the account of the child (in dollar)
// 	•	Savings Plan: Child will be redirected to the Create Savings Plan Screen.

// 	•	Expenditure: Child will be redirected to the Expenditure Screen.

// 	•	Earnings: Child will be redirected to the Earnings Screen.

// 	•	Monthly Allowance: Child will be able to view the monthly allowance in dollars and with the following details: 
// 	•	This Month (with the amount in dollars) 
// 	•	Total Spend Amount (till now in dollars)
// 	•	Total Remaining Amount (till now in dollars)
// 	•	Weekly Budget (with the amount in dollars)
// 	•	Total Spend Amount (till now in dollars)
// 	•	Total Remaining Amount (till now in dollars)

// 	•	My Goals: Child will be able to view the goals that will be set by the child in the savings plans with the following details: 
// 	•	Name of the Wishlist item
// 	•	Picture of the image upload by the child 
// 	•	Amount needed to purchase the item
// 	•	Remaining amount to save 
// 	•	View All: user will be redirected to My Goals Screen.

// Note: After clicking on any of the goal child will be redirected Goals Planning Screen.

// 	•	Education: Child will be able to view the education topics on the platform with following details: 
// 	•	Name of the topic 
// 	•	Image 
// 	•	View all: Child will be redirected to the Education Screen.

// Note: Child will be redirected to the topic detailed screen in case use clicked on any of the topic.

import React, { useState, useEffect } from 'react'
import { ImageBackground, FlatList, Alert, Animated, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments, faAlignJustify, faBell,  } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';

import * as Progress from 'react-native-progress';

import {geniPINOTP, getAnyUserDetails, getTransactionChildsideHistory, getChildList, getUserDetails, getTaskList, getUnreadTaskList, getNotificationList, getChildDashBoardData,getNotificationCount } from '../../api';

import SharedClass from '../../utils/SharedClass'
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';


import { Drawer } from 'native-base';
import DrawerLayout from '../../components/DrawerLayout'
import moment from "moment";


var colorsArray = [
    "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177", "#0d5ac1",
    "#f205e6", "#1c0365", "#14a9ad", "#4ca2f9", "#a4e43f", "#d298e2", "#6119d0",
    "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00",
    "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e",
    "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8",
    "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#ffdbe1", "#2f1179",
    "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
    "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
    "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
    "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
    "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
    "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
    "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
    "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
    "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
    "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
    "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
    "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
    "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
    "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
    "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
    "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
    "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
    "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
    "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
    "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
    "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
    "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
    "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
    "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
    "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
    "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
    "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
    "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"]


var { height, width } = Dimensions.get('window');


var shadowOpt = {
    width: 160,
    height: 170,
    color: colors.gradientGreenThree,
    border: 2,
    radius: 8,
    opacity: 0.25,
    x: 3,
    y: 3,
    style: { marginVertical: 5, marginHorizontal: 5 },

    // width:160,
    // height:170,
    // marginHorizontal: 18,
    // backgroundColor: colors.white,
    // shadowColor: colors.gradientGreenThree,
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 46
}

const ChildDashBoard = (props) => {
    var drawer
    var sharedClass = new SharedClass();
    const [userDetails, setUserDetails] = useState('')
    const [userDashBoardData, setUserDashBoardData] = useState('')
    const [sppiner, setLoader] = useState(false)
    const { setLoggedInUserAuthToken } = props;
    const [notificationCount, setNotificationCount] = useState(0)


    const closeDrawer = () => {
        drawer._root.close()
    };

    const openDrawer = () => {
        drawer._root.open()
    };
    useEffect(() => {
        setUserDetails(props.userDetails)
        createMessageListeners()
        createNotificationListeners()
    }, [setLoggedInUserAuthToken])
    useFocusEffect(
        React.useCallback(() => {
            getAllTaskList()
            getUserDetailsFun()
            getNotificationCountUnread()
            getAllNotificationList()

         
            
        }, [])
    );
   
    const onChangePin = async () => {


        try {
            setLoader(true)
            const result = await geniPINOTP();
            setLoader(false)
            if (result && result.status == 'success') {
                props.navigation.navigate('ChangeiPIN')

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
  
    const getNotificationCountUnread = async () => {
        try {

            const result = await getNotificationCount();

            
            if (result && result.status == 'success') {

                setNotificationCount(result.details.count)


            } else {

            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
  
    const getUserDetailsFun = async () => {
       
        let req = {
            userId: props.userDetails._id
        }

      

        try {
           
            const result = await getAnyUserDetails(req);
          
            if (result && result.status == 'success') {
                if (!result.details.ipinSet && result.details.cardActiveStatus=='1' && result.details.temporaryCardStatus=='1') {
                    Alert.alert(
                        'Alert',
                        'Please setup your iPIN, that will be used for E-Com transaction',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    onChangePin()
        
                                }
                            },
                        ],
                        { cancelable: false },
                    );
                }
                setUserDetails(result.details)
               

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
            
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
    }
    const createMessageListeners = async () => {
        var messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            if (message['_data'] && message['_data'].image_url) {
                var noti = new firebase.notifications.Notification()
                    .setNotificationId('notificationId')
                    .setSound('default')
                    .setTitle(message['_data'].description)
                    .setBody(message['_data'].title)
                    .setData(message['_data']);
                noti
                    .android.setChannelId('fcm_default_channel')
                    .android.setAutoCancel(true)
                    .android.setSmallIcon('@drawable/notificationicon')
                    .android.setColor('#fec400')
                    .android.setLargeIcon('@drawable/icon')
                    .android.setBigPicture(message['_data'].image_url)//, 
                    .android.setPriority(firebase.notifications.Android.Priority.High);
                firebase.notifications().displayNotification(noti)
            }

        })
    }

    const createNotificationListeners = async () => {
        const channel = new firebase.notifications.Android.Channel('fcm_default_channel', 'Default Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('notification My apps test channel');
       
        firebase.notifications().android.createChannel(channel);
        var notificationDisplayedListener = await firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            const { title, body, data } = notification;
            

            
        });

        var notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;
            const noti = new firebase.notifications.Notification()
                .setNotificationId(notification['_notificationId'])
                .setSound('default')
                .setTitle(title)
                .setBody(body)
                .setData(data);
            noti
                .android.setChannelId('fcm_default_channel')
                .android.setAutoCancel(true)
                
                .android.setColor('#fec400')
                .android.setLargeIcon('@drawable/appicon')
                .android.setPriority(firebase.notifications.Android.Priority.High);
            firebase.notifications().displayNotification(noti)
           
        });

       
        var notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            
            const { title, body, data } = notificationOpen.notification;
            
            navigationService.navigate('Notification')
           
        });

       
        const notificationOpen = await firebase.notifications().getInitialNotification();
        
        if (notificationOpen) {
            
            const { title, body, data } = notificationOpen.notification;
            
        }
        
        var messageListener = firebase.messaging().onMessage((message) => {
           


        });
    }


    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

    const onReturn = () => {
        props.navigation.goBack()
    }

    const onButton = (page) => {
        
        if (!page) {
           
        } else if (page == 'EducationPage' || page == 'ChildDashBoard' || page == 'TaskListChildPage' || page == 'ChatListPage') {

            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: page },
                    ],
                })
            );
           
        } else {
            props.navigation.navigate(page)
        }
    }

    const goToPage = (page) => {
        props.navigation.navigate(page)
    }

  

    const getAllTaskList = async () => {


        try {
            setLoader(true)
            const result = await getChildDashBoardData();
           
            setLoader(false)
          
            if (result && result.status == 'success') {
                setUserDashBoardData(result.details)




            }
        } catch (error) {
           
            setLoader(false)
            
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
    }

    const getAllNotificationList = async () => {


        try {
            setLoader(true)
            const result = await getNotificationList();
    
            setLoader(false)
          
            if (result && result.status == 'success') {
               

                if (result.details && result.details.length > 0) {
                    let filterdata = result.details.filter(it => it.status == '0' && it.type == 'all_task')
                    if (filterdata.length > 0) {
                        props.navigation.navigate('ChildJobRequestAccept', { taskId: filterdata[filterdata.length - 1].id, notificationId: filterdata[filterdata.length - 1]._id })
                    }
                    
                }


            } else {



            }
        } catch (error) {
           
            setLoader(false)
           
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
    }

    let type = DeviceInfo.hasNotch();
    
    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }
    const getDateSec = (date) => {
        var dateLocal = moment(date).format('LL');  
        return dateLocal
    }
    const getDateTime = (date) => {
        var dateLocal = moment(date).format('LT');  
        return dateLocal
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <Drawer
                ref={(ref) => { drawer = ref }}
                content={<DrawerLayout navigation={props.navigation} closeDrawer={()=>closeDrawer()} />}
                onClose={() => closeDrawer()} >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{  }}
                        contentContainerStyle={styles.scrollview}
                    
                    >
                        <View style={styles.content}>
                            <View style={styles.container} >
                                <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                    <View style={{ width: 80 }}>
                                        <TouchableOpacity onPress={() => openDrawer()} style={{ marginRight: 10, alignItems: 'center' }}>
                                            <FontAwesomeIcon style={{}} icon={faAlignJustify} color={colors.white} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: width - 160, alignItems: 'center', justifyContent: 'center' }}>

                                    </View>
                                    <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                        <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                            <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                            {notificationCount>0?<View style={{position:'absolute', backgroundColor:colors.white, width:20,height:20,borderRadius:10, right:-5, top:-5, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={[styles.robotoLightText, { color: colors.titleText }]}>{notificationCount}</Text>
                                            </View>:null}
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={() => onButton('ChatListPage')} style={{ marginLeft: 0, alignItems: 'center', marginRight: 30 }}>
                                            <FontAwesomeIcon style={{}} icon={faComments} color={colors.white} size={25} />
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                                <View style={styles.backgroundView} >

                                    <Image style={styles.image} source={{ uri: props.userDetails.coverPicture }} />
                                </View>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                    style={[styles.backgroundView, {

                                        // height: 100, width: width - 40,
                                        // backgroundColor: colors.lightBlue, 

                                        opacity: .3,

                                    }]}>

                                </LinearGradient>
                                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 60, zIndex: 99 }}>
                                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                    </View>
                                    <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{userDetails.firstName}</Text>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{userDetails.email}</Text>
                                    </View>

                                </View>
                            </View>
                            <View style={[styles.cardfirst, { marginTop: -50 }]}>
                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', borderBottomWidth: .5, borderBottomColor: colors.charcolColorNew }}>
                                    <Image source={localImages.home_equity} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16 }]}>Your Balance</Text>
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, position: 'absolute', right: 15 }]}>${parseFloat(userDetails.totalCardBalance ? userDetails.totalCardBalance : 0).toFixed(2)}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderBottomWidth: .5, borderBottomColor: colors.charcolColorNew, paddingBottom: 20 }}>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('CreateSavingPage')} style={[styles.iconBackgroud,{backgroundColor:colors.pink}]}>
                                            <Image source={localImages.piggy_bank_2_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 16, marginTop: 10 }]}>Savings plan</Text>
                                    </View>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('TransactionListPage')} style={[styles.iconBackgroud,{backgroundColor:colors.Purple}]}>
                                            <Image source={localImages.wallet_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 16, marginTop: 10 }]}>Expenditure</Text>
                                    </View>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={[styles.iconBackgroud,{backgroundColor:colors.Greenish}]} onPress={() => onButton('SingleChildStatisticPage', { childdetails: {} })}>
                                            <Image source={localImages.payment_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 16, marginTop: 10 }]}>Earnings</Text>
                                    </View>


                                </View>
                                <View style={{ width: width - 40, }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, color: colors.grayColorLight }]}>Monthly allowance</Text>
                                        <View style={{ position: 'absolute', right: 20 }}>
                                            <Text style={[styles.robotoBoldText, { color: colors.allowTitle, fontSize: 18, position: 'absolute', right: 0 }]}>${parseFloat(userDetails.allowanceAmountLimit ? userDetails.allowanceAmountLimit : 0).toFixed(2)}</Text>

                                        </View>
                                    </View>
                                    {userDetails.allowanceDate ? <View style={{ marginVertical: 10 }}>
                                        <Text style={[styles.robotoRegularText, { color: colors.allowTitle, fontSize: 14, position: 'absolute', right: 20 }]}>received on {getDateSec(userDetails.allowanceDate)}</Text>
                                    </View> : null}
                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 14, color: colors.blubutton }]}>This month</Text>
                                        <Text style={[styles.robotoBoldText, { color: colors.allowTitle, fontSize: 14, position: 'absolute', right: 0, marginRight: 20 }]}>${parseFloat(userDetails.spendLimit ? userDetails.spendLimit : 0).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ width: width - 40, alignItems: 'center', marginTop: 5 }}>
                                        <Progress.Bar
                                            borderRadius={10}
                                            progress={(userDetails.totalUseLimit ? userDetails.totalUseLimit : 0 / userDetails.spendLimit ? userDetails.spendLimit : 0)}
                                            width={width - 80}
                                            height={15}
                                            unfilledColor={colors.progressBarColor}
                                            color={colors.progressBarColorFill}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={[styles.robotoRegularText, { color: colors.allowTitle, fontSize: 14, marginTop: 3, marginLeft: 20 }]}>${parseFloat(userDetails.totalUseLimit ? userDetails.totalUseLimit : 0).toFixed(2)} Spent</Text>
                                        <Text style={[styles.robotoRegularText, { color: colors.allowTitle, fontSize: 14, marginTop: 3, position: 'absolute', right: 0, marginRight: 20 }]}>${(parseFloat(userDetails.spendLimit ? userDetails.spendLimit : 0) - parseFloat(userDetails.totalUseLimit ? userDetails.totalUseLimit : 0)).toFixed(2)} remaining</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 14, color: colors.blubutton }]}>Weekly Budget</Text>
                                        <Text style={[styles.robotoBoldText, { color: colors.allowTitle, fontSize: 14, position: 'absolute', right: 0, marginRight: 20 }]}>${parseFloat(userDetails.weeklySpendLimit ? userDetails.weeklySpendLimit : 0).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ width: width - 40, alignItems: 'center', marginTop: 5 }}>
                                        <Progress.Bar
                                            borderRadius={10}
                                            progress={(userDetails.totalUseweeklyLimit ? userDetails.totalUseweeklyLimit : 0 / userDetails.weeklySpendLimit ? userDetails.weeklySpendLimit : 0)}
                                            width={width - 80}
                                            height={15}
                                            unfilledColor={colors.progressBarColor}
                                            color={colors.progressBarGreen}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                        <Text style={[styles.robotoRegularText, { color: colors.allowTitle, fontSize: 14, marginTop: 3, marginLeft: 20 }]}>${parseFloat(userDetails.totalUseweeklyLimit ? userDetails.totalUseweeklyLimit : 0).toFixed(2)} Spent</Text>
                                        <Text style={[styles.robotoRegularText, { color: colors.allowTitle, fontSize: 14, marginTop: 3, position: 'absolute', right: 0, marginRight: 20 }]}>${(parseFloat(userDetails.weeklySpendLimit ? userDetails.weeklySpendLimit : 0) - parseFloat(userDetails.totalUseweeklyLimit ? userDetails.totalUseweeklyLimit : 0)).toFixed(2)} remaining</Text>
                                    </View>

                                </View>

                            </View>
                        
                            {userDashBoardData.savingData && userDashBoardData.savingData.length > 0 ? <View>
                                <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10 }}>
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 14, color: colors.blubutton }]}>My Goals</Text>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('SavingListPage')} style={[styles.robotoBoldText, { color: colors.blubutton, fontSize: 18, position: 'absolute', right: 0, marginRight: 20 }]}>
                                        <Text style={[styles.robotoBoldText, { color: colors.blubutton, fontSize: 14 }]}>View All</Text>
                                    </TouchableOpacity>

                                </View>

                                <FlatList
                                    data={userDashBoardData.savingData}
                                    ListEmptyComponent={() => (
                                        <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                                        </View>)}
                                    renderItem={({ item, index }) => (
                                        <View >


                                        <TouchableOpacity onPress={() => props.navigation.navigate('SavingDetailsPage', { taskDetails: item })} style={[styles.cardfirst, { minHeight: 120, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, justifyContent: 'center', marginRight: 0, flexDirection: 'row', marginBottom: 10 }]}>
        
                                            <ImageBackground source={{ uri: item.image }} imageStyle={[{ borderRadius: 8, marginLeft: 0 }]} style={[{ height: 117, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8, }]}>
        
        
                                            </ImageBackground >
        
                                            <LinearGradient
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                                    height: 117, width: width - 44,
                                                    backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                                }}>
        
                                            </LinearGradient>
                                            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, width: width - 40, }}>
                                                     <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16, color: colors.white,width: width - 180, }]}>{item.wishlistName}</Text>
                                                    <View style={{ position: 'absolute', right: 10, bottom: 0 }}>
                                                    <Text style={[styles.robotoBoldText, { color: colors.priceTag, fontSize: 22, position: 'absolute', right: 0, bottom: 20, zIndex: 110 }]}>${item.amountNeeded}</Text>
                                                       <Text style={[styles.robotoRegularText, { color: colors.white, fontSize: 13, marginTop: 5 }]}>Remaining:<Text style={[styles.robotoRegularText, { color: colors.priceTagColor, fontSize: 16, marginTop: 5 }]}>${item.amountNeeded - item.amountSave}</Text></Text>
                                                </View>
                                              </View>
                                            <View style={{ width: width - 40, alignItems: 'center', position: 'absolute', top: 1, justifyContent: 'center' }}>
                                             <Progress.Bar
                                                    borderRadius={10}
                                                    progress={((item.amountSave) / item.amountNeeded)}
                                                    width={width - 44}
                                                    height={15}
                                                    unfilledColor={colors.progressBarColor}
                                                    color={colors.childblue}
                                                />
                                                <Text style={[styles.robotoRegularText, { color: colors.white, fontSize: 9, position: 'absolute' }]}>${item.amountSave} Saved({((100 * item.amountSave) / item.amountNeeded).toFixed(2)}%)</Text>
                                            </View>
        
                                        </TouchableOpacity>
                                        </View>
                                        
                                    )}
                                    keyExtractor={item => item._id}
                                />

             




                            </View> : null}

                           { userDashBoardData.educationData && userDashBoardData.educationData.length>0?<View style={{ marginBottom: 20 }}>
                                                           <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10 }}>
                                                               <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 14, color: colors.blubutton }]}>Education</Text>
                                                               <TouchableOpacity style={{position: 'absolute', right: 0, marginRight: 20}} onPress={() => onButton('Education')}><Text style={[styles.robotoBoldText, { color: colors.blubutton, fontSize: 14,  }]}>View All</Text></TouchableOpacity> 
                                                           </View>
                                                           <View style={{ marginBottom: 10, marginTop: 0 }}>
                                                               <FlatList
                                                                   data={userDashBoardData.educationData}
                                                                   horizontal={true}
                                                                   renderItem={({ item }) => (
                                                                       <TouchableOpacity disabled={item.topic.length==0} onPress={()=>props.navigation.navigate('EducationDetailsPage',{topic:item.topic})} style={{ marginHorizontal: 10, width: width - 60, }}>
                                                                           <Image source={{uri:item.image}} imageStyle={[styles.cardfirst, { borderRadius: 8, marginLeft: 20 }]} style={[{ height: 150, marginLeft: 10, width: width - 60, marginHorizontal: 20, borderRadius: 8, }]}>
                           
                           
                                                                           </Image >
                                                                       </TouchableOpacity>
                                                                   )}
                                                                   keyExtractor={item => item.id}
                                                               //extraData={selected}
                                                               />
                                                           </View>
                                                       </View>:null}

                            {userDashBoardData.taskData && userDashBoardData.taskData.length > 0 ? <View >

                                <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 0 }}>
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 14, color: colors.blubutton }]}>Special rewards</Text>
                                    <TouchableOpacity style={{position: 'absolute', right: 0, marginRight: 20}} onPress={()=>{props.navigation.navigate('SpecialReward')}}><Text style={[styles.robotoBoldText, { color: colors.blubutton, fontSize: 14,  }]}>View All</Text></TouchableOpacity> 
                                </View>
                                <View style={[styles.scene, { backgroundColor: colors.white, width: width, paddingBottom: 30 }]} >

                                    <View style={{}}>
                                        <FlatList
                                            // horizontal={true}
                                            data={userDashBoardData.taskData}
                                            renderItem={({ item }) => {
                                                return (
                                                    <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsChildPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, backgroundColor: colors.iconBackgroud, marginTop: 30, borderRadius: 4, }}>
                                                        {item.bonusMonetry ? <View style={[styles.cardfirst, { backgroundColor: colors.white, position: 'absolute', right: 20, top: -25, borderRadius: 10, width: 80, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, marginVertical: 10, fontSize: 18, color: colors.childblue }]}>${item.bonusAmount.toFixed(2)}</Text>
                                                        </View> : null}
                                                        <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 80, marginVertical: 10 }]}>
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 20 }}>
                                                                <Image source={{ uri: item.category.image }} style={{ height: 58, width: 58, borderRadius: 29 }} />
                                                            </View>
                                                            <View style={{ width: width - 120 }}>
                                                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16, color: colors.subTitleColor, marginRight: 10 }]}>{item.bonusRewardDesc}</Text>
                                                                <View>
                                                                    <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.subTitleColor }]}>{getDate(item.updatedAt)}</Text>
                                                                    <Text style={[styles.robotoBoldText, { fontSize: 18, position: 'absolute', right: 20, color: colors.subTitleColor, fontSize: 13, }]}>{getDateTime(item.updatedAt)}</Text>
                                                                </View>


                                                            </View>
                                                            <View style={{ width: width - 120 }}>

                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                            keyExtractor={item => item.id}
                                        />
                                    </View>
                                </View>
                            </View> : null}
                        </View>

                    </ScrollView>
                    {/* <View style={[styles.tabBar, { borderTopWidth: .9, borderTopColor: colors.charcolColorNew, height: 70, position: 'absolute', bottom: Platform.OS == 'ios' ? type ? 0 : 10 : 0, }]}>
                        <TouchableOpacity onPress={() => onButton('EducationPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.accountant} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Education</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>

                           
                            <Image source={localImages.Tab2Active} style={{ height: 25, width: 25*1.31 , marginTop:10}}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.childblue }]}>Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onButton('TaskListChildPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.health_insurance} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Tasks</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onButton('ChatListPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.financial_advice} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Chat</Text>

                        </TouchableOpacity>

                    </View> */}
                </View>
            </Drawer>
        </SafeAreaView>
    )



}

const mapStateToProps = (state) => {
    
    return {
        loginStatus: state.localStates.loginStatus,
        userDetails: state.localStates.userDetails,
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
export default connect(mapStateToProps, mapDispatchToProps)(ChildDashBoard)

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
    tabBar: {

        backgroundColor: colors.white,
        
        width: width,
        flexDirection: 'row',
       



    },
    iconBackgroud: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: colors.iconBackgroud,
        justifyContent: 'center',
        alignItems: 'center'
    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    robotoLightText: {
        fontFamily: fonts.robotoLight,
        color: colors.grayColor
    },
    cardfirst: {
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

    },

    container: {
        ///alignSelf: 'center',
        /// marginTop: 100,
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle
        // margin: 10,
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
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

});