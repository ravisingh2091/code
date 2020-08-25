import React, { useState, useEffect } from 'react'
import { Alert, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCamera, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow,  } from '../../components/Button'
import InputBox from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';


import {  getTaskDetails, acceptTask, readNotification } from '../../api';
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

const ChildSendjobApproval = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})
    const [description, setDescription]=useState('')

    const [sppiner, setLoader] = useState(false)
  
    const { setLoggedInUserAuthToken } = props;
  
     

    useEffect(() => {
       

    }, [setLoggedInUserAuthToken])


    const getAllTaskList = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
            
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
        }
    }

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
            let message = {}
            message.message = 'Request Submitted'
            message.type = 'success'
            sharedClass.ShowSnakBar(message)
           
            if (result && result.status == 'success') {
               

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

                                <Image source={localImages.bell} style={{width:150, height:150*1.02, }}></Image>
                               <TouchableOpacity style={{ position: 'absolute', right: 5 , bottom:5,  height:60, width:60, borderRadius:30, backgroundColor:colors.childblue, justifyContent:'center', alignItems:'center'}}><FontAwesomeIcon  icon={faCamera} color={colors.white} size={30} /></TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center' }}>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBoxBackground}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={120}
                                placeholder="Write a description"
                                placeholderColor={colors.placeHolderColor}
                                secureTextEntry={false}
                                editable={true}
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                            ></InputBox>

                            </View>
                            <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                            
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
                                    // marginBottom={100}
                                    label="Send for Approval"
                                    labelColor={colors.white}
                                    onAction={() => onAccept('1')}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                            </View>
                        </View>


                    </View>


                 
                </View>

                <View style={{ alignItems: 'center', bottom: -30, justifyContent: 'center', width: width }}>
                    <ButtonWithoutShadow
                        height={60}
                        backgroundColor={'rgba(255, 255, 255, 0)'}
                        width={width - 94}
                        borderRadius={30}
                        marginTop={20}
                        marginBottom={100}
                        label="Back"
                        labelColor={colors.placeHolderColor}
                        onAction={() => onAccept('0')}
                        fontFamily={fonts.robotoRegular}
                        fontSize={19}
                    ></ButtonWithoutShadow>
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
export default connect(mapStateToProps, mapDispatchToProps)(ChildSendjobApproval)

var styles = StyleSheet.create({
    linearGradient: {
       
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
 

  

});