import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackScreens } from '../../App'
import LoginOrRegister from '../../components/LoginOrRegister'
import { registerUser } from '../../api/auth'

export default function Register({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Register'>) {
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
  const handleRegister = async () => {
    if (!formState.username || !formState.password) {
      setMessage('Please fill out all fields')
      return
    }
    const { username, password } = formState
    try {
      const data = await registerUser({ username, password })
      if (data) {
        setMessage("You've successfully registered!.Redirecting to login page")
        setTimeout(() => {
          navigation.navigate('Login')
        }, 2000)
      }
    } catch (error) {
      setMessage(error as string)
    }
  }
  return (
    <LoginOrRegister
      message={message}
      handlePassword={handlePassword}
      handleUsername={handleUsername}
      handleSubmit={handleRegister}
      formName={'Register'}
    />
  )
}
