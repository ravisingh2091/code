// User will be able to view following details of the completed tasks: 

// 	•	Name of the child (To whom task is assigned) or all users
// 	•	Profile picture of the child
// 	•	Name of the task
// 	•	Description of the task
// 	•	Due Date
// 	•	Reward 
// 	•	Bonus Reward (non-monetary only)
// 	•	Ability to view the Image of the task completion 
// 	•	Ability to view the video of the task completion (Optional)
// 	•	Action Button: 
// 	•	Complete & Send Rewards
// 	•	Reject 

// Note: User will be able to complete & send reward in which the rewarded amount as well as the bonus (Only in case of monetary rewards in case non-monetary rewards will be shared as per the specified in the field)
// Will be transferred to the child account and child will be able to receive the notification for the same.

// If user rejects the task, then child will be notified for the same that your task will not be accepted by the parent and child will not be able to receive any of the reward from the parent.



import React, { useState, useEffect } from 'react'
import { StatusBar, ActivityIndicator, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages,val } from '../../utils/constant'
import Button, { ButtonWithoutShadow,  } from '../../components/Button'
import InputBox, { InputToggele } from '../../components/InputBox'
import { ScrollView } from 'react-native-gesture-handler';

import moment from "moment"

import {  getTaskDetails, updateTask, getCategoryList, taskRewardAndComplte } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'

import ImageView from "react-native-image-viewing";
import VideoPlayerUi from '../../components/VideoPlayer'


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


var { height, width } = Dimensions.get('window');

