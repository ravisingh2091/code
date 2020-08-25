import React, { useState, useEffect } from 'react'
import { StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight, faChevronLeft, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonCalender } from '../../components/Button'
import InputBox from '../../components/InputBox'
import { ScrollView } from 'react-native-gesture-handler';

import Swiper from 'react-native-swiper';
import { getCards, addNeWcard,getUserDetails } from '../../api';

import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'
var { height, width } = Dimensions.get('window');

const RequestNewCardPage = (props) => {

    const sharedClass = new SharedClass();
    const [sppiner, setLoader] = useState(false)
    const [postalCode, setpostalCode] = useState('')
    const [selectedcard, setselectedcard] = useState()
    const [fullAddress, setfullAddress] = useState('')
    const [line2Address, setLine2Address] = useState('')
    const [city, setcity] = useState('Singapore')
    const [state, setstate] = useState('Singapore')
    const [country, setcountry] = useState('')
    const [cardId, setCardId] = useState('')
    const [countryCodeCountry, setCountryCodeCountry] = useState('SG')
  const [callingCodeCountry, setCallingCodeCountry] = useState('+65')

    const [cardList, setCardList] = useState([])
    const [childDetails, setChildDetails] = useState([])
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(false)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(true)
    const [withCallingCode, setWithCallingCode] = useState(true)
    const { setLoggedInUserAuthToken } = props;
    const route = useRoute();
    useEffect(() => {
        getCardDetails()
        getUserDetailsFun()
        setChildDetails(route.params.childdetails)

    }, [setLoggedInUserAuthToken])


    useFocusEffect(
        React.useCallback(() => {
            console.log('focus')
        }, [])
    );
    const getUserDetailsFun = async () => {


        try {
            setLoader(true)
            const result = await getUserDetails();
            console.log(result)
            setLoader(false)
          
            if (result && result.status == 'success') {
                // setUsersDetails(result.details)
    
                if(result.details && result.details.address){
                  setfullAddress(result.details.address.address_1?result.details.address.address_1:'')
                  setLine2Address(result.details.address.address_2?result.details.address.address_2:'')
                  setcity(result.details.address.city?result.details.address.city:'')
                  setstate(result.details.address.state?result.details.address.state:'')
                  setcountry(result.details.address.country?result.details.address.country:'')
                  setpostalCode(result.details.address.postalCode?result.details.address.postalCode:'')
                  setCountryCodeCountry(result.details.address.countryCode?result.details.address.countryCode:'')
                }
                props.setLoggedInUserDetails(result.details)
    
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
    const onSelectCountry = (country) => {
        console.log(country)
        setCountryCodeCountry(country.cca2)
        setCallingCodeCountry("+" + country.callingCode[0])
        setcountry(country.name)
      }
    const getCardDetails = async () => {


        try {
            setLoader(true)
            const result = await getCards();
            console.log(result)
            setLoader(false)

            if (result && result.status == 'success') {
                setCardList(result.details)

                if (result.details.length > 0) {
                    setCardId(result.details[0]._id)
                }

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                message
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }




    const onNextTwo = async () => {
        console.log(selectedcard)
        console.log(cardId)
        if (selectedcard) {
            setCardId(selectedcard)
        } else {
            if (cardList.length > 0) {
                setCardId(cardList[0]._id)
            }

        }
        console.log(selectedcard)
        console.log(cardId)
        let message = {}
        if (!fullAddress) {
            message.message = 'Please enter  address line one'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!line2Address) {
            message.message = 'Please enter  address line two'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }
        if (!city) {
            message.message = 'Please enter  city'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!state) {
            message.message = 'Please enter state'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!country) {
            message.message = 'Please enter country'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }

        if (!postalCode) {
            message.message = 'Please enter postal code'
            message.type = 'error'
            sharedClass.ShowSnakBar(message)
            return
        }



        let req = {
            personisalizedCardId: cardId,
            childId: childDetails._id,
            address: {
                address_1: fullAddress,
                address_2: line2Address,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode

            }
        }

        console.log(req)

        try {
            setLoader(true)
            const result = await addNeWcard(req);
            console.log(result)
            setLoader(false)

            if (result && result.status == 'success') {

                let message = {}
                message.message = "New card request accepted and new card will be delivered, on your provided address"
                message.type = 'success'
                sharedClass.ShowSnakBar(message)
                props.navigation.goBack()

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
                    style={{ marginBottom: 0, paddingBottom: 0 }}
                    contentContainerStyle={styles.scrollview}

                >
                    <View style={styles.content}>
                        <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={[styles.container, { marginVertical: 20, height: 40 }]} >
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                <View style={{ width: 80, marginLeft: 20, }}>
                                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                        <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                </View>

                                <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                </View>
                            </View>

                        </View>
                        <View>

                            <View style={{ alignItems: 'center', marginBottom: 20 }}>

                                {cardList.length > 0 && <View style={styles.containerCard}>
                                    <Swiper
                                        index={0}
                                        showsButtons
                                        buttonWrapperStyle={{ backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 70, right: 20, flex: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: width - 140, color: colors.white }}
                                        nextButton={<FontAwesomeIcon style={{ marginLeft: 30 }} icon={faChevronRight} color={colors.white} size={30} />}
                                        prevButton={<FontAwesomeIcon style={{}} icon={faChevronLeft} color={colors.white} size={30} />}
                                        onIndexChanged={(index) => {
                                            console.log(index)
                                            const value = cardList[index]._id;
                                            setselectedcard(value);
                                            setCardId(value)
                                        }}
                                        showsPagination={false}
                                        loop={false}
                                    >
                                        {
                                            cardList.length > 0 &&
                                            cardList.map((item, key) => {
                                                return (
                                                    <Image
                                                        resizeMode={'contain'}
                                                        source={{ uri: item.image }}
                                                        style={styles.imageCard}
                                                        key={key} />
                                                );
                                            })}
                                    </Swiper>
                                </View>}
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="Address Line"
                                    label="Address Line 1"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    editable={true}
                                    value={fullAddress}
                                    maxLength={400}
                                    onChangeText={(text) => setfullAddress(text)}
                                ></InputBox>
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="Address Line"
                                    label="Address Line 2"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    editable={true}
                                    value={line2Address}
                                    maxLength={400}
                                    onChangeText={(text) => setLine2Address(text)}
                                ></InputBox>
                                {/* <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="City"
                                    label="City"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    editable={true}
                                    value={city}
                                    maxLength={400}
                                    onChangeText={(text) => setcity(text)}
                                ></InputBox>
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="State"
                                    label="State"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    editable={true}
                                    value={state}
                                    maxLength={400}
                                    onChangeText={(text) => setstate(text)}
                                ></InputBox> */}
                                <View>
                                    <Text style={[styles.robotoRegularText, { fontSize: 12, color: colors.labelColor, marginLeft: 20, marginBottom: 10, marginTop: 15 }]}>Country</Text>
                                    <View style={[styles.card, { marginRight: 5, marginTop: 0, width: width - 40, height: 60, justifyContent: 'center', backgroundColor: colors.inputBoxBackground, borderRadius: 8 }]}>

                                        <CountryPicker
                                            onSelect={onSelectCountry}
                                            containerButtonStyle={{ marginLeft: 10, color: colors.inputTextColor }}
                                            withCountryNameButton={true}
                                            countryCode={countryCodeCountry}

                                            {...{

                                                withFilter,
                                                withAlphaFilter,
                                                withCallingCode,
                                                withEmoji,

                                            }}
                                        />
                                    </View>
                                </View>
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBoxBackground}
                                    width={width - 40}
                                    borderRadius={30}
                                    marginTop={15}
                                    placeholder="PIN Code"
                                    label="PIN Code"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}

                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={false}

                                    editable={true}
                                    value={postalCode}
                                    maxLength={400}
                                    onChangeText={(text) => setpostalCode(text)}
                                ></InputBox>
                                <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 60}
                                    borderRadius={30}
                                    marginTop={20}
                                    label="NEXT"
                                    labelColor={colors.white}
                                    onAction={() => { onNextTwo() }}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={15}
                                ></ButtonWithoutShadow>
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(RequestNewCardPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,

    },
    imageCard: {
        height: (width - 80) * .52,
        width: width - 80,
        alignSelf: "center",
    },
    containerCard: {
        //flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        height: (width - 80) * .52,
        marginTop: 20,
        marginBottom: 0
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
    justifyContent: 'center',
   
    borderRadius: 8

  },

});