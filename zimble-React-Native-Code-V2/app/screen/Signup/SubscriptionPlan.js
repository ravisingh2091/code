import React, { useState, useEffect } from 'react'
import { ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faComments, faAlignJustify, faBell, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import { ButtonWithoutShadow, } from '../../components/Button'




import { educationFavourite, getEducationList, getChatHistory, getNotificationCount ,getSubscription,getCardList,postSubscription} from '../../api';

import SharedClass from '../../utils/SharedClass'
import { CommonActions, } from '@react-navigation/native';

import { Drawer } from 'native-base';
import DrawerLayout from '../../components/DrawerLayout'


import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../childflow/styles/SliderEntry.style';
import SliderEntry from '../childflow/components/SliderEntry';
import stylesSlider from '../childflow/styles/index.style';
import stylesEntry, { slideWidth } from '../childflow/styles/SliderEntry.style';


var { height, width } = Dimensions.get('window');
var drawer


const SLIDER_1_FIRST_ITEM = 1;

class SubscriptionPlan extends React.Component {

    constructor(props) {

        super(props);
        this.sharedClass = new SharedClass();
        this.state = {

            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            notificationCount: 0,
            selectedCard:'',
            messagesList: [

               
            ],

        };


        // this.getEducationData()


    }



    componentWillMount() {

        this.setState({ chatReq: this.props.childchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {

            this.getSubscriptionData()
            this.getAllCardList()
            // this.getNotificationCountUnread()
        });


    }

    componentDidMount() {

    }

    closeDrawer = () => {
        drawer._root.close()
    };

    openDrawer = () => {
        drawer._root.open()
    };
    getNotificationCountUnread = async () => {
        try {

            const result = await getNotificationCount();


            if (result && result.status == 'success') {



                this.setState({
                    notificationCount: result.details.count
                })


            } else {

            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

     getAllCardList = async () => {

        try {
            const result = await getCardList();
            console.log(result)
           
            if (result && result.status == 'success') {
                // setCardList(result.details)
                if (result.details.length > 0) {
                    // setSelectedCard(result.details[0])
                    this.setState({
                        selectedCard:result.details[0]
                    })
                   
                }

            } else {
                let message = {}
                message.message = result.message
                message.type = 'error'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
       
    }
    async handleMoreOrders() {
        let reqData = {
            roomId: this.props.childchatreq.childId,
            page: this.state.page
        }
        try {
            // setLoader(true)
            const result = await getChatHistory(reqData);

            if (result && result.status == 'success') {
                this.setState({
                    messagesList: [...this.state.messagesList, ...result.details],
                    page: this.state.page + 1,
                    loadMoreDataStatus: true
                })


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
        }
    }

    async onSubscribe(data){
       

        try {

            let reqData={
                // amount:parseInt(data.amount)/100,
                planId:data.id,
                cardId:this.state.selectedCard._id
            }
            // setLoader(true)
            const result = await postSubscription(reqData);

            if (result && result.status == 'success') {
                this.props.navigation.navigate('RegistrationSuccessPage')


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            console.log(error)
            let message = {}
            message.message = 'Something went wrong'
            message.type = 'error'
            this.sharedClass.ShowSnakBar(message)

        }
        // 
    }

    async getSubscriptionData() {

       
        try {
            // setLoader(true)
            const result = await getSubscription();

            if (result && result.status == 'success') {
                this.setState({
                    messagesList: result.details.data,
                    page: 1,
                    loadMoreDataStatus: true
                })


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {


        }

    }
    onAction(item) {

        this.markFavioutite(item._id)
    }
    async markFavioutite(id) {

        let reqData = {
            roomId: this.props.childchatreq.childId,
            page: 0
        }
        try {
            // setLoader(true)
            const result = await educationFavourite(id);


            if (result && result.status == 'success') {
                this.getEducationData()


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {


        }

    }
    onButton = (page) => {
        // alert('under development')
        if (!page) {
            // alert('under devlopment')
        } else if (page == 'EducationPage' || page == 'ChildDashBoard' || page == 'TaskListChildPage' || page == 'ChatListPage') {

            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: page },
                    ],
                })
            );
            // props.navigation.navigate(page)
        } else {
            this.props.navigation.navigate(page)
        }
    }

    _renderItemWithParallax = ({ item, index }, parallaxProps) => {
        var data = item
        var even = (index) % 3
        var backgroundColor = [
            colors.Greenish,
            colors.Purple,
            colors.Blue,
        ]
        data.backgroundColor = backgroundColor[even]
        return (
            <View style={{ width: width, }}>

                <View style={[stylesEntry.slideInnerContainer, { backgroundColor: data.backgroundColor, minHeight: height / 2 }]}>

                    <View style={[stylesEntry.imageContainer, stylesEntry.imageContainerEven, { alignItems: 'center', marginTop: 40 }]}>


                        <Text style={[stylesEntry.robotoBoldText, { textAlign: 'center', color: colors.titleText, marginTop: 15, fontSize: 17, color: colors.white }]}>{data.title}</Text>
                        <Text style={[stylesEntry.robotoBoldText, { textAlign: 'center', color: colors.timeSelectedColor, marginTop: 15, fontSize: 15, marginHorizontal: 15, color: colors.white }]}>{data.subTitle}</Text>
                        {
                            data.benefits.map(it => {
                                return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        {/* <View style={{height:10, width:10, borderRadius:5, backgroundColor:colors.white}}></View> */}
                                        <Text style={[stylesEntry.robotoRegularText, { textAlign: 'center', color: colors.timeSelectedColor, marginTop: 15, fontSize: 15, marginHorizontal: 15, color: colors.white }]}>{it}</Text>
                                    </View>
                                )
                            })
                        }
                        {!data.selected ?
                            <ButtonWithoutShadow
                                height={50}
                                backgroundColor={colors.childblue}
                                width={slideWidth - 40}
                                borderRadius={30}
                                marginTop={30}
                                marginBottom={100}
                                label="Select"
                                labelColor={colors.white}
                                onAction={() =>this.onSubscribe(data)}
                                fontFamily={fonts.robotoRegular}
                                fontSize={19}
                            ></ButtonWithoutShadow> : null}
                    </View>
                </View>
            </View>

        );
    }

    mainExample(number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={[stylesSlider.exampleContainer, { marginTop: -120 }]}>

                <View style={{}}>
                    <Carousel
                        ref={c => this._slider1Ref = c}
                        data={this.state.messagesList}
                        renderItem={this._renderItemWithParallax}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        // inactiveSlideShift={20}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        loop={true}
                        loopClonesPerSide={1}
                        autoplay={false}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                    />
                </View>
                <Pagination
                    dotsLength={this.state.messagesList.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={stylesSlider.paginationContainer}
                    dotColor={colors.childblue}
                    dotStyle={stylesSlider.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />


            </View >
        );
    }


    render() {
        const example1 = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
        return (
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={{}}
                            contentContainerStyle={styles.scrollview}
                        //   scrollEnabled={scrollEnabled}
                        //   onContentSizeChange={this.onContentSizeChange}
                        >
                            <View style={styles.content}>
                            <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                        <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginPage')} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                                <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={15} />
                                                <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                <View style={styles.container} >
                                   

                                    <LinearGradient
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree,]}

                                        style={[styles.backgroundView, {



                                            opacity: 1,

                                        }]}>

                                    </LinearGradient>

                                </View>
                                {example1}


                            </View>

                        </ScrollView>
                        {/* <View style={[styles.tabBar, { borderTopWidth: .9, borderTopColor: colors.charcolColorNew, height: 70, position: 'absolute', bottom: Platform.OS == 'ios' ? this.state.type ? 0 : 10 : 0, }]}>
                            <TouchableOpacity onPress={() => {}} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                                <Image source={localImages.Tab1Active} style={{ height: 35, width: 35 *0.88}}></Image>
                                <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.childblue }]}>Education</Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onButton('ChildDashBoard')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>

                                
                                <Image source={localImages.wallet} style={{ height: 35, width: 35 }}></Image>
                                <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Wallet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onButton('TaskListChildPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                                <Image source={localImages.health_insurance} style={{ height: 35, width: 35 }}></Image>
                                <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Tasks</Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onButton('ChatListPage')} style={{ width: width / 4, alignItems: 'center', marginTop: 15 }}>
                                <Image source={localImages.financial_advice} style={{ height: 35, width: 35 }}></Image>
                                <Text style={[styles.robotoLightText, { fontSize: 10, color: colors.charcolBlack }]}>Chat</Text>

                            </TouchableOpacity>

                        </View> */}
                    </View>
              
            </SafeAreaView>
        )
    }




}


const mapStateToProps = (state) => {

    return {
        loginStatus: state.localStates.loginStatus,
        loginuserDetails: state.localStates.userDetails,
        childchatreq: state.localStates.userDetails,
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
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionPlan)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
        ///  marginBottom:90
    },
    tabBar: {

        backgroundColor: colors.white,

        width: width,
        flexDirection: 'row',



    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    robotoLightText: {
        fontFamily: fonts.robotoLight,
        color: colors.grayColor
    },

    container: {

        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', // for hide the not important parts from circle
        // margin: 10,
        height: 250,
    },
    backgroundView: { // this shape is a circle 
        borderRadius: width * 4, // border borderRadius same as width and height
        width: width * 4,
        height: width * 4,
        backgroundColor: colors.white,
        //marginLeft: -80, // reposition the circle inside parent view
        position: 'absolute',
        bottom: 0, // show the bottom part of circle
        overflow: 'hidden', // hide not important part of image
    },
    image: {
        opacity: .6,
        height: 250, // same width and height for the container
        width: width,
        position: 'absolute', // position it in circle
        bottom: 0, // position it in circle
        marginLeft: width * 1.5, // center it in main view same value as marginLeft for circle but positive
    },
    slider: {
        marginTop: 5,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },

});