const TaskDetailsParentPage = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
  
    const [hoursList, setHoursList] = useState([])
    const [minList, setMinList] = useState([])
    const [secList, setSecList] = useState([])
    const [sppiner, setLoader] = useState(false)
    const [sppinerImage, setLoaderImage] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [taskDetails, setTaskDetails] = useState('')
    const [imageUrls, setImageUrls] = useState([])
    var [imageUrlsList, setImageUrlsList] = useState([])
    const [videoUrls, setVideoUrls] = useState([])
    const [videoUrlsList, setVideoUrlsList] = useState([])
    const [imagesPriview, setImagePreview] = useState([])
    const [bonusIsAllow, setBonusIsAllow] = useState(false)

    const [imagesPriviewShow, setImagePreviewShow] = useState(false)
    const [timerValue, setTimerValue] = useState(0)
  
    const { setLoggedInUserAuthToken } = props;



    useEffect(() => {
        onLogin()
        ///  setTaskDetails(route.params.taskDetails)
        onTaskDetails(route.params && route.params.taskDetails._id ? route.params.taskDetails._id : '')
        getAllCategoryList()
    }, [setLoggedInUserAuthToken])

    const onLogin = () => {
        let hours = []
        let min = []
        let sec = []
        for (let index = 1; index < 101; index++) {

            hours.push({ label: index.toString(), value: index.toString() })
        }

        for (let index = 1; index < 60; index++) {

            min.push({ label: index.toString(), value: index.toString() })
        }
        for (let index = 1; index < 60; index++) {

            sec.push({ label: index.toString(), value: index.toString() })
        }
        setHoursList(hours)
        setMinList(min)
        setSecList(sec)

    }

    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }

 

    const getAllCategoryList = async () => {
        try {
       
            const result = await getCategoryList();
            console.log(result)
            if (result && result.status == 'success') {
                setCategoryList(result.details)
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
    const onTaskDetails = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                setTaskDetails(result.details)
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
                    setImageUrls(result.details.imageUrls)
                } else {
                    setImageUrls([])
                }
                if (result.details.videoUrls && result.details.videoUrls.length > 0) {
                    for (let index = 0; index < result.details.videoUrls.length; index++) {
                        video.push({ uri: result.details.videoUrls[index], key: index, loading: false })


                    }
                    setVideoUrls(result.details.videoUrls)
                } else {
                    setVideoUrls([])
                }
                setImageUrlsList(image)
                console.log(image)
                setImagePreview(imagesP)

                setVideoUrlsList(video)

                if (result.details.timer > 0) {
                    let caretedDate = new Date(result.details.createdAt).getTime()
                    let consumetime = caretedDate + result.details.timer
                    let currentTime = new Date().getTime()
                    let totalTimeLeft = consumetime - currentTime
                    console.log({ currentTime, totalTimeLeft })
                    if (totalTimeLeft > 0) {
                        setTimerValue(totalTimeLeft / 1000)

                    } else {
                        setTimerValue(0)

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


    const onReward = async (type) => {


        let message = {}
        if (!taskDetails.childId || taskDetails.status == '0') {
            message.message = 'No child accepted this task so it cant be mark as complete'
            message.type = 'success'
            sharedClass.ShowSnakBar(message)
            return
        }
        let req = {

        }

        req.taskId = taskDetails._id
        req.childId = taskDetails.childId._id
        req.bonus = bonusIsAllow


        try {
            setLoader(true)
            const result = await taskRewardAndComplte(req, taskDetails._id);
            console.log(result)
            setLoader(false)
            //let message = {}
            if (result && result.status == 'success') {

                setTimeout(() => {
                    message.message = 'Task updated'
                    message.type = 'success'
                    sharedClass.ShowSnakBar(message)
                    props.navigation.goBack()
                }, 500)


            } else {

                setTimeout(() => {
                    message.message = result.message
                    message.type = 'info'
                    sharedClass.ShowSnakBar(message)
                }, 500)

            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    const onSave = async (type) => {



        let message = {

        }
        let req = {

        }
        if ((!taskDetails.childId && type == 'complete') || taskDetails.status == '0') {
            message.message = 'No child accepted this task so it cant be mark as complete'
            message.type = 'success'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (type == 'reward') {
            req.status = '3'
        } else if (type == 'complete') {
            req.status = '2'
        }
        else if (type == 'reject') {
            req.status = '0'
        }

        try {
           
            const result = await updateTask(req, taskDetails._id);
            console.log(result)
            setLoader(false)
            let message = {}
            if (result && result.status == 'success') {
                message.message = 'Task updated'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

  
    let data= monatortTaskList.filter(it=>it.title==taskDetails.taskName)
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

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>
                           
                            <View style={{ marginBottom: 20, }}>
                                <TouchableOpacity style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                    <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, justifyContent: 'center', marginVertical: 10 }]}>
                                    {data.length>0? <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 60 }}>
                                            <Image source={localImages[data[0].image]} style={{ height: 30, width: 30 }} />
                                        </View>:null}
                                        <View style={{ width: width - 40 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{taskDetails.taskName}</Text>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.grayColorLight }]}>{getDate(taskDetails.dueDate)}</Text>
                                        </View>

                                    </View>
                                   
                                </TouchableOpacity>
                            </View>

                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20, paddingBottom: 20 }}>
                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19, color: colors.taskHeading }]}>Task Description</Text>
                                <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 14, color: colors.taskHeading, marginTop: 10 }]}>{taskDetails.taskDescription}</Text>
                            </View>

                            
                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20, paddingBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19, color: colors.taskHeading }]}>Reward</Text><Image source={localImages.money_bag} style={{ height: 50, width: 50 }}></Image>
                                    {taskDetails.monetaryReward ? <Text style={[styles.robotoBoldText, { fontSize: 11, color: colors.subTitleColor, fontSize: 18, marginHorizontal: 10, marginVertical: 10 }]}>${taskDetails.rewardAmount ? taskDetails.rewardAmount.toFixed(2) : ''}</Text> : null}

                                </View>
                                <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 14, color: colors.taskHeading, marginTop: 10 }]}>{taskDetails.reward}</Text>

                            </View>


                            {taskDetails.bonusReward?<View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20,  marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19, color: colors.taskHeading }]}>Bonus</Text><Image source={localImages.financial_advice} style={{ height: 50, width: 50 }}></Image>
                                    {taskDetails.bonusMonetry ? <Text style={[styles.robotoBoldText, { fontSize: 11, color: colors.subTitleColor, fontSize: 18, marginHorizontal: 10, marginVertical: 10 }]}>${taskDetails.bonusAmount && taskDetails.bonusMonetry ? taskDetails.bonusAmount.toFixed(2) : ''}</Text> :
                                        <View>

                                        </View>
                                    }

                                </View>
                                <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 14, color: colors.taskHeading, marginTop: 10,marginBottom:10 }]}>{taskDetails.bonusRewardDesc}</Text>




                            </View>:null}






                            {imageUrls.length > 0 ||videoUrls.length > 0  ?  <View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20,  marginTop: 20 }}> 

                                <View>
                                    {imageUrls.length > 0 ? <View style={{ height: 350, marginBottom: 10, width: width }}>
                                        <Text style={styles.heading}>Image</Text>
                                       
                                        {sppinerImage ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="small" color={colors.white} /></View> : null}

                                        <TouchableOpacity onPress={() => setImagePreviewShow(true)} style={{ height: 300, width: width, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: imageUrls[0] }} style={{ width: width - 40, height: 300, marginRight: 35 }} />


                                        </TouchableOpacity>


                                    </View> :

                                        null

                                    }


                                </View>


                                <View>
                                    {videoUrls.length > 0 ? <View style={{ height: 350, marginBottom: 10, width: width - 40, marginRight: 30 }}>
                                        <Text style={[styles.heading, { marginBottom: 5, marginTop: 30 }]}>Videos</Text>
              

                                        <VideoPlayerUi source={videoUrls[0]} hidefull={true} />



                                    </View> :

                                        null

                                    }


                                </View>

                            
                            </View>:null}

                            {taskDetails.status == '0' ? <View style={{ width: width, alignItems: 'center', marginBottom: 30 }}>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 80}
                                    borderRadius={30}
                                    marginTop={30}
                                    label="Submit"
                                    labelColor={colors.white}
                                    onAction={() => { onSave('complete') }}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={19}
                                ></ButtonWithoutShadow>
                            </View> :
                                <View>
                                    {taskDetails.bonusReward ? <View style={{ marginTop: 20, marginBottom: 20 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', right: 30 }}>
                                            <Text style={[styles.robotoRegularText, { marginHorizontal: 20, fontSize: 21, color: colors.tabGray, marginRight: 40, }]}>Allow Bonus reward</Text>
                                            <InputToggele
                                                status={bonusIsAllow}
                                                onChangeText={(text) => setBonusIsAllow(text)}
                                            />

                                        </View>

                                    </View> : null}
                                    {taskDetails.status != '0' && taskDetails.status != '3' ? <View style={{ marginLeft: 20 }}>

                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.childblue}
                                            width={width - 40}
                                            borderRadius={30}
                                            marginTop={40}
                                            marginBottom={10}
                                            label="Complete & Send Rewards"
                                            labelColor={colors.white}
                                            onAction={() => onReward('reward')}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>
                                    </View> : null}
                                    {taskDetails.status == '1' ? <View style={{ width: width, flexDirection: 'row', justifyContent: 'center' }}>
                                      
                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.red}
                                            width={(width - 40)}
                                            borderRadius={30}
                                            marginTop={10}
                                            marginBottom={100}
                                            label="Reject"
                                            labelColor={colors.white}
                                            onAction={() => onSave('reject')}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>

                                    </View> : null}


                                </View>

                            }
                        </View>

                    </View>

                </ScrollView>
            </View>
            <ImageView
                images={imagesPriview}
                imageIndex={0}
                visible={imagesPriviewShow}
                onRequestClose={() => setImagePreviewShow(false)}
            />
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsParentPage)

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
});