// Child will be able to view following elements on the home screen: 
// 	•	Notifications
// 	•	Education Content: User will be able to view the various topic on the screen with following details:
// 	•	Topic Name 
// 	•	Image
// 	•	Content preview 
// 	•	Ability to mark as favourite
// 	•	Read more: User will be redirected to the Topic detailed Screen.

// Note: Education content will be uploaded by the admin from the backend.

// 	•	Bottom menu:
// 	•	Education (Home | Dashboard will be the same)
// 	•	Wallet
// 	•	Tasks
// 	•	Chat
// 	•	Sidebar Menu 

import React, { useState, useEffect } from 'react'
import { ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments,  faAlignJustify,  faBell, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import  { ButtonWithoutShadow, } from '../../components/Button'




import { educationFavourite, getEducationList, getChatHistory,getNotificationCount } from '../../api';

import SharedClass from '../../utils/SharedClass'
import {  CommonActions, } from '@react-navigation/native';

import { Drawer } from 'native-base';
import DrawerLayout from '../../components/DrawerLayout'


import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import stylesSlider from './styles/index.style';
import stylesEntry, { slideWidth } from './styles/SliderEntry.style';


var { height, width } = Dimensions.get('window');
var drawer


const SLIDER_1_FIRST_ITEM = 1;

class EducationPage extends React.Component {

    constructor(props) {
       
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
          
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            notificationCount:0,
            messagesList: [],
           
        };


        this.getEducationData()


    }



    componentWillMount() {
    
        this.setState({ chatReq: this.props.childchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {
           
            this.getEducationData()
            this.getNotificationCountUnread()
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
                    notificationCount:result.details.count
                })


            } else {

            }
        } catch (error) {

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

    async getEducationData() {

        let reqData = {
            roomId: this.props.childchatreq.childId,
            page: 0
        }
        try {
            // setLoader(true)
            const result = await getEducationList();
        
            if (result && result.status == 'success') {
                this.setState({
                    messagesList: result.details,
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
    onAction(item){

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

    _renderItemWithParallax=({ item, index }, parallaxProps)=> {
        var even = (index + 1) % 2 === 0
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={false}
                onAction={(item)=>this.onAction(item)}
                navigation={this.props.navigation}
                userId={this.props.loginuserDetails._id}
                parallaxProps={parallaxProps}
            />
           
        );
    }

    mainExample(number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={[stylesSlider.exampleContainer, { marginTop: -120 }]}>
                {this.state.messagesList.length > 1 ?
                 <View>
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
                        containerCustomStyle={stylesSlider.slider}
                        contentContainerCustomStyle={stylesSlider.sliderContentContainer}
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
                </View>
                    :
                    this.state.messagesList.length == 1 ?
                        <View style={{width:width, alignItems:'center'}}>

                            <View style={stylesEntry.slideInnerContainer}>
                                <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }}>
                                    <Image source={localImages.start_o} style={{ height: 30, width: 30 }}></Image>
                                </TouchableOpacity>
                                <View style={[stylesEntry.imageContainer, stylesEntry.imageContainerEven, { alignItems: 'center', marginTop: 40 }]}>

                                    <View>
                                        <Image source={{ uri: this.state.messagesList[0].image }} style={{ height: 100, width: 100, borderRadius: 50 }}></Image>
                                    </View>
                                    <Text style={[stylesEntry.robotoBoldText, { textAlign: 'center', color: colors.titleText, marginTop: 15, fontSize: 17 }]}>{this.state.messagesList[0].title}</Text>
                                    <Text style={[stylesEntry.robotoRegularText, { textAlign: 'center', color: colors.timeSelectedColor, marginTop: 15, fontSize: 15, marginHorizontal: 15 }]}>{this.state.messagesList[0].preview.length > 300 ? this.state.messagesList[0].preview.substring(0, 300) + '...' : data.preview}</Text>
                                   {this.state.messagesList[0].topic && this.state.messagesList[0].topic.length>0?
                                     <ButtonWithoutShadow
                                        height={50}
                                        backgroundColor={colors.childblue}
                                        width={slideWidth - 40}
                                        borderRadius={30}
                                        marginTop={30}
                                        marginBottom={100}
                                        label="Read More"
                                        labelColor={colors.white}
                                        onAction={() => {this.props.navigation.navigate('EducationDetailsPage',{topic:this.state.messagesList[0].description}) }}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={19}
                                    ></ButtonWithoutShadow>:null}
                                </View>
                            </View>
                        </View>
                        : null

                }
            </View>
        );
    }


    render() {
        const example1 = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
        return (
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
                <Drawer
                    ref={(ref) => { drawer = ref }}
                    content={<DrawerLayout navigation={this.props.navigation} closeDrawer={this.closeDrawer} />}
                    onClose={() => this.closeDrawer()} >
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={{}}
                            contentContainerStyle={styles.scrollview}
                        //   scrollEnabled={scrollEnabled}
                        //   onContentSizeChange={this.onContentSizeChange}
                        >
                            <View style={styles.content}>
                                <View style={styles.container} >
                                    <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                        <View style={{ width: 80 }}>
                                            <TouchableOpacity onPress={() => this.openDrawer()} style={{ marginRight: 10, alignItems: 'center' }}>
                                                <FontAwesomeIcon style={{}} icon={faAlignJustify} color={colors.white} size={25} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: width - 160, alignItems: 'center', justifyContent: 'center' }}>

                                        </View>
                                        <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                            <TouchableOpacity onPress={() => this.onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                                <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                                {this.state.notificationCount>0?<View style={{position:'absolute', backgroundColor:colors.white, width:20,height:20,borderRadius:10, right:-5, top:-5, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={[styles.robotoLightText, { color: colors.titleText }]}>{this.state.notificationCount}</Text>
                                            </View>:null}
                                            </TouchableOpacity>
                                            {/* <TouchableOpacity onPress={() => this.onButton('ChatListPage')} style={{ marginLeft: 0, alignItems: 'center', marginRight: 30 }}>
                                                <FontAwesomeIcon style={{}} icon={faComments} color={colors.white} size={25} />
                                            </TouchableOpacity> */}
                                        </View>
                                    </View>

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
                </Drawer>
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
export default connect(mapStateToProps, mapDispatchToProps)(EducationPage)

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

});


