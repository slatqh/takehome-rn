import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackScreens } from '../../App'
import { getUser, login } from '../../api/auth'
import LoginOrRegister from '../../components/LoginOrRegister'

export default function Login({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Login'>) {
  const [formState, setFormState] = React.useState<{
    username?: string
    password?: string
  }>({
    username: '',
    password: '',
  })
  const [message, setMessage] = React.useState('')

  const handlePassword = (password: string) => {
    setMessage('')
    setFormState({ ...formState, password })
  }
  const handleUsername = (username: string) => {
    setMessage('')
    setFormState({ ...formState, username })
  }
  const handleLogin = async () => {
    const { username, password } = formState

    try {
      if (!username || !password) {
        throw new Error('Please fill out all fields')
      }

      const userToken = await login({ username, password })
      if (!userToken) {
        throw new Error('No user token received from API')
      }

      const user = await getUser()

      if (!user) {
        throw new Error('No user data received from API')
      }
      // Ideally we need something like AuthProvider to handle the case when session is expired or invalid
      await Promise.all([
        AsyncStorage.setItem('token', userToken),
        AsyncStorage.setItem('user', JSON.stringify(user)),
      ])

      navigation.navigate('Home')
    } catch (error) {
      setMessage(error?.message || 'An error occurred during login')
    }
  }
  return (
    <LoginOrRegister
      handlePassword={handlePassword}
      handleUsername={handleUsername}
      handleSubmit={handleLogin}
      formName={'Login'}
      message={message}
    />
  )
}
