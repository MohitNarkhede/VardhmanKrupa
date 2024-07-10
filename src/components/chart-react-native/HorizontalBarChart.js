import React, { Component } from 'react'
import { View, Text, Animated, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { checkTheme } from '../../common/checkTheme'
import { ThemeContext } from '../ThemeProvider'
import Fonts from '../../common/Fonts'
import { widthPercentageToDP } from 'react-native-responsive-screen'
let max = 0;
let final = [];
export default class HorizontalBarChart extends Component {

  constructor(props) {
    super(props)
    this.props.data.forEach(d => {
      d.anim = new Animated.Value(0)
    })
  }

  static contextType = ThemeContext;
  componentDidMount() {
    max = Math.max(...this.props.data.map((d) => d.TotalCount))
    let num = parseInt(max/4);
    
    final = [];
    final.push(0);
    for(let i = 1; i<5; i++){
      final.push(num*i)
    }
    console.log(final);
    this.props.data.forEach((d, i) => {

      Animated.timing(
        d.anim,
        {
          toValue: (d.TotalCount * this.props.barMaxWidth) / max,
          duration: this.props.animationDuration,
          useNativeDriver: false,
        }
      ).start();
    });
  }

  render() {
    let max = Math.max(...this.props.data.map((d) => d.TotalCount))
    let num = parseInt(max/4);
    
    final = [];
    final.push(0);
    for(let i = 1; i<5; i++){
      final.push(num*i)
    }
    // console.log(final);
    return (
      <View style={{flex:1}}>
        
        <ScrollView>
      <View style={{ ...this.props.style, flexDirection: 'column', justifyContent: 'space-between', marginBottom:20,  borderLeftWidth: 1, borderBottomWidth: 1, borderColor: "#bdbdbd" }}>
        {this.props.data.map((d, i) => {
          // console.log(max);

          let ww = (parseInt((d.TotalCount * this.props.barMaxWidth) / Math.max(...this.props.data.map((d) => d.TotalCount))));
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <Text style={{ marginHorizontal: 10, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, width: widthPercentageToDP('20%') }} numberOfLines={2}>{d.Name}</Text>
              <View style={{ width: ww, height: this.props.barHeight, backgroundColor: checkTheme(this.context.theme).primary, borderTopRightRadius: 3, borderBottomRightRadius: 3 }} />
              <Text style={{ marginHorizontal: 2, fontSize: 12, fontFamily: Fonts.Light,  color: checkTheme(this.context.theme).black, padding: 2, borderRadius: 5 }}>{d.TotalCount}</Text>
            </View>
          )

        })}

        <View style={{ borderStyle: 'dashed',
        height:'100%',
        borderColor: checkTheme(this.context.theme).medium_gray,
        borderLeftWidth:1, position:'absolute', top: 0, left: widthPercentageToDP('25%')}}/>
 <View style={{ borderStyle: 'dashed',
        height:'100%',
        borderColor: checkTheme(this.context.theme).medium_gray,
        borderLeftWidth:1, position:'absolute', top: 0, left: widthPercentageToDP('40%')}}/>
<View style={{ borderStyle: 'dashed',
        height:'100%',
        borderColor: checkTheme(this.context.theme).medium_gray,
        borderLeftWidth:1, position:'absolute', top: 0, left: widthPercentageToDP('55%')}}/>

<View style={{ borderStyle: 'dashed',
        height:'100%',
        borderColor: checkTheme(this.context.theme).medium_gray,
        borderLeftWidth:1, position:'absolute', top: 0, left: widthPercentageToDP('70%')}}/>
<View style={{ borderStyle: 'dashed',
        height:'100%',
        borderColor: checkTheme(this.context.theme).medium_gray,
        borderLeftWidth:1, position:'absolute', top: 0, left: widthPercentageToDP('85%')}}/>

      
      </View>

      <Text style={{ left: widthPercentageToDP('25%')-5, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, position:'absolute', bottom:0 }} >{final[0]}</Text>
      <Text style={{ left: widthPercentageToDP('40%')-5, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, position:'absolute', bottom:0 }} >{final[1]}</Text>
      <Text style={{ left: widthPercentageToDP('55%')-5, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, position:'absolute', bottom:0 }} >{final[2]}</Text>
      <Text style={{ left: widthPercentageToDP('70%')-5, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, position:'absolute', bottom:0 }} >{final[3]}</Text>
      <Text style={{ left: widthPercentageToDP('85%')-5, fontSize: 14, fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black, position:'absolute', bottom:0 }} >{final[4]}</Text>

      </ScrollView>
       </View>
    )
  }
}

HorizontalBarChart.propTypes = {
  // animationDuration: PropTypes.number,
  barHeight: PropTypes.number,
  barMaxWidth: PropTypes.number,
}

HorizontalBarChart.defaultProps = {
  // animationDuration: 2000,
  barHeight: 30,
  barMaxWidth: 200,
}