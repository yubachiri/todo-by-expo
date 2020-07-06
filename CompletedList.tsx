import React, {useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  Provider,
  Card
} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';
import TodoItem from './components/TodoItem'
import {Todo} from "./App";
import {fetchTodo} from "./functions/utils";

import firebaseApp from './functions/firebaseConfig'
import {useAuthState} from "react-firebase-hooks/auth";

export default function TodoList() {
  const [user, loading, error] = useAuthState(firebaseApp.auth())
  const [todos, setTodos] = React.useState<Todo[]>([]);

  useEffect(() => {
    fetchTodo(user, setTodos)
  }, [user])

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.centered}>
            <FlatList
              data={todos}
              renderItem={({item}) => {
                return (
                  <TodoItem
                    todo={item}
                    text={item.content}
                  />
                )
              }}
              keyExtractor={item => item.id}
              style={styles.list}
            />
          </Card.Content>
        </Card>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInput: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 40,
    width: 150,
    paddingHorizontal: 10,
    margin: 15
  },
  card: {
    width: vw(90),
    maxHeight: vh(90),
    marginTop: 20
  },
  centered: {
    alignItems: 'center'
  },
  list: {
    width: '100%',
    maxHeight: vh(70)
  }
});
