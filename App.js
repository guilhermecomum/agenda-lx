import React, { Component, Fragment } from 'react';
import { ScrollView, Alert, StyleSheet, Text, AsyncStorage,Platform, StatusBar } from 'react-native';
import { Image, Card, View, Subtitle, Caption, Button, Icon } from '@shoutem/ui';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import AppNavigator from './navigation/AppNavigation';

import backupData from './assets/current.json'
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      fontsAreLoaded: false
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
      'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
      'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
      'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
      'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
      'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
      'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
      'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
      'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
      'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
      'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
    });

    this.setState({ fontsAreLoaded: true });
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

    if (!this.state.fontsAreLoaded) {
      return <AppLoading />
    }

    return (
      <ScrollView style={styles.container}>
        {events && events.slice(0,10).map( event => (
          <Card key={event.ID}>
            <Image
              styleName="featured"
              source={{uri: event.featured_media }}
            />
            <View styleName="content">
              <Subtitle>{event.title.rendered}</Subtitle>
              <Caption>{event.StartDate}</Caption>
            </View>
          </Card>
        ))}
        <AppNavigator />
      </ScrollView>
    );
  }
}

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
