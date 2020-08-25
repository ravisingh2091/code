// Accounts Screen
// User will able to view following details on the screen:
// 	•	User Details: 
// 	•	Username 
// 	•	Email address of the user
// 	•	Manage Accounts 
// 	•	Admin Accounts: User will be able to view the admin account with following details: 
// 	•	Name of the Parent 
// 	•	Profile picture of the parent 
// 	•	Balance in the admin’s account 
// Note: After clicking on the admin’s account user will be redirected to the Admin’s Accounts Screen.

// 	•	Child Accounts: User will be able to view following child details:
// 	•	Name of the child 
// 	•	Profile picture of the child 
// 	•	Balance in the Child’s account 

// Note: After clicking on any of the child profile user will be redirected to the child profile’s screen.

// 	•	Deactivated Accounts: User will be able to view following deactivated child’s account details:
// 	•	Name of the child 
// 	•	Profile picture of the child 
// 	•	Balance in the Child’s account 

// Note: After clicking on any of the child profile user will be redirected to the Deactivated Child Profile Screen.

// Create New Account: user will be able to create any of the child’s account by clicking on create new account and user will be redirected to the Create New Account Screen for the same.


import React, { useState, useEffect } from 'react'
import { FlatList, ImageBackground, Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faShoppingCart, faAlignJustify, faBell, faPlus } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';


import { API_BASE_URL, getChildList, getUserDetails,getNotificationCount } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions, } from '@react-navigation/native';

import { Drawer } from 'native-base';
import DrawerLayoutParent from '../../components/DrawerLayoutParent'



var { height, width } = Dimensions.get('window');



