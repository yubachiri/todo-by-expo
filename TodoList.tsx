import React, {Dispatch, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import {
  Provider,
  Button,
  Card
} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';
import TodoItem from './components/TodoItem'

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

export default function TodoList() {
  const [user, loading, error] = useAuthState(firebaseApp.auth())

  const [todo, setTodo] = React.useState<string>('');
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const db = firebaseApp.firestore();

  const fetchTodo = async () => {
    if (!user) {
      return
    }

    const todos: Todo[] = []

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
  }

  useEffect(() => {
    fetchTodo()
  }, [user])

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
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
