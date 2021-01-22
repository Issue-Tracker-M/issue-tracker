import axios from 'axios'
import { baseUrl } from '../config'
import { getToken } from '../helpers'

export const axiosWithAuth = () => {
  const token = getToken()
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || ''
    },
    baseURL: baseUrl
  })
}
