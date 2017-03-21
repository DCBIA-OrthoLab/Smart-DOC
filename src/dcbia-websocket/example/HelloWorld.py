#!/usr/bin/env python

import autobahn.asyncio.websocket as websocket

class MyClientProtocol(websocket.WebSocketClientProtocol):

   def onOpen(self):
      self.sendMessage(u"newMessage".encode('utf8'))

   def onMessage(self, payload, isBinary):
      if isBinary:
         print("Binary message received: {0} bytes".format(len(payload)))
      else:
         print("Text message received: {0}".format(payload.decode('utf8')))

if __name__ == '__main__':
    try:
        import asyncio
    except ImportError:
        ## Trollius >= 0.3 was renamed
        import trollius as asyncio

    factory = websocket.WebSocketClientFactory()
    factory.protocol = MyClientProtocol

    loop = asyncio.get_event_loop()
    coro = loop.create_connection(factory, '127.0.0.1',1337)
    loop.run_until_complete(coro)
    loop.run_forever()
    loop.close()