import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import getSocket from './index'
import { ROOM_MESSAGES_KEY } from '../../constants/queryKeys'
import { ROOM_SOCKET } from '../../constants/socket.routes'
import { getLoggedInUser, getTokens } from '../../helpers/authUtils'

export default function useMessageSocket(roomId, key) {
  const user = getLoggedInUser()
  const tokens = getTokens()
  const cache = useQueryClient()

  useEffect(() => {
    let socket

    if (tokens?.access?.token) {
      socket = getSocket(tokens?.access?.token)

      if (socket) {
        console.log('roomNSocketInit', roomId)
        if (roomId){
          socket.emit(ROOM_SOCKET.JOIN_ROOM, { roomId, userId: user?.id })
        }
        socket.on(ROOM_SOCKET.ROOM_NEW_MESSAGE, (newMessage) => {
          console.log('roomNewMessage', newMessage)
          cache.setQueryData(ROOM_MESSAGES_KEY(roomId), (d) => {
            if (d?.pages[0]?.results[0]?.id !== newMessage.id) {
              d?.pages[0]?.results.unshift(newMessage)
            }
            return d
          })
        })

        socket.on('roomEditMessage', (editMessage) => {
          cache.setQueryData(ROOM_MESSAGES_KEY(editMessage.roomId), (d) => {
            let index = -1
            let editId = -1
            let alreadyFound = false

            d?.pages.forEach((p, i) => {
              const foundIndex = p.results.findIndex(
                (m) => m.id === editMessage.id
              )

              if (foundIndex !== -1 && alreadyFound === false) {
                editId = foundIndex
                alreadyFound = true
                index = i
              }
            })

            if (index !== -1 && editId !== -1) {
              d.pages[index].results[editId] = editMessage
            }

            return d
          })
        })

        socket.on(ROOM_SOCKET.ROOM_DELETE_MESSAGE, (deletedMessage) => {
          cache.setQueryData(ROOM_MESSAGES_KEY(deletedMessage.roomId), (d) => {
            let index = -1

            d?.pages?.forEach((p, i) => {
              if (
                p.results.findIndex(
                  (m) => m.id === deletedMessage.messageId
                ) !== -1
              )
                index = i
            })
            if (index !== -1) {
              d.pages[index].results = d?.pages[index].results.filter(
                (m) => m.id !== deletedMessage.messageId
              )
            }
            return d
          })
        })
      }
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId)
      }
    }
  }, [tokens?.access?.token, user?.id, roomId, cache, key])
}
