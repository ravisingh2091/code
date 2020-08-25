import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { slideWidth } from '../styles/SliderEntry.style';
import { colors, fonts, localImages } from '../../../utils/constant'
import Button, { ButtonWithoutShadow, ReturnButton, ButtonCalender } from '../../../components/Button'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faStar, faCheckSquare, faCoffee, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

var { height, width } = Dimensions.get('window');
export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: false, //PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image() {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
                source={{ uri: illustration }}
                containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
                style={styles.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
            />
        ) : (
                <Image
                    source={{ uri: illustration }}
                    style={styles.image}
                />
            );
    }

    render() {
        const { data, even, navigation, userId } = this.props;

        const uppercaseTitle = data.title ? (
            <Text
                style={[styles.title, even ? styles.titleEven : {}]}
                numberOfLines={2}
            >
                {data.title.toUpperCase()}
            </Text>
        ) : false;


        let favIndex = -1

        if (data.favoriteBy && data.favoriteBy.length > 0) {
            favIndex = data.favoriteBy.map(it => { return it.childId }).indexOf(userId)
        }

        return (
            <View
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => { }}
            >
                <TouchableOpacity onPress={() => this.props.onAction(data)} style={{ position: 'absolute', top: 20, right: 20 }}>
                    <Image source={favIndex == -1 ? localImages.star_o : localImages.star} style={{ height: 30, width: 30 }}></Image>
                </TouchableOpacity>
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}, { marginTop: 40 }]}>

                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: data.image }} style={{ height: 100, width: 100, borderRadius: 50 }}></Image>
                    </View>
                    <Text style={[styles.robotoBoldText, { textAlign: 'center', color: colors.titleText, marginTop: 15, fontSize: 17 }]}>{data.title}</Text>

                    <Text style={[styles.robotoRegularText, { textAlign: 'center', color: colors.grayColor, marginTop: 15, fontSize: 15 }]}>{data.preview}</Text>
                    {/* <WebView
                        originWhitelist={['*']}
                        source={{ html: data.description }}
                    /> */}
                    {/* <View><HTML html={data.description} imagesMaxWidth={Dimensions.get('window').width} /></View> */}

                    <View style={{ alignItems: 'center' }}>

                         <ButtonWithoutShadow
                            height={50}
                            backgroundColor={colors.childblue}
                            width={slideWidth - 40}
                            borderRadius={30}
                            marginTop={30}
                            marginBottom={100}
                            label="Read More"
                            labelColor={colors.white}
                            onAction={() => { navigation.navigate('EducationDetailsPage', { topic: data.description }) }}
                            fontFamily={fonts.robotoRegular}
                            fontSize={19}
                        ></ButtonWithoutShadow> 
                    </View>
                </View>

            </View>
        );
    }
}
