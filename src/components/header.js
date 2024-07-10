import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Header extends Component {
  render() {
    // console.log("cityName => ", this.props.cityName);
    return (
      <View style={{ flexDirection: 'column', backgroundColor: Colors.white,elevation:6 }} >
          <StatusBar barStyle='light-content'
                    hidden={false} backgroundColor={Colors.primary} />
       <SafeAreaView style={{ height: Platform.OS == 'ios' ? 50 : 50,
              paddingTop: Platform.OS == 'ios' ? 0 : 0,backgroundColor:Colors.primary, borderBottomWidth:1, borderBottomColor: Colors.background }}>

          <View
            style={{
              flex: 1,
              paddingHorizontal:10,
              flexDirection: 'row',
            justifyContent:'center',
              alignItems: 'center'}}>

            
              <TouchableOpacity style={{ flex: 0.20}} onPress={this.props.Back}>

                <View
                  style={{
                    height:40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal:5
                  }}>
                
                    {/* <Image
                      resizeMode="contain"
                      style={{ height: 22, width: 22,alignSelf:'flex-start', tintColor: Colors.white }}
                      source={require('../images/prev.png')}
                    /> */}
                  

                </View>
              </TouchableOpacity>
     
<View style={{flex: 0.60, alignItems:'center', justifyContent:'center', }}>
<Text
              style={{
               
              
                color: Colors.white,
                fontFamily: Fonts.SemiBold,
                fontSize: 18,

              }}
              numberOfLines={1}>
              {this.props.title}
            </Text>
</View>
           
             
<View style={{flex:0.20}} />
               
            
  
            
              </View>




        </SafeAreaView>
      </View>
    );
  }
}
