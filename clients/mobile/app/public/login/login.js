import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Vibration, Alert } from 'react-native';

export default class Login extends React.Component {

	constructor(props){
		super(props);
		this.state = { pass: '', loading: false };
	}

	login(){

		var { pass } = this.state;

		if ( pass === '' ) {
			Alert.alert('Error: Empty field!');
			//Vibration.vibrate();
			return new Promise(function(resolve, reject) {
				resolve({ error: 'Error: Empty field!' });
			});
		}

		this.setState({ loading: true });

		return (
			this.doLogin({ pass })
				.then(response => {

					if (response.error) {
						this.setState({ loading: false });
						console.log('error', response.error);
						Alert.alert('Error:\nLogin request failed!');
						//Vibration.vibrate();
						return { error: response.error };
					}

					var data = response.data;

					if (data.error) {
						this.setState({ pass: '', loading: false });
						Alert.alert('Login Error:\n' + data.error);
						//Vibration.vibrate();
						return { error: data.error };
					}

					this.setState({ loading: false });
					return { message: data };

				})
		);

	}

	doLogin(data) {

		var
			esc = encodeURIComponent,
			body = Object
				.keys(data)
				.map(k => esc(k) + '=' + esc(data[k]))
				.join('&');

		return (
			fetch('http://195.230.10.206:8080/api/login', {
					method: 'post',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'  
					},
					body: body
				})
				.then((response) => response.json())
				.then((responseJson) => {
					return { error: false, data: responseJson };
				})
				.catch((error) => {
					console.log('Login error: ', error);
					return { error };
				})
		);
	}

	render() {
		return (
			<View style={styles.container}>

				<Text>Login:</Text>

				<TextInput
					placeholder = 'password'
					onChangeText = {(text) => this.setState({ pass: text })}
					value = {this.state.pass}
					style = {styles.input}
					keyboardType = 'phone-pad'
					//secureTextEntry = {true}
					//password={true}
					autoFocus = {true} />

				<Button
					title='Enter'
					onPress={() => { this.props.onLogin(this.login()) }} />

				{this.state.loading && <ActivityIndicator />}

			</View>
		);
	  }

}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: 'center', alignItems: 'center'
	},
	input: {
		height: 40, width: 160,
		margin: 5, padding: 5, textAlign: 'center',
		borderColor: 'gray', borderWidth: 1, borderRadius: 4
	}
	
});