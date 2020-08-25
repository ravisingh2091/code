// User will be able to view following details on my goals screen:
// 	•	Name of the Wishlist item
// 	•	Picture of the image upload by the child 
// 	•	Amount needed to purchase the item
// 	•	Remaining amount to save

// Note: After clicking on any of the goal child will be redirected Goals Planning Screen.


import React, { useState, useEffect } from 'react'
import { Animated, ImageBackground, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, FlatList, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts,  } from '../../utils/constant'


import DeviceInfo from 'react-native-device-info';
import * as Progress from 'react-native-progress';

import {getSavingList,  } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'

import SharedClass from '../../utils/SharedClass'
import { useFocusEffect } from '@react-navigation/native';
var { height, width } = Dimensions.get('window');




const SavingListPage = (props) => {
    var sharedClass = new SharedClass();
   

    const [taskList, setTaskList] = useState([])
 


    const [sppiner, setLoader] = useState(false)
  
    const { setLoggedInUserAuthToken } = props;
   



    useEffect(() => {
       
      

    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            getShaving()
           
        }, [])
    );
 

    const getShaving = async () => {


        try {
            setLoader(true)
            const result = await getSavingList();
         
            setLoader(false)
            
            if (result && result.status == 'success') {
                setTaskList(result.details)


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
                        
                        <View style={{ marginTop: 5 }}>

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 20, }}>

                                <View style={{ marginTop: 20, marginBottom: 50 }}>





                                    <FlatList
                                        data={taskList}
                                        ListEmptyComponent={() => (
                                            <View style={{ height: 300, width: width, justifyContent: 'center', alignItems: 'center' }}>

                                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>No any task available</Text>
                                            </View>)}
                                        renderItem={({ item, index }) => (
                                            <View >


                                                <TouchableOpacity onPress={() => props.navigation.navigate('SavingDetailsPage', { taskDetails: item })} style={[styles.cardfirst, { minHeight: 120, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, justifyContent: 'center', marginRight: 0, flexDirection: 'row', marginBottom: 10 }]}>

                                                    <ImageBackground source={{ uri: item.image }} imageStyle={[{ borderRadius: 8, marginLeft: 0 }]} style={[{ height: 117, marginLeft: 1, width: width - 44, marginLeft: 0, borderRadius: 8, }]}>


                                                    </ImageBackground >

                                                    <LinearGradient
                                                        start={{ x: 0, y: 1 }}
                                                        end={{ x: 1, y: 1 }}
                                                        colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]} style={{
                                                            height: 117, width: width - 44,
                                                            backgroundColor: colors.lightBlue, position: 'absolute', opacity: .5, borderRadius: 8
                                                        }}>

                                                    </LinearGradient>
                                                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, width: width - 40, }}>
                                                        <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16, color: colors.white,marginRight:30 }]}>{item.wishlistName}</Text>
                                                        <View style={{ position: 'absolute', right: 10, bottom: 0 }}>
                                                            <Text style={[styles.robotoBoldText, { color: colors.priceTag, fontSize: 22, position: 'absolute', right: 0, bottom: 20, zIndex: 110 }]}>${item.amountNeeded}</Text>
                                                            <Text style={[styles.robotoRegularText, { color: colors.white, fontSize: 13, marginTop: 5 }]}>Remaining:<Text style={[styles.robotoRegularText, { color: colors.priceTagColor, fontSize: 16, marginTop: 5 }]}>${item.amountNeeded - item.amountSave}</Text></Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: width - 40, alignItems: 'center', position: 'absolute', top: 1, justifyContent: 'center' }}>
                                                        <Progress.Bar
                                                            borderRadius={10}
                                                            progress={((item.amountSave) / item.amountNeeded)}
                                                            width={width - 44}
                                                            height={15}
                                                            unfilledColor={colors.progressBarColor}
                                                            color={colors.childblue}
                                                        />
                                                        <Text style={[styles.robotoRegularText, { color: colors.white, fontSize: 9, position: 'absolute' }]}>${item.amountSave} Saved({((100 * item.amountSave) / item.amountNeeded).toFixed(2)}%)</Text>
                                                    </View>

                                                </TouchableOpacity>
                                            </View>
                                           
                                        )}
                                        keyExtractor={item => item._id}
                                    />






                                </View>
                            </View>

                        </View>

                    </View>

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
export default connect(mapStateToProps, mapDispatchToProps)(SavingListPage)

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
    linearGradient: {

        height: height,
        backgroundColor: 'rgba(223, 234, 252, 0.4)'

    },
    card: {

        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: colors.gradientGreenThree,
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
        marginTop: 46
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