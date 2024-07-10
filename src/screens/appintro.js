import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import Fonts from '../common/Fonts';
import AppIntroSlider from '../components/AppIntro/appintromain';
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import FontSize from '../common/FontSize';
const slides = [
  {
    key: 'three',
    title: 'Meet “Two”',
    text: 'A friend & companion for your mental wellbeing. A buddy who will make sure you feel better, sleep better and understand your Mental Health Better',
    image: require('../images/intro3.png'),
    backgroundColor: '#22bcb5',
  },
  {
    key: 'two',
    title: 'Understand your Mental Health',
    text: 'Quizzes and Audio sessions, created by Neuropsychologist & other Mental Health experts just for you, so you could understand your Mental Health',
    image: require('../images/intro2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'one',
    title: 'Journey worth taking',
    text: 'Mental wellness is a Priority, and not a Luxury. Let’s take the first step towards prioritizing our Mental Health…',
    image: require('../images/intro1.png'),
    backgroundColor: '#59b2ab',
  },
];


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  image: {
    width: widthPercentageToDP('85%'),
    height: 500 * widthPercentageToDP('85%') / 500,
    marginTop: heightPercentageToDP('2%')
  },
  text: {
    color: 'black',
    fontSize: FontSize.small,
    paddingHorizontal: 20,
    paddingTop: 10,
    fontFamily: Fonts.Regular,
    textAlign: 'left',
  },
  title: {
    paddingHorizontal: 20,
    fontSize: FontSize.large,
    fontFamily: Fonts.Bold,
    color: 'black',
    textAlign: 'left',
  },
});

export default class AppIntro extends React.Component {

  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image resizeMode="contain" source={item.image} style={styles.image} />
        <View style={{ flex: 1, width: widthPercentageToDP('100%'), paddingHorizontal: 10, marginTop: heightPercentageToDP('5%') }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  }
  _onDone = () => {

    AsyncStorage.setItem('ifirst', '1');
    const pushAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
    this.props.navigation.dispatch(pushAction);
    this.setState({ showRealApp: true });
  }
  render() {

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar hidden={false} barStyle='dark-content' backgroundColor={"#ffffff"} />
        <TouchableOpacity style={{ padding: 12, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: "#fff", marginRight:5 }} onPress={() => {
          this._onDone()
        }}>
                            <Text style={{ fontFamily: Fonts.Light, color: "#000000", fontSize: FontSize.smedium, }}>{"Skip"}</Text>

                            <Image resizeMode="contain" source={require('../images/arrowright.png')} style={{ width: 15, height: 15, marginHorizontal: 5 }} />
                        </TouchableOpacity>
        <AppIntroSlider renderItem={this._renderItem} data={slides}
          showSkipButton
          showPrevButton onDone={this._onDone} onSkip={this._onDone} />
      </SafeAreaView>
    )

  }
}
