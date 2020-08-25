// Chat Screen
// User will be able to view the chats with the users able to reply on the chats.

// Note: User will be able to receive every event in the messages that will be shared by the child with following details: 
// 	•	Name of the Event 
// 	•	Due Date
// 	•	View Info: After clicking on view info user will be redirected to the Events Screen.


import React, { useState, useEffect } from 'react'
import { FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane, faTimes, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts } from '../../utils/constant'
import Button, { ButtonRightIcon, } from '../../components/Button'




import { API_BASE_URL_SOCKET, getChatHistory, acceptEvent } from '../../api';

import SharedClass from '../../utils/SharedClass'



import io from 'socket.io-client';


import moment from "moment";
var { height, width } = Dimensions.get('window');




class ChatDetailsPage extends React.PureComponent {

    constructor(props) {


        super(props);
        this.sharedClass = new SharedClass();
        this.state = {

            selected: (new Map(): Map<string, boolean>),



            messagesList: [],
            message: '',
            chatReq: '',
            loadMoreDataStatus: true,
            page: 0
        };
        this.onSend = this.onSend.bind(this);
        this.socket = io(API_BASE_URL_SOCKET);
        this.socket.on('connect', () => {
            this.socket.emit('room join', {
                senderId: this.props.parentchatreq.parentId,
                roomId: this.props.parentchatreq.childId
            })
            this.socket.on('message', (r) => {

                console.log({ 'room join': r, uuu: this.state.chatReq.parentId })
                if (r.receiverId == this.state.chatReq.parentId) {
                    console.log({ 'message': r })

                    var a = []
                    a.push(r)
                    var c = []
                    c.push()
                    a.push.apply(a, this.state.messagesList)

                    console.log({ a })

                    this.setState({
                        messagesList: [...new Set(a)]
                    })
                    if (this.flatListParent) {
                        this.flatListParent.scrollToOffset({ animated: true, offset: 0 });
                    }

                }

            })
            this.socket.on('room join', (r) => {
                console.log({ 'room join': r })
            })
            this.socket.on('room leave', (r) => {
                console.log({ 'room leave': r })
            })


        })





    }



    componentWillMount() {

        console.log(this.props.navigation.state)
        console.log(this.props.parentchatreq)
        this.setState({ chatReq: this.props.parentchatreq })

        const unsubscribe = this.props.navigation.addListener('focus', () => {


            this.getPreviousChat()
        });

    }

    componentDidMount() {
        this.getPreviousChat()
    }

    componentWillUnmount() {
        this.socket.emit('room leave', {
            senderId: this.props.parentchatreq.parentId,
            roomId: this.props.parentchatreq.childId
        })
        this.socket.disconnect()
    }


