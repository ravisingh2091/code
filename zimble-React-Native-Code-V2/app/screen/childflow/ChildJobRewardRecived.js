import React, { useState, useEffect } from 'react'
import { Alert, Animated, StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'


import DeviceInfo from 'react-native-device-info';


import {  getTaskDetails, acceptTask, readNotification, getBadgesDetails } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


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

const ChildJobRewardRecived = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})
    const [taskType, setTaskType] = useState('')


    const [sppiner, setLoader] = useState(false)
  
    const { setLoggedInUserAuthToken } = props;
  
   
    
    useEffect(() => {
        getAllTaskList(route.params.taskId,route.params.type)
        setTaskType(route.params.type)
      

    }, [setLoggedInUserAuthToken])


    const getAllTaskList = async (id,typeTask) => {


        try {
            setLoader(true)
            var result
            if(typeTask=='reward_task'){
                 result = await getTaskDetails(id);
            }else{
                 result = await getBadgesDetails(id);
            }
           
       
            setLoader(false)
            
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)

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




    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

    let type = DeviceInfo.hasNotch();

    return (
        <SafeAreaView style={{ alignItems: 'center', backgroundColor: colors.orangeChild, color: colors.gradientGreenThree }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>

                {sppiner && <Loder data={sppiner}></Loder>}
                <NetConnectionScreen></NetConnectionScreen>
           



                <View style={{}}>



                    <View style={{}}>
                        <View style={{ width: width, alignItems: 'center' }}>
                        


                        </View>
                        <View onPress={() => onLogin()} style={styles.cardfirst}>
                        <View style={{
                               
                                justifyContent:'center',
                                alignItems:'center',
                                zIndex:999,
                                position:'absolute',
                                top:-100,
                               width: 200, height: 200, borderRadius: 100, backgroundColor: colors.white
                            }}>

                                <Image source={localImages.rewardrec} style={{width:150, height:150*.77, }}></Image>
                            </View>
                            <View style={{ alignItems: 'center' }}>

                        <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 110, textAlign:'center' }}>Job completion accepted - {taskType=='reward_task'? taskDetails.taskName:taskDetails.title}</Text>

                            </View>
                           {taskDetails.taskDescription || taskDetails.description? <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                                <Text style={{ marginVertical: 10, marginHorizontal: 10, color: '#696969', fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>{taskType=='reward_task'? taskDetails.taskDescription:taskDetails.description}</Text>
                            </View>:null}
                            <View style={[styles.card, { width: width - 80,marginTop:20 }]}>
                                            <Text style={styles.heading}>Reward</Text>

                                            <View style={[styles.cardPickerView]}>
                                                <View style={[styles.cardThree, { width: width - 60, alignItems: 'center' }]}>




                                                    <Text style={{ marginTop: 10, marginLeft: 10, color: colors.placeHolderColor, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>{taskDetails.reward}</Text>
                                                    {taskDetails.monetaryReward ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.childblue, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>Received : ${taskDetails.rewardAmount}</Text> : null}
                                                </View>






                                            </View>


                                        </View>
                            <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40 }}>

                               
                            </View>



                            <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 94}
                                    borderRadius={30}
                                    marginTop={0}
                                    
                                    label="Close"
                                    labelColor={colors.white}
                                    onAction={() => props.navigation.goBack()}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                            </View>
                        </View>


                    </View>


                   
                </View>

              




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
export default connect(mapStateToProps, mapDispatchToProps)(ChildJobRewardRecived)

var styles = StyleSheet.create({
    linearGradient: {
       
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.orangeChild
       
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
        
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
      
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        

    },
  
    heading: {
        fontFamily: fonts.robotoMedium,
        fontSize: 20,
        marginTop: 33,
        color: colors.titleText
    },


});