// Child will be able to view following two options on the screen: 

// 	•	Monetary: User will be able to view the monetary tasks with the following details: 

// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Reward monetary amount (Provided if task is completed)
// 	•	Bonus Reward (It can be monetary or non-monetary)
// 	•	Mark as complete: Child will be redirected to the Task completed Screen. 

// 	•	Non-Monetary: Child will be able to view the monetary tasks with the following details: 

// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Bonus Reward (non-monetary only) 
// 	•	Mark as complete: Child will be redirected to the Task completed Screen. 



import React, { useState, useEffect } from 'react'
import { ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors, fonts, localImages } from '../../utils/constant'
import DeviceInfo from 'react-native-device-info';




import { getUserDetails, getTaskListChild } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions, } from '@react-navigation/native';

var { height, width } = Dimensions.get('window');
import { TabView, SceneMap } from 'react-native-tab-view';

import moment from "moment";


var monatortTaskList = [

    { image: 'Home_work', title: 'Complete homework' },
    { image: 'cooking_diner', title: 'Cooking dinner/breakfast?' },
    { image: 'Top_grades', title: 'Get top school grades' },
    { image: 'Make_bed', title: 'Make bed' },
    { image: 'Walk_dog', title: 'Walk dog' },
    { image: 'Cooking', title: 'Cook dinner/meal' },
    { image: 'clean_room', title: 'Clean room/house' },
    { image: 'take_out_trash', title: 'Take out trash' },
    { image: 'Play_piano', title: 'Play piano/other music instruments' },
    { image: 'join_sports', title: 'Join/maintain sport/exercise activities' },
    { image: 'event_task', title: 'An event' },
    { image: 'movie', title: 'A favourite movie' },
    { image: 'leisure_time', title: 'Free leisure time' },
    { image: 'with_friends', title: 'Free time with friends/outing with friends' },
    { image: 'play_games', title: 'Extra time to play games' },
    { image: 'fav_food', title: 'Favourite food/dish' },
    { image: 'concert', title: 'Go to a concert' },
    { image: 'holiday', title: 'Go on a holiday' },
    { image: 'Computer_privileges', title: 'Computer privileges' },
    { image: 'family_time', title: 'Extra family time' },
    { image: 'Play_piano', title: 'Play piano/other music instruments' }
]




