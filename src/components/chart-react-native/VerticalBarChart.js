import React, { Component } from 'react'
import { View, Text, Animated, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Fonts from '../../common/Fonts';

export default class VerticalBarChart extends Component {

  constructor(props) {
    super(props)
    this.props.data.forEach(d => {
      d.anim = new Animated.Value(0)
    })
    this.state = {
    }
  }

  componentDidMount() {
    const max = Math.max(...this.props.data.map((d) => JSON.parse(d.score)))
    console.log(max);
    this.props.data.forEach((d, i) => {
      Animated.timing(
        d.anim,
        {
          toValue: (JSON.parse(d.score) * this.props.barMaxHeight) / (max == 0 ? 1 : max),
          duration: this.props.animationDuration,
        }
      ).start();
    });
  }

  render() {
    return (
      <View style={{  flexDirection: 'column',  }}>
      <View style={{ ...this.props.style, flexDirection: 'row', justifyContent: 'space-between' }}>

        {this.props.data.map((d, i) => {
            return (
              

              <TouchableOpacity onPress={()=> {d.open = true;
  this.setState({refresh: !this.state.refresh})}} key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',  width: widthPercentageToDP('18%') }}>
                {!d.open ? 
                <Text style={{ color: "#000", ...this.props.textDataStyle }}>{d.score}</Text>
                : null }
              
              </TouchableOpacity>
              
            )
        })}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
         {this.props.data.map((d, i) => {
            return (
              <View key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  width: widthPercentageToDP('18%') }}>
                <Text style={{ color: "#ccc", ...this.props.textLabelStyle }}>{d.label}</Text>
              </View>
            )
        })}
        </View>

      </View>
    )
  }
}

VerticalBarChart.propTypes = {
  animationDuration: PropTypes.number,
  barWidth: PropTypes.number,
  barMaxHeight: PropTypes.number,
}

VerticalBarChart.defaultProps = {
  animationDuration: 2000,
  barWidth: 20,
  barMaxHeight: 200,
}