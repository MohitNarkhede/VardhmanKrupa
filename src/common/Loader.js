import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Image, Text,
  ActivityIndicator
} from 'react-native';
import { ThemeContext } from '../components/ThemeProvider';
import { checkTheme } from './checkTheme';
import Colors from './Colors'



class Loader extends PureComponent<props> {
  state = {
   
  };

  static contextType = ThemeContext;


  render() {
    
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center', marginTop: 10,
    justifyContent: 'space-around'
  }
});

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={this.props.loading}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size="large" color={"#4d4e4e"}
            animating={this.props.loading} />
        </View>
      </View>
    </Modal>
  )
}
}



export default Loader;
