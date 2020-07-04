import React from 'react'
import {StyleSheet, Text, View} from 'react-native';
import {Switch} from "react-native-paper";
import {Todo} from '../App'

interface Props {
  todo: Todo
  text: string
  handleTodoStatus: (todo: Todo, value: boolean) => void
}

const TodoItem: React.FC<Props> = ({ todo, text, handleTodoStatus }) => {
  const [isEnabled, setIsEnabled] = React.useState(todo.done);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.item}>
      <Switch
        // trackColor={{ false: "#767577", true: "#81b0ff" }}
        // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(value) => {
          toggleSwitch()
          handleTodoStatus(todo, value)
        }}
        value={isEnabled}
        // style={styles.switch}
      />
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
    // shadowOpacity: 0.75,
    // shadowRadius: 5,
    // shadowColor: 'black',
    // shadowOffset: { height: 5, width: 5 },
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,

  },
  text: {
    width: 260,
    margin: 5,
  }
});

export default TodoItem
