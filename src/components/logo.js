
import React from 'react';
import {
     Text,
    View,
    Image,
    StatusBar,
    Dimensions,
 
} from 'react-native';
import { checkTheme } from '../common/checkTheme';
import { ThemeContext } from './ThemeProvider';

console.disableYellowBox = true;

const { width, height } = Dimensions.get('window')

export default class Logo extends React.Component{

static contextType = ThemeContext;
    render(){
        if(this.props.splash){
        return(
            // <SafeAreaView style={{ flex: 1}}>
             
                    <View style={{flexDirection:'column'}}>
               <Image
               resizeMode={'contain'} 
               style={{ height: 425 * width*.9/1600, width: width*.9, alignSelf:'center',   }}
                    source={require('../images/vkg.png')} />

               
</View>


             
            
    )
        } else {
            return(
                // <SafeAreaView style={{ flex: 1}}>
                 
                        <View style={{flexDirection:'column'}}>
                  <Image
               resizeMode={'contain'} 
               style={{ height: 425 * width*.7/1758, width: width*.7, alignSelf:'center',   }}
                    source={require('../images/vkg.png')} />
    </View>
    
    
                 
                
        )
        }
}

 

}