const AccountPage = (props) => {
    var drawerParent
    const sharedClass = new SharedClass();
   

    const [childList, setChildList] = useState([])
    const [childListDeacti, setChildListDeacti] = useState([])
    const [userDetails, setUsersDetails] = useState('')

    const [notificationCount, setNotificationCount] = useState(0)
    const [sppiner, setLoader] = useState(false)
   

    const { setLoggedInUserAuthToken } = props;
 


    useEffect(() => {

    }, [setLoggedInUserAuthToken])

    const  closeDrawerParent = () => {
        drawerParent._root.close()
    }
    
    const  openDrawerParent = () => {
        drawerParent._root.open()
    }
    useFocusEffect(
        React.useCallback(() => {
            getAllChildList()
            getUserDetailsFun()
            getNotificationCountUnread()
        }, [])
    );

    const getNotificationCountUnread = async () => {
        try {

            const result = await getNotificationCount();

            
            if (result && result.status == 'success') {

                setNotificationCount(result.details.count)


            } else {

            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }


    const onButton = (page) => {

        if (!page) {
            alert('under development,')
        } else {
            props.navigation.navigate(page)
        }
    }


    const onSelectChild = (item) => {
        props.navigation.push('SingleChildStatisticPage', { childdetails: item })
    }


 

    const getAllChildList = async () => {


        try {
           
            const result = await getChildList();
            console.log(result)
          
            getUserDetailsFun()
            if (result && result.status == 'success') {
                setChildList(result.details.filter(it => it.status == '1' && it.temporaryCardStatus!='0'))
                setChildListDeacti(result.details.filter(it => it.status == '0' || it.temporaryCardStatus=='0'))

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

    const getUserDetailsFun = async () => {


        try {
            setLoader(true)
            const result = await getUserDetails();
            console.log(result)
            setLoader(false)
          
            if (result && result.status == 'success') {
                setUsersDetails(result.details)
                props.setLoggedInUserDetails(result.details)

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
   
    let type = DeviceInfo.hasNotch();
    console.log(type)
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <Drawer
                ref={(ref) => { drawerParent = ref }}
                content={<DrawerLayoutParent navigation={props.navigation} closeDrawerParent={closeDrawerParent} />}
                onClose={() => closeDrawerParent()} >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{  }}
                        contentContainerStyle={styles.scrollview}
                    
                    >
                        <View style={styles.content}>
                            <View style={styles.container} >
                                <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                    <View style={{ width: 80 }}>
                                        <TouchableOpacity onPress={() => openDrawerParent()} style={{ marginRight: 10, alignItems: 'center' }}>
                                            <FontAwesomeIcon style={{}} icon={faAlignJustify} color={colors.white} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: width - 160, alignItems: 'center', justifyContent: 'center' }}>

                                    </View>
                                    <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                        <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                            <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                            {notificationCount>0?<View style={{position:'absolute', backgroundColor:colors.white, width:20,height:20,borderRadius:10, right:-5, top:-5, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={[styles.robotoLightText, { color: colors.titleText }]}>{notificationCount}</Text>
                                            </View>:null}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.backgroundView} >

                                    <Image style={styles.image} source={{uri:userDetails.coverPicture}} />
                                </View>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                    style={[styles.backgroundView, {
                                        opacity: .3,

                                    }]}>

                                </LinearGradient>
                                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 60, zIndex: 99 }}>
                                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                    </View>
                                    <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{userDetails.familyName}</Text>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{userDetails.email}</Text>
                                    </View>

                                </View>
                            </View>


                            <View >

                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                    <Image source={localImages.bank_2} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 17, color:colors.Greenish }]}>Manage Accounts</Text>

                                </View>
                            </View>
                            <View >

                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>

                                    <Text style={[styles.robotoBoldText, { marginLeft: 0, fontSize: 17, color: colors.allowTitle }]}>Admin Accounts</Text>

                                </View>
                                <View style={[styles.cardfirst, { minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, flexDirection: 'row', justifyContent: 'center' }]}>

                                    <ImageBackground source={{uri:userDetails.coverPicture}} imageStyle={[{ borderRadius: 8, marginLeft: 0 }]} style={[{ height: 97, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8, }]}>


                                    </ImageBackground >

                                    <LinearGradient
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                            height: 97, width: width - 44,
                                            backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                        }}>

                                    </LinearGradient>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('TopUpFamilyBalPage',{userDetails: userDetails })} style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                        <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                        </View>
                                        <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 22, color: colors.white, marginRight: 40 }]}>{userDetails.familyName} </Text>
                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.white, marginRight: 40 }]}>Balance:  ${userDetails.totalWallet ? userDetails.totalWallet : '0.00'}</Text>
                                        </View>

                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 0, height: 50 }}>

                                    <Text style={[styles.robotoBoldText, { marginLeft: 0, fontSize: 17, color: colors.allowTitle }]}>Child Accounts</Text>

                                </View>
                                {childList.map(item => {
                                    return (
                                        <View >


                                            <TouchableOpacity onPress={() => onSelectChild(item)} style={[styles.cardfirst, { minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, justifyContent: 'center', marginRight: 0, flexDirection: 'row', marginBottom: 20 }]}>

                                                <ImageBackground source={{uri:item.coverPicture}} imageStyle={[{ borderRadius: 8, marginLeft: 0 }]} style={[{ height: 97, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8, }]}>


                                                </ImageBackground >

                                                <LinearGradient
                                                    start={{ x: 0, y: 1 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                                        height: 97, width: width - 44,
                                                        backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                                    }}>

                                                </LinearGradient>
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={{ uri: item.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                                    </View>
                                                    <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 22, color: colors.white, marginRight: 40 }]}>{item.firstName} {item.lastName} </Text>
                                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.white, marginRight: 40 }]}>Balance:  ${parseFloat(item.totalCardBalance ? item.totalCardBalance : 0)}</Text>
                                                    </View>

                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                                <View style={[styles.cardfirst, { minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 0, flexDirection: 'row', marginBottom: 10 }]}>

                                    <View  style={[{ height: 97, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8,backgroundColor:'#0b7899' }]}>


                                    </View >

                                    <LinearGradient
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                            height: 97, width: width - 44,
                                            backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                        }}>

                                    </LinearGradient>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('AddMoreChildPage')} style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40, justifyContent:'center' }}>
                                        <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center' }}>
                                            <FontAwesomeIcon style={{}} icon={faPlus} color={colors.white} size={35} />
                                        </View>
                                        <View style={{ marginHorizontal: 0,  }}>
                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 22, color: colors.white, marginRight: 40 }]}>Create new account</Text>

                                        </View>

                                    </TouchableOpacity>

                                </View>

                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 0, height: 50 }}>

                                    <Text style={[styles.robotoBoldText, { marginLeft: 0, fontSize: 17, color: colors.allowTitle }]}>Deactivated Accounts</Text>

                                </View>
                                {childListDeacti.length > 0 ?
                                    <View>
                                        {childListDeacti.map(item => {
                                            return (
                                                <View >


                                                    <TouchableOpacity onPress={() => onSelectChild(item)} style={[styles.cardfirst, { minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, flexDirection: 'row', marginBottom: 20, justifyContent:'center' }]}>

                                                        <ImageBackground source={{uri:item.coverPicture}} imageStyle={[{ borderRadius: 8, marginLeft: 0 }]} style={[{ height: 97, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8, }]}>


                                                        </ImageBackground >

                                                        <LinearGradient
                                                            start={{ x: 0, y: 1 }}
                                                            end={{ x: 1, y: 1 }}
                                                            colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                                                height: 97, width: width - 44,
                                                                backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                                            }}>

                                                        </LinearGradient>
                                                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                                            <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Image source={{ uri: item.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                                            </View>
                                                            <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                                                <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{item.firstName} {item.lastName} </Text>
                                                                <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.white, marginRight: 40 }]}>Balance:  ${parseFloat(item.totalCardBalance ? item.totalCardBalance : 0)}</Text>
                                                            </View>

                                                        </View>

                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}

                                    </View> :

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={localImages.debt_cut} style={{ height: 60, width: 60, marginTop: 20 }}></Image>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 16, color: colors.lightGray, marginRight: 40, textAlign: 'center', marginTop: 20, marginBottom: 10 }]}>Accounts that are deactivated will be displayed here</Text>
                                    </View>
                                }
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </Drawer>
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
export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
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
    container: {
       
        alignItems: 'center',
        width: width,
        overflow: 'hidden', // for hide the not important parts from circle
      
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
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