import React from 'react'
import { Button, StyleSheet, View, Text, TextInput, StatusBar } from 'react-native'

interface IProps {
  message: string
  handlePassword: (password: string) => void
  handleUsername: (username: string) => void
  handleSubmit: () => void
  formName: string
}
const LoginOrRegister = ({
  message,
  handlePassword,
  handleUsername,
  handleSubmit,
  formName,
}: IProps) => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <View>
        <Text style={styles.message}>{message ? message : null}</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={{ alignSelf: 'center' }}>Please {formName}</Text>
        <TextInput
          style={styles.input}
          placeholder='username'
          onChangeText={handleUsername}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder='password'
          onChangeText={handlePassword}
        />
        <View style={styles.button}>
          <Button title={formName} onPress={handleSubmit} color='#fff' />
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2196F3',

    padding: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'slategray',
    borderRadius: 5,
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#2196F3',

    padding: 5,
    marginTop: 5,
  },
  message: {
    color: 'red',
    margin: 5,
    alignSelf: 'center',
  },
})
export default LoginOrRegister