    async handleMoreOrders() {
        if (!this.state.loadMoreDataStatus) {
            return
        }

        let reqData = {
            roomId: this.props.parentchatreq.childId,
            page: this.state.page
        }
        try {

            const result = await getChatHistory(reqData);
            console.log(result)

            if (result && result.status == 'success') {
                if (result.details.length > 0) {
                    this.setState({
                        messagesList: [...this.state.messagesList, ...result.details],
                        page: this.state.page + 1,

                    })
                }

                if (result.details.length == 0) {
                    this.setState({
                        loadMoreDataStatus: false

                    })
                }


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    async getPreviousChat() {

        let reqData = {
            roomId: this.props.parentchatreq.childId,
            page: 0
        }
        try {

            const result = await getChatHistory(reqData);
            console.log(result)

            if (result && result.status == 'success') {
                this.setState({
                    messagesList: [...new Set(result.details)],
                    page: 1,
                    loadMoreDataStatus: true
                })


            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                sharedClass.ShowSnakBar(message)
            }
        } catch (error) {

            console.log("ERROR IN OFFER FETCH API", error);
        }

    }

    timing(time) {
        return moment(time).fromNow()
    }

    timingTwo(time) {
        return moment(time).format('DD/MM/YYYY')
    }

    onAccept = async (status, eventId) => {
        let req = {
            eventId: eventId,
            acceptStatus: status,
        }

        try {

            const result = await acceptEvent(req);

            if (result && result.status == 'success') {

                let dataValue = this.state.messagesList
                let index = dataValue.map(it => { return it.eventId }).indexOf(eventId)

                if (index > -1) {
                    dataValue[index].approveStatus = '1'
                }

                console.log(dataValue)
                var a = []
                //  a.push(r)
                var c = []
                c.push()
                a.push.apply(a, dataValue)
                this.setState({
                    messagesList: [...new Set(a)]
                })
                let message = {}
                message.message = 'Request Submitted'
                message.type = 'success'
                this.sharedClass.ShowSnakBar(message)

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }
    onSend() {
        var a = []
        this.socket.emit('message', {
            senderId: this.state.chatReq.parentId,
            roomId: this.state.chatReq.childId,
            messageType: "text",
            receiverId: this.state.chatReq.childId,
            message: this.state.message,
            uniqueCode: new Date().getTime()
        })
        a.push({
            readStatus: false,

            message: this.state.message,
            messageType: "text",
            receiverId: this.state.chatReq.childId,
            roomId: this.state.chatReq.childId,
            senderId: this.state.chatReq.parentId,
            uniqueCode: new Date().getTime()
        })

        var c = []
        var messaglistLocal = Object.assign([], this.state.messagesList)
        c.push()
        a.push.apply(a, messaglistLocal)
        console.log(a)
        this.setState({
            messagesList: [...new Set(a)],
            message: ''
        })
        this.flatListParent.scrollToOffset({ animated: true, offset: 0 });

    }

    ReceivedMessage(msg) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', width: width - 40 }}>
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: this.state.chatReq.childProfile }} style={{ height: 58, width: 58, borderRadius: 29 }}></Image>
                </View>
                <View style={{ marginHorizontal: 0, width: width - 140, minHeight: 60, marginLeft: 20, backgroundColor: colors.white, marginRight: 20, borderRadius: 10, justifyContent: 'center', }}>
                    <Text style={[styles.robotoRegularText, { marginHorizontal: 10, fontSize: 18, color: colors.ammountColor, marginRight: 40, marginBottom: 30 }]}>{msg.message}  </Text>
                    <Text style={[styles.robotoBoldText, { position: 'absolute', right: 10, fontSize: 13, color: colors.ammountColor, marginRight: 0, bottom: 5 }]}>{this.timing(msg.createdAt)}</Text>
                </View>

            </View>
        )
    }

    SentMessage(msg) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', width: width - 40, }}>
                <View style={{ marginHorizontal: 0, width: width - 140, minHeight: 60, marginLeft: 0, backgroundColor: colors.childblue, marginRight: 20, borderRadius: 10, justifyContent: 'center', }}>
                    <Text style={[styles.robotoRegularText, { marginHorizontal: 10, fontSize: 18, color: colors.white, marginRight: 40, marginBottom: 30 }]}>{msg.message}  </Text>
                    <Text style={[styles.robotoBoldText, { position: 'absolute', right: 10, fontSize: 13, color: colors.grayColor, marginRight: 0, bottom: 5 }]}>{this.timing(msg.createdAt)}</Text>
                </View>
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: this.state.chatReq.parentProfile }} style={{ height: 58, width: 58, borderRadius: 29 }}></Image>
                </View>


            </View>
        )
    }

    EventMesage(msg) {
        return (
            <View style={{ minHeight: 100, marginTop: 20, width: width - 40, backgroundColor: colors.white, borderRadius: 10, }}>
                <View style={{ flexDirection: 'row', }}>

                    <View style={{


                        shadowColor: colors.shadowColor,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10
                    }}>
                        <Image source={{ uri: this.state.chatReq.childProfile }} style={{ height: 58, width: 58, borderRadius: 29, alignSelf: 'center' }}></Image>
                    </View>
                    <View style={{ marginHorizontal: 0, width: width - 140, marginTop: 10, marginBottom: 15 }}>
                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 18, color: colors.allowTitle, }]}>{msg.message}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5, }}>
                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 12, color: colors.ammountColor, }]}>Date: {this.timingTwo(msg.eventDate ? msg.eventDate : msg.createdAt)}</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CalendarEvents')} style={{ position: 'absolute', right: 0, borderBottomWidth: 1, borderBottomColor: colors.ammountColor }}>
                                <Text style={[styles.robotoBoldText, { fontSize: 12, color: colors.ammountColor, }]}>View info</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </View>
                {msg.approveStatus == '0' ? <View style={{ height: 20 }}>
                    <TouchableOpacity onPress={() => { this.onAccept('1', msg.eventId) }} style={{ position: 'absolute', right: 10, bottom: 10, borderBottomWidth: 1, borderBottomColor: colors.childblue }}>
                        <Text style={[styles.robotoBoldText, { fontSize: 12, color: colors.childblue, }]}>Accept and give permission</Text>
                    </TouchableOpacity>
                </View> : null}
            </View>
        )
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{
                    flex: 1,
                    backgroundColor: colors.blueLightColor
                }}>
                    <View style={{ justifyContent: 'center', backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.charcolColorNew, }}>

                        <View style={{ flexDirection: 'row', marginLeft: 20, paddingVertical: 10 }}>

                            <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: this.state.chatReq.childProfile }} style={{ height: 58, width: 58, borderRadius: 29, alignSelf: 'center' }}></Image>
                            </View>
                            <View style={{ marginHorizontal: 0, width: width - 40, marginTop: 10 }}>
                                <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 17, color: colors.allowTitle, marginRight: 40 }]}>{this.state.chatReq.childName} </Text>

                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ position: 'absolute', right: 30, top: 10 }}>
                                <FontAwesomeIcon style={{}} icon={faTimes} color={colors.tabGray} size={25} />
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ height: 10 }}></View>
                    <FlatList
                        ref={(c) => { this.flatListParent = c }}
                        data={this.state.messagesList}
                        inverted
                        extraData={this.state.messages}
                        selected={this.state.selected}
                        onEndReached={({ distanceFromEnd }) => {
                            if (distanceFromEnd > 0) {
                                this.handleMoreOrders();
                            }

                        }}
                        onEndReachedThreshold={0.5}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (

                                <View onPress={() => onSelectChild(item)} style={[{ minHeight: 60, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, marginBottom: 15, }]}>
                                    {item.messageType != 'text' ?
                                        this.EventMesage(item)

                                        :
                                        item.senderId == this.state.chatReq.parentId ?
                                            this.SentMessage(item)
                                            :
                                            this.ReceivedMessage(item)
                                    }
                                </View>
                            )
                        }}
                        keyExtractor={item => item.id}
                    />

                    <KeyboardAvoidingView>
                        <View style={{ flexDirection: 'row', paddingBottom: 15, borderBottomColor: colors.charcolColorNew, borderBottomWidth: 1, }}>

                            <ButtonRightIcon
                                height={40}
                                backgroundColor={colors.white}
                                width={(width - 40) / 2}
                                marginLeft={20}
                                borderRadius={30}
                                marginTop={15}
                                palceholder="Add Conditions"
                                type="bookmark"
                                palceholderColor={colors.Greenish}
                                onAction={() => { this.props.navigation.navigate('CalendarEvents') }}
                                fontFamily={fonts.robotoRegular}
                                fontSize={15}
                            ></ButtonRightIcon>
                        </View>
                        <View style={[styles.cardChatText], { backgroundColor: colors.white, width: width - 40, marginLeft: 20, height: 60, marginTop: 10, flexDirection: 'row', borderRadius: 10, marginBottom: 10 }}>
                            <TextInput
                                placeholder={"Write Message"}
                                placeholderTextColor={colors.chatTextPlaceholder}
                                multiline={true}
                                value={this.state.message}
                                onChangeText={(text) => { this.setState({ message: text }) }}

                                style={[{ width: width - 110, borderRadius: 8, marginLeft: 10, marginRight: 10 }]}>

                            </TextInput>
                            <TouchableOpacity disabled={!this.state.message} onPress={() => this.onSend()} style={{ width: 60, backgroundColor: colors.childblue, height: 60, justifyContent: 'center', alignItems: 'center', borderBottomEndRadius: 10, borderTopEndRadius: 10 }}>
                                <FontAwesomeIcon style={{}} icon={faPaperPlane} color={colors.white} size={25} />

                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        );
    }




}


const mapStateToProps = (state) => {
    console.log("check store data", state.localStates);
    return {
        loginStatus: state.localStates.loginStatus,
        loginuserDetails: state.localStates.userDetails,
        parentchatreq: state.localStates.parentchatreq,
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
export default connect(mapStateToProps, mapDispatchToProps)(ChatDetailsPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    cardChatText: {

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,

    },

});


