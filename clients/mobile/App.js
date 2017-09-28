import React from 'react';
import { ActivityIndicator, ListView, View, Button, StyleSheet, Text, StatusBar, Navigator } from 'react-native';



import Login from './app/public/login/login';

import PrivatePanel from './app/private/private';

import { StackNavigator } from 'react-navigation';






export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { login: false, loading: false };
  }


  onLogin(onLogin){

    onLogin.then(login => {

      this.setState({ loading: false });

      !login.error && this.setState({ login: true });

    });

  }

  onLogout(onLogout){

    this.setState({ loading: true });

    onLogout.then(logout => {

      this.setState({ loading: false });

      !logout.error && this.setState({ login: false });

    });

  }

  render() {

    var layout = [];

    if (!this.state.login) {

      layout.push(
        <Login key='login-panel' onLogin={(login) => this.onLogin(login)} />
      );

    } else {

      layout.push(
        <PrivatePanel key='dhl-lister' onLogout={(logout) => this.onLogout(logout)} />
      );

    }

    return (
      <View style={styles.container}>
        {layout}
      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    margin: 20
  }
});
