import React, { useState, useEffect } from 'react'
import { View,StatusBar,TouchableWithoutFeedback,Image,Text,TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
var { height, width } = Dimensions.get('window');
import { colors, fonts, localImages } from '../utils/constant'
import Video, {
    OnSeekData,
    OnLoadData,
    OnProgressData,
} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { FullscreenClose, FullscreenOpen } from '../../assets/icons/index';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar'
import { RNS3 } from 'react-native-aws3';
var { height, width } = Dimensions.get('window');
var player
var videoRef
const VideoPlayerUi = (props) => {
    let {onAction}=props
    const [fullscreen, setfullscreen] = useState(false)
    const [play, setplay] = useState(true)
    const [currentTime, setcurrentTime] = useState(0)
    const [duration, setduration] = useState(0)
    const [showControls, setshowControls] = useState(true)
    useEffect(() => {
        console.log('props', props)
        Orientation.addOrientationListener(handleOrientation);

        return () => {
            Orientation.removeOrientationListener(handleOrientation);
        };
    }, [])

    function handleOrientation(orientation: string) {
        orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
            ? (setfullscreen(true), StatusBar.setHidden(true))
            : (setfullscreen(false),
                StatusBar.setHidden(false));
    }


    function handleFullscreen() {
        fullscreen
            ? Orientation.unlockAllOrientations()
            : Orientation.lockToLandscapeLeft();
    }

    function handlePlayPause() {
        // If playing, pause and show controls immediately.
        if (play) {
            // setState({...state, play: false, showControls: true});
            setplay(false)
            setshowControls(true)
            return;
        }
        setplay(true)
        // setshowControls(true)
        // setState({...state, play: true});
        setTimeout(() => setshowControls(false), 2000);
    }

    function skipBackward() {
        videoRef.seek(currentTime - 15);
        // setState({...state, currentTime: state.currentTime - 15});

        setcurrentTime(currentTime - 15)
    }

    function skipForward() {
        videoRef.seek(currentTime + 15);
        //setState({...state, currentTime: state.currentTime + 15});
        setcurrentTime(currentTime + 15)
    }

    function onSeek(data: OnSeekData) {
        console.log(videoRef)

        //   if(videoRef.current){
        videoRef.seek(data.seekTime);
        //   }

        //setState({...state, currentTime: data.seekTime});
        setcurrentTime(data.seekTime)
    }

    function onLoadEnd(data: OnLoadData) {
        // setState(s => ({
        //   ...s,
        //   duration: data.duration,
        //   currentTime: data.currentTime,
        // }));

        setduration(data.duration)
        setcurrentTime(data.currentTime)
    }

    function onProgress(data: OnProgressData) {
        setcurrentTime(data.currentTime)
        // setState(s => ({
        //   ...s,
        //   currentTime: data.currentTime,
        // }));
    }

    function onEnd() {
        setplay(false)
        // setState({...state, play: false});
        videoRef.seek(0);
    }

    function showControlsFunc() {
        showControls
            ? setshowControls(false)
            : setshowControls(true);
    }

    return (
<View>
        {Platform.OS !='ios' ?<TouchableWithoutFeedback onPress={showControlsFunc}>
        <View>
            <Video
                //ref={videoRef}
                ref={(ref) => {
                    videoRef = ref
                }}
                source={{
                    uri:
                    props.source,
                }}
                style={fullscreen ? styles.fullscreenVideo : styles.video}
                controls={false}
                resizeMode={'contain'}
                onLoad={onLoadEnd}
                onProgress={onProgress}
                onEnd={onEnd}
                paused={!play}
            />
            {showControls && (
                <View style={styles.controlOverlay}>
                    <TouchableOpacity
                        onPress={handleFullscreen}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.fullscreenButton}>
                       {fullscreen  && !props.hidefull? <Image source={FullscreenClose} style={{ height: 30, width: 30 }} /> :!props.hidefull? <Image source={FullscreenOpen} style={{ height: 30, width: 30 }} />:null}  
                    </TouchableOpacity>
                    <PlayerControls
                        onPlay={handlePlayPause}
                        onPause={handlePlayPause}
                        playing={play}
                        showPreviousAndNext={false}
                        showSkip={true}
                        skipBackwards={skipBackward}
                        skipForwards={skipForward}
                    />
                    <ProgressBar
                        currentTime={currentTime}
                        duration={duration > 0 ? duration : 0}
                        onSlideStart={handlePlayPause}
                        onSlideComplete={handlePlayPause}
                        onSlideCapture={onSeek}
                    />
                </View>
            )}
        </View>
    </TouchableWithoutFeedback>:
    
    <Video
    source={{
      uri:
        props.source,
    }}
    style={styles.video}
    controls={true}
    resizeMode={'cover'}
  />
  
    }
    </View>
    )
}


export default VideoPlayerUi

var styles = StyleSheet.create({
    button: {
      
        paddingHorizontal:15,
        
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
       fontFamily:fonts.robotoRegular,
       fontSize:19
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      video: {
        height: 250,
        width: Dimensions.get('window').width-40,
        backgroundColor: 'black',
    },
    fullscreenVideo: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
        backgroundColor: 'black',
    },
    text: {
        marginTop: 30,
        marginHorizontal: 20,
        fontSize: 15,
        textAlign: 'justify',
    },
    fullscreenButton: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    controlOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000c4',
        justifyContent: 'space-between',
    },

});
