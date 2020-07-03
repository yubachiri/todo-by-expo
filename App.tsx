import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput
} from 'react-native';
import TodoItem from './components/TodoItem'

import firebaseApp from './functions/firebaseConfig'

export interface Todo {
  id: string
  content: string
  done: boolean
}

export default function App() {
  const [todo, setTodo] = React.useState<Todo[]>([]);
  // const [completed, setCompleted] = React.useState<Todo[]>([]);
  const [value, onChangeText] = React.useState<string>('text');
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
    <SafeAreaView style={styles.container}>
      <Button title={"refetch"} onPress={fetchTodo}/>

      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        value={value}
        placeholder={'TODO'}
      />

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
    minWidth: '50%',
    paddingHorizontal: 10
  }
});
