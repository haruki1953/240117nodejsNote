```
自己的e5分享网站中有“通知”和“动态”功能，现在的缺点是只能在访问或刷新网站时获取，不能实时获取
以前就一直想解决这个，现在刚了解websocket，就一直在烦恼具体应该怎样实现，从http与ws协议一起获取数据时应该怎样协调

方案：使用ws但并不通过其发送数据，只是让其给客户端发“更新消息”，客户端收到“更新消息”后再使用http获取数据。
这样前端和后端都不用改太多，很多已经写好的方法都可以复用，ws获取消息、http获取数据，这样的设计也感觉比较稳妥与优雅
```

## 服务端
```
新建 src\system\ws.ts

安装websocket包
pnpm i ws
pnpm i --save-dev @types/ws
```

消息设计
```ts
// src\types\ws.d.ts
export interface WsMessage {
  id: string
  type: string // 'update-e5post'
  time: string
  message: string
  data?: {
    fromUserId?: number
    updateE5postsId?: number
  }
}


// src\system\ws.ts
export const useWsSystem = () => {
  const sendUpdateE5postMessage = (
    fromUserId: number, updateE5postsId: number
  ) => {
    const message: WsMessage = {
      id: uuidv4(),
      type: 'update-e5post',
      time: new Date().toISOString(),
      message: `Post with ID ${updateE5postsId} has been updated.`,
      data: {
        fromUserId,
        updateE5postsId
      }
    }
    const messageString = JSON.stringify(message)
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString)
      }
    })
  }
  return {
    sendUpdateE5postMessage
  }
}
export const wss = new Ws.Server({ port: wsPort })


// src\services\post.ts
import { useWsSystem } from '@/system'
const wsSystem = useWsSystem()
export const postSendPostService = async (
  userId: number, e5id: number, content: string
) => {
  await confirmPostAccessPermission(userId, e5id)
  await addE5PostToEPDB(e5id, { userId, content })
  // 发送更新消息
  wsSystem.sendUpdateE5postMessage(userId, e5id)
}
```


## 客户端
```ts
// 新建 src\services\ws.js
export const setupWsService = () => {
  ws = new WebSocket(wsConfig.url)
  ws.addEventListener('message', handleMessage, false)
}

let ws = null

const handleMessage = (e) => {
  const msgData = JSON.parse(e.data)
  // 调用其他services或stores中的方法来操作数据
  if (msgData.type === 'update-e5post') {
    handleUpdateE5post(msgData)
  }
}

const handleUpdateE5post = async (msgData) => {
  // 是来自自己的更新则返回
  if (profileStore.user.id === msgData.data.fromUserId) {
    return
  }
  // 更新post
  await loadE5PostsData(msgData.data.updateE5postsId)
}


// src\views\layout\LayoutContainer.vue
import { setupWsService } from '@/services/ws'
onMounted(() => {
  // 请求获取数据
  loadAllData().then(async () => {
    notifDrawerRef.value.checkImportantNotif()
  })
  // 启用ws
  setupWsService()
})
```

好好好，已经可以实时获取帖子了
