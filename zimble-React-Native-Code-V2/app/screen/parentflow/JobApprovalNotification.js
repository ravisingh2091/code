import React, { useState, useEffect } from 'react'
import { ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts } from '../../utils/constant'
import Button, { ButtonWithoutShadow } from '../../components/Button'
import InputBox from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';
import ImageView from "react-native-image-viewing";


import {  taskRewardAndComplte, getTaskDetails, readNotification, updateTask } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'


var { height, width } = Dimensions.get('window');


const JobApprovalNotification = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [imagesPriviewShow, setImagePreviewShow] = useState(false)
    const [imagesPriview, setImagePreview] = useState([])
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})
    const [description, setDescription] = useState('')

    const [sppiner, setLoader] = useState(false)
 

    const { setLoggedInUserAuthToken } = props;
  
   
    

    useEffect(() => {
        getAllTaskList(route.params.taskId)
        setTaskIds(route.params.taskId)
        onReadNotification(route.params.notificationId)
        // onTaskDetails(route.params.taskId)
        setNotificationIds(route.params.notificationId)

    }, [setLoggedInUserAuthToken])

    const onReward = async (type) => {
        let message = {}

        let req = {

        }

        req.taskId = taskDetails._id
        req.childId = taskDetails.childId._id
        req.comment = description


        try {
            setLoader(true)
            const result = await taskRewardAndComplte(req, taskDetails._id);
            console.log(result)
            setLoader(false)
            //let message = {}
            if (result && result.status == 'success') {

                setTimeout(() => {
                    message.message = 'Task updated'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                    props.navigation.goBack()
                }, 500)


            } else {

                setTimeout(() => {
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 500)

            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const onSave = async (type) => {

        ///alert(type)

        let message = {

        }
        let req = {

        }
        if ((!taskDetails.childId && type == 'complete') || taskDetails.status == '0') {
            message.message = 'No child accepted this task so it cant be mark as complete'
            message.type = 'success'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (type == 'reward') {
            req.status = '3'
        } else if (type == 'complete') {
            req.status = '2'
        }
        else if (type == 'reject') {
            req.status = '0'
        }


        req.comment = description
        try {
            //  setLoader(true)
            const result = await updateTask(req, taskDetails._id);
            console.log(result)
            setLoader(false)
            let message = {}
            if (result && result.status == 'success') {
                message.message = 'Task updated successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const getAllTaskList = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
            console.log(result)
            setLoader(false)
           
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)
                    if (result.details.imageUrls && result.details.imageUrls.length > 0) {
                        var images = []
                        for (let index = 0; index < result.details.imageUrls.length; index++) {

                            images.push({
                                uri: result.details.imageUrls[index]
                            })


                        }
                        setImagePreview(images)
                    }

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
            notificationId: id ? id : notificationIds,
        }

        try {
           
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
            <ScrollView>
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

                                    <Image source={{ uri: taskDetails.imageUrls && taskDetails.imageUrls[0] }} style={{ width: 150, height: 150 * 1.02, borderRadius: 75 }}></Image>
                                    <TouchableOpacity onPress={() => setImagePreviewShow(true)} style={{ position: 'absolute', right: 0, bottom: 0, height: 60, width: 60, borderRadius: 30, backgroundColor: colors.childblue, justifyContent: 'center', alignItems: 'center' }}><FontAwesomeIcon icon={faSearchPlus} color={colors.white} size={30} /></TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>

                                    <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 130, textAlign: 'center', }}>Job Completed - {taskDetails.taskName}</Text>
                                    {taskDetails.childId ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.placeHolderColor, fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', marginTop: 20 }}>{taskDetails.childId.firstName} {taskDetails.childId.lastName} has completed a task</Text> : null}
                                    {taskDetails.status != '1' ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.red, fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', marginTop: 20 }}>Note:This task's status has already been changed</Text> : null}

                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>

                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 60}
                                        borderRadius={30}
                                        marginTop={30}
                                        placeholder="Write something to them!"
                                        placeholderColor={colors.placeHolderColor}
                                        secureTextEntry={false}
                                        editable={true}
                                        value={description}
                                        onChangeText={(text) => setDescription(text)}
                                    ></InputBox>

                                </View>
                                
                                <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40 }}>

                                   
                                </View>



                                {taskDetails.status == '1' ? <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 94}
                                        borderRadius={30}
                                        marginTop={0}
                                       
                                        label="Send Rewards"
                                        labelColor={colors.white}
                                        onAction={() => onReward('reward')}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>
                                </View> : null}
                            </View>


                        </View>


                       
                    </View>

                    {taskDetails.status == '1' ? <View style={{ alignItems: 'center', bottom: -30, justifyContent: 'center', width: width }}>
                        <ButtonWithoutShadow
                            height={60}
                            backgroundColor={colors.red}
                            width={width - 94}
                            borderRadius={30}
                            marginTop={20}
                            marginBottom={100}
                            label="Reject Completion"
                            labelColor={colors.white}
                            onAction={() => onSave('reject')}
                            fontFamily={fonts.robotoRegular}
                            fontSize={19}
                        ></ButtonWithoutShadow>
                    </View> : <ButtonWithoutShadow
                        height={60}
                        backgroundColor={colors.warning}
                        width={width - 94}
                        borderRadius={30}
                        marginTop={30}
                        // marginBottom={100}
                        label="Close"
                        labelColor={colors.white}
                        onAction={() => props.navigation.goBack()}
                        fontFamily={fonts.robotoRegular}
                        fontSize={19}
                    ></ButtonWithoutShadow>}


                    {taskDetails.imageUrls && taskDetails.imageUrls.length > 0 ? <ImageView
                        images={imagesPriview}
                        imageIndex={0}
                        visible={imagesPriviewShow}
                        onRequestClose={() => setImagePreviewShow(false)}
                    /> : null}


                </View>
            </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(JobApprovalNotification)

var styles = StyleSheet.create({
    
   
    cardfirst: {
        
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
       
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
       

    },


});