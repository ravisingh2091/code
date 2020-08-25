// User will be able to view following elements on the home screen: 
// 	•	Notifications

// 	•	User Details: 
// 	•	Profile picture of the user 
// 	•	Name of the user 
// 	•	Email id of the user
// 	•	Main Account Balance (Available balance in the user’s account)

// 	•	Allowance option: User will be redirected to the Allowance Screen.

// 	•	Limits option: User will be redirected to the Limits Screen.

// 	•	Top Up option: User will be redirected to the Accounts Screen.

// 	•	Saving Targets & the goals: User will be able to view the savings targets & goals of the kid with the following details: 
// 	•	Name of the child 
// 	•	Profile picture of the child 
// 	•	Target 
// 	•	Completion of target in percentage 
// 	•	Ability to like the saving target & goals

// 	•	Recent Activities: User will be able to view all the recent activities: 
// 	•	User will be able to view the cards in the form of slider and ability to select any of the card (Belongs to individual child)
// 	•	User will be able to view the transactions performed by the child as per the selection of the card with the following details: 
// 	•	Money Transfer (Credit | Debit)
// 	•	Amount that with be credited or debited from the account.
// 	•	View all transactions: User will be redirected to the Transaction screen from where he will be able to view all the transaction details of a child.

// Note: User will be able to view the transaction as per the child card selection on the platform.

// 	•	Bottom menu:
// 	•	Wallet (Home | Dashboard will be the same)
// 	•	Tasks
// 	•	Chat 
// 	•	Accounts

// 	•	Sidebar Menu 


import React, { useState, useEffect } from 'react'
import {  ScrollView, StatusBar, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faShoppingCart, faAlignJustify, faChevronRight, faChevronLeft, faHeart, faBell,  } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';


import { API_BASE_URL, getChildList, getCards, getUserDetails, parentRecation, getNotificationList, getAccountHistory, getSavingListParent, markFavSavingParent, getNotificationCount } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import SharedClass from '../../utils/SharedClass'

import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';



import Swiper from 'react-native-swiper';
import { Drawer } from 'native-base';
import DrawerLayoutParent from '../../components/DrawerLayoutParent'

// import messaging from '@react-native-firebase/messaging';

const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
var { height, width } = Dimensions.get('window');




var data = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        target: 100,
        achive: 0
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa9c7f63',
        title: 'Second Item',
        target: 100,
        achive: 1
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        target: 100,
        achive: 2
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 3
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 4
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 5
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 6
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 7
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 8
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 9
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 10
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 80
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 90
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 100
    },
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        target: 100,
        achive: 0
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa9c7f63',
        title: 'Second Item',
        target: 100,
        achive: 1
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        target: 100,
        achive: 2
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 3
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 4
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 5
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 6
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 7
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 8
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 9
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 10
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 80
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 90
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        target: 100,
        achive: 100
    },
]



