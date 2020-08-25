import React, { useState, useEffect } from 'react'
import { Animated, Alert, FlatList, TextInput, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faArrowLeft,  faBell, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'

import DeviceInfo from 'react-native-device-info';


import { childUpdate, getChildList, getCards, getTransactionHistory, getAnyUserDetails, getUserDetails, reactiveCard, lockCard, parentRecation, getChilEarning } from '../../api';

import { CommonActions, useRoute, useFocusEffect } from '@react-navigation/native';

import SharedClass from '../../utils/SharedClass'

import {
    
    StackedBarChart,
    BarChart
} from "react-native-chart-kit";

import moment from "moment";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
const colorsArray = [
    "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177", "#0d5ac1",
    "#f205e6", "#1c0365", "#14a9ad", "#4ca2f9", "#a4e43f"]



    const { height, width } = Dimensions.get('window');



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
    const sharedClass = new SharedClass();
    const route = useRoute();
   
    const [userLimitValue, setUserLimitValue] = useState(200)
    const [showUnLockModal, setShowUnLockModal] = useState(false)
    const [childEarningData, setChildEarningData] = useState()
    const [barLabel, setBarLabel] = useState([])
    const [legend, Setegend] = useState(["Task", "Transfer", "Allowance"])
    const [barColor, setBarColor] = useState([colors.pink, colors.Purple , colors.Greenish])
    const [saveChartData,setSaveChartData]= useState('')
    const [showChart, setShowChart] = useState(false)

   

    const [childdetails, setChilddetails] = useState('')

    const [sppiner, setLoader] = useState(false)
    
    const [cardList, setCardList] = useState([])
    const [scrollYY, setScrollYY] = useState(new Animated.Value(0))
    const [earningToday, setEarningToday] = useState([])
    const [totalEarning, setTotalEarning] = useState(0)
    const [taskDataSet, setTaskDataSet] = useState('')
    const [AllowanceDataSet, setAllowanceDataSet] = useState('')
    const [transaferDataSet, setTransaferDataSet] = useState('')
    const [showBar, setShowBar] = useState(0)

    const { setLoggedInUserAuthToken } = props;
  
    const [index, setIndex] = React.useState(0);
    





    useEffect(() => {


    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            ///  alert('hy')
            getChildEarningData()
            getUserDetailsFun(route.params && route.params.childdetails._id ? route.params.childdetails._id : '')
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


    const getUserDetailsFun = async (id) => {


   
        let req = {
            userId: id ? id : childdetails._id
        }

     

        try {
            setLoader(true)
            const result = await getAnyUserDetails(req);
            
            setLoader(false)
          
            if (result && result.status == 'success') {
                setChilddetails(result.details)
                setUserLimitValue(result.details.childAllowanceLimit ? parseInt(result.details.childAllowanceLimit) : 0)
                
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

    const getChildEarningData = async () => {


        try {
            setLoader(true)
            const result = await getChilEarning();
           
            setLoader(false)
            // setEmail('')
            // setPassword('')
            if (result && result.status == 'success') {
                setChildEarningData(result.details)

                let data = []
                let total = 0
                let txtData = result.details.txtData ? result.details.txtData : []
              
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
                let currentDate = moment()
                let lastPreviousMonth = moment().subtract(1, 'month');
                let twoPreviousMonth = moment().subtract(2, 'month');

                for (let index = 0; index < txtData.length; index++) {
                   
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
if(currentMonth1>0|| currentMonth2>0|| currentMonth3>0|| PreviouMonth1>0|| PreviouMonth2>0|| PreviouMonth3>0|| TwoPreviousMonth1>0|| TwoPreviousMonth2>0|| TwoPreviousMonth3>0){

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
                    data: [[currentMonth1, currentMonth2, currentMonth3], [PreviouMonth1, PreviouMonth2, PreviouMonth3],[TwoPreviousMonth1,TwoPreviousMonth2,TwoPreviousMonth3]],
                    barColors: barColor
                }

                setTaskDataSet(object1)
                setTransaferDataSet(object2)
                setAllowanceDataSet(object3)

            
                setSaveChartData(object)
                setTotalEarning(total)
                setEarningToday(data)
                if (txtData.length > 0) {
                    let totalValue = 0
                    let arrayList = []
                    for (let indexx = 0; indexx < txtData.length; indexx++) {
                        totalValue = totalValue + parseFloat(txtData[indexx].amount)

                        
                        if (arrayList.length == 0) {
                            arrayList.push(
                                {
                                    amount: parseFloat(txtData[indexx].amount),
                                    type: txtData[indexx].type,
                                    //percentage: 10,
                                    color: colorsArray[0],
                                }
                            )
                        } else {
                            let localIndex = arrayList.map(it => { return it.type }).indexOf(txtData[indexx].type)
                            if (localIndex == -1) {
                                arrayList.push(
                                    {
                                        amount: parseFloat(txtData[indexx].amount),
                                        type: txtData[indexx].type,
                                        //percentage: 10,
                                        color: colorsArray[arrayList.length],
                                    }
                                )

                            } else {
                                arrayList[localIndex].amount = arrayList[localIndex].amount + parseFloat(txtData[indexx].amount)
                            }

                        }
                    }

                    for (let arrayIndex = 0; arrayIndex < arrayList.length; arrayIndex++) {

                        arrayList[arrayIndex].percentage = totalValue > 0 ? (parseFloat(arrayList[arrayIndex].amount) * 100) / totalValue : 100
                    }
                    var listing = []
                    for (let arrayIndex = 0; arrayIndex < arrayList.length; arrayIndex = arrayIndex + 2) {


                        if (arrayList[arrayIndex] && arrayList[arrayIndex + 1]) {
                            listing.push({
                                first: arrayList[arrayIndex],
                                second: arrayList[arrayIndex + 1]
                            })
                        } else {
                            listing.push({
                                first: arrayList[arrayIndex]

                            })

                        }

                    }
                   
                }


                if (txtData.length > 0) {
                    let total = 0
                    let totalDebit = 0
                    let totalCredit = 0
                    for (let indexx = 0; indexx < txtData.length; indexx++) {
                        total = total + parseFloat(txtData[indexx].amount)

                        if (txtData[indexx].indicator == 'credit') {
                            totalCredit = totalCredit + parseFloat(txtData[indexx].amount)
                        } else {
                            totalDebit = totalDebit + parseFloat(txtData[indexx].amount)
                        }
                    }


                    let array = [
                        {
                            percentage: total > 0 ? (totalDebit * 100) / total : 0,
                            total: totalDebit,
                            color: '#279A7C',
                            type: 'spend'
                        },
                        {
                            percentage: total ? (totalCredit * 100) / total : 100,
                            total: 200,
                            color: '#DBD3AD',
                            type: 'saving'
                        }
                    ]
                    setSavingVsSpendOverView(array)
                    //setTransctionHistory(list)
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

    let type = DeviceInfo.hasNotch();


  

    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
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
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.amount}</Text>
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
                    {showBar==0 && taskDataSet?<BarChart

                        data={taskDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />
                    :
                    showBar==1 && transaferDataSet?
                    <BarChart

                        data={transaferDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />:
                    AllowanceDataSet?
                    <BarChart

                        data={AllowanceDataSet}
                        width={width}
                        height={300}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                    />
                    :null
                
                }



                </View>
            </View>
        )
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
                        <View style={styles.container} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                            <View style={{ width: 80,marginLeft: 20, }}>
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
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.backgroundView} >

                                <Image style={styles.image} source={{ uri: childdetails.profilePicture }} />
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

                                <Text style={[styles.robotoBoldText, { fontSize: 30, color: colors.white }]}>{childdetails.firstName} {childdetails.lastName}</Text  >
                            </View> : null}
                        <View style={[{ marginTop: -70, justifyContent: 'center', alignItems: 'center' }]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 120, height: 120, backgroundColor: colors.white, borderRadius: 60 }}>
                                <Image source={{ uri: childdetails.profilePicture }} style={{ height: 118, width: 118, borderRadius: 59 }} />
                            </View>

                        </View>
                        <View style={[{ width: width - 40, marginLeft: 20, marginTop: 10 }]}>


                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>

                                    <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>${parseFloat(childdetails.totalCardBalance ? childdetails.totalCardBalance : 0).toFixed(2)}</Text>
                                    <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Balance</Text>
                                    <View style={[styles.iconBackgroud,{marginTop:10, backgroundColor:colors.pink}]}>
                                                <Image source={localImages.piggy_bank_2_white} style={{ height: 40, width: 40, }} />

                                    </View>
                                </View>
                                <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>{childEarningData && childEarningData.taskCount ? childEarningData.taskCount : 0}</Text>
                                    <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Tasks Complete</Text>
                                    <View style={[styles.iconBackgroud,{marginTop:10, backgroundColor:colors.Purple}]}>
                                                <Image source={localImages.shield_lock_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                </View>
                                <View style={{ width: (width - 40) / 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.titleText, }]}>${parseFloat(childEarningData && childEarningData.totalSpent ? childEarningData.totalSpent : 0).toFixed(2)}</Text>
                                    <Text style={[styles.robotoRegularText, { fontSize: 15, marginTop: 10, color: colors.graytwo }]}>Spent</Text>
                                    <View style={[styles.iconBackgroud,{marginTop:10, backgroundColor:colors.Greenish}]}>
                                                <Image source={localImages.money_bag_white} style={{ height: 40, width: 40, }} />

                                            </View>
                                </View>


                            </View>

                        </View>
                        {earningToday.length > 0 ? <View style={[styles.tabBarView, { marginVertical: 10 }]}>



                            <TouchableOpacity
                                style={[index == 1 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20 }]}
                                onPress={() => setIndex(0)}>
                                <Text style={[index == 1 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Earnings Today</Text>
                            </TouchableOpacity>

                        </View> : null}
                        {
                            FirstRoute()

                        }
                    </View>

                </ScrollView>
             
            </View>

        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
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



export default connect(mapStateToProps, mapDispatchToProps)(SingleChildStatisticPage)

var styles = StyleSheet.create({
   
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        
    },
    iconBackgroud: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: colors.iconBackgroud,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageBackground: {
        width: width - 40,
        height: 100
    },
    container: {
        
        alignItems: 'center',
        width: width,
        
        overflow: 'hidden', 
        height: 250,
    },
    backgroundView: { 
        borderRadius: width * 4, 
        width: width * 4,
        height: width * 4,
        
        position: 'absolute',
        bottom: 0, 
        overflow: 'hidden', 
    },
    tabBarView: {
        flexDirection: 'row',
        
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