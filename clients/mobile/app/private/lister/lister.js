import React from 'react';
import { View, ListView, TextInput, Button, StyleSheet, Text, ActivityIndicator, Vibration, StatusBar, Alert } from 'react-native';


import SocketIOClient from 'socket.io-client';

import moment from 'moment';

var PushNotification = require('react-native-push-notification');






import BackgroundJob from 'react-native-background-job';

BackgroundJob.register({
  jobKey: 'testJob',
  job: () => console.log('running')
});



export default class Lister extends React.Component {

	localPacks = {};

	constructor(props){

		super(props);

		this.socket = SocketIOClient('http://195.230.10.206:3210');

		this.socket.on('dhl', (message) => {

			if (message === 'refresh') {
				this.refresh();
			}

			if (message === 'notify') {
				PushNotification.localNotification({
					title: 'notify ',
					message: 'notify socket message',
					repeatType: 'minute'
				});
			}

		});

		this.state = { loading: false };

		this.refresh();

	}

	componentDidMount() {


		BackgroundJob.schedule({
		  jobKey: 'testJob',
		  period: 5000,
		  timeout: 10000,
		  exact: true
		});
		
	}

	refresh(){
		if (this.state.loading && this.state.loading === false){
			this.setState({ loading: true });
		}

		this.load().then((data) => {

			let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

			this.setState({
				loading: false,
				date: data.date,
				dataSource: ds.cloneWithRows(data.data)
			});

			this.props.update(moment().format('H:mm:ss'));

		})

	}

	load(){

		return (
			this.doLoad()
				.then(response => {

					if (response.error) {
						//this.setState({ loading: false });
						console.log('error', response.error);
						Alert.alert('Error:\nLogin request failed!');
						//Vibration.vibrate();
						return { error: response.error };
					}

					var data = response.data;

					if (data.error) {
						//this.setState({ pass: '', loading: false });
						Alert.alert('Login Error:\n' + data.error);
						//Vibration.vibrate();
						return { error: data.error };
					}

					return { data: data.data, date: data.date };

				})
		);

	}

	doLoad(data) {

		return (
			fetch('http://195.230.10.206:8080/api/list')
				.then((response) => response.json())
				.then((responseJson) => {
					return { error: false, data: responseJson };
				})
				.catch((error) => {
					console.log('Lister error: ', error);
					return { error };
				})
		);
	}

	logout(logout){

		this.props.onLogout(logout)

	}

	render() {

		var localPacks = this.localPacks || {};

		if ( this.state && this.state.dataSource ) {

			return (
				<View>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={(row) => {

							var comps = [];
							var packs = row.data.split('^');

							packs.forEach(function(pack){

								var pack = pack.split('*');

								if ( pack[1] == '1' ) {
									comps.push(
										<Text key={pack[0]} style={styles['packStat' + pack[1]]}>{pack[0]} {pack[2]}</Text>
									);
								} else {
									if ( pack[3] !== '' && pack[4] !== '' ) {
										comps.push(
											<Text key={pack[0]} style={styles['packStat' + pack[1]]}>{pack[0]} {pack[3]} {pack[4]}</Text>
										);
									} else {
										comps.push(
											<Text key={pack[0]} style={styles['packStat2']}>{pack[0]}</Text>
										);
									}
								}

								if ( !localPacks[pack[0]] ) {
									localPacks[pack[0]] = pack[1];
								} else {
									if ( localPacks[pack[0]] !==  pack[1]) {
										localPacks[pack[0]] = pack[1];
										PushNotification.localNotification({
											title: 'Кашон ' + pack[0],
											message: 'Пристигна в ' + pack[4] + ' в ' + pack[2],
											repeatType: 'minute'
										});
									}

								}

							});

							

							return (
								<View key="awb-{row.awb}">
									<Text style={styles.awbHead}>{row.awb}</Text>
									{comps}
								</View>
							);
						}} />
				</View>
				
			);

		} else {

			return (<Text>loading</Text>);

		}

	}

}

const styles = StyleSheet.create({

	awbHead: {
		color: '#ffffff',
		fontWeight: 'bold',
		backgroundColor: '#ffcc00',
		alignSelf: 'stretch',
		textAlign: 'center'
	},

	packStat2: {
		color: '#cc0000',
		padding: 2
	},

	packStat1: {
		color: '#5cb85c',
		padding: 2
	},

	packStat0: {
		color: '#f0ad4e',
		padding: 2
	},
	

});