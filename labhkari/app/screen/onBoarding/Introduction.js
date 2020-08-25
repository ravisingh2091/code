import React, { useState, useEffect, Component } from 'react'
import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { colors, fonts, localImages } from '../../utils/constant'
import SharedClass from '../../utils/SharedClass'
import AppIntroSlider from 'react-native-app-intro-slider';

var { height, width } = Dimensions.get('window');



const slides = [
  {
    key: 'somethun',
    title: 'Rewards',
    text: 'Create tasks to reward your kids',
    backgroundColor: '#59b2ab',
    index: 0
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    backgroundColor: '#febe29',
    index: 1
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\nLorem ipsum bla bla bla',
    backgroundColor: '#22bcb5',
    index: 2
  }
];
class Introduction extends Component {
  constructor(props) {
    super(props);
    this.sharedClass = new SharedClass();
    this.state = {
      isDateTimePickerVisible: false,
      month: '',
      date: '',
      year: '',
      time: '',
      throws: '',
      currentIndex: 0,
      isLoading: false,
      dataSource: [

        {
          title: 'Item 1',
          activity: '',
          activityCount: '',
          activityPer: '',
          reminder: [],
          reminderTime: '11:59 PM'

        },
      ]
    }

  }
  static navigationOptions = ({ navigation }) => ({

    headerStyle: {
      backgroundColor: '#0A3BB4',
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,

      }, elevation: 0,
      shadowRadius: 0,
    },
    headerTintColor: '#FFF',


    headerTitle: (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={{ fontFamily: 'Roboto-Regular', color: '#FFF', fontSize: 18, lineHeight: 18 }}>Create Action Plan</Text>
      </View>
    ),
    headerRight: (
      // <TouchableOpacity onPress={navigation.getParam('increaseAction')}>
      //     <Image
      //             style={{width:20, height: 20,marginRight:10}}
      //             source={require('../assets/icon/add.png')}
      //           />
      // </TouchableOpacity>
      <View></View>
    )
  })
  _renderItem = ({ item }) => {
    return (
      <SafeAreaView>
        <View style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} />
          <Text style={styles.text}>{item.text}</Text>
        </View>

      </SafeAreaView>

    );
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
    this.props.navigation.navigate('LoginScreen')
  }
  render() {
    //alert()

    return (
      // <SafeAreaView>
      <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone} />
      // </SafeAreaView>

    );
  }

}


export default (Introduction)

var styles = StyleSheet.create({
  slide: {
    backgroundColor: 'blue',
    height: height
  },
  linearGradient: {
    //flex: 1,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 16,
    fontFamily: fonts.robotoRegular,
    marginBottom: 20,

  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontFamily: fonts.robotoMedium,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonCircle: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 50 : 20,
    right: 20,
    // top:-height+(Platform.OS=='ios'?135 :80),
    // right:-width+30,
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCircleDone: {
    // position:'absolute',
    // top:-height+(Platform.OS=='ios'?135 :80),
    // right:-2,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: fonts.robotoRegular,
    fontSize: 13,
    color: "#fff"
  }
});