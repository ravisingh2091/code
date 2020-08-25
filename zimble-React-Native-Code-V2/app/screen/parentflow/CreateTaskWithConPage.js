// User will be able to create the new task by providing following details: 
// 	•	Select Monetary Reward or not Monetary reward (By using toggle button)
// 	•	Assigned to (User will be able to select the name of the child from the drop down or able to select all user’s as well)
// 	•	Task Name 
// 	•	Task Description 
// 	•	Frequency (One-off | Daily | Weekly | Monthly)
// 	•	Date Due 
// 	•	Confirm and save: Task will be saved, and it will be assigned to a user or to all users as per the selection at the time of assignment of a task.

// Note: Task will be created, and notification will be shared to the specified child or all children in case user assigned the task to all. 

// In case task is assigned to all children, the children accept the task will be responsible for completion of task rest will receive the notification task is already assigned to someone else.

import React, { useState, useEffect } from 'react'
import { StatusBar, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, NativeModules } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ButtonDropDown, ButtonCalender } from '../../components/Button'
import InputBox, { InputBoxmultiline, InputToggele } from '../../components/InputBox'
import { ScrollView } from 'react-native-gesture-handler';

import RadioForm from 'react-native-simple-radio-button';
import moment from "moment"

import Modal from 'react-native-modal';

import {  getChildList, createTask, getCategoryList,acceptEvent } from '../../api';

import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'
var { height, width } = Dimensions.get('window');

var radio_props = [
    { label: 'No', value: 0 },
    { label: 'Daily', value: 1 },
    { label: 'Weekly', value: 2 },
    { label: 'Monthly', value: 3 }
];


