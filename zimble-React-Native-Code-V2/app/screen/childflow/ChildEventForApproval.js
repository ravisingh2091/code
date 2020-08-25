import React, { useState, useEffect } from 'react'
import { StatusBar,  Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'


import DeviceInfo from 'react-native-device-info';



import { getEventDetails, acceptTask, readNotification } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


var { height, width } = Dimensions.get('window');



const ChildEventForApproval = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})


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
            const result = await getEventDetails(id);
            
            setLoader(false)
            // setEmail('')
            // setPassword('')
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)

                }


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

    const onAccept = async (status) => {

        props.navigation.goBack()
   
      

    }

    const onReadNotification = async (id) => {
        let req = {
            notificationId: id ? id : notificationIds,
        }

        try {
            
            const result = await readNotification(req);
           
            if (result && result.status == 'success') {
                

            } else {

                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                    setLoader(false)
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
                                 
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 999,
                                position: 'absolute',
                                top: -100,
                                width: 200, height: 200, borderRadius: 100, backgroundColor: colors.white
                            }}>

                                <Image source={localImages.eventapproval} style={{ width: 150, height: 150 * .90, }}></Image>
                            </View>
                            <View style={{ alignItems: 'center' }}>

                                <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 110 }}>Approval for Event</Text>
                                <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 10 }}>{taskDetails.eventName}</Text>

                            </View>
                            <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                                <Text style={{ marginVertical: 10, marginHorizontal: 10, color: '#696969', fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>{taskDetails.eventDescription}</Text>
                            </View>
                            <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40 }}>

                                <Text style={{ marginTop: 0, marginLeft: 10, color: taskDetails.approveStatus == '3' ? colors.red : colors.childblue, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20, textAlign: 'center', marginHorizontal: 10 }}>{taskDetails.approveStatus == '3' ? 'Event is rejected by parent' : taskDetails.approveStatus == '2' ? 'Event is accepted with condition, you have to complete that task before go, Please check on going task' : 'Event Approval is accepted'}</Text>
                            </View>



                            <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 94}
                                    borderRadius={30}
                                    marginTop={0}
                                    // marginBottom={100}
                                    label="Close"
                                    labelColor={colors.white}
                                    onAction={() => onAccept('1')}
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
export default connect(mapStateToProps, mapDispatchToProps)(ChildEventForApproval)

var styles = StyleSheet.create({
    linearGradient: {
        // flex: 1,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.orangeChild
       
    },

   
    cardfirst: {
        
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        

    },
    headingBold: {
        fontFamily: fonts.robotoMedium,
        fontSize: 53,
        marginTop: 13,
        color: colors.titleText
    },

});