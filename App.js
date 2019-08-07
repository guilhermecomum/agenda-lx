import React, { Component, Fragment } from 'react';
import { ScrollView, Alert, Image, StyleSheet, Text, View, AsyncStorage,Platform, StatusBar } from 'react-native';
import { Toolbar, withTheme, Card } from 'react-native-material-ui'

import backupData from './assets/current.json'
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

class App extends Component {
  constructor(props){
    super(props);
    this.state = { isLoading: true };
  }

  saveEvents = async (events) => {
    try {
      await AsyncStorage.setItem("events", JSON.stringify(events));
    } catch (error) {
      Alert.alert('Error', 'There was an error.')
    }
  }

  restoreEvents = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("events");
      this.setState({ events: JSON.parse(storedValue) });
    } catch (error) {
      Alert.alert('Error', 'There was an error.')
    }
  }

  updateDB = async () => {
    await fetch('https://agendalx.pt/wp-json/agendalx/v1/events/current')
      .then((response) => response.json())
      .then((responseJson) => {
        this.saveEvents(responseJson)
        this.setState({
          isLoading: false,
          events: responseJson,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  componentDidMount(){
    this.restoreEvents();
    if (!this.state.events) {
      this.updateDB()
    }
  }

  render() {
    const { isLoading, events } = this.state

      return (
        <ScrollView style={styles.container}>
          <Toolbar centerElement="Agenda Lx" />
          {events && events.slice(0,10).map( event => (
            <Card key={event.ID}>
              <Image source={{uri: event.featured_media}}
                     style={{width: 400, height: 200}} />
              <View style={styles.innerCard}>
                <Text style={styles.cardTitle}>{event.title.rendered}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      );
  }
}

export default withTheme(App)

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT
  },
  innerCard: {
    padding: 10
  },
  cardTitle: {
    fontSize: 20
  }
});
