// Child will be able to view the events requests that will be created by him with following details: 

// 	•	Name of the event 
// 	•	Description
// 	•	Location 
// 	•	Date & Time of the event 

// Note: Once parent accept or accept with conditions the event request will be moved from the requests to the upcoming events.

// Upcoming Events: 
// Child will be able to view all the upcoming events with the following details:
// 	•	Name of the event 
// 	•	Description
// 	•	Location 
// 	•	Date & Time of the event 

// Note: In case parents select accept with conditions then the task created or assigned by the parent will be shown in the non-monetary tasks. 
// Child will be able to complete the task and submit the photo and video on the same and the reward would be acceptance of the event on completion of the task.

// Create New Event: Child will be redirected to the Create Event Screen.

import React, { useState, useEffect } from 'react'
import {  ScrollView, StatusBar, TouchableOpacity,  View, Text, StyleSheet, SafeAreaView, Dimensions,  FlatList } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendar, faArrowLeft, faLocationArrow, faPlus, faClock } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts } from '../../utils/constant'

import DeviceInfo from 'react-native-device-info';


import {getEventListChild, } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import { CommonActions } from '@react-navigation/native';
import SharedClass from '../../utils/SharedClass'
import {useFocusEffect } from '@react-navigation/native'
var { height, width } = Dimensions.get('window');
var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CalendarEvents = (props) => {
    var sharedClass = new SharedClass();
    const [notificationIds, setNotificationIds] = useState('')
    const [eventList, setEventList] = useState([])
    const [eventListUpcoming, setEventListUpcoming] = useState([])
    const [sppiner, setLoader] = useState(false)
    const { setLoggedInUserAuthToken } = props;
 

  

    useFocusEffect(
        React.useCallback(() => {
            getAllEventList()
        }, [])
    );
    useEffect(() => {
        getAllEventList()
    }, [setLoggedInUserAuthToken])

    const onButton = (page) => {

        if (!page) {
            
        }
        else if (page == 'ParentsMenuPage') {
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

       

        var n = monthList[date.getMonth()];
        return n

    }


    const getAllEventList = async () => {


        try {
            setLoader(true)
            const result = await getEventListChild();
          
            setLoader(false)
            if (result && result.status == 'success') {
                setEventList(result.details.filter(it => it.approveStatus == '0'))
                setEventListUpcoming(result.details.filter(it => it.approveStatus == '1' || it.approveStatus == '2'))

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
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
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
                setTimeout(() => {
                    let message = {}
                    message.message = 'Request Submitted'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
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
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }

    }

    let type = DeviceInfo.hasNotch();
   
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
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row' , justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center',width:120 , flexDirection:'row',justifyContent:'center' }}>
                                <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                            </TouchableOpacity>
                            <View style={{ width: width - 240, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.robotoRegularText, { fontSize: 20, marginTop: 0 ,color: colors.childblue}]}></Text>
                            </View>
                            <View style={{ width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                
                                <TouchableOpacity onPress={() => onButton('NewEventRequest')} style={{  }}>
                                    <FontAwesomeIcon style={{}} icon={faPlus} color={colors.childblue} size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: width, marginBottom: 20, marginTop: 10 }}>
                            <Text style={[styles.robotoBoldText, { marginLeft: 30, color: colors.red, fontSize: 25 }]}>Requests</Text>


                        </View>
                        <View style={{ marginTop: 0, marginBottom: 50 }}>


                            <FlatList
                                data={eventList}
                                ItemSeparatorComponent={() => (
                                    <View style={{ marginBottom: 10 }} />
                                )}

                                ListEmptyComponent={() => (
                                    <View style={[styles.cardfirst, { alignItems: 'center', justifyContent: 'center', height: 200 }]}>
                                        <Text style={{ fontSize: 20, fontFamily: fonts.robotoRegular, color: colors.titleText }}> No requested events </Text>

                                    </View>
                                )}
                                renderItem={({ item, index }) => (
                                    <View style={styles.cardfirst}>
                                        <View style={{ height: 40, width: 40, position: 'absolute', right: 10, top: 10, borderRadius: 10, backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: fonts.robotoMedium, color: colors.white, fontSize: 15 }}>{item.date.split('-')[0]}</Text>
                                            <Text style={{ fontFamily: fonts.robotoRegular, color: colors.white, fontSize: 10 }}>{getMonth(item.eventTimeDate)}</Text>

                                        </View>
                                        <Text style={[styles.headingTwo, { fontSize: 15, marginLeft: 20, marginTop: 20 }]}>{item.eventName}</Text>
                                        <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesomeIcon style={{}} icon={faClock} color={colors.titleText} Size={25} />
                                            <View>
                                                <Text style={styles.headingGrayBottom}>Time</Text>
                                                <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{getTime(item.time)}</Text>
                                            </View>
                                        </View>

                                        <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center' }}>
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







                            <View style={{ width: width, marginBottom: 20 , justifyContent:'center'}}>
                                <Text style={[styles.robotoBoldText, { marginLeft: 30, fontSize: 25, color: colors.titleText }]}>Upcoming</Text>
                                <TouchableOpacity style={{ position: 'absolute', right: 40, top: 10 }}>
                                    <FontAwesomeIcon style={{}} icon={faCalendar} color={colors.titleText} Size={30} />


                                </TouchableOpacity>

                            </View>
                            <FlatList
                                data={eventListUpcoming}
                                ItemSeparatorComponent={() => (
                                    <View style={{ marginBottom: 10 }} />
                                )}
                                ListEmptyComponent={() => (
                                    <View style={[styles.cardfirst, { alignItems: 'center', justifyContent: 'center', height: 200 }]}>
                                        <Text style={{ fontSize: 15, fontFamily: fonts.robotoRegular, color: colors.titleText }}> No upcoming events </Text>

                                    </View>
                                )}
                                renderItem={({ item, index }) => (

                                    <View style={styles.cardfirst}>
                                        <View style={{ height: 40, width: 40, position: 'absolute', right: 10, top: 10, borderRadius: 10, backgroundColor: colors.childblue, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: fonts.robotoMedium, color: colors.white, fontSize: 15, marginTop: 5 }}>{item.date.split('-')[0]}</Text>
                                            <Text style={{ fontFamily: fonts.robotoRegular, color: colors.white, fontSize: 10, marginBottom: 5 }}>{getMonth(item.eventTimeDate)}</Text>

                                        </View>
                                        <Text style={[styles.headingTwo, { fontSize: 15, marginLeft: 20, marginTop: 20 }]}>{item.eventName}</Text>
                                        <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesomeIcon style={{}} icon={faClock} color={colors.titleText} Size={25} />
                                            <View>
                                                <Text style={styles.headingGrayBottom}>Time</Text>
                                                <Text style={[styles.headingGrayBottom, { color: colors.childblue }]}>{getTime(item.time)}</Text>
                                            </View>
                                        </View>

                                        <View style={{ height: 60, width: '100%', marginLeft: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center' }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(CalendarEvents)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        
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
        marginBottom: 10
        
    },
    headingTwo: {
        fontFamily: fonts.robotoRegular,
        fontSize: 20,
        color: colors.titleText,
        marginTop: 10

    },
      headingGrayBottom: {
        fontFamily: fonts.robotoRegular,
        fontSize: 15,
        /// marginTop: 5,
        marginLeft: 10,
        color: colors.titleText
    },
})