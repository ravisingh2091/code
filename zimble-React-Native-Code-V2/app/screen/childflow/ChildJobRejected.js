import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import {ButtonWithoutShadow} from '../../components/Button';

import DeviceInfo from 'react-native-device-info';



import {  updateTask,  getTaskDetails, acceptTask, readNotification } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useRoute } from '@react-navigation/native'
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import ImageView from "react-native-image-viewing";

var { height, width } = Dimensions.get('window');




const ChildJobRejected = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [taskIds, setTaskIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [taskDetails, setTaskDetails] = useState({})
    const [imagesPriview, setImagePreview] = useState([])
    const [imageUrls, setImageUrls] = useState([])
    const [imageChnageStatus,setImageChnageStatus]= useState(false)
    const [sppinerImage, setLoaderImage] = useState(false)
    const [imagesPriviewShow, setImagePreviewShow] = useState(false)
    const [sppiner, setLoader] = useState(false)

    const { setLoggedInUserAuthToken } = props;



    useEffect(() => {
        getAllTaskList(route.params.taskId)


    }, [setLoggedInUserAuthToken])
    const onSave = async (type) => {



        let message = {}
        let req = {
            imageUrls: imageUrls,
        }


        if (imageUrls.length == 0) {
            message.message = 'Please select Image'
            message.type = 'info'
            sharedClass.ShowSnakBar(message)
            return
        }


        req.status = '1'


        try {
            //  setLoader(true)
            const result = await updateTask(req, taskDetails._id);
           
            setLoader(false)

            if (result && result.status == 'success') {
                message.message = 'Task updated'
        message.type = 'success';
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
           
        }
    }

    const getAllTaskList = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
           
            setLoader(false)
          
            if (result && result.status == 'success') {
                if (result.details) {
                    setTaskDetails(result.details)
                   
                    setImageUrls(result.details.imageUrls)
                    var image = []
                    var video = []
                    var imagesP = []
                    if (result.details.imageUrls && result.details.imageUrls.length > 0) {
                        for (let index = 0; index < result.details.imageUrls.length; index++) {
                            image.push({ uri: result.details.imageUrls[index], key: index, loading: false })
                            imagesP.push({
                                uri: result.details.imageUrls[index]
                            })

                        }
                      
                    } else {
                       
                    }
                    setImagePreview(imagesP)
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
                //  setTaskDetails(result.details)
                props.navigation.goBack()

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
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
 {sppinerImage ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="small" color={colors.white} /></View> : null}
                                {imageUrls.length > 0 ? <TouchableOpacity onPress={()=>setImagePreviewShow(true)}><Image source={{ uri: imageUrls[0] }} style={{ width: 150, height: 150 ,borderRadius:90 }}></Image></TouchableOpacity> :<Image source={localImages.jobrequestbyother} style={{ width: 150, height: 150 * .80, }}></Image> }
                            </View>
                            <View style={{ alignItems: 'center' }}>

                                <Text style={{ marginTop: 0, color: '#0b7899', fontSize: 25, fontFamily: fonts.robotoRegular, marginTop: 110 }}>Job Request - {taskDetails.taskName}</Text>
                                {taskDetails.status != '0' ? <Text style={{ marginTop: 0, marginLeft: 10, color: colors.red, fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', marginTop: 20 }}>Note:This task status already changed</Text> : null}

                            </View>
                            {taskDetails.comment ? <View style={{ width: width - 120, marginVertical: 10, borderRadius: 10, backgroundColor: colors.inputBoxBackground }}>
                                <Text style={{ marginVertical: 10, marginHorizontal: 10, color: '#696969', fontSize: 15, fontFamily: fonts.robotoRegular, textAlign: 'center', }}>{taskDetails.comment}</Text>
                            </View> : null}
                            <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 40 }}>

                                <Text style={{ marginTop: 0, marginLeft: 10, color: colors.childblue, fontSize: 15, fontFamily: fonts.robotoRegular, marginBottom: 20 }}>Reward after completion : ${taskDetails.rewardAmount}</Text>
                            </View>



                            {taskDetails.status == '0' ? <View style={{ alignItems: 'center', position: 'absolute', bottom: -30, justifyContent: 'center', width: width }}>
                              {!imageChnageStatus?
                                    <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 94}
                                    borderRadius={30}
                                    marginTop={0}
                                    // marginBottom={100}
                                    label="Send another image"
                                    labelColor={colors.white}
                                    onAction={() => {}}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                                : <ButtonWithoutShadow
                                height={60}
                                backgroundColor={colors.childblue}
                                width={width - 94}
                                borderRadius={30}
                                marginTop={0}
                                // marginBottom={100}
                                label="Send For Approval"
                                labelColor={colors.white}
                                onAction={() => onSave()}
                                fontFamily={fonts.robotoRegular}
                                fontSize={19}
                            ></ButtonWithoutShadow>
                              }
                            </View> : null}
                        </View>


                    </View>


                    {/* </ScrollView> */}
                </View>

                <View style={{ alignItems: 'center', bottom: -30, justifyContent: 'center', width: width }}>
                    {taskDetails.status == '0' ? <ButtonWithoutShadow
                        height={60}
                        backgroundColor={'rgba(255, 255, 255, 0)'}
                        width={width - 94}
                        borderRadius={30}
                        marginTop={20}
                        // marginBottom={100}
                        label="Try again later"
                        labelColor={colors.placeHolderColor}
                        onAction={() => props.navigation.goBack()}
                        fontFamily={fonts.robotoRegular}
                        fontSize={19}
                    ></ButtonWithoutShadow> : <ButtonWithoutShadow
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
                </View>
                {/* <View style={[styles.tabBar, { borderTopStartRadius: 15, borderTopEndRadius: 15, height: 60, position: 'absolute', bottom: Platform.OS == 'ios' ? type ? 45 : 10 : 0, alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => onButton('CreateTaskPage')} style={{ width: width / 3, alignItems: 'center', }}>
                        <Image source={localImages.childchedule} style={{
                            width: 24, height: 24,
                        }} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onButton()} style={{ width: width / 3, alignItems: 'center', }}>
                        <Image source={localImages.childwallate} style={{
                            width: 24, height: 24,
                        }} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onButtonLog()} style={{ width: width / 3, alignItems: 'center', }}>
                        <Image source={localImages.childmore} style={{
                            width: 24, height: 24,
                        }} />

                    </TouchableOpacity>
                </View> */}



                <ImageView
                    images={imagesPriview}
                    imageIndex={0}
                    visible={imagesPriviewShow}
                    onRequestClose={() => setImagePreviewShow(false)}
                />

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
export default connect(mapStateToProps, mapDispatchToProps)(ChildJobRejected)

var styles = StyleSheet.create({
    linearGradient: {
        // flex: 1,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.orangeChild
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
    childwall: {
        width: width - 40,
        height: (width - 40) * .544
    },
    headingGray: {
        fontFamily: fonts.robotoRegular,
        fontSize: 15,
        /// marginTop: 5,
        color: colors.timeSelectedColor
    },
    headingGrayBottom: {
        fontFamily: fonts.robotoRegular,
        fontSize: 15,
        /// marginTop: 5,
        marginLeft: 10,
        color: colors.titleText
    },
    headingBold: {
        fontFamily: fonts.robotoMedium,
        fontSize: 53,
        marginTop: 13,
        color: colors.titleText
    },
    heading: {
        fontFamily: fonts.robotoMedium,
        fontSize: 20,
        marginTop: 33,
        color: colors.titleText
    },
    headingwhite: {
        fontFamily: fonts.robotoRegular,
        fontSize: 20,
        //  marginTop: 33,
        color: colors.white
    },
    headingTwo: {
        fontFamily: fonts.robotoRegular,
        fontSize: 20,
        color: colors.titleText,
        marginTop: 10

    },
    forgotPassword: {
        // position: 'absolute',
        // right: 48,
        color: colors.placeHolderColor
    },
    borderViewFirst: {
        width: (width - 122) / 3 + 6,
        height: 1,
        backgroundColor: colors.titleText
    },
    borderViewSecond: {
        width: (width - 122) / 3 - 12,
        alignItems: 'center'
        //borderWidth:1
    },

    socialImage: {
        height: (width - 70) * .52,
        width: width - 70,
        marginVertical: 12

    },
    calendar: {
        height: 30,
        width: 30,
        marginRight: 20
    },
    calendarOrange: {
        height: 30,
        width: 30,
        // marginRight: 20
    },
    socialText: {
        fontSize: 13,
        fontFamily: fonts.robotoRegular,
        color: colors.inputTextColor,
        marginTop: 17
    },
    cardFour: {
        minWidth: 80,
        minHeight: 50,
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
        backgroundColor: colors.inputBoxBackground,
        borderRadius: 15,
        marginHorizontal: 20
    },
    innerBox: {
        marginHorizontal: 10,
        width: width - 60, height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    leftBox: {

        height: 80, width: 80,
        borderTopStartRadius: 15,
        borderBottomLeftRadius: 15
    },
    rightBox: {

        height: 80,
        width: width - 140,
        borderTopEndRadius: 15,
        borderBottomEndRadius: 15
    }

});
