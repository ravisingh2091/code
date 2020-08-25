// User will be able to view following options on the sidebar menu:
// 	•	Profile picture of the user
// 	•	Update picture: User will be able to update his profile picture either by uploading picture from the library or take a picture.
// 	•	Name of the user 
// 	•	Email id of the user
// 	•	Events: User will be redirected to the events Screen.
// 	•	Child’s Saving: User will be redirected to the Child’s Saving Screen.
// 	•	Refer: User will be redirected to the Refer Screen.
// 	•	Notifications: User will be able to turn notifications on/Off
// 	•	Logout


import React, { useState, useEffect } from 'react'
import { View, Alert, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
var { height, width } = Dimensions.get('window');
import { colors, fonts, localImages ,variable} from '../utils/constant'
import { connect } from 'react-redux';
import { actions } from "../reduxActionAndReducer/reducer";
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import Loder from '../utils/Loder'
import SharedClass from '../utils/SharedClass'
import NetConnectionScreen from '../utils/NetConnectionScreen'
import InputBox, { InputBoxmultiline, InputToggele } from './InputBox'
import {logOut, updateuser, getAnyUserDetails } from '../api';
const DrawerLayoutParent = (props) => {

    const sharedClass = new SharedClass();
    const [sppiner, setLoader] = useState(false)
    const [image, setImage] = useState('')
    const [imageType, setImageType] = useState('')
    const [notification, setNotification] = useState(false)
    useEffect(() => {
        console.log('props', props)
    }, [])


    const closeDrawer = async () => {
        props.closeDrawerParent()
    }
    const getUserDetailsFun = async () => {
        console.log(props.userDetails._id)
        let req = {
            userId: props.userDetails._id
        }

        console.log(req)

        try {

            const result = await getAnyUserDetails(req);

            if (result && result.status == 'success') {
                props.setLoggedInUserDetails(result.details)
                if(result.details){
                    setNotification(result.details.notification)
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
            console.log("ERROR IN OFFER FETCH API", error);
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
    }
    const chooseFile = (type) => {
        setImageType(type)

        console.log({ type })
        var options = {
            title: 'Select Image',
            quality: .5,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {


            if (response.didCancel) {

            } else if (response.error) {

            }
            else {

                response.data = undefined
                response.name = response.uri.split('/').pop()


                setImage(response.uri)




                let source = response;
                console.log(source)
                const file = {
                    uri: source.uri,
                    name: source.name,
                    type: source.type,
                    key: source.key,
                }
                console.log(file)


                const options = {
                    keyPrefix: type == 'profile' ? "user/profile/" : "user/cover/",
                    bucket: variable.bucket,
                    region:variable.region,
                    accessKey:variable.accessKey,
                    secretKey:variable.secretKey,
                    successActionStatus: 201
                }


                RNS3.put(file, options).progress((e) => console.log(e.loaded / e.total))
                    .then(response => {
                        console.log(response)

                        if (response.status !== 201)
                            throw new Error("Failed to upload image to S3");

                        onNextTwo(response.body.postResponse.location, type)


                    });

            }
        });
    };

    const onNextTwo = async (url, type) => {



        let req = {



        }
        if (type == 'profile') {
            req.profilePicture = url
        } else {
            req.coverPicture = url
        }


        try {
            setLoader(true)
            const result = await updateuser(req);

            setLoader(false)

            if (result && result.status == 'success') {
                setImage('')
                setImageType('')
                getUserDetailsFun()

                setTimeout(() => {
                    let message = {}
                    message.message = "Profile Picture updated successfully"
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

            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
        
    }


    const logOutApi = async () => {

        try {
          
            const result = await logOut();

        } catch (error) {
          
        }
        
    }
    const onToggaleNotification = async (text) => {



        let req = {

            notification:text
        }
       


        try {
            setLoader(true)
            const result = await updateuser(req);

            setLoader(false)

            if (result && result.status == 'success') {
                getUserDetailsFun()

                setTimeout(() => {
                    let message = {}
                    message.message = "Status updated successfully"
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

            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }
        
    }
    const goToPage = (page) => {





        if (page == 'logout') {
            Alert.alert(
                'Alert',
                'Do you want to Logout?',
                [

                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Yes', onPress: () => {
                            props.setLoggedInUserStatus(null)
                            props.setLoggedInUserType(null)
                            logOutApi()
                        }
                    },
                ],
                { cancelable: false },
            );

        } else {
            props.navigation.navigate(page)
        }





    }
    return (

        <View style={{ alignItems: 'center', backgroundColor: colors.white, height: height }}>
            <View style={styles.container} >
                {sppiner && <Loder data={sppiner}></Loder>}
                <NetConnectionScreen></NetConnectionScreen>
                <TouchableOpacity onPress={() => closeDrawer()} style={[styles.closeDrawer,{left:20, borderWidth:0}]}><Image source={localImages.close} style={{ height: 30, width: 30, }}></Image></TouchableOpacity>
                <TouchableOpacity onPress={() => chooseFile('cover')} style={styles.closeDrawer}><FontAwesomeIcon icon={faCamera} color={colors.titleText} size={25} /></TouchableOpacity>
                <View style={styles.backgroundView} >

                    <Image style={styles.image} source={{ uri: imageType == 'cover' && image ? image : props.userDetails.coverPicture }} />
                </View>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                    style={[styles.backgroundView, {



                        opacity: .3,

                    }]}>

                </LinearGradient>
                <View style={{ width: '100%', left: 10, flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 60, zIndex: 99 }}>
                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: imageType == 'profile' && image ? image : props.userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                        <TouchableOpacity onPress={() => chooseFile('profile')} style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', height: 40, width: 40, borderRadius: 20, borderColor: colors.titleText, borderWidth: 1 }}><FontAwesomeIcon icon={faCamera} color={colors.titleText} size={25} /></TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 0, maxWidth: 200 }}>
                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 16, color: colors.white, marginRight: 40 }]}>{props.userDetails.familyName}</Text>
                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 14, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{props.userDetails.email}</Text>
                    </View>

                </View>
            </View>




            <TouchableOpacity onPress={() => goToPage('CalendarEvents')} style={[styles.cardBox, { width: '90%', flexDirection: 'row', marginTop: 30, marginLeft: 0, height: 60 }]}>


                <Image source={localImages.event} style={{ height: 30, width: 30, marginLeft: 20 }} />

                <Text style={[styles.robotoBoldText, { color: colors.pink, marginLeft: 20 }]}>Events</Text>


            </TouchableOpacity>

            <TouchableOpacity onPress={() => goToPage('SavingListPage')} style={[styles.cardBox, { width: '90%', flexDirection: 'row', marginTop: 15, marginLeft: 0, height: 60 }]}>


                <Image source={localImages.savingNew} style={{ height: 30, width: 30, marginLeft: 20 }} />

                <Text style={[styles.robotoBoldText, { color: colors.Greenish, marginLeft: 20 }]}>Child's Saving</Text>


            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToPage('ReferralPage')} style={[styles.cardBox, { width: '90%', flexDirection: 'row', marginTop: 15, marginLeft: 0, height: 60 }]}>


                <Image source={localImages.refer} style={{ height: 30, width: 30, marginLeft: 20 }} />

                <Text style={[styles.robotoBoldText, { color: colors.Purple, marginLeft: 20 }]}>Refer</Text>


            </TouchableOpacity>
            <View  style={[styles.cardBox, { width: '90%', flexDirection: 'row', marginTop: 15, marginLeft: 0, height: 60 }]}>


                

                <Text style={[styles.robotoBoldText, { color: colors.Greenish, marginLeft: 20 }]}>Notification</Text>
                <View style={{marginLeft:10}}>
                    <InputToggele
                       titleText={colors.Greenish}
                        status={notification}
                        onChangeText={(text) => { onToggaleNotification(text) }}
                    />
                </View>


            </View>

            <TouchableOpacity onPress={() => goToPage('logout')} style={[styles.cardBox, { width: '90%', flexDirection: 'row', marginTop: 15, marginLeft: 0, height: 60 }]}>


                <Image source={localImages.logoutNew} style={{ height: 30, width: 30, marginLeft: 20 }} />

                <Text style={[styles.robotoBoldText, { color: colors.Blue, marginLeft: 20 }]}>Logout</Text>


            </TouchableOpacity>









        </View>
    )
}


const mapStateToProps = (state) => {
    console.log("check store data", state.localStates);
    return {
        loginStatus: state.localStates.loginStatus,
        userDetails: state.localStates.userDetails
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawerLayoutParent)


var styles = StyleSheet.create({

    cardBox: {

        backgroundColor: '#fff', borderRadius: 10, alignItems: 'center',
        shadowColor: 'rgb(11, 120, 153)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginLeft: 15
    },
     closeDrawer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 9999,
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: colors.titleText,
        borderWidth: 1
    },
    container: {

        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        overflow: 'hidden',

        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
        //marginLeft: -80, // reposition the circle inside parent view
        position: 'absolute',
        bottom: 0, // show the bottom part of circle
        overflow: 'hidden', // hide not important part of image
    },
    image: {
        opacity: .6,
        height: 250, // same width and height for the container
        width: width,
        position: 'absolute', // position it in circle
        bottom: 0, // position it in circle
        marginLeft: width * 1.5, // center it in main view same value as marginLeft for circle but positive
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
});