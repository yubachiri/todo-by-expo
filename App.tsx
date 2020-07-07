import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TodoList from './screens/TodoList'
import CompletedList from './screens/CompletedList'

import firebaseApp from './functions/firebaseConfig'

export interface Todo {
  id: string
  content: string
  done: boolean
}

const Tab = createBottomTabNavigator();

export default function App() {
  firebaseApp.auth().signInAnonymously()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="TodoList" component={TodoList}/>
        <Tab.Screen name="Settings" component={CompletedList}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
