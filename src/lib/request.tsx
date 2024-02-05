import Axios, { AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'

interface AxiosConfig {
  baseURL_dev: string
  baseURL_prod: string
  timeout: number
  withCredentials: boolean
  retries: number
  shouldResetTimeout: boolean
  retryDelay: any
}

const axiosConfig: AxiosConfig = {
  baseURL_dev: '',
  baseURL_prod: '',
  timeout: 10000,
  withCredentials: true,
  retries: 5,
  shouldResetTimeout: true,
  retryDelay: 0,
}

const axiosService = Axios.create({
  baseURL: axiosConfig.baseURL_dev,
  timeout: axiosConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosRetry(axiosService, {
  retries: axiosConfig.retries,
  shouldResetTimeout: axiosConfig.shouldResetTimeout,
  retryDelay: (retryCount) => retryCount * axiosConfig.retryDelay,
  retryCondition: (error) => {
    return error.message.includes('timeout')
  },
})

axiosService.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ...config.headers,
    }
    return config
  },
  (error) => errorHandler(error),
)

axiosService.interceptors.response.use(
  (response: any) => {
    if (!response) return
    return response
  },
  (error) => errorHandler(error),
)

const errorHandler = (error: any) => {
  return Promise.reject('error please retry')
}

export default axiosService
