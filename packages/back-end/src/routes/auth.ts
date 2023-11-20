import IRoute from '../types/IRoute'
import { Router } from 'express'
import { attachSession } from '../middleware/auth'
import { sequelize, Session, User } from '../services/db'
import { randomBytes } from 'crypto'

const bcrypt = require('bcrypt')
const saltRounds = bcrypt.genSaltSync(5)

const AuthRouter: IRoute = {
  route: '/auth',
  router() {
    const router = Router()
    router.use(attachSession)

    // If we're authenticated, return basic user data.
    router.get('/', (req, res) => {
      if (req.session?.token?.id) {
        const {
          token: { token, ...session },
          user: { password, ...user },
        } = req.session
        return res.json({
          success: true,
          message: 'Authenticated',
          data: {
            session,
            user,
          },
        })
      } else {
        return res.json({
          success: false,
          message: 'Not Authenticated',
        })
      }
    })

    // Attempt to log in
    router.post('/login', async (req, res) => {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        })
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username)
        ),
      }).catch(err => console.error('User lookup failed.', err))
      // Ensure the user exists. If not, return an error.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not exists. Please register.',
        })
      }
      const validatePass = await bcrypt.compare(password, user.dataValues.password)
      // Ensure the password is correct. If not, return an error.
      if (!validatePass) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        })
      }
      // We now know the user is valid so it's time to mint a new session token.
      const sessionToken = randomBytes(32).toString('hex')
      let session
      try {
        // Persist the token to the database.
        session = await Session.create({
          token: sessionToken,
          user: user.dataValues.id,
        })
      } catch (e) {
        return passError('Failed to create session.', e, res)
      }

      if (!session) {
        // Something broke on the database side. Not much we can do.
        return passError('Returned session was nullish.', null, res)
      }

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      // res.header('Access-Control-Allow-Credentials')
      res.cookie('SESSION_TOKEN', sessionToken, {
        expires: new Date(Date.now() + 3600 * 24 * 7 * 1000), // +7 days
        secure: false,

        httpOnly: true,
      })

      // We return the cookie to the consumer so that non-browser
      // contexts can utilize it easily. This is a convenience for the
      // take-home so you don't have to try and extract the cookie from
      // the response headers etc. Just know that this is a-standard
      // in non-oauth flows :)
      console.log('HERE 2')
      return res.json({
        success: true,
        message: 'Authenticated Successfully.',
        data: {
          token: sessionToken,
        },
      })
    })

    // Attempt to register
    router.post('/register', async (req, res) => {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        })
      }
      const userExist = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username)
        ),
      }).catch(err => console.error('User lookup failed.', err))
      if (userExist) {
        return res.status(400).json({
          success: false,
          message: 'User already exists. Please login',
        })
      } else {
        const hashPassword = await bcrypt.hash(password, saltRounds)

        await User.create({
          username,
          password: hashPassword,
          displayName: username,
          registered: new Date(),
        })
        return res.json({
          success: true,
          message: 'User created successfully. Please login',
        })
      }
    })

    // Log out
    router.post('/logout', async (req, res) => {
      const token = req.session
      if (!token) {
        return res.status(200).send({ success: false, message: 'Not logged in' })
      }

      if (token && token.user) {
        const session = await Session.findOne({
          where: {
            user: token.user.id,
          },
        })

        if (session) {
          await session.destroy()
          res.clearCookie('SESSION_TOKEN')
          return res.status(200).send({ success: true, message: 'Logged out' })
        }
      }
    })

    return router
  },
}

export default AuthRouter

function passError(message, error, response) {
  console.error(message, error)
  return response.status(500).json({
    success: false,
    message: `Internal: ${message}`,
  })
}
