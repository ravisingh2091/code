// Events Screen
// User will be able to view the events requests that will be received from the child with following details: 

// 	•	Name of the user
// 	•	Profile picture of the user
// 	•	Name of the event 
// 	•	Description
// 	•	Location 
// 	•	Date & Time of the event 
// 	•	Action Button: 
// 	•	Accept 
// 	•	Accept with conditions: User will be redirected to the Accept with conditions Screen.
// 	•	Reject 

// Note: Once user accept or accept with conditions the event request will be moved from the requests to the upcoming events.

// Upcoming Events: 
// User will be able to view all the upcoming events with the following details:
// 	•	Name of the user
// 	•	Profile picture of the user
// 	•	Name of the event 
// 	•	Description
// 	•	Location 
// 	•	Date & Time of the event 

import React, { useState, useEffect } from 'react'
import { Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, FlatList } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faArrowLeft, faCalendar,faCaretLeft,faBell, faCoffee, faLocationArrow, faCheck, faPlus, faEye, faUnlock, faLock, faClock } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonWithBorder } from '../../components/Button'


import DeviceInfo from 'react-native-device-info';


import { getEventList, readNotification, acceptEvent } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'

import SharedClass from '../../utils/SharedClass'
import { useRoute ,useFocusEffect} from '@react-navigation/native'
var { height, width } = Dimensions.get('window');
var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CalendarEvents = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [notificationIds, setNotificationIds] = useState('')
 
    const [eventIds, setEventIds] = useState('')
    const [eventList, setEventList] = useState([])


    const [sppiner, setLoader] = useState(false)
    

    const { setLoggedInUserAuthToken } = props;

     
    useFocusEffect(
        React.useCallback(() => {
            getAllEventList()
        }, [])
      );
    useEffect(() => {
        getAllEventList()
        setEventIds(route.params && route.params.eventId?route.params.eventId:'')
        setNotificationIds(route.params && route.params.notificationId?route.params.notificationId:'')
    }, [setLoggedInUserAuthToken])

    const getTime = (item) => {
        var time = item.split(':')
        var returnTime = ''
        if (parseInt(time[0]) > 11) {
            if (parseInt(time[0]) == 12) {
                returnTime = time[0] + ':' + time[1] + 'pm'
            } else {
                returnTime = time[0] - 12 + ':' + time[1] + 'pm'
            }

        } else {
            returnTime = time[0] + ':' + time[1] + 'am'
        }

        return returnTime
      

    }

    const getMonth = (datevalue) => {
      
        var date = new Date(datevalue)

        console.log(date)

        var n = monthList[date.getMonth()];
        return n

    }

    const getAllEventList = async () => {


        try {
            setLoader(true)
            const result = await getEventList();
            console.log(result)
            setLoader(false)
           
            if (result && result.status == 'success') {
                setEventList(result.details)

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


    const acceptWithCondition =(id,childId)=>{
        console.log(id,childId)
        props.navigation.navigate('CreateTaskWithConPage', { eventId: id, notificationId:notificationIds,childId:childId})
    }

    const onAccept = async (status, eventId) => {
        let req = {
            eventId: eventId,
            acceptStatus: status,
        }

        try {
            setLoader(true)
            const result = await acceptEvent(req);
           
            setLoader(false)

           
            if (result && result.status == 'success') {
                
                getAllEventList()
                if (notificationIds) {
                    onReadNotification()
                }

                let message = {}
                message.message = 'Request Submitted'
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
    const onReadNotification = async () => {
        let req = {
            notificationId: notificationIds,
        }

        try {
           
            const result = await readNotification(req);
          
            if (result && result.status == 'success') {
              
                props.navigation.goBack()

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
    console.log(type)
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{}}
                    contentContainerStyle={styles.scrollview}
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                        <NetConnectionScreen></NetConnectionScreen>
                        
                        <View style={{ marginTop: 5 }}>

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 20, }}>
                            <View style={{ width: width, marginBottom: 20 }}>
                        <Text style={[styles.heading, { marginLeft: 30, color: colors.red }]}>Requests</Text>


                    </View>
                    <View style={{ marginTop: 0, marginBottom: 50 }}>


                        <FlatList
                            data={eventList.filter(it => it.approveStatus == '0')}
                            ItemSeparatorComponent={() => (
                                <View style={{ marginBottom: 10 }} />
                            )}
                            ListEmptyComponent={()=>(
                                <View style={[styles.cardfirst,{alignItems:'center', justifyContent:'center', height:200}]}>
                                        <Text style={{fontSize:20, fontFamily:fonts.robotoRegular, color:colors.titleText}}> No Requested events </Text>

                                    </View>
                            )}
                            renderItem={({ item, index }) => (
                                <View style={[styles.cardfirst,{paddingBottom:10}]}>
                                    <View style={{ height: 50, width: 50, position: 'absolute', right: 10, top: 10, borderRadius: 10, backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: fonts.robotoMedium, color: colors.white, fontSize: 25 }}>{item.date.split('-')[0]}</Text>
                                        <Text style={{ fontFamily: fonts.robotoRegular, color: colors.white, fontSize: 15 }}>{getMonth(item.eventTimeDate)}</Text>

                                    </View>
                                    <Text style={[styles.headingTwo, { fontSize: 15, marginLeft: 20, marginTop: 20 }]}>{item.eventName}</Text>
                                    <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon style={{}} icon={faClock} color={colors.titleText} Size={25} />
                                        <View>
                                            <Text style={styles.headingGrayBottom}>Time</Text>
                                            <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{getTime(item.time)}</Text>
                                        </View>
                                    </View>

                                    <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon style={{}} icon={faLocationArrow} color={colors.titleText} Size={25} />
                                        <View>
                                            <Text style={styles.headingGrayBottom}>Location</Text>
                                            <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{item.location}</Text>
                                        </View>
                                    </View>

                                    <View style={{ alignItems: 'center' }}>
                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.Greenish}
                                            width={width - 94}
                                            borderRadius={30}
                                            marginTop={0}
                                            
                                            label="Accept"
                                            labelColor={colors.white}
                                            onAction={() => onAccept('1', item._id)}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>

                                        <ButtonWithBorder
                                            height={60}
                                            borderColor={colors.childblue}
                                            borderWidth={1}
                                            width={width - 94}
                                            borderRadius={30}
                                            marginTop={10}
                                            
                                            label="Accept with Conditions"
                                            labelColor={colors.childblue}
                                            onAction={()=>acceptWithCondition(item._id, item.childId)}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithBorder>
                                        <ButtonWithBorder
                                            height={60}
                                            borderColor={colors.red}
                                            borderWidth={1}
                                            width={width - 94}
                                            borderRadius={30}
                                            marginTop={10}
                                            
                                            label="Reject"
                                            labelColor={colors.red}
                                            onAction={()=>onAccept('3', item._id)}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithBorder>
                                    </View>

                                </View>

                            )}
                            keyExtractor={item => item._id}
                        />







                        <View style={{ width: width, marginBottom: 20 }}>
                            <Text style={[styles.heading, { marginLeft: 30, fontSize: 25 }]}>Upcoming</Text>
                            <TouchableOpacity  style={{ position: 'absolute', right: 40, top: 33 }}>
                                <FontAwesomeIcon style={{}} icon={faCalendar} color={colors.titleText} Size={25} />


                            </TouchableOpacity>

                        </View>
                        <FlatList
                            data={eventList.filter(it => it.approveStatus == '1' || it.approveStatus == '2')}
                            ItemSeparatorComponent={() => (
                                <View style={{ marginBottom: 10 }} />
                            )}

                            ListEmptyComponent={()=>(
                                <View style={[styles.cardfirst,{alignItems:'center', justifyContent:'center', height:200}]}>
                                        <Text style={{fontSize:20, fontFamily:fonts.robotoRegular, color:colors.titleText}}> No upcoming events </Text>

                                    </View>
                            )}
                            renderItem={({ item, index }) => (

                                <View style={styles.cardfirst}>
                                    <View style={{ height: 50, width: 50, position: 'absolute', right: 10, top: 10, borderRadius: 10, backgroundColor: colors.Greenish, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: fonts.robotoMedium, color: colors.white, fontSize: 25 }}>{item.date.split('-')[0]}</Text>
                                        <Text style={{ fontFamily: fonts.robotoRegular, color: colors.white, fontSize: 15 }}>{getMonth(item.eventTimeDate)}</Text>

                                    </View>
                                    <Text style={[styles.headingTwo, { fontSize: 15, marginLeft: 20, marginTop: 20 }]}>{item.eventName}</Text>
                                    <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon style={{}} icon={faClock} color={colors.titleText} Size={25} />
                                        <View>
                                            <Text style={styles.headingGrayBottom}>Time</Text>
                                            <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{getTime(item.time)}</Text>
                                        </View>
                                    </View>

                                    <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon style={{}} icon={faLocationArrow} color={colors.titleText} Size={25} />
                                        <View>
                                            <Text style={styles.headingGrayBottom}>Location</Text>
                                            <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{item.location}</Text>
                                        </View>
                                    </View>



                                </View>

                            )}
                            keyExtractor={item => item._id}
                        />

               



                    </View>
                            </View>

                        </View>

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
        setLoggedInUserStatus: loginStatus => {
            dispatch(actions.setLoggedInUserStatus(loginStatus));
        },
        setLoggedInUserType: loginType => {
            dispatch(actions.setLoggedInUserType(loginType));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CalendarEvents)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        ///  marginBottom:90
    },
    cardfirst: {
       
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
        marginBottom:10
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: -60

    },
    headingGrayBottom: {
        fontFamily: fonts.robotoRegular,
        fontSize: 15,
        /// marginTop: 5,
        marginLeft: 10,
        color: colors.titleText
    },
    heading: {
        fontFamily: fonts.robotoMedium,
        fontSize: 20,
        marginTop: 33,
        color: colors.titleText
    },
    headingTwo: {
        fontFamily: fonts.robotoRegular,
        fontSize: 20,
        color: colors.titleText,
        marginTop: 10

    },
});