const TaskListChildPage = (props) => {
    const sharedClass = new SharedClass();

    const [index, setIndex] = React.useState(0);

    const [userDetails, setUsersDetails] = useState('')

    const [sppiner, setLoader] = useState(false)
    const [taskList, setTaskList] = useState([])
    const [taskListCompleted, setTaskListCompleted] = useState([])


    const { setLoggedInUserAuthToken } = props;

    const [routes] = React.useState([
        { key: 'monetary', title: 'Monetary' },
        { key: 'nonMonetary', title: 'Non Monetary' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };






    useEffect(() => {

    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getAllTaskList()
            getUserDetailsFun()
            setIndex(1)
        }, [])
    );




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



    const getAllTaskList = async () => {


        try {

            const result = await getTaskListChild();


            getUserDetailsFun()
            if (result && result.status == 'success') {
                setTaskList(result.details.filter(it => it.status != '1' && it.status != '2' && it.status != '3'))
                setTaskListCompleted(result.details.filter(it => it.status == '1' || it.status == '2' || it.status == '3'))

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

    const getUserDetailsFun = async () => {


        try {
            setLoader(true)
            const result = await getUserDetails();

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
        }
    }







    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }

    let type = DeviceInfo.hasNotch();






    const MonetaryPenRoute = () => {
        return (
            <View style={[styles.scene, { backgroundColor: colors.white, width: width }]} >

                <View style={{ marginTop: 10 }}>
                    {taskListCompleted.length == 0 ? <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No tasks available</Text>
                    </View> : null}


                    {taskListCompleted.map(item => {
                        let data = monatortTaskList.filter(it => it.title == item.taskName)
                        return (
                            <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsChildPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, justifyContent: 'center', marginVertical: 10 }]}>
                                { data.length>0?   <View style={{
                                        shadowColor: colors.gradientGreenThree,
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                        elevation: 5,
                                        justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 10

                                    }}>
                                        <Image source={localImages[data[0].image]} style={{ height: 40, width: 40, }} />
                                    </View>:null}
                                    <View style={{ width: width - 120 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.taskName}</Text>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.grayColorLight }]}>{getDate(item.dueDate)}</Text>
                                    </View>

                                </View>

                            </TouchableOpacity>

                        )
                    })




                    }
                </View>
            </View>
        )
    }

    const NonMonetaryPenRoute = () => {
        return (
            <View style={[styles.scene, { backgroundColor: colors.white, width: width }]} >

                <View style={{ marginTop: 10 }}>
                    {taskList.length == 0 ? <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No tasks available</Text>
                    </View> : null}
                    {taskList.map(item => {
                        let data = monatortTaskList.filter(it => it.title == item.taskName)
                        return (
                            <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsChildPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, justifyContent: 'center', marginVertical: 10 }]}>
                                { data.length>0?   <View style={{
                                        shadowColor: colors.gradientGreenThree,
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                        elevation: 5,
                                        justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 10

                                    }}>
                                        <Image source={localImages[data[0].image]} style={{ height: 40, width: 40,  }} />
                                    </View>:null}
                                    <View style={{ width: width - 120 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.taskName}</Text>
                                        <View style={{ minHeight: 40 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.grayColorLight }]}>{getDate(item.dueDate)}</Text>
                                            <View style={{ position: 'absolute', alignItems: 'center', right: 10, top: 0, backgroundColor: colors.childblue, borderRadius: 20 }}>
                                                <Text style={[styles.robotoBoldText, { fontSize: 11, color: colors.white, fontSize: 11, marginHorizontal: 8, marginVertical: 8 }]}>Mark as complete</Text>
                                            </View>
                                        </View>

                                    </View>


                                </View>

                            </TouchableOpacity>

                        )
                    })




                    }
                </View>
            </View>
        );
    }




    const renderScenePen = SceneMap({
        monetary: MonetaryPenRoute,
        nonMonetary: NonMonetaryPenRoute,
    });


    const _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={[styles.tabBarView, { marginVertical: 10, marginLeft: 20 }]}>
                {props.navigationState.routes.map((route, i) => {

                    /// var color

                    return (
                        <TouchableOpacity
                            style={[index == i ? styles.tabItemViewActive : styles.tabItemViewInActive,]}
                            onPress={() => setIndex(i)}>
                            <Text style={[index == i ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>{route.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{}}
                    contentContainerStyle={styles.scrollview}

                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                        <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={{ marginTop: 5 }}>

                            <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                <Image source={localImages.payment} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.subTitleColor }]}>Task Tracker</Text>


                            </View>
                            <View style={{ marginBottom: 20, }}>
                                <TabView
                                    swipeEnabled={false}
                                    navigationState={{ index, routes }}
                                    renderScene={renderScenePen}
                                    onIndexChange={setIndex}
                                    renderTabBar={_renderTabBar}
                                    initialLayout={initialLayout}
                                />
                            </View>


                        </View>

                    </View>

                </ScrollView>
                {/* <View style={[styles.tabBar, { borderTopWidth: .9, borderTopColor: colors.charcolColorNew, height: 70, position: 'absolute', bottom: Platform.OS == 'ios' ? type ? 0 : 10 : 0, }]}>
                    <TouchableOpacity onPress={() => onButton('EducationPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                        <Image source={localImages.accountant} style={{ height: 35, width: 35 }}></Image>
                        <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Education</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onButton('ChildDashBoard')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>

                        
                        <Image source={localImages.wallet} style={{ height: 35, width: 35 }}></Image>
                        <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                        <Image source={localImages.Tab3Active} style={{ height: 35, width: 35 }}></Image>
                        <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.childblue }]}>Tasks</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onButton('ChatListPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                        <Image source={localImages.financial_advice} style={{ height: 35, width: 35 }}></Image>
                        <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Chat</Text>

                    </TouchableOpacity>

                </View> */}

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
export default connect(mapStateToProps, mapDispatchToProps)(TaskListChildPage)

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
    tabBar: {

        backgroundColor: colors.white,

        width: width,
        flexDirection: 'row',




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
    robotoLightText: {
        fontFamily: fonts.robotoLight,
        color: colors.grayColor
    },
    cardfirst: {

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
    image: {
        opacity: .6,
        height: 250,
        width: width,
        position: 'absolute',
        bottom: 0,
        marginLeft: width * 1.5,
    },
    containerCard: {

        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        height: (width - 60) * .63,
        marginTop: 20,
        marginBottom: 0
    },
    tabBarView: {
        flexDirection: 'row',

    },
    tabItemViewActive: {

        backgroundColor: colors.childblue,
        alignItems: 'center',
        width: (width - 40) / 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    tabItemViewInActive: {
        // flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        width: (width - 40) / 2,
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


});