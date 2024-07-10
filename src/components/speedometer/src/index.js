/* eslint import/no-unresolved: [2, { ignore: ['react-native', 'react'] }] */
/* eslint radix: ["error", "as-needed"] */
import React, { Component } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

// Utils
import calculateDegreeFromLabels from './utils/calculate-degree-from-labels';
import calculateLabelFromValue from './utils/calculate-label-from-value';
import limitValue from './utils/limit-value';
import validateSize from './utils/validate-size';

// Style
import style, { width as deviceWidth } from './style';
import Fonts from '../../../common/Fonts';

// eslint-disable-next-line react/prefer-stateless-function
class Speedometer extends Component {
  constructor(props) {
    super(props);
    this.speedometerValue = new Animated.Value(props.defaultValue);
  }

  render() {
    const {
      value,
      size,
      minValue,
      maxValue,
      easeDuration,
      allowedDecimals,
      labels,
      needleImage,
      wrapperStyle,
      outerCircleStyle,
      halfCircleStyle,
      imageWrapperStyle,
      imageStyle,
      innerCircleStyle,
      labelWrapperStyle,
      labelStyle,
      labelNoteStyle,
      useNativeDriver,
    } = this.props;
    const degree = 180;
    const perLevelDegree = calculateDegreeFromLabels(degree, labels);
    const label = calculateLabelFromValue(
      limitValue(value, minValue, maxValue, allowedDecimals), labels, minValue, maxValue,
    );
    Animated.timing(
      this.speedometerValue,
      {
        toValue: limitValue(value, minValue, maxValue, allowedDecimals),
        duration: easeDuration,
        easing: Easing.linear,
        useNativeDriver,
      },
    ).start();

    const rotate = this.speedometerValue.interpolate({
      inputRange: [minValue, maxValue],
      outputRange: ['-100deg', '100deg'],
    });

    const currentSize = validateSize(size, deviceWidth - 20);
    return (
      <View style={[style.wrapper, {
        width: currentSize,
        height: currentSize / 2,
      }, wrapperStyle]}
      >
        <View style={[style.outerCircle, {
          width: currentSize,
          height: currentSize / 2,
          borderTopLeftRadius: currentSize / 2,
          borderTopRightRadius: currentSize / 2,
        }, outerCircleStyle]}
        >
          {labels.map((level, index) => {
            const circleDegree = 90 + (index * perLevelDegree);
            return (

              <View
                key={level.name}
                style={[style.halfCircle, {
                  width: currentSize / 2,
                  height: currentSize, backgroundColor: level.activeBarColor, borderWidth: 2, borderColor: 'white',
                  zIndex: -1,
                  borderRadius: currentSize / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [
                    { translateX: currentSize / 4 },
                    { rotate: `${circleDegree}deg` },
                    { translateX: (currentSize / 4 * -1) },
                  ],
                }, halfCircleStyle]}
              >

                <Text style={{
                  fontSize: 14,
                  color: 'black',
                  fontFamily: Fonts.Regular,

                  transform: [
                    { translateX: currentSize / 4 },
                    { rotate: `${205}deg` },
                    // { translateX: (currentSize / 4 * -1) },
                  ],
                  zIndex: 99999,
                  flex: 1,
                  backgroundColor: 'transparent'
                }}>{JSON.stringify(level.val)}</Text>

              </View>
            );
          })}
          <Text style={{
            fontSize: 14,
            color: 'black',
            fontFamily: Fonts.Regular,
            left: 10,
            transform: [
              //  { translateX: currentSize / 30 },
              { rotate: `${270}deg` },
              // { translateX: (currentSize / 4 * -1) },
            ],
            position: 'absolute',
            zIndex: 99999,

            backgroundColor: 'transparent'
          }}>{0}</Text>



          <Animated.View style={[style.imageWrapper,
          {
            top: -(currentSize / 15),
            transform: [{ rotate }],
          },
            imageWrapperStyle]}
          >
            <Image
              style={[style.image,
              {
                width: currentSize,
                height: currentSize,
              }, imageStyle]}
              source={needleImage}
            />
          </Animated.View>
          <View style={[style.innerCircle, {
            width: currentSize * 0.6,
            height: (currentSize / 2) * 0.6,
            borderTopLeftRadius: currentSize / 2,
            borderTopRightRadius: currentSize / 2,
          }, innerCircleStyle]}
          />
        </View>
        <View style={[style.labelWrapper, labelWrapperStyle]}>
          <Text style={
            [style.label, labelStyle]}
          >
            {limitValue(value, minValue, maxValue, allowedDecimals)} KW
          </Text>
          {/* <Text style={
            [style.labelNote, { color: label.labelColor, fontFamily: Fonts.Bold }, labelNoteStyle]}
          >
            {label.name}
          </Text> */}
        </View>
      </View>
    );
  }
}

Speedometer.defaultProps = {
  defaultValue: 0,
  minValue: 0,
  maxValue: 30,
  easeDuration: 500,
  allowedDecimals: 0,
  labels: [
    {
      name: 'Low',
      labelColor: '#0f0',
      activeBarColor: '#0f0',
      val: 5
    },
    {
      name: 'Medium',
      labelColor: '#ffd233',
      activeBarColor: '#ffd233',
      val: 10
    },
    {
      name: 'High',
      labelColor: '#ff9433',
      activeBarColor: '#ff9433',
      val: 15
    },
    {
      name: 'Extreme',
      labelColor: '#ce3333',
      activeBarColor: '#ce3333',
      val: 20
    },
    {
      name: 'Extreme1',
      labelColor: '#ce3333',
      activeBarColor: '#ce3333',
      val: 25
    },
    {
      name: 'Extreme2',
      labelColor: '#ce3333',
      activeBarColor: '#ce3333',
      val: 30
    },

  ],
  needleImage: require('../images/speedometer-needle.png'),
  wrapperStyle: {},
  outerCircleStyle: {},
  halfCircleStyle: {},
  imageWrapperStyle: {},
  imageStyle: {},
  innerCircleStyle: {},
  labelWrapperStyle: {},
  labelStyle: {},
  labelNoteStyle: {},
  useNativeDriver: true,
};

Speedometer.propTypes = {
  value: PropTypes.number.isRequired,
  defaultValue: PropTypes.number,
  size: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  easeDuration: PropTypes.number,
  allowedDecimals: PropTypes.number,
  labels: PropTypes.array,
  needleImage: PropTypes.any,
  wrapperStyle: PropTypes.object,
  outerCircleStyle: PropTypes.object,
  halfCircleStyle: PropTypes.object,
  imageWrapperStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  innerCircleStyle: PropTypes.object,
  labelWrapperStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  labelNoteStyle: PropTypes.object,
  useNativeDriver: PropTypes.bool,
};

export default Speedometer;
