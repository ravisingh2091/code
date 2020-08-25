// Child will be able to view following details on the earning screen: 
// 	•	Balance in the account 
// 	•	Number of completed tasks (assigned by the parent on the app)
// 	•	Total Spend (Done by the child)
// 	•	Total Earnings (In dollars)
// 	•	Earnings: User will be able to view following details in the earnings sections: 
// 	•	Total Earnings (Amount in dollars)
// 	•	Earning graph based on following factors:
// 	•	Task 
// 	•	Transfer 
// 	•	Allowance


import React, { useState, useEffect } from 'react'
import { StatusBar, ActivityIndicator, FlatList, TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'

import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { colors, fonts, localImages } from '../../utils/constant'

import { ScrollView } from 'react-native-gesture-handler';

import moment from "moment"

import {specilaReward} from '../../api';
import NetConnectionScreen from '../../utils/NetConnectionScreen'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

import { useRoute } from '@react-navigation/native'

const { height, width } = Dimensions.get('window');



const SpecialReward = (props) => {
    const sharedClass = new SharedClass();
    const route = useRoute();
    const [selectedtransctionHistory, setSelectedTransctionHistory] = useState([])
 
    const [sppiner, setLoader] = useState(false)
    const [chilId,setChildId]=useState('')
  
    const { setLoggedInUserAuthToken } = props;


   


    useEffect(() => {
       
        setChildId(route.params && route.params.chilId ? route.params.chilId : '')
        getChildTransction(route.params && route.params.chilId ? route.params.chilId : '')
    }, [setLoggedInUserAuthToken])

   
    const getDate = (date) => {
        var dateLocal = moment(date).format('DD/MM/YYYY')
        return dateLocal
    }
    const getDateTime = (date) => {
        var dateLocal = moment(date).format('LT');  
        return dateLocal
    }
    const getChildTransction = async (id) => {


        try {
            setLoader(true)
            const result = await specilaReward();
          
            setLoader(false)
           
            if (result && result.status == 'success') {
                
                var list = []
                if (result.details.length > 0) {

                    setSelectedTransctionHistory(result.details)
                   
                    
                }

            } else {
               
            }
        } catch (error) {
            setLoader(false)
        }
    }
 
  
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
                    <View style={[styles.content, { backgroundColor: colors.white, }]}>
                        <NetConnectionScreen></NetConnectionScreen>
                        {sppiner && <Loder data={sppiner}></Loder>}
                        <View style={{ marginTop: 5 }}>

                            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesomeIcon style={{}} icon={faArrowLeft} color={colors.childblue} size={15} />
                                    <Text style={[styles.robotoRegularText, { color: colors.childblue, marginLeft: 10, fontSize: 15 }]}>Back</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                        
                        data={selectedtransctionHistory}
                        
                        extraData={selectedtransctionHistory}
                        
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => props.navigation.navigate('TaskDetailsChildPage', { taskDetails: item })} style={{ width: width - 40, marginLeft: 20, backgroundColor: colors.iconBackgroud, marginTop: 30, borderRadius: 4, }}>
                                    {item.bonusMonetry ? <View style={[styles.cardfirst, { backgroundColor: colors.white, position: 'absolute', right: 20, top: -25, borderRadius: 10, width: 80, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={[styles.robotoBoldText, { marginHorizontal: 10, marginVertical: 10, fontSize: 18, color: colors.childblue }]}>${item.bonusAmount.toFixed(2)}</Text>
                                    </View> : null}
                                    <View style={[{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, minHeight: 80, marginVertical: 10 }]}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 60, backgroundColor: colors.white, borderRadius: 30, marginLeft: 20 }}>
                                            <Image source={{ uri: item.category.image }} style={{ height: 58, width: 58, borderRadius: 29 }} />
                                        </View>
                                        <View style={{ width: width - 120 }}>
                                            <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 16, color: colors.subTitleColor, marginRight: 10 }]}>{item.bonusRewardDesc}</Text>
                                            <View>
                                                <Text style={[styles.robotoBoldText, { marginLeft: 10, fontSize: 13, color: colors.subTitleColor }]}>{getDate(item.updatedAt)}</Text>
                                                <Text style={[styles.robotoBoldText, { fontSize: 18, position: 'absolute', right: 20, color: colors.subTitleColor, fontSize: 13, }]}>{getDateTime(item.updatedAt)}</Text>
                                            </View>


                                        </View>
                                        <View style={{ width: width - 120 }}>

                                        </View>
                                    </View>
                                </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(SpecialReward)

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
    ImageBackground: {
        width: width - 40,
        height: 100
    },
    container: {
        
        alignItems: 'center',
        width: width,
        
        overflow: 'hidden', 
        height: 250,
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