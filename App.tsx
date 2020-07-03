import React, {useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import TodoItem from './components/TodoItem'
import {
  Provider,
  Button,
  Card
} from 'react-native-paper';

import firebaseApp from './functions/firebaseConfig'
import { useAuthState } from "react-firebase-hooks/auth";

export interface Todo {
  id: string
  content: string
  done: boolean
}

export default function App() {
  const [user, loading, error] = useAuthState(firebaseApp.auth())

  const [todo, setTodo] = React.useState<Todo[]>([]);
  // const [completed, setCompleted] = React.useState<Todo[]>([]);
  const [value, onChangeText] = React.useState<string>('');
  const db = firebaseApp.firestore();
  firebaseApp.auth().signInAnonymously()

  const fetchTodo = async () => {
    const todos: Todo[] = []
    const completeds: Todo[] = []

    const todoSnapshot = await db.collection("tweets")
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

    setTodo(todos)

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

  const handleDone = (todo: Todo, status: boolean) => {
    db
      .collection("tweets")
      .doc(todo.id)
      .set({
        content: todo.content,
        done: status
      })
  }

  useEffect(() => {
    fetchTodo()
  }, [])

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.centered}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeText}
              value={value}
              placeholder={'TODO'}
            />

            <Button
              mode={"contained"}
              style={styles.addButton}
            >
              追加する
            </Button>

            <Text>
              {!loading && !error && user?.uid}
            </Text>
          </Card.Content>
        </Card>

        {/*未完のTODO*/}
        <FlatList
          data={todo}
          renderItem={({item}) => {
            return (
              <TodoItem
                todo={item}
                text={item.content}
                handleTodoStatus={(todo, value) => {
                  handleDone(todo, value)
                  fetchTodo()
                }}
              />
            )
          }}
          keyExtractor={item => item.id}
        />

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
    justifyContent: 'center',
  },
  textInput: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 40,
    width: 150,
    paddingHorizontal: 10
  },
  addButton: {
    margin: 20
  },
  card: {
    width: '80%',
    maxHeight: 300
  },
  centered: {
    alignItems: 'center'
  }
});
