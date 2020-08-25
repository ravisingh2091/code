// User will be able to view the child savings with following details: 
// 	•	Name of the child 
// 	•	Profile picture of the child 
// 	•	Target 
// 	•	Completion of target in percentage 
// 	•	Ability to like the saving target & goals

// Note: User will be able to view the child goals or targets on the screen.




import React, { useState, useEffect } from 'react'
import { FlatList, ScrollView, StatusBar, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faArrowLeft,  faHeart, } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'

import {  getSavingListParent, markFavSavingParent } from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

var { height, width } = Dimensions.get('window');



class SavingListPage extends React.Component {

    constructor(props) {
        // var route = useRoute();

        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            messages: [],
            sppiner: false,
            savingPlanList: [],
            loadMoreDataStatus: true,
            page: 0
        };



 

    }

    componentWillMount() {
       
        console.log(this.props.navigation.state)
        console.log(this.props.parentchatreq)
        this.setState({ chatReq: this.props.parentchatreq })
        const unsubscribe = this.props.navigation.addListener('focus', () => {
            
            this.getInitialList()
        });

    }

    componentDidMount() {
       

    }
    async handleMoreOrders() {

        try {
           
            const result = await getSavingListParent(this.state.page);
            console.log(result)
           
            if (result && result.status == 'success') {
                this.setState({
                    savingPlanList: [...this.state.savingPlanList, ...result.details],
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

            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    async getInitialList() {


        try {
          
            this.setState({sppiner:true})
            const result = await getSavingListParent(0);
            console.log(result)
            this.setState({sppiner:false})
            if (result && result.status == 'success') {
                this.setState({
                    savingPlanList: result.details,
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
            this.setState({sppiner:false})
            console.log("ERROR IN OFFER FETCH API", error);
        }

    }

     getPercentage (item) {

        let per = (item.amountSave * 100) / item.amountNeeded
        return Math.round(per)

    }
     getRightSideRadious (item) {

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

     getHeight  (item) {

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
     getLeftSideRadious  (item) {

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
     onFaviroutie = async (id,index) => {


        try {
          
            const result = await markFavSavingParent(id);
            console.log(result)
          
            if (result && result.status == 'success') {

                
              let data=this.state.savingPlanList
              data[index].favorite=!data[index].favorite
              this.setState({
                  savingPlanList:data
              })
             console.log(data)
           

            } else {
             
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
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
                        <View style={[styles.content, { backgroundColor: colors.white, }]}>
                            <NetConnectionScreen></NetConnectionScreen>
                            {this.state.sppiner && <Loder data={this.state.sppiner}></Loder>}
                            <View style={{ marginTop: 5 }}>

                                <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                        <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 20, }}>
                                    <FlatList
                                        ref={(c) => { this.flatList = c }}
                                        data={this.state.savingPlanList}
                                        
                                        extraData={this.state.savingPlanList}
                                        selected={this.state.selected}
                                        onEndReached={({ distanceFromEnd }) => {
                                            if (distanceFromEnd > 0) {
                                                this.handleMoreOrders();
                                            }
                                            
                                        }}
                                        onEndReachedThreshold={0.5}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item ,index}) => {
                                            return (

                                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <View style={[styles.cardfirst, { height: 54, width: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginRight: 0 }]}>
                                            <Image source={{uri:item.childId.profilePicture}} style={{ height: 50, width: 50, borderRadius: 25.5, borderWidth: 1.5, borderColor: colors.white }} />
                                        </View>
                                        <View style={[styles.cardfirst, { height: 54, width: width - 160, borderRadius: 24, alignItems: 'center', marginLeft: 10, marginRight: 0, flexDirection: 'row' }]}>

                                            <View style={[{

                                                height: this.getHeight(item),
                                                width: (this.getPercentage(item) * (width - 160)) / 100,
                                                borderBottomStartRadius: this.getLeftSideRadious(item),

                                                borderTopLeftRadius: this.getLeftSideRadious(item),
                                                borderBottomEndRadius: this.getRightSideRadious(item),
                                                borderTopRightRadius: this.getRightSideRadious(item),
                                                backgroundColor: colors.lightBlue, position: 'absolute', opacity: 1
                                            }]}></View>
                                            <View style={[{ height: 54, width: width - 160, alignItems: 'center', marginRight: 0, flexDirection: 'row' }]}>
                                                <Image source={localImages.piggy_bank_2} style={{ height: 30, width: 30, marginLeft: 10, marginBottom: 0 }} />
                                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16, color: colors.titleText }]}>{item.wishlistName.length>15?item.wishlistName.substring(0, 15) + '...':item.wishlistName}</Text>
                                                <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 16, position: 'absolute', right: 10 }]}>{this.getPercentage(item)} %</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={()=>this.onFaviroutie(item._id,index)} style={[{ height: 54, width: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 0 }]}>
                                            <FontAwesomeIcon style={{}} icon={faHeart} color={item.favorite?colors.titleText:colors.grayColor} size={30} />
                                        </TouchableOpacity>

                                    </View>
                                            )
                                        }}
                                        keyExtractor={item => item.id}
                                    />
                                </View>

                            </View>

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
export default connect(mapStateToProps, mapDispatchToProps)(SavingListPage)

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollview: {
        flexGrow: 1,
       
    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    cardfirst: {
        // height: 189,
        width: width - 40,
        marginHorizontal: 18,
        backgroundColor: colors.white,
        shadowColor: colors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,

        // marginTop: -60

    },

});


