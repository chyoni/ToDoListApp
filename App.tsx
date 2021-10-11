import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  KeyboardAvoidingView,
  Platform,
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
    // Object.assign은 특정 오브젝트의 기존값에 새로운 값을 추가한 뒤 그 오브젝트를 새로운 오브젝트로 return해주는 function이다.
    // 1번째 args는 새롭게 반환할 오브젝트, 2번째는 특정 오브젝트, 3,4,5 ...번째는 특정 오브젝트에 추가할 값을 넣어주면 된다.
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, work: isWork },
    });
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
    borderRadius: 15,
    fontSize: 17,
  },
});
