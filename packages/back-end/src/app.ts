import express from 'express'
import bodyParser from 'body-parser'
import { readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'
import { attachSequelize } from './middleware/db'
import Cors from './middleware/cors'
import IRoute from './types/IRoute'
import cookieParser = require('cookie-parser')
import config from './config'
import cors from 'cors'
const app = express()

// Attach any middleware

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: false }))
app.use(express.text({ limit: '5mb' }))
app.use(cookieParser())
app.use(attachSequelize)

// Read all entries from the "routes" directory. Filter out any entry that is not a file.
const _ROUTES_ROOT = resolve(join(__dirname, './routes/'))
const queue = readdirSync(_ROUTES_ROOT)
  .map(entry => join(_ROUTES_ROOT, entry))
  .filter(isFile)

// For each item in the queue, inject it as an API route.
queue.forEach(entry => {
  try {
    const required = require(entry)
    if (required?.default) {
      const { route, router }: IRoute = required.default
      app.use(route, router())

      console.log('Injected route "%s"', route)
    } else {
      console.error('Invalid route: "%s". No `default` key defined.', entry)
    }
  } catch (e) {
    console.error('Failed to inject route on entry "%s".', entry, e)
  }
})

app.listen(config.http.port, config.http.host, () => {
  console.log(`Listening on http://${config.http.host}:${config.http.port}/`)
})

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile()
  } catch (ignored) {
    return false
  }
}
