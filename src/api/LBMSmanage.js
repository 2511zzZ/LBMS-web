import { LBMSaxios } from '@/utils/LBMSrequest'
import Qs from 'qs'

const api = {
}

export default api


export function getUserDetails () {
  return LBMSaxios({
    url: 'user',
    method: 'get'
  })
}

export function changeUserDetails (parameters) {
  return LBMSaxios({
    url: 'user',
    method: 'put',
    data: Qs.stringify(parameters)
  })
}

export function changePassword (parameters) {
  return LBMSaxios({
    url: 'user/password',
    method: 'post',
    data: Qs.stringify(parameters)
  })
}
