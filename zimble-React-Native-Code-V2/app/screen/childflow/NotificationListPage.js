// Child will be able to view & receive all the in-app notifications.


import React, { useState, useEffect } from 'react'
import { Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, FlatList, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft,faEllipsisV, faCaretRight,   } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';


import {  getNotificationList } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import moment from "moment";
var eventList = ['all_task','reward_badge','parent_comp_task', 'single_task', 'parent_transaction_reaction', 'parent_transaction_reaction','single_badge','accept_event','parent_comp_task','parent_reject_task']
var { height, width } = Dimensions.get('window');




const NotificationListPage = (props) => {
    var sharedClass = new SharedClass();
   
   
    var [notification,setNotification] = useState([])
 
    const [sppiner, setLoader] = useState(false)
 

    const { setLoggedInUserAuthToken } = props;
  
    
     

    useEffect(() => {
        getNotification()
   
    }, [setLoggedInUserAuthToken])

 

 

   

    const getNotification = async () => {


        try {
            setLoader(true)
            const result = await getNotificationList();
          
            setLoader(false)
           
            if (result && result.status == 'success') {
                
                
             setNotification(result.details)
               


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


    const getNavigationstatus = (type) => {
        let index = eventList.indexOf(type)
        if (index != -1) {
            return true
        } else {
            return false
        }
    }

    
    const onSelectNoti = (item) => {
       
      
        switch (item.type) {
            case "all_task":
                props.navigation.navigate('ChildJobRequestAccept', { taskId: item.id, notificationId: item._id })
                break;
            case "single_task":
                props.navigation.navigate('TaskDetailsChildPage', { taskDetails: { _id: item.id }, notificationId: item._id })

                break;
            case "parent_transaction_reaction":
                props.navigation.navigate('ChildReactionReply', { taskId: item.id, notificationId: item._id, item: item })
                break;
            case "parent_comp_badge":
                props.navigation.navigate('BadgesDetailsChildPage', { taskDetails: { _id: item.id }, notificationId: item._id })
                break;

            case "single_badge":
                props.navigation.navigate('BadgesDetailsChildPage', { taskDetails: { _id: item.id }, notificationId: item._id })
                break;

            case "accept_event":
                props.navigation.navigate('ChildEventForApproval', { taskId: item.id, notificationId: item._id, item: item })
                break;


            case "parent_reject_task":
                props.navigation.navigate('ChildJobRejected', { taskId: item.id, notificationId: item._id, item: item })
                break;
            case "reward_task":
                props.navigation.navigate('ChildJobRewardRecived', { taskId: item.id, notificationId: item._id, type: 'reward_task' })
                break

            case "reward_badge":
                props.navigation.navigate('ChildJobRewardRecived', { taskId: item.id, notificationId: item._id, type: 'reward_badge' })
                break
                
            case "parent_comp_task":
                props.navigation.navigate('TaskDetailsChildPage', { taskDetails: { _id: item.id }, notificationId: item._id })
                break;

            default:
            // code block
        }

    }

    const timing = (time) => {
        return moment(time).fromNow()
    }
    let type = DeviceInfo.hasNotch();
 
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{}}
                    contentContainerStyle={styles.scrollview}
                //   scrollEnabled={scrollEnabled}
                //   onContentSizeChange={this.onContentSizeChange}
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                        <NetConnectionScreen></NetConnectionScreen>
                        {/* {this.state.sppiner && <Loder data={this.state.sppiner}></Loder>} */}
                         <View style={{ marginTop: 5 }}>

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 20, }}>
                              
                               
                            <View style={[styles.detailsBox, {}]}>
                                <FlatList
                                    data={notification}
                                    ListEmptyComponent={() => (
                                        <View style={[styles.cardfirst, { alignItems: 'center', justifyContent: 'center', height: 200 }]}>
                                            <Text style={{ fontSize: 20, fontFamily: fonts.robotoRegular, color: colors.titleText }}> No Notifications History  Found</Text>

                                        </View>)}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => onSelectNoti(item)} style={styles.innerBox}>
                                           
                                            <View style={[styles.rightBox, { flexDirection: 'row', alignItems: 'center', }]}>
                                                <View>
                                                    <Text style={{ color: colors.titleText, fontSize: 13.6, fontFamily: fonts.robotoRegular, marginLeft: 10 }}>{item.title}</Text>
                                                    <Text style={styles.dollarcolor}>{item.message ? item.message : ''}</Text>
                                                    <Text style={styles.dollarcolor}>{timing(item.createdAt)}</Text>
                                                </View>

                                            </View>
                                            {getNavigationstatus(item.type) ?
                                                <View style={{ position: 'absolute', flexDirection: 'row', right: 10 }}>

                                                    <FontAwesomeIcon style={{}} icon={faCaretRight} color={colors.titleText} Size={25} />


                                                </View>
                                                : null}
                                        </TouchableOpacity>

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
export default connect(mapStateToProps, mapDispatchToProps)(NotificationListPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    card: {
        
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


    cardfirst: {
        // height: 189,
        width: width - 60,
        //marginHorizontal: 18,
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
        

    },
   

    detailsBox: {
       
        borderRadius: 15,
        marginHorizontal: 20
    },
    innerBox: {
        marginHorizontal: 10,
        width: width - 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginTop: 10,
        borderRadius: 15,
        shadowColor: colors.gradientGreenThree,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 5
    },

    rightBox: {

        minHeight: 80,
        width: width - 100,
        marginVertical: 10,

        //borderBottomEndRadius: 15
    },
    dollarcolor: {
        color: colors.timeSelectedColor,
        fontSize: 16.3,
        fontFamily: fonts.robotoRegular,
        marginLeft: 10, marginTop: 5
    },


});