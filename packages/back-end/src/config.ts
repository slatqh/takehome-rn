const config = {
  http: {
    host: process.env.EXPRESS_HOST || '127.0.0.1',
    port: Number(process.env.EXPRESS_PORT) || 8080,
  },
}

export default config
