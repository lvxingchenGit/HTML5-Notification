/*
 * @Author: LvXingChen
 * @Github: https://github.com/OBKoro1
 * @Date: 2020-05-30 23:08
 * @Description: html5 Notification(桌面通知)
 */

import { isObject, isFunction } from './tools'
export default class VueWebNotify {
    // 初始化
    constructor(title = 'test', options = {}) {
        let { showDialog, delay = 2000 } = { ...options }
        this.support = true
        this.status = '' // 授权之前用户浏览器的显示通知的状态
        this.title = title
        this.options = options
        this.isGranted = '' // 授权之后是否是 ‘greanted’
        this.notificationInstance = [] // 消息实例,相当于一个栈
        this.eventObjGather = {} // 注册的事件
        this.timer = null
        this.delay = delay
        this.showDialog = !!showDialog
        this.id = 0 // 消息实例的key
        this.close_id = 1
    }
    initNotification() {
        this.id ++
        this.notice = new Notification(this.title, { ...this.options, tag: '', requireInteraction: this.showDialog })
        this.notificationInstance.unshift({[this.id]: this.notice})
    }
    // 检查浏览器是否支持Notification
    isSupport() {
        return new Promise((resolve, reject) => {
            this.support = !!window && !!window.Notification
            if (this.support) {
                this.init()
                resolve({
                    support: this.support, // 是否支持Notification
                    isGranted: this.isGranted // 返回用戶授权之后的浏览器通知状态
                })
            } else {
                console.error('Your browser does not support "Notification"')
                reject({ support: this.support })
            }
        })
    }
    init() {
        if (!this.support) return
        this.status = Notification.permission
        this.checkStatus() // 直接判断授权
    }
    // 初始化注册事件
    initNoticeEvent(userSelectObj){
        if (!this.support) return
        this.eventObjGather = this.checkUserSelcetObj(userSelectObj) ? userSelectObj : null
    }
    // 检查事件回调是否是函数
    checkUserSelcetObj(userSelectObj, ischeckFn=true) {
        if (!isObject(userSelectObj)) return console.error(`TypeError: "${userSelectObj}" is not Object`)
        if (!ischeckFn) return true
        for(let key in userSelectObj) {
            if (!isFunction(userSelectObj[key])) {
                return console.error(`TypeError: "${userSelectObj[key]}" is not a function`)
            }
        }
        return true
    }
    // 授权判断
    checkStatus() {
        switch (this.status){
            case 'default':
                Notification.requestPermission().then(r => {
                    if (r === 'default') {
                        this.checkStatus()
                    }else this.isGranted = r})
                break
            case 'granted':
                this.isGranted = 'granted'
                break
            case 'denied':
                this.isGranted = 'denied'
                console.warn(`vueNotification wairning:
您目前的浏览器的通知状态为denied,需要手动开启通知消息权限！
关于开启浏览器消息通知请查看：https://blog.csdn.net/qq_42778001/article/details/106450669`)
                return 'denied'
        }
        return this.isGranted
    }
    //
    noticeAgree() {
        return new Promise((resolve) => {
            if(this.isGranted === 'granted' && this.support) {
                this.initNotification()
                Object.keys(this.eventObjGather).forEach(i => {
                    this.notice.addEventListener(i, this.eventObjGather[i])
                })
                resolve()
            }
        })
    }
    // 清除/关闭消息
    clearNotice() {
        if (this.showDialog) return
        let len = this.notificationInstance.length
        if (len) {
            this.timer = setTimeout(() => {
                this.notificationInstance.pop()[this.close_id].close()
                clearTimeout(this.timer)
                this.close_id ++
                this.clearNotice()
            }, this.delay)
        }
    }
    // 更新通知配置
    upDataNotification(options) {
        if(this.checkUserSelcetObj(options, false)) {
            let { title = this.title } = { ...options }
            this.options = options
            Object.keys(options).forEach(i => {
                this.options[i] = options[i]
            })
            this.title = title
        }
    }
}
