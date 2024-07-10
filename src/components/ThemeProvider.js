import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, createContext } from 'react';

export const ThemeContext = createContext();

class ThemeProvider extends Component {
    state = {
        theme: 'light'
    }

    async componentDidMount(){
      const th = await AsyncStorage.getItem('themeMode');
      if(th){
      this.setState({
        theme: th
      })
    }
    }

    toggleTheme = (color) => {
        this.setState({ theme: color }, ()=> {
            AsyncStorage.setItem('themeMode', this.state.theme)
        });
    }

    render() {
        const { children } = this.props;
        return (
            <ThemeContext.Provider value={{...this.state, toggleTheme: this.toggleTheme }}>
            {children}
            </ThemeContext.Provider>
        );
    }
}

export default ThemeProvider;