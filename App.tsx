import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  ScrollView,
  TextInputSubmitEditingEventData,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';

interface IToDos {
  [key: number]: { text: string; work: boolean; compleleted: boolean };
}

const STORAGE_KEY = '@toDos';
const TAB = '@tab';

export default function App() {
  const [isWork, setIsWork] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const [toDos, setToDos] = useState<IToDos>({});

  const saveTab = async (state: boolean): Promise<void> => {
    await AsyncStorage.setItem(TAB, JSON.stringify(state));
  };
  const loadTab = async (): Promise<void> => {
    try {
      const currentTab = await AsyncStorage.getItem(TAB);
      if (currentTab !== null) {
        setIsWork(JSON.parse(currentTab));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const work = async (): Promise<void> => {
    setIsWork(true);
    await saveTab(true);
  };
  const travel = async (): Promise<void> => {
    setIsWork(false);
    await saveTab(false);
  };
  const onChangeText = (payload: string): void => {
    setText(payload);
  };

  const saveToDos = async (toSave: IToDos): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async (): Promise<void> => {
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
  const completedToDo = (key: string): void => {
    Alert.alert('Completed To Do', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          const newToDos = { ...toDos };
          newToDos[parseInt(key)].compleleted = true;
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const deleteToDo = (key: string): void => {
    Alert.alert('Delete To Do', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[parseInt(key)];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const addToDo = async (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): Promise<void> => {
    if (text === '') {
      return;
    }
    const newToDos: IToDos = {
      ...toDos,
      [Date.now()]: { text, work: isWork, compleleted: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  useEffect(() => {
    loadTab();
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
            <View
              key={key}
              style={{
                ...styles.toDo,
                backgroundColor: toDos[parseInt(key)].compleleted
                  ? theme.green
                  : theme.grey,
              }}
            >
              <Text
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[parseInt(key)].compleleted
                    ? 'line-through'
                    : 'none',
                }}
              >
                {toDos[parseInt(key)].text}
              </Text>
              <View style={styles.actionView}>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => completedToDo(key)}
                >
                  <Fontisto name="check" size={18} color={theme.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.white} />
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