const CreateTaskWithConPage = (props) => {
    const route = useRoute();
    const sharedClass = new SharedClass();
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDueDate, setTaskDueDate] = useState('')
    const [taskRepeat, setTaskRepeat] = useState(0)
    const [selectedDate, setSelectedDate] = useState('')
    const [days, setDays]= useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedChild, setSelectedChild] = useState([])
 

    const [hoursList, setHoursList] = useState([])
    const [minList, setMinList] = useState([])
    const [secList, setSecList] = useState([])
    
    const [sppiner, setLoader] = useState(false)
    const [eventIds, setEventIds] = useState('')
    const [notificationIds, setNotificationIds] = useState('')
    const [childId, setChildId]= useState('')

    const [selectedChildLabel, setSelectedChildLabel] = useState('Select Child')
    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('Select Category')
    const [showChild, setShowChild] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const [categoryList, setCategoryList] = useState(.5)
    const [childList, setChildList] = useState(
    )
    const { setLoggedInUserAuthToken } = props;
    useEffect(() => {
        onLogin()
        getAllChildList()
        getAllCategoryList()
       
        setEventIds(route.params.eventId)
        setNotificationIds(route.params.notificationId)
        setChildId(route.params.childId)
    }, [setLoggedInUserAuthToken])
  

    const handleBackButtonClick = () => {
       
        if (showChild) {
            setShowChild(false)
            return true;

        }

    }
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

    const onAccept = async () => {
        let req = {
            eventId: eventIds,
            acceptStatus: '2',
        }

        try {
            setLoader(true)
            const result = await acceptEvent(req);
           
            setLoader(false)

           
            if (result && result.status == 'success') {
             
                if (notificationIds) {
                    onReadNotification()
                }else{
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
    const onSignup = async () => {


        let message = {}
        if (!selectedCategory) {
            message.message = 'Please select any category'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }


        if (!taskName) {
            message.message = 'Please enter task name'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!taskDescription) {
            message.message = 'Please enter task description'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

       
   


        if (!taskDueDate) {
            message.message = 'Please enter due date '
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }


        
        let req = {
            taskName: taskName,
            taskDescription: taskDescription,
            dueDate:taskDueDate,
            dueDays:days,
            repeat:taskRepeat,
            category: selectedCategory,
            childArray: [childId],
            eventId:eventIds,
            notificationId:notificationIds,
      }

        try {
            setLoader(true)
            const result = await createTask(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                message.message = 'Task created'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                if(eventIds){
                    onAccept()
                 }else{
                    props.navigation.goBack()
                 }
               

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

       
    }
    const onReturn = () => {
        props.navigation.goBack()
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = date => {
        hideDatePicker();
        console.log('A date has been picked: ', new Date(date).toISOString());
        var data = new Date(date).toISOString()
        var dateLocal = moment(date).format('YYYY-MM-DD')
        var time = dateLocal[0].split(':')
        setTaskDueDate(dateLocal)
        setSelectedDate(date)
        let days = moment(date).diff(moment(), 'days')+1
        console.log(days)

       
        if (taskRepeat == 0) {
            setDays(days)

        }
        else if (taskRepeat == 1) {
            setDays(1)

        } else if (taskRepeat == 2) {
            setDays(7)

        }
        else if (taskRepeat == 3) {
            setDays(30)

        }
        


        
        console.log(dateLocal)

    };

    const getMaxDate = () => {
        if (taskRepeat == 0) {
            return null

        }
        else if (taskRepeat == 1) {
            return new Date()

        } else if (taskRepeat == 2) {
            var d = new Date();
            d.setDate(d.getDate() + 7);
            return new Date(d)

        }
        else if (taskRepeat == 3) {
            var d = new Date();
            d.setDate(d.getDate() + 30);
            return new Date(d)

        }
    }
    const onSelectChild = (item) => {
       
        console.log(item._id)
        var selectedChildloacal = []
        if (item == 'All') {
            for (let index = 0; index < childList.length; index++) {
                selectedChildloacal.push(childList[index]._id)

            }
            setSelectedChildLabel('All')
        } else {
            selectedChildloacal.push(item._id)
            setSelectedChildLabel(item.firstName)
        }
      
        setSelectedChild(selectedChildloacal)
        console.log(selectedChildloacal)
        setShowChild(false)
    }
    const onShowModal = () => {
        setShowChild(true)
    }


    const onShowCategoryModal = () => {
        setShowCategory(true)
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
    const getSelectedChild = async () => {

        if (selectedChild.length > 1) {
            return 'All'

        } else {
            var id = selectedChild[0]
            var data = childList.filter(it => it.id == id)

            return data[0].firstName + data[0].lastName

        }


    }
    const getAllChildList = async () => {


        try {
            
            const result = await getChildList();
            console.log(result)
           
            if (result && result.status == 'success') {
                setChildList(result.details)
                if (result.details.length > 0) {

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


    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ marginBottom: 0, paddingBottom: 90 }}
                    contentContainerStyle={styles.scrollview}
               
                >
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>

                        <View style={{ marginTop: 5 }}>

                            <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                <Image source={localImages.payment} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 19, color: colors.subTitleColor }]}>Create task</Text>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={[styles.cardfirst], { position: 'absolute', right: 20, backgroundColor: colors.childblue, height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesomeIcon style={{}} icon={faTimes} color={colors.white} size={40} />
                                </TouchableOpacity>

                            </View>
                            <View style={{ marginLeft: 20 }}>
                               

                                <ButtonDropDown
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={10}
                                    marginTop={25}
                                    marginBottom={10}
                                    label="Select Category"
                                    labelColor={colors.labelColor}
                                    palceholder={selectedCategoryLabel}
                                    palceholderColor={selectedCategory ? colors.placeHolderColor : colors.placeHolderColor}
                                    onAction={onShowCategoryModal}
                                    fontFamily={fonts.robotoMedium}
                                    fontSize={13}
                                    marginLeftText={20}
                                    marginRightText={0}
                                ></ButtonDropDown>
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="New Task name"
                                    label="Task name"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}
                                    
                                    editable={true}
                                    value={taskName}
                                    maxLength={400}
                                    onChangeText={(text) => setTaskName(text)}
                                ></InputBox>
                                <InputBoxmultiline
                                    height={100}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="Description of task"
                                    label="Task description"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    
                                    multiline={true}
                                    editable={true}
                                    value={taskDescription}
                                    maxLength={400}
                                    onChangeText={(text) => setTaskDescription(text)}
                                ></InputBoxmultiline>
                                <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 20 }]}>Repeat</Text>
                                <RadioForm
                                    radio_props={radio_props}
                                    initial={0}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    buttonColor={colors.childblue}
                                    animation={false}
                                    buttonStyle={{ marginRightText: 10 }}
                                    labelStyle={{ marginRight: 10 }}
                                    selectedButtonColor={colors.childblue}
                                    onPress={(value) => { setTaskRepeat(value), setSelectedDate(''), setTaskDueDate('') }}
                                />
                                <ButtonCalender
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={8}
                                    marginTop={20}
                                    marginBottom={20}
                                    labelColor={colors.labelColor}
                                    label="Date Due"
                                    palceholder={taskDueDate ? taskDueDate : 'Due Date'}
                                    palceholderColor={colors.dropDownPlace}
                                    onAction={showDatePicker}
                                    fontFamily={fonts.robotoMedium}
                                    fontSize={13}
                                    marginLeftText={20}
                                    marginRightText={0}
                                    hideDatePicker={hideDatePicker}
                                    showDatePicker={showDatePicker}
                                    handleConfirm={handleConfirm}
                                    isDatePickerVisible={isDatePickerVisible}
                                    minDate={new Date()}
                                    maxDate={getMaxDate()}
                                    selectedDate={selectedDate}
                                ></ButtonCalender>
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 60}
                                        borderRadius={30}
                                        marginTop={20}
                                        label="Confirm and Save"
                                        labelColor={colors.white}
                                        onAction={() => { onSignup()}}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={15}
                                    ></ButtonWithoutShadow>
                                </View>
                            </View>


                        </View>

                    </View>

                </ScrollView>
                <Modal
                    isVisible={showChild}
                    style={styles.bottomModal}
                    onBackdropPress={() => setShowChild(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={{ width: width, borderBottomWidth: 1, borderBottomColor: colors.grayColor }}>
                            <View style={{ height: 40, width: width, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { setShowChild(false) }} style={{ height: 40, width: width, backgroundColor: colors.inputBoxBackground, borderRadius: 20, alignItems: 'center', marginRight: 20, marginBottom: 10, flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 19, marginLeft: 20 }}>Select a child</Text>
                                    <FontAwesomeIcon style={{ position: 'absolute', right: 20 }} icon={faCaretUp} color={colors.dropDownPlace} size={20} />
                                </TouchableOpacity >
                            </View>
                        </View>
                        <FlatList


                            ItemSeparatorComponent={() => (
                                <View style={{ marginLeft: 70 }} />
                            )}

                            data={childList}
                            renderItem={({ item, index }) =>
                                <ScrollView>

                                    {index == 0 && childList.length > 1 &&
                                        <TouchableOpacity style={[styles.innerBox, { backgroundColor: selectedChild.length > 1 ? colors.blueLightColor : '#f6f8f9', height: 50, justifyContent: 'center' }]} onPress={() => onSelectChild('All')}>

                                            <View style={[styles.rightBox, { flexDirection: 'row', alignItems: 'center', }]}>
                                                <View>
                                                    <Text style={{ color: colors.placeHolderColor, fontSize: 13.6, fontFamily: fonts.robotoRegular, marginLeft: 10 }}>All</Text>

                                                </View>

                                            </View>
                                        </TouchableOpacity>

                                    }
                                    <TouchableOpacity style={[styles.innerBox, { backgroundColor: selectedChild.indexOf(item._id) != -1 ? colors.blueLightColor : '#f6f8f9', height: 50, justifyContent: 'center' }]} onPress={() => onSelectChild(item)}>
                                        
                                        <View style={[styles.rightBox, { flexDirection: 'row', alignItems: 'center', }]}>
                                            <View>
                                                <Text style={{ color: colors.placeHolderColor, fontSize: 13.6, fontFamily: fonts.robotoRegular, marginLeft: 10 }}>{item.firstName}</Text>

                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                            }
                            keyExtractor={item => item._id}
                        />

                    </View>
                </Modal>

                <Modal
                    isVisible={showCategory}
                    style={styles.bottomModal}
                    onBackdropPress={() => setShowCategory(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={{ width: width, borderBottomWidth: 1, borderBottomColor: colors.grayColor }}>
                            <View style={{ height: 40, width: width, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { setShowCategory(false) }} style={{ height: 40, width: width, backgroundColor: colors.inputBoxBackground, borderRadius: 20, alignItems: 'center', marginRight: 20, marginBottom: 10, flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: fonts.robotoRegular, color: colors.placeHolderColor, fontSize: 19, marginLeft: 20 }}>Select a category</Text>
                                    <FontAwesomeIcon style={{ position: 'absolute', right: 20 }} icon={faCaretUp} color={colors.dropDownPlace} size={20} />
                                </TouchableOpacity >
                            </View>
                        </View>
                        <FlatList


                            ItemSeparatorComponent={() => (
                                <View style={{ marginLeft: 70 }} />
                            )}

                            data={categoryList}
                            renderItem={({ item, index }) =>
                                <ScrollView>
                                    <TouchableOpacity style={[styles.innerBox, { backgroundColor: selectedCategory.indexOf(item._id) != -1 ? colors.blueLightColor : '#f6f8f9', height: 50, justifyContent: 'center' }]} onPress={() => { setSelectedCategory(item._id), setShowCategory(false), setSelectedCategoryLabel(item.name) }}>

                                        <View style={[styles.rightBox, { flexDirection: 'row', alignItems: 'center', }]}>
                                            <View>
                                                <Text style={{ color: colors.placeHolderColor, fontSize: 13.6, fontFamily: fonts.robotoRegular, marginLeft: 10 }}>{item.name}</Text>

                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                            }
                            keyExtractor={item => item._id}
                        />

                    </View>
                </Modal>


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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskWithConPage)

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
    container: {
        
        alignItems: 'center',
        width: width,
        
        overflow: 'hidden', 
        height: 250,
    },
    image: {
        opacity: .6,
        height: 250, // same width and height for the container
        width: width,
        position: 'absolute', // position it in circle
        bottom: 0, // position it in circle
        marginLeft: width * 1.5, // center it in main view same value as marginLeft for circle but positive
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
        
    },
    modalContent: {
        backgroundColor: '#f6f8f9',
        paddingTop: 22,
        justifyContent: "center",
       
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: height * .75,
        minHeight: 300,
    },


});