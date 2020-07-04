import React from 'react';
import {
  Text,
  View
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TodoList from './TodoList'

import firebaseApp from './functions/firebaseConfig'

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  firebaseApp.auth().signInAnonymously()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="TodoList" component={TodoList}/>
        <Tab.Screen name="Settings" component={SettingsScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
