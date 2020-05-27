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

export function getTotalOnlineData(parameters) {
  return LBMSaxios({
    url: '/totalData/online',
    method: 'get',
    params: parameters
  })
}

export function getBranchOnlineData(parameters) {
  return LBMSaxios({
    url: '/branchData/online',
    method: 'get',
    params: parameters
  })
}

export function getGroupOnlineData(parameters) {
  return LBMSaxios({
    url: '/groupData/online',
    method: 'get',
    params: parameters
  })
}

export function getTeamOnlineData(parameters) {
  return LBMSaxios({
    url: '/teamData/online',
    method: 'get',
    params: parameters
  })
}

export function getAnchorOnlineData(parameters) {
  return LBMSaxios({
    url: '/anchorData/online',
    method: 'get',
    params: parameters
  })
}

export function getOnlineRank (parameters) {
  return LBMSaxios({
    url: 'online/rank',
    method: 'get',
    params: parameters
  })
}

export function getHistoryRank (parameters) {
  return LBMSaxios({
    url: 'history/rank',
    method: 'get',
    params: parameters
  })
}

export function getTotalHistoryData (parameters) {
  return LBMSaxios({
    url: 'totalData/historys',
    method: 'get',
    params: parameters
  })
}

export function getBranchHistoryData (parameters) {
  return LBMSaxios({
    url: 'branchData/historys',
    method: 'get',
    params: parameters
  })
}

export function getGroupHistoryData (parameters) {
  return LBMSaxios({
    url: 'groupData/historys',
    method: 'get',
    params: parameters
  })
}

export function getTeamHistoryData (parameters) {
  return LBMSaxios({
    url: 'teamData/historys',
    method: 'get',
    params: parameters
  })
}

export function getAnchorHistoryData (parameters) {
  return LBMSaxios({
    url: 'anchorData/historys',
    method: 'get',
    params: parameters
  })
}

export function getAlertList (parameters) {
  return LBMSaxios({
    url: '/alarm/',
    method: 'get',
    params: parameters
  })
}

export function getAlertOverView () {
  return LBMSaxios({
    url: '/alarm/overview',
    method: 'get'
  })
}

export function updateAlert (parameters) {
  return LBMSaxios({
    url: '/alarm/',
    method: 'post',
    data: Qs.stringify(parameters)
  })
}

export function deleteAlert (parameters) {
  return LBMSaxios({
    url: '/alarm/delete',
    method: 'post',
    data: Qs.stringify(parameters)
  })
}

export function getBranchList () {
  return LBMSaxios({
    url: '/branch/list',
    method: 'get'
  })
}

export function getGroupList (parameters) {
  return LBMSaxios({
    url: '/group/list',
    method: 'get',
    params: parameters
  })
}

export function getTeamList (parameters) {
  return LBMSaxios({
    url: '/team/list',
    method: 'get',
    params: parameters
  })
}

export function getAnchorList (parameters) {
  return LBMSaxios({
    url: '/anchor/list',
    method: 'get',
    params: parameters
  })
}

export function getLevelId () {
  return LBMSaxios({
    url: 'levelId',
    method: 'get'
  })
}


export function getTopCardsData () {
  return LBMSaxios({
    url: '/online/data',
    method: 'get'
  })
}