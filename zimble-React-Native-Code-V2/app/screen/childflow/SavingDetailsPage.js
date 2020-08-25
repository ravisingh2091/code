// Child will be able to view following details on the goals planning screen: 
// 	•	Name of the Wishlist item
// 	•	Picture of the image upload by the child 
// 	•	Amount needed to purchase the item
// 	•	Saved amount 
// 	•	Child will be able to enter the amount he wants to save.

// Note: The amount entered by the child to save on the platform will be on hold which means that child will not be able to use that amount, it would be saved for the goal achievement.

import React, { useState, useEffect } from 'react'
import { StatusBar, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretDown, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonDropDown } from '../../components/Button'
import InputBox from '../../components/InputBox'
import VideoPlayerUi from '../../components/VideoPlayer'
import { ScrollView } from 'react-native-gesture-handler';

import moment from "moment"
import Modal, {
    ModalTitle,
    ModalContent,

} from 'react-native-modals';

import CountDown from 'react-native-countdown-component';
import { API_BASE_URL, getShaving, getTaskDetails, getUserDetails, updateSaving, saveMoneyCardtoPocket, createTask, getCategoryList,saveMoneyPockettoCard } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'

import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import { RNCamera } from 'react-native-camera';

import ImageView from "react-native-image-viewing";


var { height, width } = Dimensions.get('window');
var camera
var player
var _interval
const images = [
    {
        uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4"
    },
    {
        uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34"
    },
    {
        uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111"
    }
]
const SavingDetailsPage = (props) => {
    var sharedClass = new SharedClass();
    const route = useRoute();
    
    const [sppiner, setLoader] = useState(false)
   
    const [taskDetails, setTaskDetails] = useState(null)

  
    const [imagesPriview, setImagePreview] = useState([])
    const [imagesPriviewShow, setImagePreviewShow] = useState(false)
  
    const [wishAmount, setWishAmount] = useState('')
   
    const { setLoggedInUserAuthToken } = props;


   


    useEffect(() => {
       
        
        
        onSavingDetails(route.params && route.params.taskDetails && route.params.taskDetails._id)
        
    }, [setLoggedInUserAuthToken])

 

 
    const onReturn = () => {
        props.navigation.goBack()
    }


   
  

  

  
    const onSavingDetails = async (id) => {


        try {
            setLoader(true)
            const result = await getShaving(id);
           
            setLoader(false)
           
            if (result && result.status == 'success') {
                setTaskDetails(result.details)
              


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



 

    const onCreate = async () => {

        let message = {}






        if (!wishAmount) {
            message.message = 'Please enter saving amount'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if(parseFloat(wishAmount)+taskDetails.amountSave>taskDetails.amountNeeded){
            message.message = `Enter saving amount can't be greater than ${taskDetails.amountNeeded-taskDetails.amountSave}`
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        let req = {

            amountSave: wishAmount,
            savingId: taskDetails._id

        }

     
        try {
            setLoader(true)
            const result = await saveMoneyCardtoPocket(req);
           
            setLoader(false)
            if (result && result.status == 'success') {
                message.message = 'Money Saved successfully'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            
        }

        
    }


    const onTransferMoney = async () => {

        let message = {}
        let req = {

            amountDefault: taskDetails.amountNeeded,
            savingId: taskDetails._id

        }

        
        try {
            setLoader(true)
            const result = await saveMoneyPockettoCard(req);
          
            setLoader(false)
            if (result && result.status == 'success') {
                message.message = 'Money Saved successfully, now you can use that amount'
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

            } else {
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
        }

        
    }
    

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <LinearGradient colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>
                <NetConnectionScreen></NetConnectionScreen>
                {sppiner && <Loder data={sppiner}></Loder>}


                <View style={{ height: 40, width: width, marginTop: 20 }}>
                    <ReturnButton
                        height={40}
                        backgroundColor={colors.white}
                        width={width}
                        borderRadius={30}
                        marginTop={0}
                        label="Return"
                        labelColor={colors.placeHolderColor}
                        onAction={onReturn}
                        fontFamily={fonts.robotoRegular}
                        fontSize={13}
                        position="absolute"
                        top={10}
                        left={20}

                    ></ReturnButton>
                </View>
                <View style={{ height: height - 40, }}>
                    <ScrollView>
                        {taskDetails ? <View style={{ alignItems: 'center', marginBottom: 100 }}>



                            <View style={{ paddingBottom: 20 }}>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                   


                                    <View style={[{ width: width - 40, marginTop: -20 }]}>
                                        <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10 }]}>Wishlist item Name</Text>

                                        <View style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row', alignItems: 'center' }]}>

                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>{taskDetails.wishlistName}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                  
                                    {taskDetails.image ?
                                        <View style={[{ width: width - 40, marginTop: -20 }]}>

                                            <Image source={{ uri: taskDetails.image }} style={{ width: width - 40, height: 150 }} />
                                        </View>
                                        : null}
                                </View>
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                    

                                    <View style={[{ width: width - 40, marginTop: -20 }]}>
                                        <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10 }]}>How much does it cost?</Text>

                                        <View style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row', alignItems: 'center' }]}>

                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>{taskDetails.amountNeeded}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>
                                   

                                    <View style={[{ width: width - 40, marginTop: -20 }]}>
                                        <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10 }]}>How much have you saved?</Text>

                                        <View style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: 60, backgroundColor: colors.inputBoxBackground, flexDirection: 'row', alignItems: 'center' }]}>

                                            <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.placeHolderColor, marginLeft: 20, marginBottom: 10 }]}>{taskDetails.amountSave}</Text>
                                        </View>
                                    </View>
                                </View>
                                {taskDetails.amountSave < taskDetails.amountNeeded ? <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>

                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBoxBackground}
                                        width={width - 40}
                                        borderRadius={30}
                                        marginTop={-20}
                                        placeholder="Saving Amount"
                                        label="How much you want to save?"
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
                                </View> : null}
                                <View style={{ flexDirection: 'row', width: width, justifyContent: 'center', marginTop: 40, }}>

                                    {taskDetails.amountSave < taskDetails.amountNeeded ? <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 40}
                                        borderRadius={30}
                                        marginTop={0}
                                        label="Save"
                                        labelColor={colors.white}
                                        onAction={() => { onCreate() }}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow> :
                                        <ButtonWithoutShadow
                                            height={60}
                                            backgroundColor={colors.childblue}
                                            width={width - 40}
                                            borderRadius={30}
                                            marginTop={0}
                                            label="Transfer saved money to card"
                                            labelColor={colors.white}
                                            onAction={() => { onTransferMoney() }}
                                            fontFamily={fonts.robotoRegular}
                                            fontSize={19}
                                        ></ButtonWithoutShadow>}
                                </View>

                            </View>

                        </View> : null}
                    </ScrollView>
                    


                </View>
                <ImageView
                    images={imagesPriview}
                    imageIndex={0}
                    visible={imagesPriviewShow}
                    onRequestClose={() => setImagePreviewShow(false)}
                />
            </LinearGradient>
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
export default connect(mapStateToProps, mapDispatchToProps)(SavingDetailsPage)

var styles = StyleSheet.create({
    linearGradient: {
        //flex: 1,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
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

  

});

