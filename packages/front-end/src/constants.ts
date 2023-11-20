type IConfig = {
  BASE_URL: string
}
export const appConfig: IConfig = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
}
