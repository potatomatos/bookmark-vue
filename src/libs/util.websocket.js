import $ from 'jquery'
const webSocket = {
  socket: null,
  lockReconnect: false,
  listener: [],
  hostname: '127.0.0.1',
  port: 80,
  path: '',
  reconnectCount: 0,
  maxReconnectCount: 20,
  // 心跳检测
  heartCheck: {
    timeout: 10000, // 10秒发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    start: function () {
      const self = this
      this.timeoutObj = setTimeout(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        webSocket.socket.send('ping')
        self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
          webSocket.socket.close() // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, self.timeout)
      }, this.timeout)
    }
  },
  // 连接
  connect: function (hostname, port, path) {
    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.port = location.port
        if (port) {
          this.port = port
        }
        let url
        if (hostname) {
          this.hostname = hostname
          url = 'ws://' + hostname
        } else {
          url = 'ws://' + location.hostname
          this.hostname = location.hostname
        }
        if (this.port) {
          url += ':' + this.port
        }
        if (path) {
          this.path = path
          url += path
        }
        url += '/' + localStorage.getItem('token') + '?token=' + localStorage.getItem('token')
        this.socket = new WebSocket(url)
        this.socket.onopen = this.onopen
        this.socket.onerror = this.onerror
        this.socket.onmessage = this.onmessage
      } catch (e) {
        this.reconnect()
        console.error(e)
      }
    }
  },
  // 重连
  reconnect: function () {
    this.reconnectCount++
    console.log('重连中...，次数', this.reconnectCount)
    if (this.reconnectCount > this.maxReconnectCount) {
      console.log('连接失败了')
      return
    }
    const _this = this
    if (_this.lockReconnect) return
    _this.lockReconnect = true
    setTimeout(function () {
      // 没连接上会一直重连，设置延迟避免请求过多
      _this.connect(_this.hostname, _this.port, _this.path)
      _this.lockReconnect = false
    }, 5000)
  },
  // 关闭连接
  close: function () {
    if (this.socket && this.socket.readyState === 3) {
      this.socket.close()
    }
    this.listener = []
  },
  // 连接成功回调
  onopen: function () {
    console.log('socket已打开')
    $.each(webSocket.listener, function (index, listener) {
      if (listener.onopen) {
        listener.onopen()
      }
    })
    webSocket.heartCheck.reset().start()
  },
  // 连接失败回调
  onerror: function (e) {
    console.error('ws连接错误!', e)
    $.each(webSocket.listener, function (index, listener) {
      if (listener.onerror) {
        listener.onerror()
      }
    })
    webSocket.reconnect()
  },
  // 收到消息回调
  onmessage: function (event) {
    const data = JSON.parse(event.data)
    $.each(webSocket.listener, function (index, listener) {
      if (listener.onmessage) {
        listener.onmessage(data)
      }
    })
    webSocket.heartCheck.reset().start()
  },
  // 添加监听器
  listen: function (handler) {
    if (!this.listener.includes(handler)) {
      this.listener.push(handler)
    }
    console.log('添加监听器,监听列表：', this.listener)
  }
}
export default webSocket
