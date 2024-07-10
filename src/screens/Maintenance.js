import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  PrefManager,
  Dimensions,
  BackHandler,
  ScrollView,
  NetInfo,
  SafeAreaView
} from "react-native";
import Fonts from "../common/Fonts";

var width = Dimensions.get("window").width;

export default class Maintenance extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {


  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>

        <View style={styles.container}>

          <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
            <View
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
              <Image
                // resizeMode={'contain'}
                style={{ width: width * 0.8, height: width * 0.8 }}
                source={require('../images/bg.png')}
              />
            </View>
            <View style={{ flex: 1, alignItems: "center", marginHorizontal: 20 }}>
              <Text
                style={{ fontSize: 20, fontFamily: Fonts.Bold, color: 'black' }}>
                Application
            </Text>

              <Text
                style={{ fontSize: 20, fontFamily: Fonts.SemiBold, color: "black" }}>
                Under Maintenance
            </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontFamily: Fonts.Regular,
                  color: 'black',
                  paddingVertical: 30
                }}
              >
                Sorry for the inconvenience but we are performing some maintenance
                at the moment. If you need to you can always contact us.
            </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});
