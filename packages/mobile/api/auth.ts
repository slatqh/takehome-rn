import { appConfig } from '../screens/appConfig'

type ICredentials = {
  username: string
  password: string
}

export const getUser = async () => {
  const res = await fetch(`${appConfig.BASE_URL}/auth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if (res.ok) {
    const data = await res.json()
    return data.data.user
  } else {
    await res.json().then(err => Promise.reject(err))
  }
}

export const registerUser = async (args: ICredentials) => {
  const response = await fetch(`${appConfig.BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (response.ok) {
    return response.json()
  } else {
    await response.json().then(err => Promise.reject(err))
  }
}

export const login = async (args: ICredentials) => {
  const res = await fetch(`${appConfig.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    credentials: 'include',
  })

  if (res.ok) {
    const { data } = await res.json()
    return data.token
  } else {
    await res.json().then(err => Promise.reject(err))
  }
}

export const logout = async () => {
  await fetch(`${appConfig.BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify the content type
    },
    credentials: 'include',
  })
}
