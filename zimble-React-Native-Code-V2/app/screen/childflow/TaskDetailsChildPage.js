// Child will be able to mark the task as completed by providing following details: 
// 	•	Ability to view name of the task 
// 	•	Ability to view the description of the task
// 	•	Due Date
// 	•	Reward monetary amount (Provided if task is completed)
// 	•	Bonus Reward (It can be monetary or non-monetary)
// 	•	Ability to upload the picture of the task completion 
// 	•	Ability to upload the video of the task completion (Optional)
// 	•	Submit: Task will be submitted to the parent and parent will be able to Complete & send Reward or Reject, based on parent selection child will be notified and in case complete and send reward, rewarded amount will be transferred into the child’s account.



import React, { useState, useEffect } from 'react'
import { StatusBar, ActivityIndicator, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faPaperclip, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages, variable } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonDropDown } from '../../components/Button'

import { ScrollView } from 'react-native-gesture-handler';


import Modal, {
    ModalTitle,
    ModalContent,
} from 'react-native-modals';

import {  getTaskDetails, updateTask, createTask, getCategoryList, deleteimagepath } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import { RNCamera } from 'react-native-camera';

import ImageView from "react-native-image-viewing";
import VideoPlayerUi from '../../components/VideoPlayer'
import moment from "moment";
import CountDown from 'react-native-countdown-component';
const { height, width } = Dimensions.get('window');
var camera
var player
var _interval

 
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

