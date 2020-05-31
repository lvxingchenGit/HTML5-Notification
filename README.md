# notification 桌面通知  
基于Notification API封装的浏览器桌面通知  

### 
**浏览器支持：**  
*MDN：目前Notification除了IE浏览器不支持外, 其他浏览器都已支持桌面通知，移动端浏览器基本都未支持。*  

### 
**使用：**  
**1、导入 & 初始化需要2个参数：**   
参数一：title 消息通知标题；  
参数二：options 通知弹窗配置 

```javascript
<script>
// 引入
import WebNotify from '@/components/vue-notification/vue-notification'
// 实例化消息通知 
this.notice = new WebNotify('this is title', {
  body: '这是一条测试消息', // 消息通知 - 正文部分
  icon: '',                // 消息通知 - 图标
  image: '',               // 消息通知 - 大图
  dir: 'auto',             // 文字排列方向 auto自动、ltr从左至右、rtl从右至左
  showDialog: false,       // 消息通知是否一直显示，默认为false
  delay: 1000,             // 消息通知间隔多时间关闭 - 此属性只有在showDialog=false 时有效
  data: {                  // 自定义数据（可在事件对象e.target中获取到）
    url: 'https://www.baidu.com'
    // ···
  }
})
</script>
```
**2、浏览器是否支持：**   
 实例方法：**isSupport()** ，检测浏览器是否支持Notification ，如果支持会判断浏览器是否同意显示消息通知，返回一个promise对象  
 参数中是一个对象support（浏览器是否支持消息通知）和isGranted（是否了开启消息通知）

```javascript
 // 例子
this.notice.isSupport()  
  .then(r => {  
    if (r['isGranted'] === 'granted') {
      // 说明已经开启了消息通知
    }else {  
      // 说明禁止接收消息通知，如果想开启，需要用户设置
    }
  })  
  .catch(err => {
    alert('浏览器不支持消息通知，请升级！')
  })
```

**3、事件注册：**   
 实例方法：**initNoticeEvent(object)**  
 注意：事件注册需在通知显示在前注册，否则无效！  
 
 ```javascript
 // 事件注册例子
eventRegister() {
    let userSelectObj = {
        click(e) {
            console.log('点击了：', e)
        },
        show() {
            console.log('通知显示了')
        },
        error(e) {
            console.log('通知出错了', e)
        },
        close() {
            console.log('通知关闭了')
        }
    }
    this.notice.initNoticeEvent(userSelectObj)
}
 ```
 
 **4、消息通知显示：**   
 实例方法：**noticeAgree()**  
 该方法可以调用消息通知，返回promise
 
  ```javascript
 // 调用消息通知
this.notice.noticeAgree()
  .then(() => {
    this.notice.clearNotice() // 关闭通知
  })
 ```
 
  
 **5、关闭消息通知：**   
 实例方法：**clearNotice()**  
 
  **6、更新消息通知：**   
 实例方法：**upDataNotification(obj)**  
 ```javascript
 let obj = {
    title: '更新消息通知标题',  
    body: '更新消息通知正文',
    // ···
}
this.notice.upDataNotification(obj)
 ```
 
 ### 完整的例子(vue)###
 ```javascript
<template>
    <div>
        <h1>桌面消息通知</h1>
        <button @click="openInfo">打开通知</button>
    </div>
</template>
<script>
    import WebNotify from '@/components/vue-notification/vue-notification'
    export default {
        async created() {
            /**
             *  大多数浏览器消息显示样式及关闭的时长不同
             *  建议 ：
             *  showDialog: false
             *  delay: 1000 到 5000之间
             */
            // 实例化消息通知
            this.notice = new WebNotify('this is title', {
                body: '这是一条测试消息',
                icon: '',
                image: '',
                dir: 'auto',
                showDialog: false,
                delay: 5000,
                data: {
                    url: 'https://www.baidu.com'
                    // ···
                }
            })
            // 查看浏览器是否支持Notification和消息通知状态
            const r = await this.notice.isSupport()
            if (r['isGranted'] === 'granted') {
                // 事件需先注册
                this.eventRegister()
                // 此方法为：显示消息通知框，所以事件注册需在此方法之前，否则事件无效！！！
                this.notice.noticeAgree()  // 返回一个Promise
                    .then(() => {
                        this.notice.clearNotice()
                    })
            }

        },
        methods: {
            updata() {
                let u = {
                    title: '更新标题',
                    body: '更新正文' // 提示中的正文部分
                }
                this.notice.upDataNotification(u)
            },
            openInfo() {
                this.notice.noticeAgree()
                    .then(() => {
                        this.notice.clearNotice()
                    })
            },
            // 事件注册
            eventRegister() {
                let userSelectObj = {
                    click(e) {
                        console.log('点击了：', e)
                    },
                    show() {
                        console.log('通知显示了')
                    },
                    error(e) {
                        console.log('通知出错了', e)
                    },
                    close() {
                        console.log('通知关闭了')
                    }
                }
                this.notice.initNoticeEvent(userSelectObj)
            }
        }
    }
</script>
 ```
 
 
 
