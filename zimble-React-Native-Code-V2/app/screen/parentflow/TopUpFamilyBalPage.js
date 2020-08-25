// User will be able to view following details: 
// 	•	User details: 
// 	•	Username 
// 	•	Email address of the user 
// 	•	User will be able to view following two options of the screen: 
// 	•	Subscription plan: User will be able to view the subscription plan available on monthly basis per child.

// Note: The subscription amount will be auto deducted from the saved card.

// 	•	Top-up: User will be able to view the following details: 
// 	•	Enter Top-up Amount or select a amount from the available options
// 	•	Enter name of the card holder 
// 	•	Enter card number 
// 	•	Enter Expiry date 
// 	•	Enter CVV Number 
// 	•	Save and top-up
// Or
// User will be able to view the saved card on the platform and able to select the card for the top-up.

import React, { useState, useEffect } from 'react'
import { ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faBriefcase, faChevronRight, faChevronLeft, faHeart, faBell, faTimes, faMobile, faBullhorn, faBars, faHome, faCheckSquare, faCoffee, faCheck, faPlus, faEye, faUnlock, faLock, faCaretRight, faCalendar, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'
import InputBox, { MaskedInputBox } from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';


import { getCardList, getAnyUserDetails, setUpPaymentMethode, initialTopUp } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'

import { CommonActions, useRoute, useFocusEffect } from '@react-navigation/native';

import SharedClass from '../../utils/SharedClass'
import Swiper from 'react-native-swiper';
var { height, width } = Dimensions.get('window');
const TopUpFamilyBalPage = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    const [subscriptionPlan, setSubscriptionPlan] = useState('0')
    const [userDetails, setUsersDetails] = useState('')
    const [sppiner, setLoader] = useState(false)
    const [topupamount, setTopupamount] = useState(null);
    const [selectedCard, setSelectedCard] = useState('')
    const [cardList, setCardList] = useState([])
    const [subPlan, setSubPlan] = useState([])
    const [nameOnCard, setNameOnCard] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expriyDate, setExpriyDate] = useState('')
    const [cvvNubmer, setCvvNubmer] = useState('')


    const { setLoggedInUserAuthToken } = props;

    const [index, setIndex] = React.useState(1);



    useEffect(() => {
        setUsersDetails(route.params && route.params.userDetails ? route.params.userDetails : {})
        getAllCardList()
        // getSubscriptionData()
        //  getAllChildList()

        getUserDetailsFun(route.params.userDetails._id)
    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getUserDetailsFun(route.params.userDetails._id)
            //getAllTaskList()
        }, [])
    );


    const onButton = (page) => {

        if (!page) {
            alert('under development,')
        }
        else if (page == 'ParentsMenuPage') {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: page },
                    ],
                })
            );

        }
        else {
            props.navigation.navigate(page)
        }
    }

    const getSubscriptionData = async () => {
        try {
            // setLoader(true)
            const result = await getSubscription();

            if (result && result.status == 'success') {
                setSubPlan(result.details.data)


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {


        }

    }
    const getUserDetailsFun = async (id) => {
        console.log(userDetails)
        let req = {
            userId: id ? id : userDetails._id
        }

        console.log(req)

        try {
            setLoader(true)
            const result = await getAnyUserDetails(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                setUsersDetails(result.details)
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
    const getAllCardList = async () => {

        try {
            const result = await getCardList();
            console.log(result)

            if (result && result.status == 'success') {
                setCardList(result.details)
                if (result.details.length > 0) {
                    setSelectedCard(result.details[0])

                }

            } else {
                let message = {}
                message.message = result.message
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }


    let type = DeviceInfo.hasNotch();
    console.log(type)


    const fixCardNumber = (text) => {
        console.log(text)
        if (text.length >= 19) {
            text = text.substring(0, 19)
        }

        setCardNumber(text)
    }

    const fixExpiryText = (text) => {
        if (text.length == 2 && (expriyDate == 1 || expriyDate.substring(0.0) == 0)) {
            text += '/'
        } else if (text.length == 2 && expriyDate.length == 3) {
            text = text.substring(0, text.length - 1)
        } else if (text.length >= 4) {
            text = text.substring(0, 5)
        }
        setExpriyDate(text)
    }

    const fixCVVText = (text) => {

        if (text.length >= 3) {
            text = text.substring(0, 3)
        }
        setCvvNubmer(text)
    }
    const saveCredidCard = async () => {
        console.log(expriyDate)

        let message = {}

        if (!topupamount) {
            message.message = 'Please enter amount'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (parseFloat(topupamount) > 1000) {
            message.message = "Enter amount can't grater then $1000 "
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!nameOnCard) {
            message.message = 'Please enter name on card'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!cardNumber) {
            message.message = 'Please enter card number'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!expriyDate) {
            message.message = 'Please enter expire date'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!cvvNubmer) {
            message.message = 'Please enter cvv number'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }




        let req = {

            cardHolderName: nameOnCard,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expDate: expriyDate,
            expMonth: Number.parseInt(expriyDate.split('/')[0]),
            expYear: Number.parseInt(expriyDate.split('/')[1]),
            cvv: cvvNubmer,
            name: nameOnCard,
            cardStatus: 'new'
        }
        try {
            setLoader(true)
            const result = await setUpPaymentMethode(req);
            console.log(result)

            setLoader(false)
            if (result && result.status == 'success') {
                let message = {}
                debugger
                onTopUpAccount(result.details._id)
                getAllCardList()


            } else {
                let message = {}
                message.message = result.message
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    const onTopUpAccount = async (id) => {
        let req = {
            amount: parseInt(topupamount),
            description: 'family balance topup',
            cardId: id
        }
        let message = {}
        if (!topupamount) {
            message.message = 'Please enter amount'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (parseFloat(topupamount) > 1000) {
            message.message = "Enter amount can't grater then $1000 "
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        try {
            setLoader(true)
            const result = await initialTopUp(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {

                message.message = 'Topup done successfully !'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                setTopupamount('')
                setNameOnCard('')
                setCardNumber('')
                setExpriyDate('')
                setCvvNubmer('')


            } else {
                let message = {}
                message.message = result.message
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }




    const FirstRoute = () => {
        return (
            <View style={[styles.scene,]} >


                <View style={[{ width: width, alignItems: 'center' }]}>
                    <TouchableOpacity style={[styles.cardBox, { marginLeft: 10, backgroundColor: subscriptionPlan == '2' ? colors.titleText : colors.white }]}>
                        <View style={{ minHeight: 120, marginVertical: 30, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                            <View style={{ width: 120, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesomeIcon style={{}} icon={faBriefcase} color={subscriptionPlan == '2' ? colors.white : colors.blubutton} size={50} />
                            </View>
                            <View style={{ width: width - 180, justifyContent: 'center', }}>
                                <Text style={[styles.title, { fontSize: 25, color: subscriptionPlan == '2' ? colors.white : colors.titleText }]}>{userDetails.planData && userDetails.planData.title ? userDetails.planData.title : ''}</Text>
                                <Text style={[styles.title, { fontSize: 18, color: subscriptionPlan == '2' ? colors.white : colors.titleText }]}>{userDetails.planData && userDetails.planData.subTitle ? userDetails.planData.subTitle : ''}</Text>
                                {
                                    userDetails.planData && userDetails.planData.benefits.map(it => {
                                        return (
                                            <Text style={[styles.title, { fontSize: 17, color: subscriptionPlan == '2' ? colors.white : colors.placeHolderColor }]}>{it} </Text>
                                        )
                                    })
                                }
                            </View>
                        </View>

                    </TouchableOpacity>
                    <ButtonWithoutShadow
                            height={60}
                            backgroundColor={colors.childblue}
                            width={width - 60}
                            borderRadius={30}
                            marginTop={20}
                            label="Change"
                            labelColor={colors.white}
                            onAction={() => {props.navigation.navigate('SubscriptionPlan',{planData:userDetails.planData}) }}
                            fontFamily={fonts.robotoRegular}
                            fontSize={19}
                        ></ButtonWithoutShadow>



                </View>

            </View>
        )
    }



    const SecondRoute = () => {
        return (
            <View style={[styles.scene,]} >
                <View style={{ alignItems: 'center' }}>
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Enter Amount"
                        label="Topup Amount"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}
                        keyboardType={'numeric'}
                        editable={true}
                        value={topupamount}
                        maxLength={400}
                        onChangeText={(text) => setTopupamount(text)}
                    ></InputBox>
                    <View>
                        <Text style={[styles.robotoBoldText, { marginTop: 10 }]}>OR Select From Below</Text>

                    </View>
                    <View style={{ width: width - 40, marginLeft: 20, flexDirection: 'row', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => setTopupamount('100')} style={[styles.cardBox, { height: 50, width: 70 }]}>
                            <Text style={styles.robotoRegularText}>$100</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTopupamount('500')} style={[styles.cardBox, { height: 50, width: 70 }]}>
                            <Text style={styles.robotoRegularText}>$500</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTopupamount('750')} style={[styles.cardBox, { height: 50, width: 70 }]}>
                            <Text style={styles.robotoRegularText}>$750</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTopupamount('1000')} style={[styles.cardBox, { height: 50, width: 70 }]}>
                            <Text style={styles.robotoRegularText}>$1000</Text>
                        </TouchableOpacity>

                    </View>
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Name of the card holder"
                        label="Card holder's name"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}
                        editable={true}
                        value={nameOnCard}
                        maxLength={400}
                        onChangeText={(text) => setNameOnCard(text)}
                    ></InputBox>

                    <MaskedInputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Card number"
                        label="Card number"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}
                        editable={true}
                        value={cardNumber}
                        maxLength={400}
                        onChangeText={(text) => fixCardNumber(text)}
                    ></MaskedInputBox>

                    <View
                        style={{ flexDirection: 'row' }}
                    >

                        <InputBox
                            height={60}
                            backgroundColor={colors.inputBoxBackground}
                            width={(width - 60) / 2}
                            borderRadius={30}
                            marginTop={15}
                            placeholder="Expiry Date"
                            label="Expiry Date"
                            labelColor={colors.labelColor}
                            placeholderColor={colors.placeHolderColor}

                            inputTextColor={colors.inputTextColor}
                            secureTextEntry={false}
                            editable={true}
                            value={expriyDate}
                            maxLength={400}
                            onChangeText={(text) => fixExpiryText(text)}
                        ></InputBox>
                        <View style={{ width: 20 }}></View>
                        <InputBox
                            height={60}
                            backgroundColor={colors.inputBoxBackground}
                            width={(width - 60) / 2}
                            borderRadius={30}
                            marginTop={15}
                            placeholder="CVV"
                            label="CVV Number"
                            labelColor={colors.labelColor}
                            placeholderColor={colors.placeHolderColor}

                            inputTextColor={colors.inputTextColor}
                            secureTextEntry={false}
                            editable={true}
                            value={cvvNubmer}
                            maxLength={400}
                            onChangeText={(text) => fixCVVText(text)}
                        ></InputBox>

                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <ButtonWithoutShadow
                            height={60}
                            backgroundColor={colors.childblue}
                            width={width - 60}
                            borderRadius={30}
                            marginTop={20}
                            label="Save and Top Up"
                            labelColor={colors.white}
                            onAction={() => { saveCredidCard() }}
                            fontFamily={fonts.robotoRegular}
                            fontSize={19}
                        ></ButtonWithoutShadow>
                    </View>
                </View>


                {cardList.length > 0 ? <View style={{ marginTop: 10, backgroundColor: colors.blueLightColor, marginBottom: 20 }}>
                    <View style={[{ width: width, }]}>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: width - 40, marginLeft: 20 }}>
                            <Image source={localImages.credit_card_protection} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19 }]}>Card details </Text>


                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.heading}>Or use Select a card to use</Text>
                            {cardList.length > 0 ? <View style={styles.containerCard}>
                                <Swiper
                                    index={0}
                                    showsButtons
                                    buttonWrapperStyle={{ backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 30, right: 20, flex: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: width - 60, color: colors.white }}
                                    onIndexChanged={(index) => {
                                        console.log(index)
                                        //const value = cardList[index]._id;
                                        setSelectedCard(cardList[index])

                                    }}
                                    style={{}}
                                    showsPagination={false}
                                    nextButton={<FontAwesomeIcon style={{}} icon={faChevronRight} color={colors.white} size={30} />}
                                    prevButton={<FontAwesomeIcon style={{}} icon={faChevronLeft} color={colors.white} size={30} />}
                                    loop={false}
                                >

                                    {cardList.map((item, key) => {


                                        return (

                                            <View style={{ alignItems: 'center' }}>
                                                <LinearGradient colors={['#f7a072', '#FBD48E', '#fede4a']} style={styles.imageCard}>

                                                </LinearGradient>
                                                {selectedCard ? <View style={{ position: 'absolute', left: 80, bottom: 40 }}>
                                                    <Text style={{ fontFamily: fonts.robotoMedium, fontSize: 25, color: colors.white, marginVertical: 10 }}>xxxx xxxx xxxx {selectedCard.cardNumber}</Text  >

                                                    <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.white, marginVertical: 5 }}>{selectedCard.cardHolderName} </Text  >
                                                    <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.white, marginVertical: 10 }}>{selectedCard.expDate} </Text  >

                                                </View> : null}
                                            </View>

                                        )
                                    })}



                                </Swiper>
                            </View> : null}
                            <ButtonWithoutShadow
                                height={60}
                                backgroundColor={colors.buttonBlack}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={20}
                                label="Select This Card"
                                labelColor={colors.white}
                                onAction={() => { onTopUpAccount(selectedCard._id) }}
                                fontFamily={fonts.robotoRegular}
                                fontSize={15}
                            ></ButtonWithoutShadow>
                        </View>



                    </View>
                </View> : null}
            </View>
        );
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
                        <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={styles.container} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                <View style={{ width: 80, marginLeft: 20, }}>
                                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={25} />
                                        <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 19 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                </View>
                                <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                    <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                        <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.backgroundView} >

                                <Image style={styles.image} source={{ uri: userDetails.coverPicture }} />
                            </View>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                style={[styles.backgroundView, {

                                    opacity: .3,

                                }]}>

                            </LinearGradient>

                        </View>
                        {userDetails ?

                            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 60, zIndex: 99 }}>
                                <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                </View>
                                <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                    <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{userDetails.familyName}</Text>
                                    <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{userDetails.email}</Text>
                                </View>

                            </View> : null}

                        <View style={[{ width: width - 40, marginLeft: 20, marginTop: 10 }]}>


                        </View>

                        <View style={[styles.tabBarView, { marginVertical: 10 }]}>



                            <TouchableOpacity
                                style={[index == 0 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20 }]}
                                onPress={() => setIndex(0)}>
                                <Text style={[index == 0 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Subscription Plan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[index == 1 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20 }]}
                                onPress={() => setIndex(1)}>
                                <Text style={[index == 1 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Topup</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            index == 0 ? FirstRoute() : SecondRoute()

                        }
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
        loginuserData: state.localStates.userDetails,
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



export default connect(mapStateToProps, mapDispatchToProps)(TopUpFamilyBalPage)

var styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,

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
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },

    robotoBoldTextActive: {
        fontFamily: fonts.robotoBold,
        color: colors.white,
        fontSize: 19
    },
    robotoBoldTextInActive: {
        fontFamily: fonts.robotoBold,
        color: colors.tabGray,
        fontSize: 19
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
    ImageBackground: {
        width: width - 40,
        height: 100
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
    backgroundViewGrad: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
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
    containerCard: {
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
        borderRadius: 12,
    },
    tabBarView: {
        flexDirection: 'row',
    },
    tabItemViewActive: {

        backgroundColor: colors.childblue,
        alignItems: 'center',
        width: (width - 60) / 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    tabItemViewInActive: {

        backgroundColor: colors.white,
        alignItems: 'center',
        width: (width - 60) / 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    tabItemView: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    cardBox: {
        width: (width - 60), backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
        shadowColor: 'rgb(11, 120, 153)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10
    }

});