const TaskDetailsChildPage = (props) => {
    const sharedClass = new SharedClass();
    const route = useRoute();
    
    
    const [sppiner, setLoader] = useState(false)
    const [sppinerImage, setLoaderImage] = useState(false)
    const [seconds, setSeconds] = useState(60);


    const [isRecording, setIsRecording] = useState(false)
    const [isVideoRecorded, setIsVideoRecorded] = useState(false)
    const [cameraDirection, setCameraDirection] = useState('back')
    const [isRecordingStart, setisRecordingStart] = useState('')
    const [videofilepath, setVideoFilepath] = useState({})
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('')

   
    const [showChild, setShowChild] = useState(false)
    const [showVideoModal, setShowVideoModal] = useState(false)

    const [categoryList, setCategoryList] = useState([])
    const [taskDetails, setTaskDetails] = useState('')
    const [imageUrls, setImageUrls] = useState([])
    const [imageUrlsList, setImageUrlsList] = useState([])
    const [videoUrls, setVideoUrls] = useState([])
    const [videoUrlsList, setVideoUrlsList] = useState([])
    const [imagesPriview, setImagePreview] = useState([])

    const [imagesPriviewShow, setImagePreviewShow] = useState(false)
    const [timerValue, setTimerValue] = useState(0)
   
    const { setLoggedInUserAuthToken } = props;


    const [recordOptions, setRecordOptions] = useState({
        mute: true,
        maxDuration: 60,
    })


    useEffect(() => {
       
        ///  setTaskDetails(route.params.taskDetails)
        onTaskDetails(route.params && route.params.taskDetails._id ? route.params.taskDetails._id : '')

    }, [setLoggedInUserAuthToken])

   

    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }

  


  



   
  
    const onTaskDetails = async (id) => {


        try {
            setLoader(true)
            const result = await getTaskDetails(id);
        
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
                
                setImagePreview(imagesP)

                setVideoUrlsList(video)

                if (result.details.timer > 0) {
                    let caretedDate = new Date(result.details.createdAt).getTime()
                    let consumetime = caretedDate + result.details.timer
                    let currentTime = new Date().getTime()
                    let totalTimeLeft = consumetime - currentTime
                   
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
           
        }
    }

    const onCaptureVideo = () => {
        setShowChild(false)
        setShowVideoModal(true)
    }
    const chooseFile = () => {
        setShowChild(false)
        var options = {
            title: 'Select Image',
           
            quality: .7,
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
                setLoaderImage(true)
                response.data = undefined
                response.name = response.uri.split('/').pop()
                /// let source = response;


                let tempImageUrlList = Object.assign([], imageUrlsList)
               
               
                let data = [response.uri]
                let data2 = [{ uri: response.uri }]
                setImageUrls(data)
                setImagePreview(data2)
                setImageUrlsList(tempImageUrlList)


                let source = response;
             
                const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: source.uri,
                    name: source.name,
                    type: source.type,
                    key: source.key,
                }
           

               
                const options = {
                    keyPrefix: "task/images/",
                    bucket: variable.bucket,
                    region:variable.region,
                    accessKey:variable.accessKey,
                    secretKey:variable.secretKey,
                    successActionStatus: 201
                }
                // console.log(options)

                RNS3.put(file, options).progress((e) => console.log(e.loaded / e.total))
                    .then(response => {
                      
                        setLoaderImage(false)
                        if (response.status !== 201)
                            throw new Error("Failed to upload image to S3");
                      
                        let data3 = [response.body.postResponse.location]
                        let data4 = [{ uri: response.body.postResponse.location }]
                        setImageUrls(data3)
                        setImagePreview(data4)

                    });
                
            }
        });
    };
 
    const takeVideo = async () => {
     
        if (camera) {
            try {
                setisRecordingStart(true)
                const promise = camera.recordAsync(recordOptions);

                if (promise) {
                    //   this.setState({ isRecording: true });
                    setIsRecording(true)
                    // countdown()
                    var data = await promise;
                    data.name = data.uri.split('/').pop()
                    data.type = "video/mp4"
                    

                    setisRecordingStart(false)
                    setIsRecording(false)
                    
                    setIsVideoRecorded(true)
                    setVideoFilepath(data)
                    
             
                    
                    setTimeout(() => {
                        setSelectedVideoUrl(data.uri)
                    }, 1000)

                }
            } catch (e) {
                console.error(e);
            }
        }
    };
    const rotateCamera = () => {
        setCameraDirection(cameraDirection == 'front' ? 'back' : 'front')
    }
    const stopVideo = async function () {
        //debugger

        setIsRecording(false)
        clearInterval(_interval);
        camera.stopRecording();

    }
    const resetVideo = () => {
        setIsRecording(false)
        setIsVideoRecorded(false)
        setisRecordingStart(false)
        setSelectedVideoUrl('')
    }

    const onSave = async (type) => {


        let imageUrlsLocal = []

        for (let index = 0; index < imageUrlsList.length; index++) {
            imageUrlsLocal.push(imageUrlsList[index].uri)

        }
        let message = {}
        let req = {
            imageUrls: imageUrls,
            videoUrls: videoUrls,
        }

        if (taskDetails.timer > 0 && timerValue < 1) {
            message.message = 'Unable to do task within time so you can not save this task'
            message.type = 'info'
            sharedClass.ShowSnakBar(message)
            return
        }
        // if (imageUrls.length == 0) {
        //     message.message = 'Please select Image'
        //     message.type = 'info'
        //     sharedClass.ShowSnakBar(message)
        //     return
        // }

        if (type == 'save') {

        } else if (type == 'complete') {
            req.status = '1'
        }

        try {
           
            const result = await updateTask(req, taskDetails._id);
            
            setLoader(false)

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
        }
    }

 

    const removeImgeserverAswell = async (path) => {
        try {
           
            const result = await deleteimagepath({ url: path });
     
           
        } catch (error) {
            setLoader(false)
        }

    }
    const removeImage = (path) => {
        removeImgeserverAswell(path)
        setImageUrls([])
        setImageUrlsList([])
        setImagePreview([])
    }
    const removeVideo = () => {
        setVideoUrls([])
        setVideoUrlsList([])
    }
    const closedPopUp = () => {
       
        setIsRecording(false)
        setIsVideoRecorded(false)
        setShowVideoModal(false)
    }
    const submitVideo = () => {
        let source = videofilepath;
        setLoader(true)
       
        const file = {
            
            uri: source.uri,
            name: source.name,
            type: source.type,
        }
       
        const options = {
            keyPrefix: "task/video/",
            bucket: variable.bucket,
            region:variable.region,
            accessKey:variable.accessKey,
            secretKey:variable.secretKey,
            successActionStatus: 201
        }

        RNS3.put(file, options).progress((e) => console.log(e.loaded / e.total))
            .then(response => {
                if (response.status !== 201)
                    throw new Error("Failed to upload image to S3");
                

                let imageUrlLocal = []

                imageUrlLocal.push(response.body.postResponse.location)
                setVideoUrls(imageUrlLocal)
               
                setIsRecording(false)
                setIsVideoRecorded(false)
                setVideoFilepath()
                setShowVideoModal(false)
                setLoader(false)
              
            });
    }

    let data = monatortTaskList.filter(it => it.title == taskDetails.taskName)
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
                                        {data.length>0?<View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 20 }}>
                                            <Image source={localImages[data[0].image]} style={{ height: 40, width: 40, }} />
                                        </View>:null}
                                        <View style={{ width: width - 120 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{taskDetails.taskName}</Text>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.grayColorLight }]}>{getDate(taskDetails.dueDate)}</Text>
                                        </View>

                                    </View>
                                   
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20, paddingBottom: 20 }}>
                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.taskHeading }]}>Task Description</Text>
                                <Text style={[styles.robotoRegularText, { marginLeft: 20, fontSize: 12, color: colors.taskHeading, marginTop: 10 }]}>{taskDetails.taskDescription}</Text>
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
                            <View style={{ borderBottomWidth: .5, borderBottomColor: colors.taskHeading, width: width - 40, marginLeft: 20, paddingBottom: 20, marginTop: 20 }}>
                       


                                <View>
                                    {imageUrls.length > 0 ? <View style={{ height: 350, marginBottom: 10, width: width }}>
                                        <Text style={styles.heading}>Image</Text>
                                        {taskDetails.status == 0 ? <TouchableOpacity onPress={() => { removeImage(imageUrls[0]) }} style={{ position: 'absolute', left: width - 60, bottom: 0, top: 40, height: 30, width: 30, backgroundColor: colors.red, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                                            <FontAwesomeIcon style={{}} icon={faTimes} color={colors.white} size={20} />
                                        </TouchableOpacity > : null}
                                        {sppinerImage ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="small" color={colors.white} /></View> : null}

                                        <TouchableOpacity onPress={() => setImagePreviewShow(true)} style={{ height: 300, width: width, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: imageUrls[0] }} style={{ width: width - 40, height: 300, marginRight: 35 }} />


                                        </TouchableOpacity>


                                    </View> :

                                        <View>

                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 20 }]}>Image</Text>
                                            <TouchableOpacity onPress={() => chooseFile()} style={[styles.card, styles.button, { width: width - 150, borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row', marginTop: 5 }]}>
                                                <FontAwesomeIcon style={{}} icon={faPaperclip} color={colors.placeHolderColor} size={25} />
                                                <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>Upload Image</Text>
                                            </TouchableOpacity>
                                        </View>

                                    }


                                </View>


                                <View>
                                    {videoUrls.length > 0 ? <View style={{ height: 350, marginBottom: 10, width: width - 40, marginRight: 30 }}>
                                        <Text style={[styles.heading, { marginBottom: 5, marginTop: 30 }]}>Videos</Text>
                                        {taskDetails.status == 0 ? <TouchableOpacity onPress={() => { removeVideo() }} style={{ position: 'absolute', left: width - 70, bottom: 0, top: 50, height: 30, width: 30, backgroundColor: colors.red, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                                            <FontAwesomeIcon style={{}} icon={faTimes} color={colors.white} size={20} />
                                        </TouchableOpacity > : null}
                                        

                                        <VideoPlayerUi source={videoUrls[0]} hidefull={true} />



                                    </View> :

                                        <View>

                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 20 }]}>Video(Optional)</Text>
                                            <TouchableOpacity onPress={() => onCaptureVideo()} style={[styles.card, styles.button, { width: width - 150, borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row', marginTop: 5 }]}>
                                                <FontAwesomeIcon style={{}} icon={faPaperclip} color={colors.placeHolderColor} size={25} />
                                                <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>Upload Video</Text>
                                            </TouchableOpacity>
                                        </View>

                                    }


                                </View>

                                
                            </View>

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
                            </View> : null}
                        </View>

                    </View>

                </ScrollView>
                <Modal
                    visible={showVideoModal}
                    onTouchOutside={() => { setShowVideoModal(false) }}
                    onHardwareBackPress={() => {
                        setShowVideoModal(false)
                        return true

                    }}
                    height={1}
                    width={1}
                    onSwipeOut={() => { }}
                    modalTitle={
                        <ModalTitle
                            title="Camera"
                            hasTitleBar
                        />
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        {!isVideoRecorded ? <View style={{ backgroundColor: '#FFF', }}>
                            <View style={{}}>
                                <RNCamera

                                    ref={ref => {
                                        camera = ref;
                                    }}
                                    style={{
                                        //flex: 1,
                                        // justifyContent: 'center',
                                        alignItems: 'center',
                                        height: height - 100,
                                        display: isVideoRecorded ? 'none' : 'flex'
                                        // marginBottom: 40

                                    }}
                                    type={cameraDirection}
                                    androidCameraPermissionOptions={{
                                        title: 'Permission to use camera',
                                        message: 'We need your permission to use your camera',
                                        buttonPositive: 'Ok',
                                        buttonNegative: 'Cancel',
                                    }}
                                    androidRecordAudioPermissionOptions={{
                                        title: 'Permission to use audio recording',
                                        message: 'We need your permission to use your audio',
                                        buttonPositive: 'Ok',
                                        buttonNegative: 'Cancel',
                                    }}

                                >

                                </RNCamera>
                            </View>

                            {!isRecordingStart && <TouchableOpacity onPress={() => { closedPopUp() }} style={{ position: 'absolute', left: width - 70, bottom: 0, top: 10, height: 40, width: 40, backgroundColor: colors.red, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesomeIcon style={{}} icon={faTimes} color={colors.white} size={30} />
                            </TouchableOpacity >}
                            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

                                {isRecording && <CountDown
                                    size={10}
                                    until={seconds}
                                    onFinish={() => { }}
                                    digitStyle={{ backgroundColor: 'transaparent', borderWidth: 0, borderColor: '#1CC625' }}
                                    digitTxtStyle={{ color: '#fff' }}
                                    timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                                    separatorStyle={{ color: '#fff' }}
                                    timeToShow={['H', 'M', 'S']}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />}
                                {isRecording ? (
                                    <ButtonWithoutShadow
                                        height={50}
                                        backgroundColor={colors.red}
                                        width={100}
                                        borderRadius={30}
                                        marginTop={0}
                                        marginBottom={10}
                                        label="STOP"
                                        labelColor={colors.white}
                                        onAction={() => stopVideo()}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>


                                ) : (
                                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>

                                            <ButtonWithoutShadow
                                                height={50}
                                                backgroundColor={colors.red}
                                                width={100}
                                                borderRadius={30}
                                                marginTop={0}
                                                marginBottom={10}
                                                label="REC"
                                                labelColor={colors.white}
                                                onAction={() => takeVideo()}
                                                fontFamily={fonts.robotoRegular}
                                                fontSize={19}
                                            ></ButtonWithoutShadow>
                                            <View style={{ width: 20 }}></View>
                                            <TouchableOpacity
                                                style={

                                                    {
                                                        height: 50,
                                                        backgroundColor: colors.red,
                                                        borderRadius: 30,
                                                        width: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',

                                                    }
                                                }

                                                onPress={() => rotateCamera()}
                                            >
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={localImages.rotate}
                                                />
                                               
                                            </TouchableOpacity>
                                        </View>
                                    )}
                            </View>

                        </View> :
                            <View style={{ height: height - 50, width: width, marginLeft: -20 }}>

                                <View style={{ height: height, justifyContent: 'center', alignItems: 'center' }}>
                                   
                                    <VideoPlayerUi source={selectedVideoUrl} hidefull={true} />
                                </View>
                                <TouchableOpacity onPress={() => { closedPopUp() }} style={{ position: 'absolute', left: width - 70, bottom: 0, top: 10, height: 40, width: 40, backgroundColor: colors.red, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesomeIcon style={{}} icon={faTimes} color={colors.white} size={30} />
                                </TouchableOpacity >
                                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>


                                    <ButtonWithoutShadow
                                        height={50}
                                        backgroundColor={colors.red}
                                        width={100}
                                        borderRadius={30}
                                        marginTop={40}
                                        marginBottom={10}
                                        label="Retake"
                                        labelColor={colors.white}
                                        onAction={() => resetVideo()}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>
                                    <View style={{ width: 20 }}></View>
                                    <ButtonWithoutShadow
                                        height={50}
                                        backgroundColor={colors.red}
                                        width={100}
                                        borderRadius={30}
                                        marginTop={40}
                                        marginBottom={10}
                                        label="Submit"
                                        labelColor={colors.white}
                                        onAction={() => submitVideo()}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>


                                </View>
                            </View>}
                    </ModalContent>
                </Modal>

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
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsChildPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        
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
    image: {
        opacity: .6,
        height: 250,
        width: width,
        position: 'absolute', 
        bottom: 0, 
        marginLeft: width * 1.5, 
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
       
        borderRadius: 8

    },
    button: {

        paddingHorizontal: 15,
       
        alignItems: 'center'
    },


});