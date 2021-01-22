/// <reference types="react-scripts" />
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'production' | 'dev'
      REACT_APP_API_HOST: string
    }
  }
}
export {}
