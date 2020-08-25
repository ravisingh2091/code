import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, fonts, localImages } from '../../../utils/constant'

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const heightPercent= Platform.OS === 'ios'?0.56:0.66
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * heightPercent;
export const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;


export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        minHeight: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 ,// needed for shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
        borderRadius:entryBorderRadius,
        backgroundColor:'rgba(255,255,255,1)'
    },
    shadow: {
        // position: 'absolute',
        // top: 0,
        // left: itemHorizontalMargin,
        // right: itemHorizontalMargin,
        // bottom: 18,
        // shadowColor: colors.black,
        // shadowOpacity: 0.25,
        // shadowOffset: { width: 0, height: 10 },
        // shadowRadius: 10,
        // borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
      ///  backgroundColor:colors.black ,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
       /// height:200
    },
    imageContainerEven: {
       // backgroundColor: colors.black,
       ///height:200
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
      ///  height:100
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: colors.black,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    robotoLightText: {
        fontFamily: fonts.robotoLight,
        color: colors.grayColor
    },
});
