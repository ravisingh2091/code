// Limits Screen
// User will be able to view the list of all the added children and able to manage the spending limit for individual child with the following details: 
// 	•	Name of the child
// 	•	Profile picture of the child 
// 	•	Current Limit 
// 	•	User will be able to enter the Limit amount in the text field or able to select the limit amount from the available amount options in the below.

// Confirm & Save: Similarly, user will be able to select the Limit for all children and after clicking on confirm and save the limits  will be saved for all the children and it will starts reflecting on the platform.


// Note: Limits will be the maximum amount that child will be allowed to spend in a month. Children will not be able to spend more than the specified limit in the limit section by his parent.


import React, { useState, useEffect } from 'react'
import { FlatList, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import Button, { ButtonWithoutShadow, ButtonCalender } from '../../components/Button'
import InputBox, { InputToggele } from '../../components/InputBox'
import { getChildList, getUserDetails, markFavSavingParent,updateChildLimit, updateChildAllow } from '../../api';
import SharedClass from '../../utils/SharedClass'
import RangeSlider from 'rn-range-slider';
import moment from "moment";
var { height, width } = Dimensions.get('window');

class SetUpLimitPage extends React.Component {

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
            minAllow: '0',
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
                        spendLimit: listOfUser[index].spendLimit ? listOfUser[index].spendLimit : this.state.minAllow,
                       

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
        //  setSteps(4)

        let req = {
            childData: this.state.childListAllow
        }

        try {
            // setLoader(true)
            const result = await updateChildLimit(req);
            console.log(result)

            // setLoader(false)
            
            if (result && result.status == 'success') {
                let message = {}
                message.message = 'Spend limit updated successfully'
                message.type = 'success'
                this.sharedClass.ShowSnakBar(message)
                
            } else {
                let message = {}
                message.message = result.message
                message.type = 'info'
                this.sharedClass.ShowSnakBar(message)
            }
        } catch (error) {
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
            childListLocal[index].spendLimit = amount
    
            this.setState({
                childList: childListLocal
            })
        }
        if (index2 != -1) {
            childListAllowLocal[index].spendLimit = amount
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
                    style={{}}
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
                                <Image source={localImages.phone_money} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 19, color:colors.Purple }]}>Manage Spending limit</Text>

                            </View>
                        </View>
                        {this.state.childList.length>0? <View style={{ marginTop: 20 }}>

                        <FlatList
                                    data={this.state.childList}
                                    extraData={this.state.childList}
                                    keyExtractor={({ _id }, index) => _id.toString()}
                                    renderItem={({ item, index }) => {
                                        console.log(item)
                                        return (
                                            <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: colors.charcolColorNew }}>
        
        
                                                <View  style={[{ minHeight: 100, width: width - 40, borderRadius: 8, alignItems: 'center', marginLeft: 20, marginRight: 0, }]}>
        
        
        
        
                                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', position: 'absolute', width: width - 40 }}>
                                                        <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: colors.white, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image source={{ uri: item.profilePicture }} style={{ height: 79, width: 79, borderRadius: 39.5 }}></Image>
                                                        </View>
                                                        <View style={{ marginHorizontal: 0, width: width - 40 }}>
                                                            <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 25, color: colors.allowTitle, marginRight: 40 }]}>{item.firstName} {item.lastName} </Text>
                                                            <View style={{ flexDirection: 'row', width: width - 40 , alignItems:'center'}}>
                                                                <Text style={[styles.robotoBoldText, { marginHorizontal: 10, fontSize: 14, color: colors.ammountColor, marginRight: 40 }]}>Current Limit:  </Text>
                                                                <Text style={[styles.robotoBoldText, { position: 'absolute', right: 80, fontSize: 14, color: colors.ammountColor, marginRight: 40 }]}> ${parseFloat(item.spendLimit ? item.spendLimit : 0)}</Text>
                                                            </View>
                                                        </View>
        
                                                    </View>
                                                    <View>
        
                                                    </View>
        
                                                </View>
                                                <View style={{ width: width - 40, marginLeft: 20 ,marginBottom:30}}>
                                                   
                                                    <View style={{ width: width - 40, alignItems: 'center', }}>
        
                                                      
                                                        <View style={{marginLeft: 10}}>
                                                                <View style={{marginLeft:20}}>
                                                                <InputBox
                                                                    height={60}
                                                                    backgroundColor={colors.inputBoxBackground}
                                                                    width={width - 60}
                                                                    borderRadius={30}
                                                                    marginTop={15}
                                                                    placeholder="Amount"
                                                                    label="Limit Amount"
                                                                    labelColor={colors.labelColor}
                                                                    placeholderColor={colors.placeHolderColor}
        
                                                                    inputTextColor={colors.inputTextColor}
                                                                    secureTextEntry={false}
                                                                    keyboardType={'numeric'}
                                                                    editable={true}
                                                                    value={item.spendLimit ? item.spendLimit : 0}
                                                                    maxLength={400}
                                                                    onChangeText={(text) => {
        
                                                                        this.setCutomAllow(item,text)
                                                                    }}
                                                                ></InputBox>
                                                                </View>
                                                                <View style={{alignItems:'center'}}>
                                                                    <Text style={[styles.robotoBoldText, { marginTop: 10 }]}>OR Select From Below</Text>
        
                                                                </View>
                                                                <View style={{ width: width,  flexDirection: 'row', marginTop: 10 }}>
                                                                    <TouchableOpacity onPress={() => {
                                                                            this.setCutomAllow(item,'500')
                                                                    }} style={[styles.cardBox, { height: 50, width: 60 }]}>
                                                                        <Text style={styles.robotoRegularText}>$500</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                            this.setCutomAllow(item,'1000')        
                                                                    }} style={[styles.cardBox, { height: 50, width: 60 }]}>
                                                                        <Text style={styles.robotoRegularText}>$1000</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                            this.setCutomAllow(item,'1500')
                                                                    }} style={[styles.cardBox, { height: 50, width: 60 }]}>
                                                                        <Text style={styles.robotoRegularText}>$1500</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                            this.setCutomAllow(item,'2000')
                                                                    }} style={[styles.cardBox, { height: 50, width: 60 }]}>
                                                                        <Text style={styles.robotoRegularText}>$2000</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                            this.setCutomAllow(item,'2500')
                                                                    }} style={[styles.cardBox, { height: 50, width: 60 }]}>
                                                                        <Text style={styles.robotoRegularText}>$2500</Text>
                                                                    </TouchableOpacity>
        
                                                                </View>
        
                                                            </View>
                                                    </View>
                                                </View>
                                             
                                            </View>
                                        )

                                    }
                                    }
                                />
                         
                              <View style={{alignItems:'center'}}>
                              <ButtonWithoutShadow
                                height={60}
                                backgroundColor={colors.childblue}
                                width={width - 60}
                                borderRadius={30}
                                marginTop={20}
                                label="Confirm and Save"
                                labelColor={colors.white}
                                onAction={() => {this.onUpdateLimit() }}
                                fontFamily={fonts.robotoRegular}
                                fontSize={15}
                            ></ButtonWithoutShadow>
                              </View>
                        </View>:<View>
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
export default connect(mapStateToProps, mapDispatchToProps)(SetUpLimitPage)

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


