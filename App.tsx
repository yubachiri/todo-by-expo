import React from 'react';
import TodoList from './screens/TodoList'
import CompletedList from './screens/CompletedList'

import firebaseApp from './functions/firebaseConfig'
import {StyleSheet, Dimensions, Text} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

export interface Todo {
  id: string
  content: string
  done: boolean
}

const initialLayout = {width: Dimensions.get('window').width};

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'TODO'},
    {key: 'second', title: 'COMPLETED'},
  ]);

  firebaseApp.auth().signInAnonymously()

  const FirstRoute = () => (
    <TodoList/>
  );

  const SecondRoute = () => (
    <CompletedList/>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'blue'}}
      style={{backgroundColor: '#EEEEEE'}}
      renderLabel={({route, focused}) => {
        return (
          <Text style={{color: focused ? 'blue' : 'gray', margin: 8}}>
            {route.title}
          </Text>
        )
      }}
    />
  )

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      tabBarPosition={'bottom'}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
