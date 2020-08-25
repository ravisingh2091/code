// User will be able to activate his child’s card by providing 12-digit proxy number at the back of the card.

// 	•	Enter your proxy Number (In the text field)

// Note: Proxy number would be verified by using the matchmove validations APIs and after successfully activation of the card user will be able to receive a success message in the form of notifications.

// Child will be able to receive a notification that his card has been approved to use.

// 	•	User will be able to view the back view graphical representation of the card for the guidance.
// 	•	Activate: User’s account will be activated, and account will be moved from the deactivated accounts to the child accounts.

// Note: Card will be activated, and child will be able to use the card to make the transactions.
// User needs to enter the proxy number available on the back side of the card to activate the card, after entering that number user will be able to use the card.


import React, { useState, useEffect } from 'react'
import { StatusBar, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, } from '../../components/Button'
import InputBox from '../../components/InputBox'
import { ScrollView } from 'react-native-gesture-handler';

import { activateCard } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'

var { height, width } = Dimensions.get('window');
const ActivateCardPage = (props) => {
    const sharedClass = new SharedClass();

    const route = useRoute();

    const [proxyNumber, setProxyNumber] = useState('')
   
    const [sppiner, setLoader] = useState(false)
    const [childdetails, setChilddetails] = useState('')
  
    const { setLoggedInUserAuthToken } = props;
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            setProxyNumber('')
           
          });
      
         
        
        console.log(route.params.childdetails)
      
        setChilddetails(route.params.childdetails)
       
        return unsubscribe;
    }, [setLoggedInUserAuthToken])

    const onActivate = async () => {
        let message = {}
        if (!proxyNumber) {
            message.message = 'Please enter Proxy Number name'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }




     


        let req = {
            proxyCode: proxyNumber,
            childId: childdetails._id,
            name_on_card:childdetails.firstName

        }

        try {
            setLoader(true)
            const result = await activateCard(req);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                setTimeout(() => {
                    message.message = 'Card Activated'
                    message.type = 'success'
                    message.delay = 1000
                    sharedClass.ShowSnakBar(message)
                    props.navigation.goBack()
                })



            } else {
                setTimeout(() => {
                    message.message = result.message
                    message.type = 'info'
                    message.delay = 500
                    sharedClass.ShowSnakBar(message)
                }, 1000)

            }
        } catch (error) {
            setLoader(false)
            setTimeout(() => {
                let message = {}
                message.message = 'Something went wrong please try again'
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }, 500)
        }

        
    }
  

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <LinearGradient colors={[colors.white, colors.white, colors.white]} style={styles.linearGradient}>
                <NetConnectionScreen></NetConnectionScreen>
                {sppiner && <Loder data={sppiner}></Loder>}


                <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                            <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                            <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ height: height - 40, }}>
                    <ScrollView>
                        <View style={{ alignItems: 'center' }}>



                            <View style={{ width: width - 40, marginLeft: 20, alignItems: 'center', marginTop: 50 }}>
                                <Image source={localImages.cardnew} style={{ height: 120, width: 120 }} />
                                <Text style={[styles.robotoBoldText, { fontSize: 24, color: colors.darkBlue, marginTop: 20, textAlign: 'center' }]}>

                                Activate your card
                                </Text>
                                <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 20, textAlign: 'center', marginBottom: 30 }]}>
                                You can find the 12 digit proxy number at the back of the card

                                </Text>
                            </View>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBoxBackground}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={30}
                                label="Proxy number"
                                labelColor={colors.labelColor}
                                placeholder="12 digit proxy number"
                                placeholderColor={colors.placeHolderColor}
                                secureTextEntry={false}
                                editable={true}
                                value={proxyNumber}
                                onChangeText={(text) => setProxyNumber(text)}
                            ></InputBox>


                            <View style={styles.card}>

                               


                                <Image style={{ height: (width - 60) * 0.63, width: width - 60, marginVertical: 10, marginHorizontal: 10 }} source={localImages.cardback} />
                            </View>
                            <ButtonWithoutShadow
                                height={60}
                                backgroundColor={colors.childblue}
                                width={width - 94}
                                borderRadius={30}
                                marginTop={40}
                                marginBottom={100}
                                label="Activate"
                                labelColor={colors.white}
                                onAction={onActivate}
                                fontFamily={fonts.robotoRegular}
                                fontSize={19}
                            ></ButtonWithoutShadow>
                        </View>
                    </ScrollView>
                </View>

            </LinearGradient>
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
export default connect(mapStateToProps, mapDispatchToProps)(ActivateCardPage)

var styles = StyleSheet.create({
    linearGradient: {
        
        height: height,
        justifyContent: 'center',
        
    },
    cricle: {
        height: 11,
        width: 11,
        borderRadius: 5.5,
        backgroundColor: colors.greenText1
    },
});