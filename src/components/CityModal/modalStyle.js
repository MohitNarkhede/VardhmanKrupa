import {StyleSheet, Dimensions} from 'react-native';
import Fonts from '../../common/Fonts';

const {width, height} = Dimensions.get('window');

const optionStyle = {
  flex: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
};

const optionTextStyle = {
  flex: 1,
  textAlign: 'left',
  color: '#000',
  fontSize: 14,
};

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    flex: 0,
    // color: Colors.white,
    fontSize: 18,
    paddingVertical: 5,
    fontFamily: Fonts.Medium,
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
    width: width,
    maxHeight: height,
    // backgroundColor: Colors.white,
    borderRadius: 5,
  },
  cancelContainer: {
    top: 30,
    right: 10,

    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // borderRadius: 10,
    // borderWidth:1,
    // borderColor:'#e3202d'
  },
  cancelButtonText: {
    // textAlign: 'center',
    // fontSize: 18,
    // color: "#fff"
  },
  filterTextInputContainer: {
    borderWidth: 1,
    // borderColor: Colors.primary,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  filterTextInput: {
    fontFamily: Fonts.Regular,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 0,
  },
  categoryStyle: {
    ...optionStyle,
  },
  categoryTextStyle: {
    ...optionTextStyle,
    color: '#999',
    fontFamily: Fonts.Regular,
    fontSize: 16,
  },
  optionStyle: {
    ...optionStyle,
  },
  optionStyleLastChild: {
    borderBottomWidth: 0,
  },
  optionTextStyle: {
    ...optionTextStyle,
  },
  selectedOptionStyle: {
    ...optionStyle,
  },
  selectedOptionStyleLastChild: {
    borderBottomWidth: 0,
  },
  selectedOptionTextStyle: {
    ...optionTextStyle,
    fontFamily: Fonts.Regular,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  noResultsText: {
    flex: 1,
    textAlign: 'center',
    // color: Colors.medium_gray,
    fontFamily: Fonts.Medium,
    fontSize: 18,
  },
});
