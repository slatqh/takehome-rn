import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native'
import { StackScreens } from '../../App'
import { StatusBar } from 'expo-status-bar'
import { useCallback } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logout } from '../../api/auth'

interface IUser {
  username: string
  displayName?: string
  id?: number
  registered?: string
}
export default function Home({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Home'>) {
  const handleLoginPress = useCallback(
    () => navigation.navigate('Login'),
    [navigation?.navigate]
  )
  const handleRegisterPress = useCallback(
    () => navigation.navigate('Register'),
    [navigation?.navigate]
  )
  const handleWebviewPress = useCallback(
    () => navigation.navigate('App'),
    [navigation?.navigate]
  )

  const [isLogin, setIsLogin] = React.useState(false)
  const [user, setUser] = React.useState<IUser | null>(null)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    const getUser = async () => {
      const localStorage = await AsyncStorage.getItem('user')
      if (localStorage) {
        const parsedUser = JSON.parse(localStorage)
        setUser({
          username: parsedUser.username,
        })
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    }
    getUser()
  }, [isFocused])

  const handleLogout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('token'),
        logout(),
      ])
      setIsLogin(false)
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.container}>
      {isLogin ? (
        <View style={styles.loginContainer}>
          <View style={styles.greeting}>
            <Text style={styles.text}>Hi</Text>
            <Text style={[styles.text, { fontWeight: '500' }]}> {user?.username}</Text>
          </View>
          <Text>Now you can logout!</Text>
          <Button title='Logout' onPress={handleLogout} />
        </View>
      ) : (
        <>
          <Button title='Login' onPress={handleLoginPress} />
          <Button title='Register' onPress={handleRegisterPress} />
          <Button title='Skip to Webview' onPress={handleWebviewPress} />
          <StatusBar style='auto' />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
