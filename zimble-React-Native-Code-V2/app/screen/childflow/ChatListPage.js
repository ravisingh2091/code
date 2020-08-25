// Child will be able to view following details of the parent: 
// 	•	Name of the parent 
// 	•	Profile picture of the parent 
// 	•	Message Preview 
// 	•	Time of message (2days ago)

// Note: Child will be redirected to the chat screen after clicking on the admin.



import React, { useState, useEffect } from 'react'
import { FlatList, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";


import DeviceInfo from 'react-native-device-info';


import moment from "moment";

import { colors, fonts, localImages } from '../../utils/constant'

import {  getAnyUserDetails ,getChildChatList} from '../../api';

import SharedClass from '../../utils/SharedClass'

import { useFocusEffect, CommonActions, } from '@react-navigation/native';



var { height, width } = Dimensions.get('window');
const ChatListPage = (props) => {
    var sharedClass = new SharedClass();
    

    const [childList, setChildList] = useState([])
    const [roomIDList, setroomIDList] = useState([])
    const [userDetails, setUsersDetails] = useState('')
    const [sppiner ,setLoader]= useState(false)

  
   
    const { setLoggedInUserAuthToken } = props;

    useEffect(() => {

    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getRoomIds()
            
            getUserDetailsFun(props.loginUser.parentId)
        }, [])
    );


    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

    const onReturn = () => {
        props.navigation.goBack()
    }

    const onButton = (page) => {
        
        if (!page) {
            
        } else if (page == 'ChildDashBoard' || page == 'TaskListChildPage' || page=='ChatListPage') {

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

   


  

    const getRoomIds = async () => {


        try {
            // setLoader(true)
            const result = await getChildChatList();

         
            if (result && result.status == 'success') {
                 setroomIDList([result.details])
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

    const getUserDetailsFun = async (id) => {

        
        let req = {
            userId: id?id:props.loginUser.parentId
        }
        
        try {
            setLoader(true)
            const result = await getAnyUserDetails(req);
            
            setLoader(false)
            
            if (result && result.status == 'success') {
                
                setUsersDetails(result.details)
              

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

 
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

 
   const timing =(time)=> {
        return moment(time).fromNow()
    }
    const onNavigate =(item)=>{
        let chatReq={
            parentName:userDetails.familyName,// userDetails.familyName,
            parentProfile:roomIDList[0].profilePicture,///userDetails.profilePicture,
            parentId:roomIDList[0].parentId,///userDetails._id,
            childName:props.loginUser.firstName,
            childProfile:props.loginUser.profilePicture,
            childId:props.loginUser._id,
            }
        props.setChildChatReq(chatReq)
        props.navigation.navigate('ChatDetailsPage')
       
    }

    let type = DeviceInfo.hasNotch();

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                     style={{  }}
                    contentContainerStyle={styles.scrollview}
                
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                        
                        <View style={{ marginTop: 5 }}>

                            <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 0, height: 50 }}>
                                
                             <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.allowTitle }]}>{userDetails.familyName}</Text>
                       

                            </View>
                            <FlatList
                                data={roomIDList}
                                horizontal={true}
                                
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity  onPress={()=>{onNavigate()}}
                                        style={{
                                            
                                            
                                            shadowColor: colors.gradientGreenThree,
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 10,
                                            elevation: 5,height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white,marginHorizontal:5,  justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: item.profilePicture }} style={{ height: 58, width: 58, borderRadius: 29 }}></Image>
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <View style={{ marginTop: 20,height:height-250, backgroundColor:colors.blueLightColor }}>

                        <FlatList
                                data={roomIDList.filter(it=>it.msg)}
                                ListEmptyComponent={()=>(
                                    <View style={[styles.cardfirst,{alignItems:'center', justifyContent:'center', height:200, marginTop:30}]}>
                                            <Text style={{fontSize:15, fontFamily:fonts.robotoRegular, color:colors.titleText}}> Tap on profile icon to start a new chat  </Text>

                                        </View>
                                )}
                                renderItem={({ item, index }) => {
                                    return (
                                            <TouchableOpacity onPress={()=>{onNavigate()}} style={{ borderBottomWidth: index == childList.length-1 ? 1 : 0, borderBottomColor: colors.grayColorLight,borderTopWidth: index == 0 ? 1 : 1, borderTopColor: colors.grayColorLight , backgroundColor:colors.white, justifyContent:'center'}}>
        
        
                                                <View  style={[{ minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, }]}>
        
        
        
        
                                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center',width: width - 40, alignItems:'center' }}>
                                                        <View style={{ 
                                                             shadowColor: colors.gradientGreenThree,
                                                             shadowOffset: {
                                                                 width: 0,
                                                                 height: 2,
                                                             },
                                                             shadowOpacity: 0.25,
                                                             shadowRadius: 10,
                                                             elevation: 5,height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white,  justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image source={{ uri: item.profilePicture }} style={{ height: 58, width: 58, borderRadius: 29 }}></Image>
                                                        </View>
                                                        <View style={{ marginHorizontal: 0, width: width - 40 , justifyContent:'center'}}>
                                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 17, color: colors.allowTitle, marginRight: 40 }]}>{userDetails.familyName} </Text>
                                                            <View style={{ flexDirection: 'row', width: width - 40 , marginBottom:0}}>
                                                                <Text style={[styles.robotoRegularText, { marginHorizontal: 10, fontSize: 15, color: colors.ammountColor, marginRight: 40 }]}>{item.msg} </Text>
                                                                
                                                            </View>
                                                            <Text style={[styles.robotoBoldText, { position: 'absolute', right: 80, fontSize: 13, color: colors.ammountColor, marginRight: 0 , bottom:0}]}> {timing(item.msgDate)}</Text>
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
                {/* <View style={[styles.tabBar, { borderTopWidth: .9, borderTopColor: colors.charcolColorNew, height: 70, position: 'absolute', bottom: Platform.OS == 'ios' ? type ? 0 : 10 : 0, }]}>
                      <TouchableOpacity onPress={() => onButton('EducationPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.accountant} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Education</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onButton('ChildDashBoard')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>

                            <Image source={localImages.wallet} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onButton('TaskListChildPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.health_insurance} style={{ height: 35, width: 35 }}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Tasks</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                            <Image source={localImages.Tab4Active} style={{ height: 31, width: 31*1.04 , marginTop:5}}></Image>
                            <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.childblue }]}>Chat</Text>

                        </TouchableOpacity>
                       
                    </View> */}
            </View>

        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
   
    return {
        loginStatus: state.localStates.loginStatus,
        loginUser:state.localStates.userDetails
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
        setChildChatReq: chatReq => {
            dispatch(actions.setChildChatReq(chatReq));
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