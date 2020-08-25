// User will be able to view the static content that will be uploaded from the backend by the admin.

// User will be able to view the blog link in case blog link is available. After clicking on the link user will be redirected on the same.


import React, { useState, useEffect } from 'react'
import {Linking, FlatList, TextInput, KeyboardAvoidingView, ImageBackground, Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments, faArrowLeft, faBell, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'

import DeviceInfo from 'react-native-device-info';




import { getEducationList, getChatHistory, API_BASE_URL_SOCKET } from '../../api';

import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions, } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native'
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
var { height, width } = Dimensions.get('window');


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const EducationDetailsPage = (props) => {
    var drawer
    var sharedClass = new SharedClass();
    const route = useRoute();

    const [messagesList, setMessagesList] = useState([])

    const { setLoggedInUserAuthToken } = props;
    ///const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'monetary', title: 'Completed' },
        { key: 'nonMonetary', title: 'Pending' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };


    const headerTitle = 'HEADER'

    const closeDrawer = () => {
        drawer._root.close()
    };

    const openDrawer = () => {
        drawer._root.open()
    };

    useEffect(() => {
        console.log(route.params && route.params.topic)
        setMessagesList(route.params.topic)
    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getPreviousChat()
        }, [])
    );


    const onLogin = () => {
        props.navigation.navigate('LoginPage')

    }

    const onReturn = () => {
        props.navigation.goBack()
    }

    const getPreviousChat = async () => {

        let reqData = {
            roomId: props.childchatreq.childId,
            page: 0
        }
        try {
            // setLoader(true)
            const result = await getEducationList();
            console.log(result)
            //setLoader(false)
            // setEmail('')
            // setPassword('')
            if (result && result.status == 'success') {

                // setMessagesList(result.details)

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }

    }
    // const handleScroll=(event:Object)=>{

    // }

    const onButton = (page) => {
        
        if (!page) {
           
        } else if (page == 'EducationPage' || page == 'ChildDashBoard' || page == 'TaskListChildPage' || page == 'ChatListPage') {

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
    let type = DeviceInfo.hasNotch();
    console.log(type)
    const mainExample = (number, title) => {
        // const { slider1ActiveSlide } = state;

        return (
            <View style={{marginHorizontal:20}}>
               
         

<View>
    <HTML onLinkPress={(evt, href) => { Linking.openURL(href)}} html={messagesList} imagesMaxWidth={Dimensions.get('window').width} />
    
    </View> 




            </View>
        );

        // {/* <WebView
        //                 originWhitelist={['*']}
        //                 source={{ html: data.description }}
        //             /> */}
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{}}
                    contentContainerStyle={styles.scrollview}
                
                >
                    <View style={styles.content}>
                        <View style={styles.container} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                <View style={{ width: 80, marginLeft: 20 }}>
                                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={20} />
                                        <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: width - 190, alignItems: 'center', justifyContent: 'center' }}>

                                </View>
                                <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                    <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                        <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onButton('ChatListPage')} style={{ marginLeft: 0, alignItems: 'center', marginRight: 30 }}>
                                        <FontAwesomeIcon style={{}} icon={faComments} color={colors.white} size={25} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                style={[styles.backgroundView, {



                                    opacity: 1,

                                }]}>

                            </LinearGradient>

                        </View>
                        <View style={{ bottom: 0 }}>
                            {mainExample()}

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
        loginuserDetails: state.localStates.userDetails,
        childchatreq: state.localStates.childchatreq,
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
export default connect(mapStateToProps, mapDispatchToProps)(EducationDetailsPage)

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
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    cardfirst: {
        // height: 189,
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

        // marginTop: -60

    },

    container: {
        
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden',
        height: 250,
    },
    backgroundView: { 
        borderRadius: width * 4, 
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
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

});


