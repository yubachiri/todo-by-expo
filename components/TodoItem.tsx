import React from 'react'
import {StyleSheet, Text, View} from 'react-native';
import {Switch} from "react-native-paper";
import {Todo} from '../App'

interface Props {
  todo: Todo
  text: string
  handleDone?: () => void
}

const TodoItem: React.FC<Props> = ({ todo, text, handleDone }) => {
  const [isEnabled, setIsEnabled] = React.useState(todo.done);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const switchComponent = () => {
    if(!!handleDone) {
      return (
        <Switch
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            toggleSwitch()
            handleDone()
          }}
          value={isEnabled}
        />
      )
    }
  }

  return (
    <View style={styles.item}>
      {switchComponent()}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 50,
    margin: 5
  },
  item: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  text: {
    width: 260,
    margin: 5,
  }
});

export default TodoItem
