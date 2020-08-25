// Create New Task (Plus icon): User will be redirected to the Create New Task Screen.

// User will be able to view following two options on the screen: 

// 	•	Completed: In the completed tasks user will be able to view following tasks: 
// 	•	Monetary: User will be able to view the monetary tasks with the following details: 
// 	•	Name of the child (To whom task is assigned) or all users
// 	•	Profile picture of the child
// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Reward monetary amount (Provided if task is completed)
// 	•	Bonus Reward (It can be monetary or non-monetary)

// 	•	Non-Monetary: User will be able to view the monetary tasks with the following details: 
// 	•	Name of the child (To whom task is assigned) or all users
// 	•	Profile picture of the child
// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Bonus Reward (non-monetary only)

// Note: After clicking on any of the completed task user will be redirect to the Completed Task Screen.
// User will be able to view only those tasks in the completed tasks that will be marked as complete by the child.

// In case user assigned task to all the kids available on the platform than task will be assigned to the kid who accept it first (Follow the FIFO Approach)

// 	•	Pending 
// 	•	Monetary: User will be able to view the monetary tasks with the following details: 
// 	•	Name of the child (To whom task is assigned) or all users
// 	•	Profile picture of the child
// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Reward monetary amount (Provided if task is completed)
// 	•	Bonus Reward (It can be monetary or non-monetary)

// 	•	Non-Monetary: User will be able to view the monetary tasks with the following details: 
// 	•	Name of the child (To whom task is assigned) or all users
// 	•	Profile picture of the child
// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Bonus Reward (non-monetary only)



import React, { useState, useEffect } from 'react'
import { FlatList, ImageBackground,  ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faPlus } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import DeviceInfo from 'react-native-device-info';



import {  getUserDetail, getTaskList } from '../../api';

import SharedClass from '../../utils/SharedClass'
import { useFocusEffect, CommonActions, } from '@react-navigation/native';


import RangeSlider from 'rn-range-slider';
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


