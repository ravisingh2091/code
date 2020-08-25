// Child’s profile Screen
// User will be able to view following details on the child profile: 
// 	•	Name of the user 
// 	•	Profile picture of the user 
// 	•	Balance available in the account 
// 	•	Number of completed tasks 
// 	•	Spend amount 

// User will be able to view following two options on the screen:
// 	•	Earnings: User will be able to view following details in the earnings sections: 
// 	•	Total Earnings (Amount in dollars)
// 	•	Earning graph based on following factors:
// 	•	Task 
// 	•	Transfer 
// 	•	Allowance 

// 	•	Top-up: User will be able to Top-up into the child account by providing following details: 
// 	•	Top-up Amount 
// 	•	Comments (Optional)
// 	•	Confirm & Send 

// Note: After clicking on confirm and send the amount will be transferred into the child account and it will be deducted from the parent or admin’s wallet.

// Card Details: User will be able to view the card (Graphical view of the card) of the child on the screen of the child with complete details as follows: 
// 	•	Logo of the Zimble 
// 	•	Logo of the matchmove
// 	•	Card Number of the child
// 	•	Name of the user
// Deactivate Card: User will be able to deactivate the card by clicking on deactivate card.

// Note: User will be able to deactivate the card and child will not be able to use his card or his card will be temporarily blocked until parent will not activate it again.

// Child profile will be starts appearing in the deactivated account from the child accounts.

// Settings (Icon on the top right): User will be able to view the pop up on the screen where he will be able to view the following options: 
// 	•	Lock Account 
// 	•	Remove Account

// Note: User will be able to lock the account of the child and child will not be able to login into his account.

// By clicking on remove account user will be able to delete the child account from the platform.

// Deactivated Child Profile Screen	
// User will be able to view following details on the child profile: 
// 	•	Name of the user 
// 	•	Profile picture of the user 
// 	•	Balance available in the account 
// 	•	Number of completed tasks 
// 	•	Spend amount 

// User will be able to view following two options on the screen:
// 	•	Earnings: User will be able to view following details in the earnings sections: 
// 	•	Total Earnings (Amount in dollars)
// 	•	Earning graph based on following factors:
// 	•	Task 
// 	•	Transfer 
// 	•	Allowance 

// 	•	Top-up: User will be able to Top-up into the child account by providing following details: 
// 	•	Top-up Amount 
// 	•	Comments (Optional)
// 	•	Confirm & Send 

// Card Details: User will be able to view the card (Graphical view of the card)of the child on the screen of the child with complete details as follows: 
// 	•	Logo of the Zimble 
// 	•	Logo of the matchmove
// 	•	Card Number of the child
// 	•	Name of the user

// Activate Card: User will be redirected to the Activate card Screen.

// Note: User will be able to activate the card and child profile will be starts appearing in the child account from the deactivated accounts.


// Settings (Icon on the top right): User will be able to view the pop up on the screen where he will be able to view the following options: 
// 	•	Lock Account 
// 	•	Remove Account

// Note: User will be able to lock the account of the child and child will not be able to login into his account.

// By clicking on remove account user will be able to delete the child account from the platform.



import React, { useState, useEffect } from 'react'
import { Animated, Alert, FlatList, TextInput, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faShoppingCart, faEllipsisV, faAlignJustify, faChevronRight, faChevronLeft, faHeart, faBell, faTimes, faMobile, faBullhorn, faBars, faHome, faCheckSquare, faCoffee, faCheck, faPlus, faEye, faUnlock, faLock, faCaretRight, faCalendar, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton } from '../../components/Button'
import InputBox, { InputBoxTab } from '../../components/InputBox'

import DeviceInfo from 'react-native-device-info';


import { API_BASE_URL, deleteByParent, deleteAccountByParent, childUpdate, getChildList, getCards, getTransactionHistory, getAnyUserDetails, getUserDetails, reactiveCard, lockCard, parentRecation, childCardTopup, getChildEarningPrent } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import { CommonActions, useRoute, useFocusEffect } from '@react-navigation/native';
import SharedClass from '../../utils/SharedClass'
import {
    StackedBarChart,
    BarChart
} from "react-native-chart-kit";

