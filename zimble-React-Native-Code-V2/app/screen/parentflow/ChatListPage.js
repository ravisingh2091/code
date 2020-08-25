// Chats
// Start a New Chat: User will be able to select any of child from the list that will be appearing on the top in the form of sider.
// Note: User will be redirected to the chat screen with the child as per his selection.

// User will be able to view all the active chats with the child on the screen with the following details: 
// 	•	Name of the user 
// 	•	Profile picture of the user 
// 	•	Message Preview 
// 	•	Time of message (2days ago)

// Note: User will be redirected to the chat screen after clicking on any of the active chat.


import React, { useState, useEffect } from 'react'
import { FlatList, ImageBackground, Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'

import DeviceInfo from 'react-native-device-info';



import {  getUserDetails, getChatRoomId } from '../../api';

import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions, } from '@react-navigation/native';



var { height, width } = Dimensions.get('window');
import moment from "moment";


const ChatListPage = (props) => {
    const sharedClass = new SharedClass();
    const [roomIDList, setroomIDList] = useState([])
    const [childList, setChildList] = useState([])
    const [userDetails, setUsersDetails] = useState('')
    const [sppiner, setLoader] = useState(false)
   


    const { setLoggedInUserAuthToken } = props;
 

    



    useEffect(() => {

    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getRoomIds()
            // getAllChildList()
            getUserDetailsFun()
        }, [])
    );


  
  

   
    const onSelectChild = (item) => {
        props.navigation.navigate('SingleChildStatisticPage', { childdetails: item })
    }



    const getRoomIds = async () => {


        try {
            
            const result = await getChatRoomId();
            console.log(result)

            if (result && result.status == 'success') {
                setroomIDList(result.details)
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

  


    const onNavigate = (item) => {
        let chatReq = {
            parentName: userDetails.faimlyName,
            parentProfile: userDetails.profilePicture,
            parentId: userDetails._id,
            childName: item.name,
            childProfile: item.profilePicture,
            childId: item._id,
        }
        props.setParentChatReq(chatReq)
        props.navigation.navigate('ChatDetailsPage')

    }

    const timing = (time) => {
        return moment(time).fromNow()
    }

   
    let type = DeviceInfo.hasNotch();
    console.log(type)
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ }}
                    contentContainerStyle={styles.scrollview}
               
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                       
                        <View style={{ marginTop: 5 }}>

                            <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', height: 50 }}>
                              
                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.allowTitle }]}>{userDetails.familyName}</Text>
                              

                            </View>
                            <FlatList
                                data={roomIDList}
                                horizontal={true}
                               
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity onPress={() => { onNavigate(item) }} style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: item.profilePicture }} style={{ height: 59, width: 59, borderRadius: 29.5 }}></Image>
                                        </TouchableOpacity >
                                    )
                                }}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <View style={{ marginTop: 20, height: height - 250, backgroundColor: colors.blueLightColor }}>

                            <FlatList
                                data={roomIDList.filter(it => it.msg)}
                                ListEmptyComponent={()=>(
                                    <View style={[styles.cardfirst,{alignItems:'center', justifyContent:'center', height:200, marginTop:30}]}>
                                            <Text style={{fontSize:15, fontFamily:fonts.robotoRegular, color:colors.titleText}}>Add a child and Tap on profile icon to start a new chat.  </Text>

                                        </View>
                                )}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity onPress={() => { onNavigate(item) }} style={{ borderBottomWidth: index == childList.length - 1 ? 1 : 0, borderBottomColor: colors.grayColor, borderTopWidth: index == 0 ? 1 : 1, borderTopColor: colors.grayColor, backgroundColor: colors.white }}>


                                            <View onPress={() => onSelectChild(item)} style={[{ minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, }]}>




                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                                    <View style={{

                                                        shadowColor: colors.shadowColor,
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,

                                                        height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center'
                                                    }}>
                                                        <Image source={{ uri: item.profilePicture }} style={{ height: 58, width: 58, borderRadius: 29 }}></Image>
                                                    </View>
                                                    <View style={{ marginHorizontal: 0, width: width - 40, justifyContent: 'center' }}>
                                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 17, color: colors.allowTitle, marginRight: 40 }]}>{item.name}  </Text>
                                                        <View style={{ flexDirection: 'row', width: width - 40, }}>
                                                            <Text style={[styles.robotoRegularText, { marginHorizontal: 10, fontSize: 15, color: colors.ammountColor, marginRight: 40 }]}>{item.msg}</Text>

                                                        </View>
                                                        <Text style={[styles.robotoBoldText, { position: 'absolute', right: 50, fontSize: 11, color: colors.ammountColor, marginRight: 0, bottom: 0 }]}> {timing(item.msgDate)}</Text>
                                                    </View>

                                                </View>
                                                <View>

                                                </View>

                                            </View>

                                        </TouchableOpacity>

                                    )
                                }}
                                keyExtractor={item => item.id}
                            />


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
        setParentChatReq: chatReq => {
            dispatch(actions.setParentChatReq(chatReq));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatListPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        ///  marginBottom:90
    },
    mainContent: {
        flexGrow: 1,
        justifyContent: "space-between",
        padding: 10,
    },
    tabBar: {

        backgroundColor: colors.white,
        // shadowColor: colors.gradientGreenThree,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 10,
        // elevation: 5,
        // height: 60,
        width: width,
        flexDirection: 'row',
        // alignItems: 'center',
        // minHeight: 60,
        // position:'absolute',
        // bottom:Platform.OS=='ios'? 30:0
        //marginBottom:30



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

});