// Child will be able to generate the CVV number which will be valid only for 10 mins at a time after that child needs to generate the CVV number again as it will be expired after every 10 minutes.

// Note: Child will be able to view the CVV number on the screen and able to use the same for performing the transactions and it will be expired after 10 minutes of generation.



import React, { useState, useEffect } from 'react'
import { FlatList, TextInput, KeyboardAvoidingView, ImageBackground, Animated, Alert, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faShoppingCart, faPaperPlane, faArrowLeft, faAlignJustify, faChevronRight, faChevronLeft, faHeart, faBell, faTimes, faMobile, faBullhorn, faBars, faHome, faCheckSquare, faCoffee, faCheck, faPlus, faEye, faUnlock, faLock, faCaretRight, faCalendar, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonRightIcon, ButtonWithoutShadow, ReturnButton, ButtonDropDown, ButtonCalender } from '../../components/Button'
import InputBox from '../../components/InputBox'





import { API_BASE_URL, getChildList, getCards, getUserDetails, getTransactionChildsideHistory, childCardTopup, getChatHistory, API_BASE_URL_SOCKET, genrateCvvApi } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import CountDown from 'react-native-countdown-component';

import moment from "moment";
var { height, width } = Dimensions.get('window');

class GenrateCvvPage extends React.PureComponent {

    constructor(props) {
        // var route = useRoute();
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {


            selectedCard: '',
            userDetails: '',
            transctionHistory: '',

            genrateCvv: null,
            sppiner: false
        };


        this.getUserDetailsFun()




    }



    componentWillMount() {

        this.setState({ chatReq: this.props.childchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {


            this.getUserDetailsFun()
        });


    }

    componentDidMount() {

    }

    getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }

    getUserDetailsFun = async () => {


        try {

            const result = await getUserDetails();


            if (result && result.status == 'success') {
                this.setState({
                    userDetails: result.details
                })
                this.getCardDetails(result.details)

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {

        }
    }

    getCardDetails = async (loacalUser) => {


        try {

            const result = await getCards();


            if (result && result.status == 'success') {


                if (result.details.length > 0) {
                    var data = result.details.filter(it => it._id == loacalUser.personisalizedCardId)

                    if (data.length) {
                        this.setState({
                            selectedCard: data[0]
                        })


                    }


                }

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
        }
    }



    async onGenrateCvv() {


        try {


            let reqData = {
                childId: this.state.userDetails._id
            }
            this.setState({
                sppiner: true
            })
            const result = await genrateCvvApi(reqData);

            this.setState({
                sppiner: false
            })
            if (result && result.status == 'success') {
                this.setState({
                    genrateCvv: result.details
                })
            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            this.setState({
                sppiner: false
            })

        }

    }




    cc_format = (value) => {


        if (value) {
            var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            var matches = v.match(/\d{4,16}/g);
            var match = matches && matches[0] || ''
            var parts = []

            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4))
            }

            if (parts.length) {
                return parts.join(' ')
            } else {
                return value
            }
        } else {
            return 'Card Not activated'
        }

    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{}}
                        contentContainerStyle={styles.scrollview}

                    >
                        <View style={styles.content}>
                            <NetConnectionScreen></NetConnectionScreen>
                            {this.state.sppiner && <Loder data={this.state.sppiner}></Loder>}
                            <View style={styles.container} >
                                <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                    <View style={{ width: 80, marginLeft: 20, }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                            <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={20} />
                                            <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                    </View>
                                    <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                        <TouchableOpacity onPress={() => onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                            <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.backgroundView} >

                                    <Image style={styles.image} source={{ uri: this.props.loginuserDetails.coverPicture }} />
                                </View>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                    style={[styles.backgroundView, {



                                        opacity: .3,

                                    }]}>

                                </LinearGradient>

                            </View>
                            <View style={{ marginTop: -100, alignItems: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={localImages.cardback} style={{ width: 300, height: 300 * .633, marginTop: 10 }} />
                                    <Text style={[styles.robotoRegularText, { position: 'absolute', top: (300 * .633 / 2), right: 120 }]}>{this.state.genrateCvv ? this.state.genrateCvv.value : ''}</Text>
                                    <Text style={{ fontFamily: fonts.robotoBold, fontSize: 25, color: colors.childblue, marginTop: 10 }}>Balance: ${parseFloat(this.state.userDetails.totalCardBalance ? this.state.userDetails.totalCardBalance : 0).toFixed(2)}</Text  >
                                </View>
                                {!this.state.genrateCvv ? <ButtonWithoutShadow
                                    height={60}
                                    backgroundColor={colors.childblue}
                                    width={width - 120}
                                    borderRadius={30}
                                    marginLeft={0}
                                    marginRight={0}
                                    marginTop={20}
                                    label="Generate CVV"
                                    labelColor={colors.white}
                                    onAction={() => { this.onGenrateCvv() }}
                                    fontFamily={fonts.robotoRegular}
                                    fontSize={15}
                                ></ButtonWithoutShadow>
                                    : <View style={{ alignItems: 'center' }}>

                                        <Text style={{ fontFamily: fonts.robotoRegular, fontSize: 20, color: colors.grayColor, marginTop: 20, marginBottom:10 }}>Current CVV is only valid for</Text  >
                                        <CountDown
                                            size={25}
                                            until={60*10}
                                            onFinish={() => { }}
                                            digitStyle={{ backgroundColor: colors.Greenish, borderWidth: 0, borderColor: '#1CC625' }}
                                            digitTxtStyle={{ color: '#fff' }}
                                            timeLabelStyle={{ color: colors.Greenish, fontWeight: 'bold' }}
                                            separatorStyle={{ color: '#fff' }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: "M", s: 'S' }}
                                            showSeparator
                                        />
                                       

                                    </View>

                                }
                                 
                            </View>





                        </View>

                    </ScrollView>

                </View>

            </SafeAreaView>);
    }




}


const mapStateToProps = (state) => {
    return {
        loginStatus: state.localStates.loginStatus,
        loginuserDetails: state.localStates.userDetails,
        childchatreq: state.localStates.childchatreq,
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
export default connect(mapStateToProps, mapDispatchToProps)(GenrateCvvPage)

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

    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },


    container: {

        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle

        height: 250,
    },
    backgroundView: {
        borderRadius: width * 4,
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,

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

});


