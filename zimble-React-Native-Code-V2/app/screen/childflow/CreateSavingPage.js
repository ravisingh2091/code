// Child will be able to make monthly savings plans by providing following details:
// This Month Saving Plans: 
// 	•	Child will be able to enter weekly savings target amount 
// 	•	Child will be able to set the expenditure limit
// 	•	Save Changes 
// Note: Weekly savings target and the expenditure limit will be updated based on the data or amount entered by the user in the monthly allowance section (Weekly Savings)

// Child will be able to set a Wishlist item or a goal or target for which he wants to do the savings with the following details: 

// 	•	Name of the Wishlist item 
// 	•	Upload picture of the item
// 	•	Enter the amount needed to purchase it
// 	•	Add Plan
// Note: The plan will be added in the My goals, child’s goal will be created on the platform.



import React, { useState, useEffect } from 'react'
import { Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, FlatList, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments, faArrowLeft, faEllipsisV, faPaperclip,  faBell,  } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'
import InputBox from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';


import { API_BASE_URL, childUpdate, getChildList,getNotificationCount, getCards, getUserDetails, createSavingPlanForChild } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'


import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';


var { height, width } = Dimensions.get('window');



const createSavingPlan = (props) => {
    var sharedClass = new SharedClass();
   
    const [userDetails, setUsersDetails] = useState('')
 
 
    var [selectedCard, setSelectedCard] = useState('')

    const [wishName, setWishName] = useState('')
    const [wishAmount, setWishAmount] = useState('')
    const [s3Image, setS3Image] = useState('')

    const [weeklySpendLimit, setWeeklSpendLimit] = useState(0)
    const [weeklySavingTarget, setWeeklySavingTarget] = useState(0)
    const [sppiner, setLoader] = useState(false)
    const [notificationCount, setNotificationCount] = useState(0)


    const { setLoggedInUserAuthToken } = props;
  


    useEffect(() => {
      
        getUserDetailsFun()
        getNotificationCountUnread()
    }, [setLoggedInUserAuthToken])

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
    const chooseFile = () => {
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
                setS3Image(response.uri)
                response.name = response.uri.split('/').pop()
                let source = response;

                
                const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: source.uri,
                    name: source.name,
                    type: source.type,
                }
               
                const options = {
                    keyPrefix: "saving/",
                    bucket: "zimble-dev",
                    region: "ap-southeast-1",
                    accessKey: "AKIATSM77MSHWTDTE35A",
                    secretKey: "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",
                    successActionStatus: 201
                }

                RNS3.put(file, options).progress((e) => console.log(e.loaded / e.total))
                    .then(response => {
                        if (response.status !== 201)
                            throw new Error("Failed to upload image to S3");
                       
                        setS3Image(response.body.postResponse.location)
                       
                    });
              
            }
        });
    };


    const onCreate = async () => {

        let message = {}


        if (!wishName) {
            message.message = 'Please enter saving name'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        // if (!s3Image) {
        //     message.message = 'Please select saving Image'
        //     message.type = 'error'
        //     sharedClass.ShowSnakBar(message)
        //     return
        // }



        if (!wishAmount) {
            message.message = 'Please enter saving amount'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }


        let req = {
            wishlistName: wishName,
            amountNeeded: wishAmount,
            
        }


        if(s3Image){
            req.image= s3Image
        }
        
        try {
            setLoader(true)
            const result = await createSavingPlanForChild(req);
           
            setLoader(false)
            if (result && result.status == 'success') {
                message.message = 'Saving Plan created successfully'
                message.type = 'success'
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


    const onNextTwo = async (url, type) => {



        let req = {

            weeklySavingTarget: weeklySavingTarget ? parseInt(weeklySavingTarget) : 0,
            weeklySpendLimit: weeklySpendLimit ? parseInt(weeklySpendLimit) : 0,
            childId: userDetails._id

        }

       

        try {
            setLoader(true)
            const result = await childUpdate(req);
           
            setLoader(false)
          
            if (result && result.status == 'success') {

                

                setTimeout(() => {

                    let message = {}
                    message.message = "Profile updated successfully"
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
    const getCardDetails = async (loacalUser) => {


        try {
            setLoader(true)
            const result = await getCards();
           
            setLoader(false)
           
            if (result && result.status == 'success') {
               
                if (result.details.length > 0) {
                    var data = result.details.filter(it => it._id == loacalUser.personisalizedCardId ? loacalUser.personisalizedCardId : userDetails.personisalizedCardId)
                   
                    if (data.length) {


                        setSelectedCard(data[0])
                    }
                   

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
 

    const onButton = (page) => {
       
        if (!page) {
           
        } else if (page == 'ChildDashBoard' || page == 'TaskListChildPage' || page == 'ChatListPage') {

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

 

    const getUserDetailsFun = async () => {


        try {
            setLoader(true)
            const result = await getUserDetails();
            
            setLoader(false)
            // setEmail('')
            // setPassword('')
            if (result && result.status == 'success') {
                
                setWeeklSpendLimit(result.details.weeklySpendLimit ? result.details.weeklySpendLimit : 0)
                setWeeklySavingTarget(result.details.weeklySavingTarget ? result.details.weeklySavingTarget : 0)
                setUsersDetails(result.details)
                getCardDetails(result.details)

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
    // const handleScroll=(event:Object)=>{

    // }
    let type = DeviceInfo.hasNotch();

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ marginBottom: 0, paddingBottom: 0 }}
                    contentContainerStyle={styles.scrollview}
              
                >
                    <View style={styles.content}>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <NetConnectionScreen></NetConnectionScreen>
                        <View style={styles.container} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                <View style={{ width: 80, marginLeft: 20 }}>
                                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={20} />
                                        <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                </View>
                                <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                    <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                        <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                        {notificationCount>0?<View style={{position:'absolute', backgroundColor:colors.white, width:20,height:20,borderRadius:10, right:-5, top:-5, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={[styles.robotoLightText, { color: colors.titleText }]}>{notificationCount}</Text>
                                            </View>:null}
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={() => onButton('ChatListPage')} style={{ marginLeft: 0, alignItems: 'center', marginRight: 30 }}>
                                        <FontAwesomeIcon style={{}} icon={faComments} color={colors.white} size={25} />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View style={styles.backgroundView} >

                                <Image style={styles.image} source={{ uri: props.userDetails.coverPicture }} />
                            </View>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                style={[styles.backgroundView, {

                                   

                                    opacity: .3,

                                }]}>

                            </LinearGradient>
                            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 80, zIndex: 99 }}>
                                <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                </View>
                                <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                    <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{userDetails.firstName}</Text>
                                    <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{userDetails.email}</Text>
                                </View>

                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20 }}>
                            <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 20, color: colors.subTitleColor }]}>This months saving plans</Text>
                            
                        </View>
                        <View>
                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.gradientGreenTwo, paddingBottom: 20 }}>


                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 20, }}>
                                    <View style={[styles.iconBackgroud, { marginTop: 0, marginRight: 20, backgroundColor: colors.pink }]}>
                                        <Image source={localImages.piggy_bank_2_white} style={{ height: 50, width: 50, }} />

                                    </View>
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={-20}
                                        placeholder="Weekly Savings Target"
                                        label="Weekly Savings Target"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}

                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        keyboardType={'numeric'}
                                        editable={true}
                                        value={weeklySavingTarget.toString()}
                                        marginLeft={0}
                                        maxLength={400}
                                        onChangeText={(text) => { setWeeklySavingTarget(text) }}
                                    ></InputBox>
                                </View>

                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    <View style={[styles.iconBackgroud, { marginTop: 0, marginRight: 20, backgroundColor: colors.Purple }]}>
                                        <Image source={localImages.shield_lock_white} style={{ height: 40, width: 40, }} />

                                    </View>
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={-20}
                                        placeholder="Weekly Spending limit"
                                        label="Set expenditure limit"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}

                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        keyboardType={'numeric'}
                                        editable={true}
                                        value={weeklySpendLimit.toString()}
                                        marginLeft={0}
                                        maxLength={400}
                                        onChangeText={(text) => { setWeeklSpendLimit(text) }}
                                    ></InputBox>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    <View style={{ marginTop: 0, marginRight: 20, height: 70, width: 70, }}>
                                        {/* <Image source={localImages.earning} style={{ height: 70, width: 70, }} /> */}

                                    </View>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={0}
                                        label="Save Changes"
                                        labelColor={colors.white}
                                        onAction={() => { onNextTwo() }}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>
                                </View>
                            </View>


                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.gradientGreenTwo, paddingBottom: 20 }}>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                <View style={[styles.iconBackgroud,{marginTop:0,marginRight:20, backgroundColor:colors.Greenish}]}>
                                                <Image source={localImages.money_bag_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={-20}
                                        placeholder="Wishlist name"
                                        label="Wishlist item"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}

                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        // keyboardType={'numeric'}
                                        editable={true}
                                        value={wishName}
                                        marginLeft={0}
                                        maxLength={400}
                                        onChangeText={(text) => { setWishName(text) }}
                                    ></InputBox>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    <View style={{ marginTop: 0, marginRight: 20, height: 70, width: 70, }}>
                                        {/* <Image source={localImages.earning} style={{ height: 70, width: 70, }} /> */}

                                    </View>
                                    {s3Image ?
                                        <View style={[{ width: width - 140, marginTop: -20 }]}>

                                            <Image source={{ uri: s3Image }} style={{ width: width - 140, height: 150 }} />
                                        </View>
                                        : <View style={[{ width: width - 140, marginTop: -20 }]}>
                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10 }]}>Upload an image</Text>

                                            <TouchableOpacity onPress={() => chooseFile()} style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row' }]}>
                                                <FontAwesomeIcon style={{}} icon={faPaperclip} color={colors.placeHolderColor} size={25} />
                                                <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>Upload Image</Text>
                                            </TouchableOpacity>
                                        </View>}
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    <View style={{ marginTop: 0, marginRight: 20, height: 70, width: 70, }}>
                                        {/* <Image source={localImages.earning} style={{ height: 70, width: 70, }} /> */}

                                    </View>
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={-20}
                                        placeholder="Amount needed"
                                        label="How much does it cost?"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}

                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        keyboardType={'numeric'}
                                        editable={true}
                                        value={wishAmount}
                                        marginLeft={0}
                                        maxLength={400}
                                        onChangeText={(text) => { setWishAmount(text) }}
                                    ></InputBox>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    <View style={{ marginTop: 0, marginRight: 20, height: 70, width: 70, }}>
                                        {/* <Image source={localImages.earning} style={{ height: 70, width: 70, }} /> */}

                                    </View>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 140}
                                        borderRadius={30}
                                        marginTop={0}
                                        label="Add Plan"
                                        labelColor={colors.white}
                                        onAction={() => { onCreate() }}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>
                                </View>

                            </View>
                        </View>





                    </View>

                </ScrollView>
               
            </View>

        </SafeAreaView >
    )
}

const mapStateToProps = (state) => {
    return {
        loginStatus: state.localStates.loginStatus,
        userDetails: state.localStates.userDetails,
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
export default connect(mapStateToProps, mapDispatchToProps)(createSavingPlan)

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

    iconBackgroud: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: colors.iconBackgroud,
        justifyContent: 'center',
        alignItems: 'center'
    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },

    container: {
        
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', 
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
        
        position: 'absolute',
        bottom: 0, // show the bottom part of circle
        overflow: 'hidden', // hide not important part of image
    },
    image: {
        opacity: .6,
        height: 250, 
        width: width,
        position: 'absolute', 
        bottom: 0, 
        marginLeft: width * 1.5, 
    },
    containerCard: {
        //flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        height: (width - 60) * .63,
        marginTop: 20,
        marginBottom: 0
    },
    imageCard: {
        height: (width - 60) * .63,
        width: width - 60,
        // alignSelf: "center",
    },
    card: {
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        //justifyContent: 'center',
        //alignItems: 'center',
        borderRadius: 8

    },
    button: {

        paddingHorizontal: 15,
        
        alignItems: 'center'
    },

});