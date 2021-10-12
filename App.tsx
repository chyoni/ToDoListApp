import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  ScrollView,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { theme } from './colors';

interface IToDos {
  [key: number]: { text: string; work: boolean };
}

export default function App() {
  const [isWork, setIsWork] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const [toDos, setToDos] = useState<IToDos>({});
  const work = (): void => {
    setIsWork(true);
  };
  const travel = (): void => {
    setIsWork(false);
  };
  const onChangeText = (payload: string): void => {
    setText(payload);
  };
  const addToDo = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): void => {
    if (text === '') {
      return;
    }
    const newToDos: IToDos = {
      ...toDos,
      [Date.now()]: { text, work: isWork },
    };
    setToDos(newToDos);
    setText('');
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: isWork ? theme.white : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !isWork ? theme.white : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        returnKeyType={'done'}
        placeholder={isWork ? 'Add a to do' : 'Where you want to go?'}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => {
          if (isWork) {
            if (toDos[parseInt(key)].work) {
              return (
                <View key={key} style={styles.toDo}>
                  <Text style={styles.toDoText}>
                    {toDos[parseInt(key)].text}
                  </Text>
                </View>
              );
            }
          } else {
            if (!toDos[parseInt(key)].work) {
              return (
                <View key={key} style={styles.toDo}>
                  <Text style={styles.toDoText}>
                    {toDos[parseInt(key)].text}
                  </Text>
                </View>
              );
            }
          }
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: theme.white,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 15,
    fontSize: 17,
  },
  toDo: {
    backgroundColor: theme.grey,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  toDoText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
});
