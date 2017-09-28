import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';

export default class Logout extends React.Component {

	constructor(props){
		super(props);
		this.state = { loading: false };
	}

	logout(){

		this.setState({ loading: true });

		return (
			this.doLogout()
				.then(response => {

					if (response.error) {
						this.setState({ loading: false });
						console.log('error', response.error);
						Alert.alert('Error:\nLogout request failed!');
						return { error: response.error };
					}

					var data = response.data;

					if (data.error) {
						this.setState({ loading: false });
						Alert.alert('Logout Error:\n' + data.error);
						return { error: data.error };
					}

					this.setState({ loading: false });
					return { message: data.message };

				})
		);

	}

	doLogout() {

		return (
			fetch('http://195.230.10.206:8080/api/logout', {
					method: 'post',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'  
					}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					return { error: false, data: responseJson };
				})
				.catch((error) => {
					console.log('Logout error: ', error);
					return { error };
				})
		);
	}

	render() {
		return (
			<View>

				<Button
					title='EXIT'
					color='#cc0000'
					style={styles.button}
					onPress={() => { this.props.onLogout(this.logout()) }} />

				{this.state.loading && <ActivityIndicator />}

			</View>
		);
	  }

}

const styles = StyleSheet.create({
	button: {
		color:'#cc0000',
        textAlign:'center',
	}
});