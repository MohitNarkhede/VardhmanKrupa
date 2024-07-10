import { StyleSheet } from 'react-native';
import Fonts from '../../../common/Fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    color: '#49658c',
    borderColor: '#49658c',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    backgroundColor: '#00000000',
    alignContent: 'center',
    justifyContent: 'center',
  },
  input1: {
    minHeight: 20,
    color:'#000',
    paddingVertical: 2,
    fontFamily: Fonts.Regular,
    zIndex: 10,
  },
  input: {
    minHeight: 48,
    color: '#000',
    paddingVertical: 5,
    flex: 1,
    fontFamily: Fonts.Regular,
    zIndex: 10,
  },
  img: {
    height: 25,
    width: 25,
    alignSelf: 'center',
  },
  toggleButton: {
    zIndex: 11,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  countdown: {
    position: 'absolute',
    right: 11,
    bottom: 0,
    color: '#49658c',
    fontSize: 10,
  },
});
