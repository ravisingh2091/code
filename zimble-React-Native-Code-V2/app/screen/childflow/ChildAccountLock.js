import React, { useState, useEffect } from 'react'
import { Alert, Animated, StatusBar, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import { ButtonWithoutShadow, } from '../../components/Button'


import DeviceInfo from 'react-native-device-info';



import { getTaskDetails, acceptTask, readNotification } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


var { height, width } = Dimensions.get('window');

const ChildAccountLock = (props) => {
    var sharedClass = new SharedClass();

    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')



    const [sppiner, setLoader] = useState(false)

    const { setLoggedInUserAuthToken } = props;



    useEffect(() => {


    }, [setLoggedInUserAuthToken])



    const onAccept = async (status) => {
        let req = {
            taskId: taskIds,
            acceptStatus: status,
        }

        try {
            setLoader(true)
            const result = await acceptTask(req);

            setLoader(false)
            onReadNotification()


            if (result && result.status == 'success') {

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
           
        }

    }
    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }



    let type = DeviceInfo.hasNotch();
   
    return (
        <SafeAreaView style={{ alignItems: 'center', backgroundColor: colors.lockaccount, color: colors.gradientGreenThree }}>
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

                                <Image source={localImages.lockaccount} style={{ width: 150, height: 150 * .95, }}></Image>
                            </View>
                            <View style={{ alignItems: 'center' }}>

                                <Text style={{ marginTop: 0, color: colors.red, fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 110 }}>Account Locked</Text>

                            </View>
                            <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                                <Text style={{ marginVertical: 10, marginHorizontal: 10, color: '#696969', fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>left until your account
becomes unlocked</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(ChildAccountLock)

var styles = StyleSheet.create({
    linearGradient: {
       
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lockaccount
       
    },
   

    

});