const ParentDashBoard = (props) => {
    var drawerParent

    var sharedClass = new SharedClass();
   

    const [childList, setChildList] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    var [cardList, setCardList] = useState([])
    const [userDetails, setUsersDetails] = useState('')

    const [notificationList, setNotificationList] = useState('')
 
    var [selectedtransctionHistory, setSelectedTransctionHistory] = useState([])

    const [notificationCount, setNotificationCount] = useState(0)


    const [sppiner, setLoader] = useState(false)


    const [savingPlanList, setSavingPlanList] = useState([])

    const { setLoggedInUserAuthToken } = props;
  


    useEffect(() => {

        createMessageListeners()
        createNotificationListeners()
       
        getSavingPlan()
        getCardDetails()
       
    }, [setLoggedInUserAuthToken])
    useFocusEffect(
        React.useCallback(() => {
            getAllChildList()
            getUserDetailsFun()
            getAllNotificationList()
            getNotificationCountUnread()
           
        }, [])
    );

    const closeDrawerParent = () => {
        drawerParent._root.close()
    }

    const openDrawerParent = () => {
        drawerParent._root.open()
    }

    const getNotificationCountUnread = async () => {
        try {

            const result = await getNotificationCount();

            // debugger
            if (result && result.status == 'success') {

                setNotificationCount(result.details.count)


            } else {

            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    const getSavingPlan = async () => {


        try {

            const result = await getSavingListParent(0);
            console.log(result)

            if (result && result.status == 'success') {
                setSavingPlanList(result.details)




            } else {

            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const onFaviroutie = async (id, index) => {


        try {

            const result = await markFavSavingParent(id);
            console.log(result)

            if (result && result.status == 'success') {
               

                getSavingPlan()

            } else {

            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const getCardDetails = async () => {


        try {
           
            const result = await getCards();
            console.log(result)
           
            if (result && result.status == 'success') {
                setCardList(result.details)




            } else {
               
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    const getChildTransction = async (dataValue) => {


        try {
            setLoader(true)
            const result = await getAccountHistory(1, dataValue._id);
            console.log(result)
            setLoader(false)
          
            if (result && result.status == 'success') {
              
                var list = []
                if (result.details.transectionData.length > 0) {

                    setSelectedTransctionHistory(result.details.transectionData)
                   
                }

            } else {
               
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const createMessageListeners = async () => {
        var messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            console.log('message display', message)
            //console.log('message display _data', message['_data'].image_url)
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
        console.log('d')
       
        const channel = new firebase.notifications.Android.Channel('fcm_default_channel', 'Default Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('notification My apps test channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);
        var notificationDisplayedListener = await firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            const { title, body, data } = notification;
            console.log('data', data)

        });

        var notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;
            console.log('notification first', notification)
            console.log('notification first', title)
            console.log('notification first', body)

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
            console.log('notification second', notificationOpen)
            const { title, body, data } = notificationOpen.notification;
            console.log('notification data', data)
            props.navigation.navigate('NotificationListPage')
          
        });

     
        const notificationOpen = await firebase.notifications().getInitialNotification();
       
        if (notificationOpen) {
            console.log('notification third', notificationOpen)
            const { title, body, data } = notificationOpen.notification;
            props.navigation.navigate('NotificationListPage')
           
        }
       
        var messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log('notification', JSON.stringify(message['_data']));


        });
    }



  


   

    const onButton = (page) => {

        if (!page) {
            alert('under development,')
        }
        else if (page == 'ParentDashBoard' || page == 'TaskListPage' || page == 'ChatListPage' ) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: page },
                    ],
                })
            );

        }
        else {
            props.navigation.navigate(page)
        }
    }




    const getAllChildList = async () => {


        try {
            setLoader(true)
            const result = await getChildList();
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                let activeCard = result.details.filter(it => it.cardActiveStatus == '1' && it.temporaryCardStatus == '1')
                setChildList(activeCard)

                if (selectedCard && activeCard.length) {
                    let selectedChild = activeCard.filter(it => it._id == selectedCard._id)
                    if (selectedChild.length) {
                        setSelectedCard(selectedChild[0])
                        getChildTransction(selectedChild[0])
                    } else {
                        setSelectedCard(activeCard[0])
                        getChildTransction(activeCard[0])
                    }
                } else {
                    if (activeCard.length) {
                        setSelectedCard(activeCard[0])
                        getChildTransction(activeCard[0])
                    }
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

    const getAllNotificationList = async () => {


        try {
            setLoader(true)
            const result = await getNotificationList();
            console.log(result)
            setLoader(false)
            
            if (result && result.status == 'success') {
                setNotificationList(result.details)

                if (result.details && result.details.length > 0) {
                    let filterdata = result.details.filter(it => it.status == '0' && (it.type == 'accept_task' || it.type == 'submit_task'))
                    if (filterdata.length > 0) {

                        if (filterdata[0].type == 'accept_task') {
                            props.navigation.navigate('JobAcceptedNotification', { taskId: filterdata[filterdata.length - 1].id, notificationId: filterdata[filterdata.length - 1]._id })
                        }

                        if (filterdata[0].type == 'submit_task') {
                            
                        }
                       
                    }
                    
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
    const getUserDetailsFun = async () => {


        try {
            setLoader(true)
            const result = await getUserDetails();
            console.log(result)
            setLoader(false)
          
            if (result && result.status == 'success') {
                setUsersDetails(result.details)
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
    
    let type = DeviceInfo.hasNotch();
    console.log({ type })

    const getPercentage = (item) => {

        let per = (item.amountSave * 100) / item.amountNeeded
        return Math.round(per)

    }
    const getRightSideRadious = (item) => {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 94:

                return 4
            case 95:

                return 5
            case 96:

                return 9
            case 97:

                return 12
            case 98:

                return 14
            case 99:

                return 20
            case 100:

                return 24
            default:
                return 0
            // code block
        }


    }

    const getHeight = (item) => {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 10:

                return 52
            case 9:

                return 51
            case 8:

                return 51
            case 7:

                return 50
            case 6:

                return 50
            case 5:

                return 45
            case 4:

                return 40
            case 3:

                return 30
            case 2:

                return 25
            case 1:

                return 20
            case 0:

                return 0
            default:
                return 54
            // code block
        }



    }
    const getLeftSideRadious = (item) => {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 10:
                
                return 27
            case 9:
                
                return 27
            case 8:
                
                return 27
            case 7:
                
                return 27
            case 6:
                
                return 27
            case 5:
                
                return 45
            case 4:
                
                return 40
            case 3:
                
                return 30
            case 2:
                
                return 25
            case 1:
                
                return 20
            case 0:
                
                return 0
            default:
                return 24
            // code block
        }



    }
    const cc_format = (value) => {
        console.log(value)

        if (value) {
            var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            var matches = v.match(/\d{4,16}/g);
            var match = matches && matches[0] || ''
            var parts = []

            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4))
            }

            if (parts.length) {
                return parts.join(' ')
            } else {
                return value
            }
        } else {
            return 'Card Not activated'
        }

    }
    return (
        <SafeAreaView style={styles.mainContainer}>

            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <Drawer
                ref={(ref) => { drawerParent = ref }}

                content={<DrawerLayoutParent navigation={props.navigation} closeDrawerParent={closeDrawerParent} />}
                onClose={() => closeDrawerParent()} >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{}}
                        contentContainerStyle={styles.scrollview}
                   
                    >
                        <View style={styles.content}>
                            <View style={styles.container} >
                                <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                    <View style={{ width: 80 }}>
                                        <TouchableOpacity onPress={() => openDrawerParent()} style={{ marginRight: 10, alignItems: 'center' }}>
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

                                       

                                        opacity: .3,

                                    }]}>

                                </LinearGradient>
                                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 60, zIndex: 99 }}>
                                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                    </View>
                                    <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{userDetails.familyName}</Text>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{userDetails.email}</Text>
                                    </View>

                                </View>
                            </View>
                            <View style={[styles.cardfirst, { marginTop: -50 }]}>
                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', borderBottomWidth: .5, borderBottomColor: colors.charcolColorNew }}>
                                    <Image source={localImages.home_equity} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16 }]}>Main Account Balance</Text>
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16, position: 'absolute', right: 10 }]}>${parseFloat(userDetails.totalWallet ? userDetails.totalWallet : 0).toFixed(2)}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('SetUpAllowancePage')} style={[styles.iconBackgroud, { backgroundColor: colors.pink }]}>
                                            <Image source={localImages.piggy_bank_2_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10 }]}>Allowance</Text>
                                    </View>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('SetupLimitPage')} style={[styles.iconBackgroud, , { backgroundColor: colors.Purple }]}>
                                            <Image source={localImages.money_shield_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10 }]}>Limits</Text>
                                    </View>
                                    <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={[styles.iconBackgroud, { backgroundColor: colors.Greenish }]} onPress={() => onButton('Accounts')}>
                                            <Image source={localImages.payment_white} style={{ height: 40, width: 40, }} />

                                        </TouchableOpacity>
                                        <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10 }]}>Top up</Text>
                                    </View>


                                </View>

                            </View>
                            {savingPlanList.length > 0 ? <View >

                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                    <Image source={localImages.bar_graph} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18 }]}>Saving Targets and goals</Text>

                                </View>
                                <View style={{ marginBottom: 10, marginTop: 20 }}>
                                    {
                                        savingPlanList.map((item, index) => {
                                            return (
                                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                    <View style={[styles.cardfirst, { height: 50, width: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginRight: 0 }]}>
                                                        <Image source={{ uri: item.childId.profilePicture }} style={{ height: 50, width: 50, borderRadius: 25.5, borderWidth: 1.5, borderColor: colors.white }} />
                                                    </View>
                                                    <View style={[styles.cardfirst, { height: 50, width: width - 160, borderRadius: 24, alignItems: 'center', marginLeft: 10, marginRight: 0, flexDirection: 'row' }]}>

                                                        <View style={[{

                                                            height: getHeight(item),
                                                            width: (getPercentage(item) * (width - 160)) / 100,
                                                            borderBottomStartRadius: getLeftSideRadious(item),
                                                            borderBottomEndRadius: getRightSideRadious(item),

                                                            borderBottomRightRadius: getRightSideRadious(item),

                                                            borderTopEndRadius: getRightSideRadious(item),
                                                            borderTopLeftRadius: getLeftSideRadious(item),
                                                            borderTopRightRadius: getRightSideRadious(item),
                                                            backgroundColor: colors.lightBlue, position: 'absolute', opacity: 1
                                                        }]}></View>
                                                        <View style={[{ height: 50, width: width - 160, alignItems: 'center', marginRight: 0, flexDirection: 'row' }]}>
                                                            <Image source={localImages.piggy_bank_2} style={{ height: 30, width: 30, marginLeft: 10, marginBottom: 0 }} />
                                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16, color: colors.titleText }]}>{item.wishlistName.length > 15 ? item.wishlistName.substring(0, 15) + '...' : item.wishlistName}</Text>
                                                            <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16, position: 'absolute', right: 10 }]}>{getPercentage(item)} %</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity onPress={() => onFaviroutie(item._id, index)} style={[{ height: 54, width: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 0 }]}>
                                                        <FontAwesomeIcon style={{}} icon={faHeart} color={item.favorite ? colors.titleText : colors.grayColor} size={25} />
                                                    </TouchableOpacity>

                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View> : null}
                            {childList.length > 0 ? <View >

                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                    <Image source={localImages.stock_market} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18 }]}>Recent Activities</Text>

                                </View>
                                <View>
                                    {childList.length > 0 && <View style={styles.containerCard}>
                                        <Swiper
                                            index={0}
                                            showsButtons
                                            buttonWrapperStyle={{ backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 30, right: 20, flex: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: width - 60, color: colors.white }}
                                            onIndexChanged={(index) => {
                                                console.log(index)
                                               
                                                if (index > -1) {
                                                    setSelectedCard(childList[index])
                                                    getChildTransction(childList[index])
                                                    
                                                }

                                               
                                            }}
                                            showsPagination={false}
                                            loop={false}
                                            showsPagination={false}
                                            nextButton={<FontAwesomeIcon style={{}} icon={faChevronRight} color={colors.white} size={30} />}
                                            prevButton={<FontAwesomeIcon style={{}} icon={faChevronLeft} color={colors.white} size={30} />}
                                        >
                                            {
                                                childList.length > 0 &&
                                                childList.map((item, key) => {

                                                    var imagedata = []
                                                    if (selectedCard) {
                                                        imagedata = cardList.filter(it => it._id == selectedCard.personisalizedCardId)
                                                    } else {
                                                        imagedata = cardList.filter(it => it._id == item.personisalizedCardId)
                                                    }
                                                   
                                                    if (imagedata.length > 0) {
                                                      
                                                        return (
                                                            <View style={{ alignItems: 'center' }}>
                                                                <Image
                                                                    
                                                                    source={{ uri: imagedata[0].image }}
                                                                    style={styles.imageCard}
                                                                    key={key} />
                                                                {selectedCard && <View style={{ position: 'absolute', left: 60, bottom: 40 }}>
                                                                    <Text style={{ fontFamily: fonts.robotoMedium, fontSize: 25, color: colors.white }}>{cc_format(selectedCard.matchMoveWalletCard)}</Text  >
                                                                    <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.white }}>{selectedCard.firstName} {selectedCard.lastName}</Text  >
                                                                </View>}
                                                            </View>
                                                        );

                                                    } else {
                                                        return (
                                                            <View></View>
                                                        );
                                                    }

                                                })}
                                        </Swiper>
                                    </View>}
                                    <View style={{ marginTop: 30 }}>
                                        {

                                            selectedtransctionHistory.map(item => {
                                              

                                                return (
                                                    <View style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                                        <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60 }]}>
                                                            <View style={{ height: 42, width: 42, borderRadius: 21, backgroundColor: colors.blueCardBox, justifyContent: 'center', alignItems: 'center' }}>
                                                                <FontAwesomeIcon style={{}} icon={faShoppingCart} color={colors.white} size={25} />
                                                            </View>
                                                            <View style={{ width: width - 120 }}>
                                                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.description}</Text>
                                                                <Text style={[styles.robotoRegularText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.type}</Text>
                                                            </View>
                                                            <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, position: 'absolute', right: 10, color: colors.subTitleColor }]}>${item.indicator == "credit" ? '+' : '-'}{item.amount}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                        {selectedtransctionHistory.length > 0 ? <View style={{ marginTop: 40, marginBottom: 40 }}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('TransactionListPage', { chilId: selectedCard._id })} style={{ position: 'absolute', right: 20, bottom: 0, borderBottomWidth: 1, borderBottomColor: colors.titleText }}><Text style={[styles.robotoRegularText, { fontSize: 19, color: colors.titleText }]}>View all transactions</Text></TouchableOpacity>
                                        </View> : null}
                                    </View>
                                </View>
                            </View> : null}
                            {savingPlanList.length == 0 && childList.length == 0 ? <View style={{ width: width, alignItems: 'center' }}>
                                <Text style={[styles.robotoBoldText, { fontSize: 18, marginTop: 20 }]}>There is no data to show, add child accounts</Text>
                                <Image source={localImages.logo} style={{ height: 100, width: 280.71, marginTop: 30 }} />
                            </View> : null}
                        </View>

                    </ScrollView>

                </View>
            </Drawer>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    console.log("check store data", state.localStates);
    return {
        loginStatus: state.localStates.loginStatus,
        userDetails: state.localStates.userDetails
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
export default connect(mapStateToProps, mapDispatchToProps)(ParentDashBoard)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
       
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
       
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle
       
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
        
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
       
    },

});

