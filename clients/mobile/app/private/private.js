import React from 'react';
import { View, ListView, ScrollView, TextInput, Image, Button, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Vibration, Alert } from 'react-native';

import Logout from './login/logout';

import Lister from './lister/lister';

import moment from 'moment';


export default class PrivatePanel extends React.Component {

	constructor(props){

		super(props);

		this.state = {
			login: true,
			updated: moment().format()
		};

	}

	update(updated){

		this.setState({ updated });

	}

	logout(logout){

		this.props.onLogout(logout);

		this.setState({ login: false });

	}

	render() {

		return (
			<ScrollView style={styles.container}>

				<View style={styles.toolbar}>
                    <Logout style={styles.toolbarLogout} onLogout={(logout) => this.logout(logout) } />
                    <Text style={styles.toolbarText}>{this.state.updated}</Text>
                    <TouchableOpacity onPress={()=>{ this.lister.refresh() }} style={styles.toolbarRefresh}>
						<Image style={styles.toolbarRefreshIcon} source={require('../../media/refresh.png')} />
					</TouchableOpacity>
                </View>

				<Lister ref={lister=>{ this.lister = lister; }} login={this.state.login} update={(updated) => this.update(updated)} />

			</ScrollView>
		);

	}

}

const styles = StyleSheet.create({

	container:{
		alignSelf: 'stretch',
		flexDirection:'column'
	},

	toolbar:{
        backgroundColor:'#427FED',
        padding: 2,
        flexDirection:'row'
    },

    toolbarText: {
    	alignSelf: 'stretch',
    	margin: 6
    },

    toolbarButton:{
        width: 50,            //Step 2
        color:'#fff',
        textAlign:'center'
    },
    toolbarLogout:{
        margin: '5px'
    },
    toolbarRefresh: {
    	margin: 5
    },
    toolbarRefreshLabel: {
    	color: 'white'
    },
    toolbarRefreshIcon: {
    	width: 24, height: 24
    }
	
});