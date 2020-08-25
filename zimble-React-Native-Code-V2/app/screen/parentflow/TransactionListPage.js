// User will be able to view the transactions performed by the child as per the selection of the card with the following details: 

// 	•	Money Transfer (Credit | Debit)
// 	•	Amount that with be credited or debited from the account.

// Note: In this screen user will be able to view all the transaction details on this screen of the card as per the selection.


import React, { useState, useEffect } from 'react'
import { StatusBar, ActivityIndicator, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'
import { ScrollView } from 'react-native-gesture-handler';
import {getAccountHistory} from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'
var { height, width } = Dimensions.get('window');



const TransactionListPage = (props) => {
    const sharedClass = new SharedClass();
    const route = useRoute();
    const [selectedtransctionHistory, setSelectedTransctionHistory] = useState([])

    const [sppiner, setLoader] = useState(false)
    const [chilId,setChildId]=useState('')
    const [page,setpage]=useState(0)
    const [loadMoreDataStatus,setloadMoreDataStatus]=useState(true)
    
   
    const { setLoggedInUserAuthToken } = props;


   


    useEffect(() => {

        setChildId(route.params && route.params.chilId ? route.params.chilId : '')
        getChildTransction(route.params && route.params.chilId ? route.params.chilId : '')
    }, [setLoggedInUserAuthToken])

    const getChildTransction = async (id) => {


        try {
            setLoader(true)
            const result = await getAccountHistory(1,id);
            console.log(result)
            setLoader(false)
            if (result && result.status == 'success') {
                
                var list = []
                if (result.details.transectionData.length > 0) {

                    setSelectedTransctionHistory(result.details.transectionData)
                    setloadMoreDataStatus(true)
                    setpage(2)
                    
                }

            } else {
               
            }
        } catch (error) {
            setLoader(false)
            console.log("ERROR IN OFFER FETCH API", error);
        }
    }
    const handleMoreOrders= async ()=>{
       
        try {
            const result = await await getAccountHistory(page,id);
            console.log(result)
            if (result && result.status == 'success') {
                if (result.details.transectionData.length > 0) {

                    setSelectedTransctionHistory([ ...selectedtransctionHistory,...result.details.transectionData])
                    setloadMoreDataStatus(true)
                    setpage(page+1)
                }
    
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
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={{ marginTop: 5 }}>

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={25} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 19 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                        
                        data={selectedtransctionHistory}
                        
                        extraData={selectedtransctionHistory}
                        onEndReached={({ distanceFromEnd }) => {
                            if (distanceFromEnd > 0) {
                               handleMoreOrders();
                            }
                            
                          }}
                          onEndReachedThreshold={0.5}
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({ item }) => {
                            return (

                                <View style={{ width: width - 40, marginLeft: 20, marginBottom: 10, backgroundColor: colors.iconBackgroud, marginBottom: 10, borderRadius: 4 }}>
                                <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 60 }]}>
                                    <View style={{ height: 42, width: 42, borderRadius: 21, backgroundColor: colors.blueCardBox, justifyContent: 'center', alignItems: 'center' }}>
                                        <FontAwesomeIcon style={{}} icon={faShoppingCart} color={colors.white} size={25} />
                                    </View>
                                    <View style={{ width: width - 120 }}>
                                        <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.description}</Text>
                                        <Text style={[styles.robotoRegularText, { marginLeft: 10, fontSize: 18, color: colors.subTitleColor }]}>{item.details.name}</Text>
                                    </View>
                                    <Text style={[styles.robotoBoldText, { marginLeft: 20, fontSize: 18, position: 'absolute', right: 10, color: colors.subTitleColor }]}>{item.indicator == "credit" ? '+' : '-'}{item.amount}$</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(TransactionListPage)

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


});