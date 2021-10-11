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
} from 'react-native';
import { theme } from './colors';

export default function App() {
  const [isWork, setIsWork] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const work = (): void => {
    setIsWork(true);
  };
  const travel = (): void => {
    setIsWork(false);
  };
  const onChangeText = (payload: string): void => {
    setText(payload);
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
        onChangeText={onChangeText}
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
