import clsx from 'clsx'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import { GetServerSidePropsContext } from 'next'
import { appConfig } from '../constants'
import Router from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // if SESSION_TOKEN is set, then hit our back-end to check authentication
  // status. if the token is valid, then we'll get back the user's info and pass
  // it to the HomeProps object.
  if (ctx.req.cookies?.SESSION_TOKEN) {
    const authRes = await fetch(`http://${process.env.BACK_END_HOST}:8080/auth`, {
      method: 'GET',
      headers: {
        Cookie: `SESSION_TOKEN=${encodeURIComponent(ctx.req.cookies.SESSION_TOKEN)}`,
      },
    })
      .then(r => r.json())
      .catch(e => console.error('Failed to fetch auth state during SSR!', e))

    if (process.env.NODE_ENV !== 'production') {
      console.debug('authRes,', authRes)
    }

    const { success, data } = authRes
    if (success && data?.user?.id) {
      return {
        props: {
          sess: {
            id: data.user.id,
            username: data.user.username,
            displayName: data.user.displayName,
          },
        } satisfies HomeProps,
      }
    }
  } else {
    // Cookie not present, we're not logged in!
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Cookie not present, refusing to check auth status!')
    }
  }

  return {
    props: {},
  }
}

export type HomeProps = {
  sess?: {
    id: number
    username: string
    displayName: string
  }
}
export default function Home({ sess }: HomeProps) {
  const logout = async () => {
    await fetch(`${appConfig.BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          // do something, redirect to home page
          Router.reload()
        } else {
          throw new Error('Something went wrong')
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/public/favicon.ico' />
      </Head>
      <main className={clsx('w-full h-full', inter.className)}>
        <h1 className='border-b border-neutral-300 px-4 py-2 text-2xl font-medium text-center'>
          User Profile
        </h1>
        <div className='flex gap-4 '>
          <a href={'/login'} className='p-1'>
            Login
          </a>
          {sess?.username && (
            <a href={'#'} onClick={logout}>
              Logout
            </a>
          )}
        </div>
        <div className='p-4'>
          <p className='text-neutral-500'>
            {sess ? `Welcome back, ${sess.displayName}!` : 'How ya doing,  stranger?'}
          </p>
        </div>
      </main>
    </>
  )
}