import Modal, {
    ModalContent,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-modals';
import moment from "moment";

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var { height, width } = Dimensions.get('window');
const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43, 2, 2, 2, 2, 2, 2, 2]
        }
    ]
};
const chartConfig = {
    backgroundGradientFrom: colors.white,
    // backgroundGradientFromOpacity: 1,
    backgroundGradientTo: colors.white,
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(29, 193, 230, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
};

const SingleChildStatisticPage = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    var [userLimitValue, setUserLimitValue] = useState(200)
    const [comment, setComment] = useState('')
    const [showEditModal, setShowEditModal] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showLockModal, setShowLockModal] = useState(false)
    const [showUnLockModal, setShowUnLockModal] = useState(false)
    const [showModaTransaEnable, setShowModaTranEnable] = useState(false)
    const [showModaTransaDisable, setShowModaTranDisable] = useState(false)

    const [showModalRemove, setShowModalRemove] = useState(false)
    const [showModalNewCard, setShowModalNewCard] = useState(false)
    const [childdetails, setChilddetails] = useState('')
    const [sppiner, setLoader] = useState(false)
    const [topupamount, setTopupamount] = useState(null);
    var [selectedCard, setSelectedCard] = useState('')
    var [cardList, setCardList] = useState([])
    const [earningToday, setEarningToday] = useState([])
    const [totalEarning, setTotalEarning] = useState(0)
    const [childEarningData, setChildEarningData] = useState()
    const [barLabel, setBarLabel] = useState([])
    const [legend, Setegend] = useState(["Task", "Transfer", "Allowance"])
    const [barColor, setBarColor] = useState(["#8DFD45", "#546CD4", "#2DC1E4"])
    const [saveChartData, setSaveChartData] = useState()
    const [showChart, setShowChart] = useState(false)
    const [taskDataSet, setTaskDataSet] = useState('')
    const [AllowanceDataSet, setAllowanceDataSet] = useState('')
    const [transaferDataSet, setTransaferDataSet] = useState('')
    const [showBar, setShowBar] = useState(0)

    const [index, setIndex] = React.useState(1);

    const { setLoggedInUserAuthToken } = props;



    useEffect(() => {

        setChilddetails(route.params.childdetails)
        getCardDetails()



    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getUserDetailsFun(route.params.childdetails._id)
            //getAllTaskList()
        }, [])
    );

    const getAllChildTransction = async (id) => {


        try {

            const result = await getChildEarningPrent(id);
            console.log(result)
            setLoader(false)

            if (result && result.status == 'success') {

                var list = []
                setChildEarningData(result.details)

                let data = []
                let total = 0
                let txtData = result.details.txtData ? result.details.txtData : []
                console.log('moment', monthNames[moment().month()])
                let localLabel = []

                let currentMonth1 = 0
                let currentMonth2 = 0
                let currentMonth3 = 0

                let PreviouMonth1 = 0
                let PreviouMonth2 = 0
                let PreviouMonth3 = 0

                let TwoPreviousMonth1 = 0
                let TwoPreviousMonth2 = 0
                let TwoPreviousMonth3 = 0

                if (moment().month() == 0) {
                    setBarLabel([monthNames[0], monthNames[11], monthNames[10]])
                    localLabel = [monthNames[0], monthNames[11], monthNames[10]]
                } else {
                    localLabel = [monthNames[moment().month()], monthNames[moment().month() - 1], monthNames[moment().month() - 2]]
                    setBarLabel([monthNames[moment().month()], monthNames[moment().month() - 1], monthNames[moment().month() - 2]])
                }

                let lastPreviousMonth = moment().subtract(1, 'month');
                let twoPreviousMonth = moment().subtract(2, 'month');

                for (let index = 0; index < txtData.length; index++) {
                    console.log(txtData[index].type)
                    let date = moment(txtData[index].updatedAt)
                    if (txtData[index].type != '11') {

                        if (date.isSame(moment(), 'date')) {
                            data.push(txtData[index])
                        }
                        total = total + parseFloat(txtData[index].amount)
                    }

                    if (date.isSame(moment(), 'month')) {
                        if (txtData[index].type == '1') {
                            currentMonth1 = currentMonth1 + parseFloat(txtData[index].amount)
                        } else if (txtData[index].type == '2') {
                            currentMonth2 = currentMonth2 + parseFloat(txtData[index].amount)
                        } else {
                            currentMonth3 = currentMonth3 + parseFloat(txtData[index].amount)
                        }

                    }

                    if (date.isSame(lastPreviousMonth, 'month')) {

                        if (txtData[index].type == '1') {
                            PreviouMonth1 = PreviouMonth1 + parseFloat(txtData[index].amount)
                        } else if (txtData[index].type == '2') {
                            PreviouMonth2 = PreviouMonth2 + parseFloat(txtData[index].amount)
                        } else {
                            PreviouMonth3 = PreviouMonth3 + parseFloat(txtData[index].amount)
                        }
                    }

                    if (date.isSame(twoPreviousMonth, 'month')) {

                        if (txtData[index].type == '1') {
                            TwoPreviousMonth1 = TwoPreviousMonth1 + parseFloat(txtData[index].amount)
                        } else if (txtData[index].type == '2') {
                            TwoPreviousMonth2 = TwoPreviousMonth2 + parseFloat(txtData[index].amount)
                        } else {
                            TwoPreviousMonth3 = TwoPreviousMonth3 + parseFloat(txtData[index].amount)
                        }
                    }



                }


                if (currentMonth1 > 0 || currentMonth2 > 0 || currentMonth3 > 0 || PreviouMonth1 > 0 || PreviouMonth2 > 0 || PreviouMonth3 > 0 || TwoPreviousMonth1 > 0 || TwoPreviousMonth2 > 0 || TwoPreviousMonth3 > 0) {

                    setShowChart(true)
                }

                let object1 = {
                    labels: localLabel,
                    datasets: [
                        {
                            data: [currentMonth1 ? currentMonth1 : 0, PreviouMonth1 ? PreviouMonth1 : 0, TwoPreviousMonth1 ? TwoPreviousMonth1 : 0]
                        }
                    ]
                }
                let object2 = {
                    labels: localLabel,
                    datasets: [
                        {
                            data: [currentMonth2 ? currentMonth2 : 0, PreviouMonth2 ? PreviouMonth2 : 0, TwoPreviousMonth3 ? TwoPreviousMonth3 : 0]
                        }
                    ]
                }
                let object3 = {
                    labels: localLabel,
                    datasets: [
                        {
                            data: [currentMonth3 ? currentMonth3 : 0, PreviouMonth3 ? PreviouMonth3 : 0, TwoPreviousMonth3 ? TwoPreviousMonth3 : 0]
                        }
                    ]
                }
                let object = {
                    labels: localLabel,
                    legend: legend,
                    data: [[currentMonth1, currentMonth2, currentMonth3], [PreviouMonth1, PreviouMonth2, PreviouMonth3], [TwoPreviousMonth1, TwoPreviousMonth2, TwoPreviousMonth3]],
                    barColors: barColor
                }
                console.log(object)

                setTaskDataSet(object1)
                setTransaferDataSet(object2)
                setAllowanceDataSet(object3)

                setSaveChartData(object)
                setTotalEarning(total)
                setEarningToday(data)

            } else {
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }


    const onLock = async () => {
        setShowLockModal(true)

    }

    const onRemove = () => {
        setShowModalRemove(true)

    }

    const onNewCard = () => {
        setShowModalNewCard(true)

    }

    const onUnLock = async () => {

        setShowUnLockModal(true)

    }

    const onUnlockAccount = async () => {
        setShowUnLockModal(false)
        setShowModal(false)
        if (childdetails.cardActiveStatus == '0' || childdetails.temporaryCardStatus == '1') {
            onLimitUpdate('unlock')
            return
        }
        let req = {
            childId: childdetails._id
        }
        try {
            setLoader(true)
            const result = await reactiveCard(req);
            console.log(result)
            setLoader(false)

            if (result && result.status == 'success') {



                setTimeout(() => {
                    let message = {}
                    message.message = 'Account unlocked successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                }, 1000)

                onLimitUpdate('unlock')
            } else {


                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 1000)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }

    const onLockAccount = async () => {
        setShowLockModal(false)
        setShowModal(false)
        if (childdetails.cardActiveStatus == '0' || childdetails.temporaryCardStatus == '0') {
            onLimitUpdate('lock')
            return
        }
        let req = {
            childId: childdetails._id
        }
        try {
            setLoader(true)
            const result = await lockCard(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {



                setTimeout(() => {
                    let message = {}
                    message.message = 'Account locked successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                }, 1000)

                onLimitUpdate('lock')
            } else {


                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 1000)


            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }

    const onRemoveAccount = async (type) => {
        setShowEditModal(false)
        setShowModal(false)
        try {
            setLoader(true)
            const result = await deleteAccountByParent(childdetails._id);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                let message = {}

                if (childdetails.cardActiveStatus == '1' && childdetails.temporaryCardStatus == '!') {
                    onRemoveAccountSecond()
                } else {
                    let message = {}
                    message.message = 'Child account removed successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
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

    const onRemoveAccountSecond = async () => {
        try {
            setLoader(true)
            const result = await deleteByParent(childdetails._id);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                let message = {}
                message.message = 'Child account removed successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()
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

    const onAddNewCard = async (type) => {
        setShowEditModal(false)
        setShowModal(false)



        try {
            setLoader(true)
            const result = await deleteByParent(childdetails._id);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                let message = {}
                message.message = 'Child Card details removed successfully'
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
                props.navigation.navigate('RequestNewCardPage', { childdetails: childdetails })
                getUserDetailsFun(childdetails._id)
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

    const onLimitUpdate = async (type) => {

        setShowEditModal(false)
        setShowModal(false)
        let req = {
            childId: childdetails._id,

        }
        if (type == 'limit') {
            req.childAllowanceLimit = parseInt(userLimitValue)
        } else if (type == 'account') {
            req.cashWithdrawal = childdetails.cashWithdrawal && childdetails.cashWithdrawal == '1' ? '0' : '1'
        } else if (type == 'remove') {
            req.status = '2'
            req.userToken = ''
        }
        else if (type == 'lock') {
            req.status = '0'
            req.userToken = ''
        }
        else if (type == 'unlock') {
            req.status = '1'

        }

        try {
            setLoader(true)
            const result = await childUpdate(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {

                if (type != 'unlock' && type != 'lock') {
                    let message = {}
                    message.message = 'Data Updated successfully'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                }

                if (type == 'remove') {
                    props.navigation.goBack()
                } else {
                    getUserDetailsFun(childdetails._id)
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


    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }
    const getUserDetailsFun = async (id) => {
        console.log(childdetails)
        let req = {
            userId: id ? id : childdetails._id
        }

        console.log(req)

        try {
            setLoader(true)
            const result = await getAnyUserDetails(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                setChilddetails(result.details)
                setUserLimitValue(result.details.childAllowanceLimit ? parseInt(result.details.childAllowanceLimit) : 0)
                getAllChildTransction(result.details._id)
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

    const getCardDetails = async () => {


        try {
            setLoader(true)
            const result = await getCards();
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                setCardList(result.details)

                if (result.details.length > 0) {
                    var data = result.details.filter(it => it._id == route.params.childdetails.personisalizedCardId)
                    if (data.length) {
                        console.log(route.params.childDetails)
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
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    let type = DeviceInfo.hasNotch();
    console.log(type)

    const cc_format = (value) => {
        console.log(value)

        if (value) {
            var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            var matches = v.match(/\d{4,16}/g);
            var match = matches && matches[0] || ''
            var parts = []

            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4))
            }

            if (parts.length) {
                return parts.join(' ')
            } else {
                return value
            }
        } else {
            return 'Card Not activated'
        }

    }


    const onReactivecard = async () => {
        setShowModal(false)
        let req = {
            childId: childdetails._id
        }
        try {
            setLoader(true)
            const result = await reactiveCard(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {

                let message = {}
                message.message = 'Card unlocked successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                getUserDetailsFun(childdetails._id)
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

    const onDeactiveCard = async () => {
        setShowModal(false)
        let req = {
            childId: childdetails._id
        }
        try {
            setLoader(true)
            const result = await lockCard(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {

                let message = {}
                message.message = 'Card locked successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                getUserDetailsFun(childdetails._id)
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

    const onChildCardTopUp = async () => {


        let req = {
            childId: childdetails._id,
            amount: parseInt(topupamount),
            message: comment ? comment : 'Card funds from Parents'
        }
        let message = {}
        if (!topupamount) {
            message.message = 'Please enter amount'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }



        if (parseInt(topupamount) > parseInt(props.loginUserDetails.totalWallet)) {
            message.message = 'Please enter amount less then family balance'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }


        try {
            setLoader(true)
            const result = await childCardTopup(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                getUserDetailsFun(childdetails._id)
                setTopupamount('')
                setComment('')
                setTimeout(() => {
                    let message = {}
                    message.message = 'Top up success!'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                }, 500)


            } else {
                setTimeout(() => {
                    let message = {}
                    message.message = result.message
                    message.type = 'error'
                    sharedClass.ShowSnakBar(message)
                }, 500)

            }
        } catch (error) {
            setTimeout(() => {
                let message = {}
                message.message = 'something went wrong!'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)

            }, 1000)
            setLoader(false)

        }

    }
    const FirstRoute = () => {
        return (
            <View style={[styles.scene,]} >

                {

                    earningToday && earningToday.txtData && earningToday.txtData.map(item => {


                        return (
                            <View style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60 }]}>

                                    <View style={{ width: width - 60 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16, color: colors.subTitleColor }]}>{item.amount}</Text>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.grayColorLight }]}>{getDate(item.updatedAt)}</Text>
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.childblue }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, position: 'absolute', right: 10, color: colors.childblue, fontSize: 13, borderBottomWidth: 1, borderBottomColor: colors.childblue }]}>+{item.amount}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <View style={[{ width: width, borderBottomWidth: .5, borderBottomColor: colors.charcolColorNew }]}>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: width - 40, marginLeft: 20 }}>
                        <Image source={localImages.coins} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19 }]}>Earnings </Text>
                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 11, position: 'absolute', right: 10 }]}>Total
                                     <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 24, marginLeft: 10 }]}>  ${(totalEarning ? totalEarning : 0).toFixed(2)}</Text>
                        </Text>
                    </View>



                </View>
                <View style={{flexDirection:'row', marginTop:10}}>
                    <TouchableOpacity
                        style={[showBar == 0 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20, width:(width-60)/3 }]}
                        onPress={() => setShowBar(0)}>
                        <Text style={[showBar == 0 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[showBar == 1 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20, width:(width-60)/3 }]}
                        onPress={() => setShowBar(1)}>
                        <Text style={[showBar == 1 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Transfer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[showBar == 2 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20, width:(width-60)/3 }]}
                        onPress={() => setShowBar(2)}>
                        <Text style={[showBar == 2 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Allowance</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, backgroundColor: colors.blueLightColor }}>
                    {showBar==0?<BarChart

                        data={taskDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />
                    :
                    showBar==1?
                    <BarChart

                        data={transaferDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />:
                    <BarChart

                        data={AllowanceDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />
                
                }



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
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBoxBackground}
                        width={width - 40}
                        borderRadius={30}
                        marginTop={20}
                        placeholder="Leave a comment (Optional)"
                        label="Comments"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}

                        inputTextColor={colors.inputTextColor}
                        secureTextEntry={false}

                        editable={true}
                        value={comment}
                        maxLength={400}
                        onChangeText={(text) => setComment(text)}
                    ></InputBox>

                    <ButtonWithoutShadow
                        height={60}
                        backgroundColor={colors.childblue}
                        width={width - 80}
                        borderRadius={30}
                        marginTop={20}
                        label="Confirm and send"
                        labelColor={colors.white}
                        onAction={() => { onChildCardTopUp() }}
                        fontFamily={fonts.robotoRegular}
                        fontSize={19}
                    ></ButtonWithoutShadow>
                </View>


                <View style={{ marginTop: 10, backgroundColor: colors.blueLightColor }}>
                    <View style={[{ width: width, }]}>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: width - 40, marginLeft: 20 }}>
                            <Image source={localImages.credit_card_protection} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19 }]}>Card details </Text>


                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <View>
                                <Image source={{ uri: selectedCard.image }} style={{ width: width - 80, height: (width - 80) * .633, marginTop: 10 }} />
                                {childdetails ? <View style={{ position: 'absolute', left: 20, bottom: 40 }}>
                                    <Text style={{ fontFamily: fonts.robotoMedium, fontSize: 25, color: colors.white }}>{cc_format(childdetails.matchMoveWalletCard)}</Text  >
                                    <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.white }}>{childdetails.firstName} {childdetails.lastName}</Text  >
                                </View> : null}
                            </View>
                            <View style={{ marginBottom: 20 }}>


                                {
                                    childdetails.cardActiveStatus == '0' && childdetails.matchMoveWalletCard ?

                                        <View>
                                            <ButtonWithoutShadow
                                                height={60}
                                                backgroundColor={colors.childblue}
                                                width={width - 60}
                                                borderRadius={30}
                                                marginTop={20}
                                                label="Activate Card"
                                                labelColor={colors.white}
                                                onAction={() => { props.navigation.navigate('ActivateCardPage', { childdetails: childdetails }) }}
                                                fontFamily={fonts.robotoRegular}
                                                fontSize={15}
                                            ></ButtonWithoutShadow>

                                        </View>
                                        :
                                        childdetails.cardActiveStatus == '0' && !childdetails.matchMoveWalletCard ?

                                            <View>
                                                <ButtonWithoutShadow
                                                    height={60}
                                                    backgroundColor={colors.childblue}
                                                    width={width - 60}
                                                    borderRadius={30}
                                                    marginTop={20}
                                                    label="Add New Card"
                                                    labelColor={colors.white}
                                                    onAction={() => { props.navigation.navigate('RequestNewCardPage', { childdetails: childdetails }) }}
                                                    fontFamily={fonts.robotoRegular}
                                                    fontSize={15}
                                                ></ButtonWithoutShadow>

                                            </View>
                                            : <View>

                                                {childdetails.temporaryCardStatus == '1' ? <ButtonWithoutShadow
                                                    height={60}
                                                    backgroundColor={colors.buttonBlack}
                                                    width={width - 60}
                                                    borderRadius={30}
                                                    marginTop={20}
                                                    label="Deactivate Card"
                                                    labelColor={colors.white}
                                                    onAction={() => { onDeactiveCard() }}
                                                    fontFamily={fonts.robotoRegular}
                                                    fontSize={15}
                                                ></ButtonWithoutShadow> :

                                                    <ButtonWithoutShadow
                                                        height={60}
                                                        backgroundColor={colors.childblue}
                                                        width={width - 60}
                                                        borderRadius={30}
                                                        marginTop={20}
                                                        label="Reactivate Card"
                                                        labelColor={colors.white}
                                                        onAction={() => { onReactivecard() }}
                                                        fontFamily={fonts.robotoRegular}
                                                        fontSize={15}
                                                    ></ButtonWithoutShadow>
                                                }
                                            </View>
                                }

                            </View>
                        </View>



                    </View>
                </View>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ marginBottom: 0, paddingBottom: 0 }}
                    contentContainerStyle={styles.scrollview}

                >
                    <View style={styles.content}>
                        <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={styles.container} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                <View style={{ width: 80, marginLeft: 20, }}>
                                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={20} />
                                        <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                </View>

                                <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                    <TouchableOpacity onPress={() => 
                                        // props.navigation.navigate('RequestNewCardPage', { childdetails: childdetails })
                                        setShowModal(true)
                                        
                                        } style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                        <Image source={localImages.settings} style={{ height: 30, width: 30 }} ></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.backgroundView} >

                                <Image style={styles.image} source={{ uri: childdetails.coverPicture }} />
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
                        {childdetails ?

                            <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 100, left: 0, width: width, zIndex: 9999 }}>

                                <Text style={[styles.robotoBoldText, { fontSize: 36, color: colors.white }]}>{childdetails.firstName} {childdetails.lastName}</Text  >
                            </View> : null}
                        <View style={[{ marginTop: -70, justifyContent: 'center', alignItems: 'center' }]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 120, height: 120, backgroundColor: colors.white, borderRadius: 60 }}>
                                <Image source={{ uri: childdetails.profilePicture }} style={{ height: 118, width: 118, borderRadius: 59 }} />
                            </View>

                        </View>
                        {childdetails.cardActiveStatus ?
                            <View>

                                <View style={[{ width: width - 40, marginLeft: 20, marginTop: 10 }]}>


                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                        <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>

                                            <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>${parseFloat(childdetails.totalCardBalance ? childdetails.totalCardBalance : 0).toFixed(2)}</Text>
                                            <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Balance</Text>
                                            <View style={[styles.iconBackgroud, { marginTop: 10, backgroundColor: colors.pink }]}>
                                                <Image source={localImages.piggy_bank_2_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                        </View>
                                        <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>{childEarningData && childEarningData.taskCount ? childEarningData.taskCount : 0}</Text>
                                            <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Tasks Complete</Text>
                                            <View style={[styles.iconBackgroud, { marginTop: 10, backgroundColor: colors.Purple }]}>
                                                <Image source={localImages.shield_lock_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                        </View>
                                        <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>${parseFloat(childEarningData && childEarningData.totalSpent ? childEarningData.totalSpent : 0).toFixed(2)}</Text>
                                            <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Spent</Text>
                                            <View style={[styles.iconBackgroud, { marginTop: 10, backgroundColor: colors.Greenish }]}>
                                                <Image source={localImages.money_bag_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                        </View>


                                    </View>

                                </View>
                                <View style={[styles.tabBarView, { marginVertical: 10 }]}>



                                    <TouchableOpacity
                                        style={[index == 0 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20 }]}
                                        onPress={() => setIndex(0)}>
                                        <Text style={[index == 0 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Earnings</Text>
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

                            :

                            <View style={{ marginTop: 10, backgroundColor: colors.blueLightColor }}>
                                <View style={[{ width: width, }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: width - 40, marginLeft: 20 }}>
                                        <Image source={localImages.credit_card_protection} style={{ height: 40, width: 40, marginLeft: 10, marginBottom: 10 }} />
                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19 }]}>Card details </Text>


                                    </View>
                                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                        <View>
                                            <Image source={{ uri: selectedCard.image }} style={{ width: width - 80, height: (width - 80) * .633, marginTop: 10 }} />
                                            {childdetails ? <View style={{ position: 'absolute', left: 20, bottom: 40 }}>
                                                <Text style={{ fontFamily: fonts.robotoMedium, fontSize: 25, color: colors.white }}>{cc_format(childdetails.matchMoveWalletCard)}</Text  >
                                                <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.white }}>{childdetails.firstName} {childdetails.lastName}</Text  >
                                            </View> : null}
                                        </View>
                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.childblue}
                                            width={width - 60}
                                            borderRadius={30}
                                            marginTop={20}
                                            label="Activate Card"
                                            labelColor={colors.white}
                                            onAction={() => { props.navigation.navigate('ActivateCardPage', { childdetails: childdetails }) }}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={15}
                                        ></ButtonWithoutShadow>
                                    </View>



                                </View>
                            </View>

                        }



                    </View>

                </ScrollView>
                <Modal
                    onDismiss={() => {
                        setShowModal(false)
                        setShowLockModal(false)
                        setShowUnLockModal(false)
                        setShowModaTranEnable(false)
                        setShowModaTranDisable(false)
                        setShowModalRemove(false)
                        setShowModalNewCard(false)

                    }}
                    onTouchOutside={() => {


                        if (showUnLockModal) {
                            setShowUnLockModal(false)
                        } else if (showLockModal) {
                            setShowLockModal(false)
                        } else if (showModaTransaEnable) {
                            setShowModaTranEnable(false)
                        } else if (showModaTransaDisable) {
                            setShowModaTranDisable(false)
                        } else if (showModalRemove) {
                            setShowModalRemove(false)
                        } else if (showModalNewCard) {
                            setShowModalNewCard(false)
                        }
                        else {
                            setShowModal(false)
                        }
                    }}
                    onHardwareBackPress={() => {
                        if (showUnLockModal) {
                            setShowUnLockModal(false)
                        } else if (showLockModal) {
                            setShowLockModal(false)
                        } else if (showModaTransaEnable) {
                            setShowModaTranEnable(false)
                        } else if (showModaTransaDisable) {
                            setShowModaTranDisable(false)
                        } else if (showModalRemove) {
                            setShowModalRemove(false)
                        } else if (showModalNewCard) {
                            setShowModalNewCard(false)
                        } else {
                            setShowModal(false)
                        }
                        return true

                    }}
                    swipeDirection="down"
                    onSwipeOut={() => setShowModal(false)}
                    visible={showModal}
                    modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                >
                    <ModalContent style={{ width: width - 40 }}>
                        <Text>{showUnLockModal}</Text>
                        {!showUnLockModal && !showLockModal && !showModaTransaEnable && !showModaTransaDisable && !showModalRemove && !showModalNewCard ? <View>

                            {
                                childdetails.status == '0' ? <TouchableOpacity onPress={() => onUnLock()}><Text style={{ fontFamily: fonts.robotoRegular, color: colors.red, fontSize: 20, textAlign: 'center', marginVertical: 10 }}>Unlock Account</Text></TouchableOpacity>
                                    : <TouchableOpacity onPress={() => onLock()}><Text style={{ fontFamily: fonts.robotoRegular, color: colors.red, fontSize: 20, textAlign: 'center', marginVertical: 10 }}>Lock Account</Text></TouchableOpacity>
                            }

                            <TouchableOpacity onPress={() => onRemove()}><Text style={{ fontFamily: fonts.robotoRegular, color: colors.red, fontSize: 20, textAlign: 'center', marginVertical: 10 }}>Remove Account</Text></TouchableOpacity>
                            {childdetails.cardDeleteRequest == '1' ? <TouchableOpacity onPress={() => onNewCard()}><Text style={{ fontFamily: fonts.robotoRegular, color: colors.red, fontSize: 20, textAlign: 'center', marginVertical: 10 }}>Request A New Card</Text></TouchableOpacity> : null}
                        </View>
                            :
                            showUnLockModal ?


                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to unlock this account?</Text>
                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>Users of unlocked account will  be able to use their virtual and physical card to make transactions.</Text>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.red}
                                        width={width - 94}
                                        borderRadius={30}
                                        marginTop={40}
                                        marginBottom={10}
                                        label="Unlock this Account"
                                        labelColor={colors.white}
                                        onAction={() => onUnlockAccount()}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>

                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={'rgba(255,255,255,0)'}
                                        width={width - 94}
                                        borderRadius={30}
                                        marginTop={10}
                                        marginBottom={30}
                                        label="Cancel"
                                        labelColor={colors.placeHolderColor}
                                        onAction={() => setShowUnLockModal(false)}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>
                                </View>
                                : showModaTransaEnable ?
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to enable cash withdrawal?</Text>
                                        <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>User will  be able to withdraw cash using this card</Text>
                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.red}
                                            width={width - 94}
                                            borderRadius={30}
                                            marginTop={40}
                                            marginBottom={10}
                                            label="Enable Cash Withdrawal"
                                            labelColor={colors.white}
                                            onAction={() => onLimitUpdate('account')}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>

                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={'rgba(255,255,255,0)'}
                                            width={width - 94}
                                            borderRadius={30}
                                            marginTop={10}
                                            marginBottom={30}
                                            label="Cancel"
                                            labelColor={colors.placeHolderColor}
                                            onAction={() => setShowModaTranEnable(false)}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>
                                    </View>

                                    : showModaTransaDisable ?

                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to disable cash withdrawal?</Text>
                                            <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>User will not be able to withdraw cash using this card until it is enable again.</Text>
                                            <ButtonWithoutShadow
                                                height={60}
                                                backgroundColor={colors.red}
                                                width={width - 94}
                                                borderRadius={30}
                                                marginTop={40}
                                                marginBottom={10}
                                                label="Disable Cash Withdrawal"
                                                labelColor={colors.white}
                                                onAction={() => onLimitUpdate('account')}
                                                fontFamily={fonts.robotoRegular}
                                                fontSize={19}
                                            ></ButtonWithoutShadow>

                                            <ButtonWithoutShadow
                                                height={60}
                                                backgroundColor={'rgba(255,255,255,0)'}
                                                width={width - 94}
                                                borderRadius={30}
                                                marginTop={10}
                                                marginBottom={30}
                                                label="Cancel"
                                                labelColor={colors.placeHolderColor}
                                                onAction={() => setShowModaTranDisable(false)}
                                                fontFamily={fonts.robotoRegular}
                                                fontSize={19}
                                            ></ButtonWithoutShadow>
                                        </View>
                                        : showModalRemove ?
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to remove account?</Text>
                                                <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>Removing account will also terminate the card in the process.and it will cost of $9</Text>
                                                <ButtonWithoutShadow
                                                    height={60}
                                                    backgroundColor={colors.red}
                                                    width={width - 94}
                                                    borderRadius={30}
                                                    marginTop={40}
                                                    marginBottom={10}
                                                    label="Remove Account"
                                                    labelColor={colors.white}
                                                    onAction={() => onRemoveAccount('remove')}
                                                    fontFamily={fonts.robotoRegular}
                                                    fontSize={19}
                                                ></ButtonWithoutShadow>

                                                <ButtonWithoutShadow
                                                    height={60}
                                                    backgroundColor={'rgba(255,255,255,0)'}
                                                    width={width - 94}
                                                    borderRadius={30}
                                                    marginTop={10}
                                                    marginBottom={30}
                                                    label="Cancel"
                                                    labelColor={colors.placeHolderColor}
                                                    onAction={() => setShowModalRemove(false)}
                                                    fontFamily={fonts.robotoRegular}
                                                    fontSize={19}
                                                ></ButtonWithoutShadow>
                                            </View>
                                            : showModalNewCard ?
                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to Add new Card?</Text>
                                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>Adding New card will be Transfer all money in that card to parent wallet.</Text>
                                                    <ButtonWithoutShadow
                                                        height={60}
                                                        backgroundColor={colors.red}
                                                        width={width - 94}
                                                        borderRadius={30}
                                                        marginTop={40}
                                                        marginBottom={10}
                                                        label="Add New Card"
                                                        labelColor={colors.white}
                                                        onAction={() => onAddNewCard()}
                                                        fontFamily={fonts.robotoRegular}
                                                        fontSize={19}
                                                    ></ButtonWithoutShadow>

                                                    <ButtonWithoutShadow
                                                        height={60}
                                                        backgroundColor={'rgba(255,255,255,0)'}
                                                        width={width - 94}
                                                        borderRadius={30}
                                                        marginTop={10}
                                                        marginBottom={30}
                                                        label="Cancel"
                                                        labelColor={colors.placeHolderColor}
                                                        onAction={() => setShowModalNewCard(false)}
                                                        fontFamily={fonts.robotoRegular}
                                                        fontSize={19}
                                                    ></ButtonWithoutShadow>
                                                </View>
                                                :
                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.titleText, fontSize: 25, textAlign: 'center', marginVertical: 10 }}>Are you sure you want to lock this account?</Text>
                                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 15, textAlign: 'center', marginVertical: 10 }}>Users of locked account will not be able to use their virtual and physical card to make transactions  until account is unlocked.</Text>
                                                    <ButtonWithoutShadow
                                                        height={60}
                                                        backgroundColor={colors.red}
                                                        width={width - 94}
                                                        borderRadius={30}
                                                        marginTop={40}
                                                        marginBottom={10}
                                                        label="Lock this Account"
                                                        labelColor={colors.white}
                                                        onAction={() => onLockAccount()}
                                                        fontFamily={fonts.robotoRegular}
                                                        fontSize={19}
                                                    ></ButtonWithoutShadow>

                                                    <ButtonWithoutShadow
                                                        height={60}
                                                        backgroundColor={'rgba(255,255,255,0)'}
                                                        width={width - 94}
                                                        borderRadius={30}
                                                        marginTop={10}
                                                        marginBottom={30}
                                                        label="Cancel"
                                                        labelColor={colors.placeHolderColor}
                                                        onAction={() => setShowLockModal(false)}
                                                        fontFamily={fonts.robotoRegular}
                                                        fontSize={19}
                                                    ></ButtonWithoutShadow>
                                                </View>

                        }

                    </ModalContent>
                </Modal>
            </View>



        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    console.log("check store data", state.localStates);
    return {
        loginStatus: state.localStates.loginStatus,


        loginUserDetails: state.localStates.userDetails,
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



export default connect(mapStateToProps, mapDispatchToProps)(SingleChildStatisticPage)

var styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    iconBackgroud: {
        height: 60,
        width: 60,
        borderRadius: 30,
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
    container: {
        ///alignSelf: 'center',
        /// marginTop: 100,
        alignItems: 'center',
        width: width,
        ///backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle
        // margin: 10,
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        /// backgroundColor: colors.white,
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
    tabBarView: {
        flexDirection: 'row',
        //  paddingTop: Constants.statusBarHeight,
    },
    tabItemViewActive: {
        // flex: 1,
        backgroundColor: colors.childblue,
        alignItems: 'center',
        width: (width - 60) / 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    tabItemViewInActive: {
        // flex: 1,
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

});