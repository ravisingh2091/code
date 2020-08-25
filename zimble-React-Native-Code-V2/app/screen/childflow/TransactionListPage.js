// Child will be able to view all the expenses that will be done by him with the following details: 
// 	•	Name of the transaction
// 	•	Amount of the transaction
// 	•	Date of the transaction


import React, {  } from 'react'
import { FlatList,  ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions,  } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faShoppingCart, faArrowLeft,  faBell,  } from '@fortawesome/free-solid-svg-icons'
import { colors} from '../../utils/constant'




import {  getCards, getUserDetails, getTransactionChildsideHistory ,getNotificationCount} from '../../api';


import SharedClass from '../../utils/SharedClass'


import moment from "moment";
var { height, width } = Dimensions.get('window');





class TransactionListPage extends React.PureComponent {

    constructor(props) {
        // var route = useRoute();
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            messages: [],
            selected: (new Map(): Map<string, boolean>),
            firstMessage: '',
            message: '',
            roomId: '',
            isFetching: false,
            userId: '',
            receiverId: '',
            isLoading: false,
            messagesToRender: '',
            messagesLength: '',
            assistType: '',
            modalVisible: false,
            SliderValue: 50,
            seekBarTime: 0,
            maxDuration: 0,
            showPauseButton: false,
            showResumeButton: false,
            placeHolderImage: '',
            height: 0,
            profileImage: '',
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,

            hasPermission: undefined,
            isImageViewVisible: false,
            latitude: null,
            longitude: null,
            musicPlayerVisible: false,
            cancelRecording: false,
            viewMoreModalVisible: false,
            groupMembers: [],
            userImageName: '',
            name: '',
            groupId: '',
            imagePickerTitle: '',
            groupImage: '',
            isGpImage: '',
            imageSource: '',
            selectionType: '',

            messagesList: [],
            message: '',
            chatReq: '',
            loadMoreDataStatus: true,
            page: 0,

            selectedCard: '',
            userDetails: '',
            transctionHistory: '',
            notificationCount:0,
        };

        this.getTransaction()
        this.getUserDetailsFun()
        this.getNotificationCountUnread()




    }

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

    componentWillMount() {
        
     
        this.setState({ chatReq: this.props.childchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {
          
            this.getTransaction()
            this.getUserDetailsFun()
        });


    }

    componentDidMount() {

    }

     onButton = (page) => {
        
        if (!page) {
           
        } else if (page == 'ChildDashBoard' || page == 'TaskListChildPage' || page == 'ChatListPage') {

            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: page },
                    ],
                })
            );
           
        } else {
            this.props.navigation.navigate(page)
        }
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
    async handleMoreOrders() {
        
        try {
           
            const result = await getTransactionChildsideHistory(this.state.page);
          
           
            if (result && result.status == 'success') {
                this.setState({
                    transctionHistory: [...this.state.messagesList, ...result.details.transectionData],
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

    async getTransaction() {


        try {
            
            const result = await getTransactionChildsideHistory(1);
          
            
            if (result && result.status == 'success') {
                this.setState({
                    transctionHistory: result.details.transectionData,
                    page: 2,
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
    timing(time) {
        return moment(time).fromNow()
    }
    timingTwo(time) {
        return moment(time).format('DD/MM/YYYY')
    }
    onSend() {
        var a = []
        this.socket.emit('message', {
            senderId: this.state.chatReq.childId,
            roomId: this.state.chatReq.childId,
            receiverId: this.state.chatReq.parentId,
            message: this.state.message,
            messageType: "text",
            uniqueCode: new Date().getTime()
        })
        a.push({
            readStatus: false,
            
            message: this.state.message,
            messageType: "text",
            receiverId: this.state.chatReq.parentId,
            roomId: this.state.chatReq.childId,
            senderId: this.state.chatReq.childId,
            uniqueCode: new Date().getTime()
        })
        var c = []
        var messaglistLocal = Object.assign([], this.state.messagesList)
        c.push()
        a.push.apply(a, messaglistLocal)
       
        this.setState({
            messagesList: a,
            message: ''
        })
       
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
                        style={{  }}
                        contentContainerStyle={styles.scrollview}
                    
                    >
                        <View style={styles.content}>
                            <View style={styles.container} >
                                <View style={{ marginTop: 10, flexDirection: 'row', position: 'absolute', zIndex: 999, }}>
                                    <View style={{ width: 80,marginLeft: 20, }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                            <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.white} size={20} />
                                            <Text style={[styles.robotoRegularText, { color: colors.white, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: width - 180, alignItems: 'center', justifyContent: 'center' }}>

                                    </View>
                                    <View style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                                        <TouchableOpacity onPress={() => this.onButton('NotificationListPage')} style={{ marginLeft: 10, alignItems: 'center', marginRight: 20 }}>
                                            <FontAwesomeIcon style={{}} icon={faBell} color={colors.white} size={25} />
                                            {this.state.notificationCount>0?<View style={{position:'absolute', backgroundColor:colors.white, width:20,height:20,borderRadius:10, right:-5, top:-5, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={[styles.robotoLightText, { color: colors.titleText }]}>{this.state.notificationCount}</Text>
                                            </View>:null}
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', width: width, top: 80, zIndex: 99 }}>
                                    <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: this.state.userDetails.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                    </View>
                                    <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 24, color: colors.white, marginRight: 40 }]}>{this.state.userDetails.firstName}</Text>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.emailColor, marginRight: 40, shadowColor: 'rgba(0, 0, 0, 0.5)' }]}>{this.state.userDetails.email}</Text>
                                    </View>

                                </View>
                            </View>


                            
                            <View style={{ marginTop: 30 }}>

                                <FlatList
                                    ref={(c) => { this.flatList = c }}
                                    data={this.state.transctionHistory}

                                    extraData={this.state.transctionHistory}

                                    onEndReached={({ distanceFromEnd }) => {
                                        if (distanceFromEnd > 0) {
                                            this.handleMoreOrders();
                                        }
                                        
                                    }}
                                    onEndReachedThreshold={0.5}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => {
                                        return (

                                            <View style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                                <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60, marginVertical: 10 }]}>
                                                    <View style={{ height: 42, width: 42, borderRadius: 21, backgroundColor: colors.blueCardBox, justifyContent: 'center', alignItems: 'center' }}>
                                                        <FontAwesomeIcon style={{}} icon={faShoppingCart} color={colors.white} size={25} />
                                                    </View>
                                                    <View style={{ width: width - 120 }}>
                                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.description}</Text>
                                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.grayColorLight }]}>{this.timingTwo(item.date)}</Text>
                                                    </View>
                                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 13, position: 'absolute', right: 10, color: colors.subTitleColor }]}>{item.indicator == "credit" ? '+' : '-'}{item.amount} $</Text>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />



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
export default connect(mapStateToProps, mapDispatchToProps)(TransactionListPage)

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
    iconBackgroud: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: colors.iconBackgroud,
        justifyContent: 'center',
        alignItems: 'center'
    },

    container: {
       
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        overflow: 'hidden', 
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


