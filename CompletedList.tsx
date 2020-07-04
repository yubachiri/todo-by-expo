import React, {Dispatch, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {
  Provider,
  Button,
  Card
} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';
import TodoItem from './components/TodoItem'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import firebaseApp from './functions/firebaseConfig'
import {useAuthState} from "react-firebase-hooks/auth";
import {User} from "firebase";

const db = firebaseApp.firestore()

export interface Todo {
  id: string
  content: string
  done: boolean
}

const addTodo = async (text: string, uid: string, setTodo: Dispatch<string>, fetchTodo: () => void) => {
  await db
    .collection('todos')
    .doc(uid)
    .collection('todos')
    .add({
      content: text,
      done: false
    })

  setTodo('')
  fetchTodo()
}

const handleDone = async (todo: Todo, user: User, fetchTodo: () => void) => {
  await db
    .collection("todos")
    .doc(user.uid)
    .collection("todos")
    .doc(todo.id)
    .set({
      content: todo.content,
      done: true
    })

  fetchTodo()
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, loading, error] = useAuthState(firebaseApp.auth())

  const [todo, setTodo] = React.useState<string>('');
  const [todos, setTodos] = React.useState<Todo[]>([]);
  // const [completed, setCompleted] = React.useState<Todo[]>([]);
  const db = firebaseApp.firestore();
  firebaseApp.auth().signInAnonymously()

  const fetchTodo = async () => {
    const todos: Todo[] = []
    const completeds: Todo[] = []

    if (!user) {
      return
    }

    const todoSnapshot = await db
      .collection("todos")
      .doc(user.uid)
      .collection("todos")
      .where("done", "==", false)
      .get()

    todoSnapshot.forEach((doc) => {
      const {content, done} = doc.data()
      const todo = {
        id: doc.id,
        content: content || "contentが取得できませんでした",
        done: done || false
      }
      todos.push(todo)
    })

    setTodos(todos)

    // FIXME: サボってコピペした 共通化したい
    // const completedSnapshot = await db.collection("tweets")
    //   .where("done", "==", true)
    //   .get()
    //
    // completedSnapshot.forEach((doc) => {
    //   const {content, done} = doc.data()
    //   const todo = {
    //     id: doc.id,
    //     content: content || "contentが取得できませんでした",
    //     done: done || true
    //   }
    //   completeds.push(todo)
    // })
    //
    // setCompleted(completeds)
  }

  useEffect(() => {
    fetchTodo()
  }, [user])

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.centered}>
            <TextInput
              style={styles.textInput}
              onChangeText={setTodo}
              value={todo}
              placeholder={'TODO'}
            />

            <Button
              mode={"contained"}
              onPress={() => addTodo(todo, user?.uid || '', setTodo, fetchTodo)}
            >
              追加する
            </Button>

            <Text>
              {!loading && !error && user?.uid}
            </Text>
            {/*未完のTODO*/}
            <FlatList
              data={todos}
              renderItem={({item}) => {
                return (
                  <TodoItem
                    todo={item}
                    text={item.content}
                    handleDone={() => {
                      if (!user) {
                        return
                      }
                      handleDone(item, user, fetchTodo)
                    }}
                  />
                )
              }}
              keyExtractor={item => item.id}
              style={styles.list}
            />
          </Card.Content>
        </Card>

        {/*完了済みのTODO*/}
        {/*<FlatList*/}
        {/*  data={completed}*/}
        {/*  renderItem={({item}) => {*/}
        {/*    return (*/}
        {/*      <TodoItem*/}
        {/*        todo={item}*/}
        {/*        text={item.content}*/}
        {/*        handleTodoStatus={(todo, value) => {*/}
        {/*          handleDone(todo, value)*/}
        {/*          fetchTodo()*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )*/}
        {/*  }}*/}
        {/*  keyExtractor={item => item.id}*/}
        {/*/>*/}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: 50
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
    maxHeight: vh(80)
  },
  centered: {
    alignItems: 'center'
  },
  list: {
    width: '100%',
    maxHeight: vh(50)
  }
});
