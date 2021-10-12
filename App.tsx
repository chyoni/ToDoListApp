import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';

interface IToDos {
  [key: number]: { text: string; work: boolean };
}

const STORAGE_KEY = '@toDos';

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
  const saveToDos = async (toSave: IToDos) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s !== null) {
        const parsedToDos = JSON.parse(s);
        setToDos(parsedToDos);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const addToDo = async (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): Promise<void> => {
    if (text === '') {
      return;
    }
    const newToDos: IToDos = {
      ...toDos,
      [Date.now()]: { text, work: isWork },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  useEffect(() => {
    loadToDos();
  }, []);
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
        {Object.keys(toDos).map((key) =>
          toDos[parseInt(key)].work === isWork ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[parseInt(key)].text}</Text>
            </View>
          ) : null
        )}
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
