import React, { useState, useEffect } from 'react'
import { Alert, Animated, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCamera, faSearchPlus, faCoffee, faCheck, faPlus, faEye, faUnlock, faLock } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'
import InputBox from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';


import { API_BASE_URL, getChildList, getUserDetails, getTaskList, getTaskDetails, acceptTask, readNotification } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


var { height, width } = Dimensions.get('window');

const JobAcceptedNotification = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
   
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})


    const [sppiner, setLoader] = useState(false)


    const { setLoggedInUserAuthToken } = props;

   
    

    useEffect(() => {
        getAllTaskList(route.params.taskId)
      //  setTaskIds(route.params.taskId)
        onReadNotification(route.params.notificationId)
       

    }, [setLoggedInUserAuthToken])


    const getAllTaskList = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
            console.log(result)
            setLoader(false)
           
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)

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
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

  

    const onReadNotification = async (id) => {
        let req = {
            notificationId: id?id:notificationIds,
        }

        try {
            //setLoader(true)
            const result = await readNotification(req);
           
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }
    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

 
    let type = DeviceInfo.hasNotch();
    console.log(type)
    return (
        <SafeAreaView style={{ alignItems: 'center', backgroundColor: colors.blueColorLight, color: colors.gradientGreenThree }}>
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
                                
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 999,
                                position: 'absolute',
                                top: -100,
                                width: 200, height: 200, borderRadius: 100, backgroundColor: colors.white,
                                borderWidth: 10,
                                borderColor: colors.childblue
                            }}>

                                <Image source={localImages.washing} style={{ width: 150, height: 150 * 1.02, borderRadius: 75 }}></Image>
                                
                            </View>
                            <View style={{ alignItems: 'center' }}>

                        <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 130, textAlign: 'center', }}>Job Request - {taskDetails.taskName}</Text>
                                {taskDetails.childId?<Text style={{ marginTop: 0, marginLeft: 10, color: colors.placeHolderColor, fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', marginTop: 20 }}>{taskDetails.childId.firstName} {taskDetails.childId.lastName} accepted this task</Text>
                                :null}
                            </View>
                            <View style={{ width: width - 120, marginVertical: 30, borderRadius: 10 ,alignItems:'center'}}>
                        <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>Reward : ${ taskDetails.rewardAmount?taskDetails.rewardAmount:'0'}</Text>
                                <Image source={localImages.cash} style={{ width: 80, height: 80 *.95,marginTop:20 }}></Image>
                            </View>
                            <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40 }}>

                               
                            </View>



                            <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.warning}
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
export default connect(mapStateToProps, mapDispatchToProps)(JobAcceptedNotification)

var styles = StyleSheet.create({
    linearGradient: {
        // flex: 1,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blueColorLight
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    scrollContainer: {
        paddingBottom: 30,
        justifyContent: 'center'
        // maxHeight:height-160
        //padding: 16,
        //paddingTop: HEADER_EXPANDED_HEIGHT
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
        // shadowColor: colors.gradientGreenThree,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: -60

    },

});