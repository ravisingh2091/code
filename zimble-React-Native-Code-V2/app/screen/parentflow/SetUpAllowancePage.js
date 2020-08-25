// Allowance Screen
// User will be able to view the list of all the added children and able to manage the allowance for individual child with the following details: 
// 	•	Ability to view name of the child
// 	•	Ability to view profile picture of the child 
// 	•	Ability to view current Allowance 
// 	•	User will be able to enter the allowance amount in the text field or able to select the allowance amount from the available amount options in the below
// 	•	Select the date of allowance: A calendar will be opened from where user will be able to select the date of allowance. 
// 	•	 Auto Top-up (Toggle button by using which user will be able to select it yes or no)

// Note: In case user select auto-top up then amount will be auto-transferred from the user wallet to the child’s account as per the selected allowance date. 

// Selected allowance date will be the date of the month on which child will get the selected amount into the child’s account.

// Confirm & Save: Similarly, user will be able to select the allowance for all children and after clicking on confirm and save the allowance will be saved for all the children and it will starts reflecting on the platform.

// Note: User will be able to save the allowance details for all the added children at once.

// Note: Allowance will be the amount that will be transferred into the child’s account in every month. 

import React, { useState, useEffect } from 'react'
import { FlatList, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ButtonCalender } from '../../components/Button'
import InputBox, { InputToggele } from '../../components/InputBox'
import { getChildList, getUserDetails, markFavSavingParent, updateChildAllow } from '../../api';
import SharedClass from '../../utils/SharedClass'
import RangeSlider from 'rn-range-slider';
import moment from "moment";
var { height, width } = Dimensions.get('window');

class SetUpAllowancePage extends React.Component {

    constructor(props) {

        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            messages: [],
            sppiner: false,
            savingPlanList: [],
            loadMoreDataStatus: true,
            childList: [],
            isDatePickerVisible: false,
            selectedChild: '',
            minAllow: 0,
            maxAllow: 1000,
            childListAllow: [],
            page: 0
        };


