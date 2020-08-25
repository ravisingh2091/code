import React, { useState, useEffect } from 'react'
import {TouchableOpacity, Image, View, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actions } from "../../reduxActionAndReducer/reducer";
import { colors , fonts,localImages} from '../../utils/constant'

import AppIntroSlider from 'react-native-app-intro-slider';

var { height, width } = Dimensions.get('window');



const slides = [
  {
    key: 'somethun',
    title: 'Rewards',
    text: 'Create tasks to reward your kids',
    backgroundColor: '#59b2ab',
    index:0
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    backgroundColor: '#febe29',
    index:1
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\nLorem ipsum bla bla bla',
    backgroundColor: '#22bcb5',
    index:2
  }
];
const Introduction = (props) => {
  const { setLoggedInUserAuthToken } = props;
  useEffect(() => {

    // props.setLoggedInUserAuthToken('yes')
    console.log(props.loginStatus)
    setLoggedInUserAuthToken('yes')
  }, [setLoggedInUserAuthToken])


  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        
      </View>
    );
  };
  gotoNextScreen=()=>{
   props.setIntroStatsStatus(true)
    //props.navigation.navigate('LandingLogin')
  }
  _renderDoneButton = () => {
    return (
      <TouchableOpacity  onPress={()=>gotoNextScreen()} style={styles.buttonCircleDone}>
         <Text style={styles.actionText}>Done</Text>
      </TouchableOpacity>
    );
  };

  _renderSkipButton = (index) => {
    return (
      <TouchableOpacity onPress={()=>gotoNextScreen()} style={styles.buttonCircle}>
        <Text style={styles.actionText}>{slides.length-1==index?'Done':'Skip'}</Text>
      </TouchableOpacity>
    );
  };


  _renderItem = (item) => {
    console.log(item.item)
    return (
      <LinearGradient colors={[colors.gradientGreenOne, colors.gradientGreenTwo, colors.gradientGreenThree]} style={styles.linearGradient}>
        {_renderSkipButton(item.item.index)}
        <Text style={styles.title}>{item.item.title}</Text>
        <Text style={styles.text}>{item.item.text}</Text>
        <Image source={localImages.intro_one} style={{ height: height - 300, width: (height - 300) * .502 }} />

      </LinearGradient>
    );
  }

  _onSkip=()=>{
   console.log('on skip')
  }
  _onDone=()=>{
    console.log('on done')
  }
  return (

    <AppIntroSlider
      slides={slides}
      renderItem={(item) => this._renderItem(item)}
      showSkipButton={false}
      showNextButton={false}
      showDoneButton={false}
      renderDoneButton={this._renderDoneButton}
      // renderNextButton={this._renderNextButton}
      renderSkipButton={this._renderSkipButton}
      onSkip={this._onSkip}
      onDone={this._onDone}
    />
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
    setIntroStatsStatus: token => {
      dispatch(actions.setIntroStatsStatus(token));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Introduction)

var styles = StyleSheet.create({
  linearGradient: {
    //flex: 1,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 16,
    fontFamily: fonts.robotoRegular,
    marginBottom: 20,
    
  },
  title: {
    fontSize: 25,
    color: colors.white,
    fontFamily:fonts.robotoMedium,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonCircle: {
    position:'absolute',
    top:Platform.OS=='ios'?50:20,
    right:20,
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
  actionText:{
    fontFamily:fonts.robotoRegular,
    fontSize:13,
    color:colors.white
  }
});