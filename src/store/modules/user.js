import Vue from 'vue'
import { login, logout, test, getLBMSInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { getLevelId } from '@/api/LBMSmanage'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    roleNum: 0,
    levelNum: 0,
    alarmNum: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLE_NUM: (state, roleNum) => {
      state.roleNum = roleNum
    },
    SET_LEVEL_NUM: (state, levelNum) => {
      state.levelNum = levelNum
    },
    SET_ALARM_NUM: (state, alarmNum) => {
      state.alarmNum = alarmNum
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.msg, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', response.msg)
          test().then(response => {
            console.log(response)
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getLBMSInfo().then(response => {

          getLevelId().then(result => {
            commit('SET_LEVEL_NUM', result.data)
          })

          const result = response.data
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', '/' + result.avatar)
          result.roleId = 'admin'
          result.roleNum = result.role
          commit('SET_ROLE_NUM', result.roleNum)

          const permissionList = []
          result.role = { permissions: [], permissionList: [] }

          if(result.roleNum <= 4){
            permissionList.push({ 'permissionId': 'team' })
          }
          if(result.roleNum <= 3){
            permissionList.push({ 'permissionId': 'group' })
          }
          if(result.roleNum <= 2){
            permissionList.push({ 'permissionId': 'branch' })
          }
          if(result.roleNum <= 1){
            permissionList.push({ 'permissionId': 'total' })
          }
          result.role.permissions = permissionList

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            console.log(result)
            console.log(result.role)
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          // commit('SET_NAME', { name: result.name, welcome: welcome() })
          // commit('SET_AVATAR', result.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', {})
          commit('SET_ROLE_NUM', 0)
          commit('SET_LEVEL_NUM', 0)
          commit('SET_ALARM_NUM', 0)
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