        this.getAllChildList()
        this.getUserDetailsFun()


    }

    componentWillMount() {

        console.log(this.props.navigation.state)
        console.log(this.props.parentchatreq)
        this.setState({ chatReq: this.props.parentchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {

            this.getAllChildList()
            this.getUserDetailsFun()
        });

    }

    componentDidMount() {


    }
    getAllChildList = async () => {


        try {

            const result = await getChildList();
            console.log(result)

            this.setState({
                sppiner: true
            })

            this.getUserDetailsFun()
            if (result && result.status == 'success') {

                this.setState({
                    sppiner: false,
                    childList: result.details.filter(it => it.status == '1')
                })

                let listOfUser = result.details.filter(it => it.status == '1')
                let vardata = []
                for (let index = 0; index < listOfUser.length; index++) {

                    vardata.push({
                        _id: listOfUser[index]._id,
                        allowanceAmountLimit: listOfUser[index].allowanceAmountLimit ? listOfUser[index].allowanceAmountLimit : this.state.minAllow,
                        allowanceDate: listOfUser[index].allowanceDate ? listOfUser[index].allowanceDate : '',
                        allowanceAutoMode: listOfUser[index].allowanceAutoMode,

                    })
                }

                this.setState({
                    childListAllow: vardata
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
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    getUserDetailsFun = async () => {


        try {
            this.setState({
                sppiner: true
            })
            const result = await getUserDetails();
            console.log(result)
            this.setState({
                sppiner: false
            })

            if (result && result.status == 'success') {

                this.props.setLoggedInUserDetails(result.details)

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
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

    getPercentage(item) {

        let per = (item.amountSave * 100) / item.amountNeeded
        return Math.round(per)

    }
    getRightSideRadious(item) {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 94:

                return 4
            case 95:

                return 5
            case 96:

                return 9
            case 97:

                return 12
            case 98:

                return 14
            case 99:

                return 20
            case 100:

                return 24
            default:
                return 0

        }


    }

    getHeight(item) {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 10:

                return 52
            case 9:

                return 51
            case 8:

                return 51
            case 7:

                return 50
            case 6:

                return 50
            case 5:

                return 45
            case 4:

                return 40
            case 3:

                return 30
            case 2:

                return 25
            case 1:

                return 20
            case 0:

                return 0
            default:
                return 54

        }



    }
    getLeftSideRadious(item) {

        let per = (item.amountSave * 100) / item.amountNeeded
        per = Math.round(per)
        switch (per) {
            case 10:

                return 27
            case 9:

                return 27
            case 8:

                return 27
            case 7:

                return 27
            case 6:

                return 27
            case 5:

                return 45
            case 4:

                return 40
            case 3:

                return 30
            case 2:

                return 25
            case 1:

                return 20
            case 0:

                return 0
            default:
                return 24

        }



    }
    onFaviroutie = async (id, index) => {


        try {

            const result = await markFavSavingParent(id);
            console.log(result)

            if (result && result.status == 'success') {


                let data = this.state.savingPlanList
                data[index].favorite = !data[index].favorite
                this.setState({
                    savingPlanList: data
                })
                console.log(data)


            } else {

            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    hideDatePicker = () => {

        this.setState({
            isDatePickerVisible: false
        })
    };

    showDatePicker = (item) => {

        this.setState({
            selectedChild: item,
            isDatePickerVisible: true
        })
    };
    handleConfirm = date => {
        this.hideDatePicker();

        console.log('A date has been picked: ', new Date(date).toISOString());
        var data = new Date(date).toISOString()
        var dateLocal = moment(date).format('YYYY-MM-DD')

        if (this.state.childList.length > 0) {
            let index = this.state.childList.map(it => { return it._id }).indexOf(this.state.selectedChild._id)
            let index2 = this.state.childListAllow.map(it => { return it._id }).indexOf(this.state.selectedChild._id)

            console.log({ index, index2 })
            var childListLocal = this.state.childList
            var childListAllowLocal = this.state.childListAllow
            if (index != -1) {
                childListLocal[index].allowanceDate = dateLocal
                childListLocal[index].dateforPicker = date


                this.setState({
                    childList: childListLocal
                })
            }
            if (index2 != -1) {
                childListAllowLocal[index].allowanceDate = dateLocal
                this.setState({
                    childListAllow: childListAllowLocal
                })

            }

        }

        console.log(dateLocal)


    };

    onUpdateLimit = async () => {


        for (let index = 0; index < this.state.childListAllow.length; index++) {

            if (!this.state.childListAllow[index].allowanceDate) {
                let message = {}
                message.message = 'Please select date for every child'
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
                return

            }

        }

        let req = {
            allowance: this.state.childListAllow
        }

        try {
            this.setState({
                sppiner: true
            })
            const result = await updateChildAllow(req);
            console.log(result)

            this.setState({
                sppiner: false
            })

            if (result && result.status == 'success') {
                let message = {}
                message.message = 'Spend limit updated successfully'
                message.type = 'success'
                this.sharedClass.ShowSnakBar(message)

            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.state.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
            this.setState({
                sppiner: false
            })
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }

 setCutomAllow=(item,amount)=>{
    if (this.state.childList.length > 0) {
        let index = this.state.childList.map(it => { return it._id }).indexOf(item._id)
        let index2 = this.state.childListAllow.map(it => { return it._id }).indexOf(item._id)
    
        console.log({ index, index2 })
        var childListLocal = this.state.childList
        var childListAllowLocal = this.state.childListAllow
        if (index != -1) {
            childListLocal[index].allowanceAmountLimit = amount
    
            this.setState({
                childList: childListLocal
            })
        }
        if (index2 != -1) {
            childListAllowLocal[index].allowanceAmountLimit = amount
            this.setState({
                childListAllow: childListAllowLocal
            })
        }
    
    } else {
    
    }
}

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgb(61, 153, 190)" />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ paddingBottom: 50 }}
                        contentContainerStyle={styles.scrollview}

                    >
                        <View style={styles.content}>
                            <View style={{ marginTop: 10, flexDirection: 'row', zIndex: 999, }}>
                                <View style={{ marginLeft: 20 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                        <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            <View style={{ marginTop: 30 }}>

                                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 20, height: 50 }}>
                                    <Image source={localImages.tax_day} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                    <Text style={[styles.robotoBoldText, { marginLeft: 15, fontSize: 19, color: colors.pink }]}>Manage Allowance</Text>

                                </View>
                            </View>
                            {this.state.childList.length > 0 ? <View style={{ marginTop: 20 }}>

                                <FlatList
                                    data={this.state.childList}
                                    extraData={this.state.childList}
                                    keyExtractor={({ _id }, index) => _id.toString()}
                                    renderItem={({ item, index }) => {
                                        console.log(item)
                                        return (
                                            <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: colors.charcolColorNew }}>


                                                <View onPress={() => onSelectChild(item)} style={[{ minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, }]}>




                                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                                        <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image source={{ uri: item.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                                        </View>
                                                        <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 25, color: colors.allowTitle, marginRight: 40 }]}>{item.firstName} {item.lastName} </Text>
                                                            <View style={{ flexDirection: 'row', width: width - 40, alignItems: 'center' }}>
                                                                <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 14, color: colors.ammountColor, marginRight: 40 }]}>Current Allowance:  </Text>
                                                                <Text style={[styles.robotoBoldText, { position: 'absolute', right: 80, fontSize: 14, color: colors.inputTextColor, marginRight: 40 }]}> ${parseFloat(item.allowanceAmountLimit ? item.allowanceAmountLimit : 0)}</Text>
                                                            </View>
                                                        </View>

                                                    </View>
                                                    <View>

                                                    </View>

                                                </View>
                                                <View style={{ width: width - 40, marginLeft: 20 }}>
                                                  
                                                    <View style={{marginLeft: 10}}>
                                                        <InputBox
                                                            height={60}
                                                            backgroundColor={colors.inputBoxBackground}
                                                            width={width - 60}
                                                            borderRadius={30}
                                                            marginTop={15}
                                                            placeholder="Amount"
                                                            label="Allowance Amount"
                                                            labelColor={colors.labelColor}
                                                            placeholderColor={colors.placeHolderColor}

                                                            inputTextColor={colors.inputTextColor}
                                                            secureTextEntry={false}
                                                            keyboardType={'numeric'}
                                                            editable={true}
                                                            value={item.allowanceAmountLimit ? item.allowanceAmountLimit : 0}
                                                            maxLength={400}
                                                            onChangeText={(text) => {

                                                                this.setCutomAllow(item,text)
                                                            }}
                                                        ></InputBox>
                                                        <View style={{alignItems:'center'}}>
                                                            <Text style={[styles.robotoBoldText, { marginTop: 10 }]}>OR Select From Below</Text>

                                                        </View>
                                                        <View style={{ width: width - 60,  flexDirection: 'row', marginTop: 10 }}>
                                                            <TouchableOpacity onPress={() => {
                                                                    this.setCutomAllow(item,'100')
                                                            }} style={[styles.cardBox, { height: 50, width: 70 }]}>
                                                                <Text style={styles.robotoRegularText}>$100</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => {
                                                                    this.setCutomAllow(item,'500')        
                                                            }} style={[styles.cardBox, { height: 50, width: 70 }]}>
                                                                <Text style={styles.robotoRegularText}>$500</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => {
                                                                    this.setCutomAllow(item,'750')
                                                            }} style={[styles.cardBox, { height: 50, width: 70 }]}>
                                                                <Text style={styles.robotoRegularText}>$750</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => {
                                                                    this.setCutomAllow(item,'1000')
                                                            }} style={[styles.cardBox, { height: 50, width: 70 }]}>
                                                                <Text style={styles.robotoRegularText}>$1000</Text>
                                                            </TouchableOpacity>

                                                        </View>

                                                    </View>
                                                </View>
                                                <View style={{ width: width - 60, marginLeft: 30 }}>
                                                    <ButtonCalender
                                                        height={60}
                                                        backgroundColor={colors.inputBoxBackground}
                                                        width={width - 60}
                                                        borderRadius={8}
                                                        marginTop={10}
                                                        marginBottom={20}
                                                        labelColor={colors.labelColor}
                                                        label="Allowance Date"
                                                        iconColor={colors.titleText}
                                                        palceholder={item.allowanceDate ? item.allowanceDate.split('T')[0] : 'Select Date'}
                                                        palceholderColor={colors.dropDownPlace}
                                                        onAction={() => this.showDatePicker(item)}
                                                        fontFamily={fonts.robotoMedium}
                                                        fontSize={13}
                                                        marginLeftText={20}
                                                        marginRightText={0}
                                                        hideDatePicker={this.hideDatePicker}
                                                        showDatePicker={() => this.showDatePicker(item)}
                                                        handleConfirm={this.handleConfirm}
                                                        isDatePickerVisible={this.state.isDatePickerVisible}
                                                        minDate={new Date()}
                                                        maxDate={null}
                                                        selectedDate={item.dateforPicker ? item.dateforPicker : new Date()}
                                                    ></ButtonCalender>
                                                </View>
                                                <View style={{ marginBottom: 50 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', right: 30 }}>
                                                        <Text style={[styles.robotoRegularText, { marginHorizontal: 20, fontSize: 17, color: colors.tabGray, marginRight: 20, }]}>Auto Topup</Text>
                                                        <InputToggele
                                                            status={item.allowanceAutoMode}
                                                            onChangeText={(text) => {
                                                                console.log(text)
                                                                if (this.state.childList.length > 0) {
                                                                    let index = this.state.childList.map(it => { return it._id }).indexOf(item._id)
                                                                    let index2 = this.state.childListAllow.map(it => { return it._id }).indexOf(item._id)

                                                                    console.log({ index, index2 })
                                                                    var childListLocal = this.state.childList
                                                                    var childListAllowLocal = this.state.childListAllow
                                                                    if (index != -1) {
                                                                        childListLocal[index].allowanceAutoMode = text
                                                                        this.setState({
                                                                            childList: childListLocal
                                                                        })

                                                                    }
                                                                    if (index2 != -1) {
                                                                        childListAllowLocal[index].allowanceAutoMode = text
                                                                        this.setState({
                                                                            childListAllow: childListAllowLocal
                                                                        })

                                                                    }

                                                                    console.log(childListLocal, childListAllowLocal)

                                                                } else {

                                                                }

                                                            }}
                                                        />
                                                    </View>

                                                </View>
                                            </View>
                                        )

                                    }
                                    }
                                />
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.childblue}
                                        width={width - 60}
                                        borderRadius={30}
                                        marginTop={10}
                                        label="Confirm and Save"
                                        labelColor={colors.white}
                                        onAction={() => { this.onUpdateLimit() }}
                                        fontFamily={fonts.robotoRegular}
                                        fontSize={15}
                                    ></ButtonWithoutShadow>
                                </View>
                            </View> : <View>
                                    <Text style={[styles.robotoBoldText, { fontSize: 15, color: colors.charcolCOlor, marginTop: 20, textAlign: 'center', marginBottom: 30 }]}>Please add child account first</Text>
                                </View>}
                        </View>

                    </ScrollView>

                </View>

            </SafeAreaView>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(SetUpAllowancePage)

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

    cardBox: {
        width: (width - 60), backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
        shadowColor: 'rgb(11, 120, 153)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10
    }

});