const TaskListPage = (props) => {
    const sharedClass = new SharedClass();
    
    const [index, setIndex] = React.useState(0);

    const [indexMain, setIndexMain] = React.useState(0);
    const [userDetails, setUsersDetails] = useState('')
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const [sppiner, setLoader] = useState(false)

    const [taskList, setTaskList] = useState([])
    const [taskListCompleted, setTaskListCompleted] = useState([])
    const [taskListMon, setTaskListMon] = useState([])
    const [taskListMonCompleted, setTaskListMonCompleted] = useState([])


    const [taskListCompletedRec, setTaskListCompletedRec] = useState([])
    const [taskListMonCompletedRec, setTaskListMonCompletedRec] = useState([])

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
            //getUserDetailsFun()
        }, [])
    );


   

   

    const getAllTaskList = async () => {


        try {
           
            const result = await getTaskList();
            console.log(result)
            if (result && result.status == 'success') {
                setTaskList(result.details.filter(it => it.status == '0' && it.monetaryReward == false))
                setTaskListMon(result.details.filter(it => it.status == '0' && it.monetaryReward == true))

                setTaskListCompleted(result.details.filter(it => it.status != '0' && it.monetaryReward == false))
                setTaskListMonCompleted(result.details.filter(it => it.status != '0' && it.monetaryReward == true))

                let data1=result.details.filter(it => it.status != '0' && it.monetaryReward == false)

                let data2=result.details.filter(it => it.status != '0' && it.monetaryReward == true)
                setTaskListCompletedRec(data1.slice(0, 3))
                setTaskListMonCompletedRec(data2.slice(0, 3))
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

    // const getUserDetailsFun = async () => {


    //     try {
    //         setLoader(true)
    //         const result = await getUserDetails();
    //         console.log(result)
    //         setLoader(false)
    //         if (result && result.status == 'success') {
    //             setUsersDetails(result.details)
    //             props.setLoggedInUserDetails(result.details)

    //         } else {
    //             let message = {}
    //             message.message = result.message
    //             message.type = 'info'
    //             sharedClass.ShowSnakBar(message)
    //         }
    //     } catch (error) {
    //         setLoader(false)
    //         console.log("ERROR IN OFFER FETCH API", error);
    //     }
    // }

  
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

   

    let type = DeviceInfo.hasNotch();
    console.log(type)
    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }
    const MonetaryCompRoute = () => {
        return (
            <View style={[styles.scene, { backgroundColor: colors.white, width: width }]} >

                <View style={{ marginTop: 10 }}>
                    {taskListMonCompleted.length == 0 ? <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                    </View> : null}
                    <FlatList
                        horizontal={true}
                        data={taskListMonCompleted}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })} style={{ marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.Greenish, borderRadius: 30, }}>
                                       {item.imageUrls[0]? <Image source={{ uri: item.imageUrls[0]?item.imageUrls[0] : '' }} style={{ height: 60, width: 60, borderRadius: 30 }} />:<View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor:colors.Greenish }}></View>}

                                    </View>
                                    <Text style={[styles.robotoBoldText, { fontSize: 10, color: colors.subTitleColor, marginTop: 10 }]}>{item.taskName}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ marginTop: 20 }}>

                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, color: colors.subTitleColor ,marginBottom:10}]}>Recent activities</Text>

                    <FlatList
                        horizontal={true}
                        data={taskListMonCompletedRec}
                        renderItem={({ item }) => {
                            return (
                                <ImageBackground
                                    imageStyle={{   borderRadius:40 }}
                                    
                                    source={{ uri: item.imageUrls[0] }} style={{
                                        shadowColor: colors.shadowColor,
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.27,
                                        shadowRadius: 4.65,
                                        backgroundColor:colors.Greenish,
                                        borderRadius:40,
                                        elevation: 6,
                                       
                                        marginHorizontal: 5, width: width - 80, height: 500,}}>

                                    <TouchableOpacity style={{ height: 500 }} onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginTop: 20, marginLeft: 20 }}>
                                            <Image source={{ uri: item.childId ? item.childId.profilePicture : '' }} style={{ height: 58, width: 58, borderRadius: 29 }} />
                                        </View>
                                        <View>
                                            <Text style={[styles.robotoBoldText, { fontSize: 33, color: colors.white, marginTop: 10, marginLeft: 30 }]}>{item.taskName}</Text>
                                            <Text style={[styles.robotoRegularText, { fontSize: 22, color: colors.white, marginTop: 10, marginLeft: 30 }]}>{getDate(item.dueDate)}</Text>
                                        </View>
                                        <View style={{ position: 'absolute', bottom: 40 }}>
                                            <Text style={[styles.robotoRegularText, { fontSize: 24, color: colors.white, marginTop: 10, marginLeft: 30, position: 'absolute', bottom: 20 }]}>Rewards : ${item.rewardAmount.toFixed(2)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </ImageBackground>

                            )
                        }}

                        keyExtractor={item => item.id}
                    />
                </View>

            </View>
        );
    }

    const NonMonetaryCompRoute = () => {
        return (
            <View style={[styles.scene, { backgroundColor: colors.white, width: width }]} >

                <View style={{ marginTop: 10 }}>
                    {taskListCompleted.length == 0 ? <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                    </View> : null}
                    <FlatList
                        horizontal={true}
                        data={taskListCompleted}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })} style={{ marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.Greenish, borderRadius: 30, }}>
                                       {item.imageUrls[0]? <Image source={{ uri: item.imageUrls[0]?item.imageUrls[0] : '' }} style={{ height: 60, width: 60, borderRadius: 30 }} />:<View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor:colors.Greenish }}></View>}

                                    </View>
                                    <Text style={[styles.robotoBoldText, { fontSize: 10, color: colors.subTitleColor, marginTop: 10 }]}>{item.taskName}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ marginTop: 20 }}>

                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, color: colors.subTitleColor ,marginBottom:10}]}>Recent activities</Text>

                    <FlatList
                        horizontal={true}
                        data={taskListCompletedRec}
                        renderItem={({ item }) => {
                            return (
                                <ImageBackground
                                    imageStyle={{ borderRadius: 40 }}
                                    source={{ uri: item.imageUrls[0] }} 
                                    
                                    style={{
                                        shadowColor: colors.shadowColor,
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.27,
                                        shadowRadius: 4.65,
                                        backgroundColor:colors.Greenish,
                                        borderRadius:40,
                                        elevation: 6,
                                        marginHorizontal: 5, width: width - 80, height: 500,}}>
                                    <TouchableOpacity style={{height: 500}} onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginTop: 20, marginLeft: 20 }}>
                                        <Image source={{ uri: item.childId ? item.childId.profilePicture : '' }} style={{ height: 58, width: 58, borderRadius: 29 }} />
                                    </View>
                                    <View>
                                        <Text style={[styles.robotoBoldText, { fontSize: 33, color: colors.white, marginTop: 10, marginLeft: 30 }]}>{item.taskName}</Text>
                                        <Text style={[styles.robotoRegularText, { fontSize: 22, color: colors.white, marginTop: 10, marginLeft: 30 }]}>{getDate(item.dueDate)}</Text>
                                    </View>
                                    </TouchableOpacity>
                                </ImageBackground>

                            )
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>

            </View>
        );
    }


    const MonetaryPenRoute = () => {
        return (
            <View style={[styles.scene, { backgroundColor: colors.white, width: width }]} >

                <View style={{ marginTop: 10 }}>

                    {taskListMon.length == 0 ? <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                    </View> : null}
                    {
                        taskListMon.map(item => {
                           let data= monatortTaskList.filter(it=>it.title==item.taskName)
                            return (
                                <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                    <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, paddingVertical: 10 }]}>
                                       {data.length>0? <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 20 }}>
                                            <Image source={localImages[data[0].image]} style={{ height: 58, width: 58, borderRadius: 29 }} />
                                        </View>:null}
                                        <View style={{ width: width - 40 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.taskName}</Text>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.subTitleColor }]}>{getDate(item.dueDate)}</Text>
                                        </View>
                                        <View style={{}}>
                                            <Text style={[styles.robotoBoldText, { fontSize: 18, position: 'absolute', right: 20, color: colors.subTitleColor, fontSize: 13, }]}>${item.rewardAmount.toFixed(2)}</Text>
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

                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                    </View> : null}
                    {
                        taskList.map(item => {
                            let data= monatortTaskList.filter(it=>it.title==item.taskName)
                            return (
                                <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsParentPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                    <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, paddingVertical: 10 }]}>
                                    {data.length>0? <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 20 }}>
                                            <Image source={localImages[data[0].image]} style={{ height: 30, width: 30, }} />
                                        </View>:null}
                                        <View style={{ width: width - 40 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.taskName}</Text>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.subTitleColor }]}>{getDate(item.dueDate)}</Text>
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


    const renderSceneComp = SceneMap({
        monetary: MonetaryCompRoute,
        nonMonetary: NonMonetaryCompRoute,
    });

    const renderScenePen = SceneMap({
        monetary: MonetaryPenRoute,
        nonMonetary: NonMonetaryPenRoute,
    });


    const _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={[styles.tabBarViewNew, { marginVertical: 10 }]}>
                {props.navigationState.routes.map((route, i) => {

                    /// var color

                    return (
                        <TouchableOpacity
                            style={[index == i ? styles.tabItemViewActiveNew : styles.tabItemViewInActiveNew,]}
                            onPress={() => setIndex(i)}>
                            <Text style={[index == i ? styles.robotoBoldTextActiveNew : styles.robotoBoldTextInActiveNew]}>{route.title}</Text>
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
                    style={{  }}
                    contentContainerStyle={styles.scrollview}
                //   scrollEnabled={scrollEnabled}
                //   onContentSizeChange={this.onContentSizeChange}
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>

                        <View style={{ marginTop: 5 }}>

                            <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                <Image source={localImages.payment} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.subTitleColor }]}>Tasks</Text>
                                <View style={[styles.cardfirst,{position: 'absolute', right: 20, backgroundColor: colors.childblue, height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }]}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('CreateTaskPage')} style={[styles.cardfirst], { }}>
                                        <FontAwesomeIcon style={{}} icon={faPlus} color={colors.white} size={40} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                            <View style={[styles.tabBarView, { marginVertical: 10, marginTop: 30, marginLeft:20 }]}>



                                <TouchableOpacity
                                    style={[indexMain == 0 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 0 }]}
                                    onPress={() => setIndexMain(0)}>
                                    <Text style={[indexMain == 0 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Completed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[indexMain == 1 ? styles.tabItemViewActive : styles.tabItemViewInActive, { marginLeft: 20 }]}
                                    onPress={() => setIndexMain(1)}>
                                    <Text style={[indexMain == 1 ? styles.robotoBoldTextActive : styles.robotoBoldTextInActive]}>Pending</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <TabView
                                    swipeEnabled={false}
                                    navigationState={{ index, routes }}
                                    renderScene={indexMain == 0 ? renderSceneComp : renderScenePen}
                                    onIndexChange={setIndex}
                                    renderTabBar={_renderTabBar}
                                    initialLayout={initialLayout}
                                />
                            </View>


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
export default connect(mapStateToProps, mapDispatchToProps)(TaskListPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        ///  marginBottom:90
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
        backgroundColor: '#f3f5f4',
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
    tabBarViewNew: {
        flexDirection: 'row',
        marginLeft: 20
    },
    tabItemViewActiveNew: {
        borderBottomWidth: 8,
        borderBottomColor: colors.titleText,
        width: (width - 40) / 2,
        alignItems:'center'
    },
    tabItemViewInActiveNew: {
        borderBottomWidth: 8,
        borderBottomColor: colors.tabBorder,
        width: (width - 40) / 2,
        alignItems:'center'
    },
    robotoBoldTextActiveNew: {
        fontFamily: fonts.robotoBold,
        color: colors.titleText,
        fontSize: 19
    },
    robotoBoldTextInActiveNew: {
        fontFamily: fonts.robotoBold,
        color: colors.tabBorder,
        fontSize: 19
    }


});