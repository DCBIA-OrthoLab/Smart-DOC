from socketIO_client import SocketIO, BaseNamespace

class Namespace(BaseNamespace):

    def on_connect(self):
        print('[Connected]')

    def on_reconnect(self):
        print('[Reconnected]')

    def on_connected(self, args):
        print('connected', args)
        self.emit('emit_with_callback', self.callback)

    def callback(self, *args):
        print(args)

    def on_disconnect(self):
        print('[Disconnected]')

    def on_execute_task(self, *args):
        print('executing task', args)

socketIO = SocketIO('localhost', 8181, Namespace)
socketIO.wait()