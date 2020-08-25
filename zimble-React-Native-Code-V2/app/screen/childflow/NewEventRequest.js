// Child will be able to create the event by providing details: 
// 	•	Enter Name of the Event 
// 	•	Enter Description of the Event 
// 	•	Select Location of the Event 
// 	•	Select Date & Time of the Event 
// 	•	Request for permission

// Note: User Request will be submitted on the platform which will goes to his parent, parent or admin will be able to accept | Accept with conditions | Reject. 

// If parent accept the event request, then it will starts appearing on the upcoming events.

// If parent accept with condition the event request then parent will assign a task to the child, if child will be able completed the task then only, he will be rewarded as the acceptance over the event request.
// The task will be appearing in the non-monetary task and child will be able to submit the photo & video similarly to the normal task.

import React, { useState, useEffect } from 'react'
import { StatusBar, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretDown,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonDropDown } from '../../components/Button'
import InputBox from '../../components/InputBox'
import { ScrollView } from 'react-native-gesture-handler';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from "moment"

import {  createEvent } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'



const { height, width } = Dimensions.get('window');
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const NewEventRequest = (props) => {
    const sharedClass = new SharedClass();


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
 
    const [eventName, setEventName] = useState('')
    const [eventLocation, setEventLocation] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventTimeDate, setEventTimeDate]= useState('')
    const [eventDate, setEventDate]= useState('')

    const [showChild, setShowChild] = useState(false)
    
   
 
    const [sppiner, setLoader] = useState(false)
    const [selectedDay, setSelectedDay] = useState()
 
    const [selectedHours, setSelectedHourse] = useState('H')
    const [selectedMin, setSelectedMin] = useState('M')
    const [selectedAMPM, setSelectedAMPM] = useState('AM')
    const [dateForCompare, setDateCompare] = useState(new Date())
    const [timeSelcted, settimeSelcted] = useState(new Date())
    const [dateSelcted, setdateSelcted] = useState(new Date())

  
    const { setLoggedInUserAuthToken } = props;
    useEffect(() => {
     
    
    }, [setLoggedInUserAuthToken])

  

    const onSignup = async () => {
        let message = {}
        if (!eventName) {
            message.message = 'Please enter event name'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!eventDescription) {
            message.message = 'Please enter event description'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!eventLocation) {
            message.message = 'Please enter event location'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        
        if (!eventTimeDate) {
            message.message = 'Please select time of event'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        
        if (!eventDate) {
            message.message = 'Please select date of event'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        
    
         let time=''

       
         if(selectedAMPM=='AM'){
            time=selectedHours+':'+selectedMin+':'+'00'
         }else{
             if(selectedHours==12 || selectedHours=='12'){
                time=selectedHours+':'+selectedMin+':'+'00'
             }else{
                time=12+parseInt(selectedHours)+':'+selectedMin+':'+'00'
             }
         }
        let req = {
            eventName: eventName,
            eventDescription: eventDescription,
            location: eventLocation,
            eventTimeDate: eventTimeDate,
            date:eventDate,
            time:time,
            locationLatLong:{
                "type":"Point",
                "coordinates":[0,0]
            }
        }

        try { 
            setLoader(true)
            const result = await createEvent(req);
          
            setLoader(false)
            if (result && result.status == 'success') {
                

                setTimeout(() => {
                    message.message = 'Request sent successfully'
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
            setTimeout(() => {
                let message={}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
            
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
        setdateSelcted(date)
        setDateCompare(new Date(date))
        setSelectedDay(new Date(date).getDate())
        setEventDate(moment(date).format('DD-MM-YYYY'))

        
    };

  const onSelectedDay=(value)=>{
      
      setSelectedDay(getDate(value))
      var date = new Date(dateForCompare)
      date.setDate(date.getDate() + value)

  
      setEventDate(moment(date).format('DD-MM-YYYY'))
  }

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const getMonth = (value) => {
    
        var date = new Date(dateForCompare)
        date.setDate(date.getDate() + value)
      
        var n = monthList[date.getMonth()];
        return n

    }

    const getDate = (value) => {
        var date = new Date(dateForCompare)
        date.setDate(date.getDate() + value)

        var n = date.getDate();
        return n

    }

    const handleConfirmTime = date => {
        hideTimePicker();
   
        
        var data = new Date(date).getTime()
      
        var dateLocal = moment(date).format('LT').split(' ')
        var time = dateLocal[0].split(':')
     

        if(!eventDate){
           
            let message={}
            message.message = 'Please select date first'
            message.type = 'info'
            sharedClass.ShowSnakBar(message)
            return
        }

        if(eventDate==moment(date).format('DD-MM-YYYY')){
             let currentTime=new Date().getTime()
             if(data>currentTime){
                setEventTimeDate(data)
                setSelectedHourse(time[0])
                setSelectedMin(time[1])
                setSelectedAMPM(dateLocal[1])

             }else{
                let message={}
                message.message = 'Please select future time'
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
                setEventTimeDate('') 
                setSelectedHourse('H')
                setSelectedMin('M')
                setSelectedAMPM('AM')
                
               

                ///props.navigation.goBack()
             }
        }else{
          
            setEventTimeDate(data)
            setSelectedHourse(time[0])
            setSelectedMin(time[1])
            setSelectedAMPM(dateLocal[1])
        }
       
       
        hideTimePicker();
    
    };
    const onSelectChild = (item) => {
        setSelectedChild(item)
        setShowChild(false)
    }
    const onShowModal = () => {
        setShowChild(true)
    }

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
                        <View style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row' , justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center',width:120 , flexDirection:'row',justifyContent:'center' }}>
                                <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                            </TouchableOpacity>
                            <View style={{ width: width - 240, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.robotoRegularText, { fontSize: 20, marginTop: 0 ,color: colors.childblue}]}></Text>
                            </View>
                            <View style={{ width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                
                               
                            </View>
                        </View>
                       
                        <View style={{ alignItems: 'center' , marginBottom:150}}>



                            <Text style={styles.heading}>New Event</Text>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBoxBackground}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={30}
                                placeholder="Event Name"
                                placeholderColor={colors.placeHolderColor}
                                label="Name"
                                labelColor={colors.labelColor}
                                secureTextEntry={false}
                                editable={true}
                                value={eventName}
                                onChangeText={(text) => setEventName(text)}
                            ></InputBox>
                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBoxBackground}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={20}
                                label="Description"
                                labelColor={colors.labelColor}
                                placeholder="Description"
                                placeholderColor={colors.placeHolderColor}
                                secureTextEntry={false}
                                editable={true}
                                value={eventDescription}
                                onChangeText={(text) => setEventDescription(text)}
                            ></InputBox>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBoxBackground}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={20}
                                placeholder="Location"
                                
                                placeholderColor={colors.placeHolderColor}
                                label="Location"
                                labelColor={colors.labelColor}
                                secureTextEntry={false}
                                editable={true}
                                value={eventLocation}
                                onChangeText={(text) => setEventLocation(text)}
                            ></InputBox>

                            <View style={styles.card}>
                                <TouchableOpacity onPress={() => showDatePicker()} style={{ position: 'absolute', right: 10, top: 20 }}>
                                    <Image

                                        source={localImages.calendar_blue}
                                        style={{ height: 30, width: 30 }}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.robotoBoldText,{color:colors.titleText,fontSize:15, marginTop:10}]}>Time and Date of Event</Text>
                                <View style={{ width: width - 120, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => onSelectedDay(0)} style={selectedDay == getDate(0) ? styles.cardDateSelected : styles.cardDate}>
                                        <Text style={styles.dayText}>{getMonth(0)}</Text>
                                        <Text style={styles.dayTextNumber}>{getDate(0)}</Text>
                                        {selectedDay == getDate(0) ? <View style={styles.cricle}></View> : null}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onSelectedDay(1)} style={selectedDay == getDate(1) ? styles.cardDateSelected : styles.cardDate}>
                                        <Text style={styles.dayText}>{getMonth(1)}</Text>
                                        <Text style={styles.dayTextNumber}>{getDate(1)}</Text>
                                        {selectedDay == getDate(1) ? <View style={styles.cricle}></View> : null}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onSelectedDay(2)} style={selectedDay == getDate(2) ? styles.cardDateSelected : styles.cardDate}>
                                        <Text style={styles.dayText}>{getMonth(2)}</Text>
                                        <Text style={styles.dayTextNumber}>{getDate(2)}</Text>
                                        {selectedDay == getDate(2) ? <View style={styles.cricle}></View> : null}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardTime}>
                                    <TouchableOpacity onPress={() => showTimePicker()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: colors.inputBoxBackground, borderRadius: 15, marginHorizontal: 5 , width:40, height:40, justifyContent:'center', alignItems:'center'}}><Text style={styles.headingTime}>{selectedHours}</Text></View>
                                        <Text style={styles.headingColon}>:</Text>
                                        <View style={{ backgroundColor: colors.inputBoxBackground, borderRadius: 15, marginHorizontal: 5 , width:40, height:40, justifyContent:'center', alignItems:'center'}}><Text style={styles.headingTime}>{selectedMin}</Text></View>
                                        <Text style={styles.headingColon}>:</Text>
                                        <View style={{ backgroundColor: colors.inputBoxBackground, borderRadius: 15, marginHorizontal: 5 , width:40, height:40, justifyContent:'center', alignItems:'center'}}><Text style={styles.headingTime}>{selectedAMPM}</Text></View>
                                    </TouchableOpacity>
                                   

                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        minDate={new Date()}
                                        date={dateSelcted?dateSelcted: new Date()
                                        }
                                    />
                                </View>
                                <View style={{marginBottom:10}}>
                                    {/* {selectedDay?<Text style={styles.selectedDateText}>{selectedDay}{selectedDay == 1 ? 'st' : selectedDay == 2 ? 'nd' : selectedDay == 3?'rd':'th'} day of  month, at {selectedHours}:{selectedMin}{selectedAMPM}</Text>:null} */}
                                </View>
                            </View>
                            <ButtonWithoutShadow
                                height={60}
                                backgroundColor={colors.childblue}
                                width={width - 94}
                                borderRadius={30}
                                marginTop={40}
                                marginBottom={100}
                                label="Request for Permission"
                                labelColor={colors.white}
                                onAction={onSignup}
                                fontFamily={fonts.robotoRegular}
                                fontSize={19}
                            ></ButtonWithoutShadow>
                        </View>

                    </View>
                    <DateTimePickerModal
                                        isVisible={isTimePickerVisible}
                                        mode="time"
                                        onConfirm={handleConfirmTime}
                                        onCancel={hideTimePicker}
                                      
                                        date={timeSelcted?timeSelcted: new Date()
                                        }
                                    />
                </ScrollView>


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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewEventRequest)

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
  
    
    card: {
        // height: 189,
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    cardTime: {
        height: 60,
        width: width - 120,
        //marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    
    cardDate: {
        height: 160,
        width: (width - 160) / 3,
        marginRight: 20,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    cardDateSelected: {
        height: 160,
        width: (width - 160) / 3,
        marginRight: 20,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.greenText1,
        marginTop: 30
    },
    cricle: {
        height: 11,
        width: 11,
        borderRadius: 5.5,
        backgroundColor: colors.greenText1
    },
    dayText: {
        color: colors.dayText,
        fontSize: 13,
        fontFamily: fonts.robotoMedium
    },
    dayTextNumber: {
        color: colors.titleText,
        fontSize: 20,
        fontFamily: fonts.robotoMedium,
        marginVertical: 20
    },
})


