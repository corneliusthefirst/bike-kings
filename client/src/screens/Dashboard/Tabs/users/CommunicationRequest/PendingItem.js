import React from 'react'
import { useQueryClient } from 'react-query'
import ReactGA from 'react-ga'
import { isIncoming } from '../../../../../helpers/friendObject'
import { getTokens } from '../../../../../helpers/authUtils'
import getSocket from '../../../../../api/socket'
import { acceptPendingRequestApi, cancelPendingRequestApi } from '../../../../../api/friend'
import { ALL_FRIENDS_KEY, OUT_GOING_REQUESTS_KEY, PENDING_REQUESTS_KEY } from '../../../../../constants/queryKeys'
import { ME_SOCKET } from '../../../../../constants/socket.routes'
import  apiErrorHandler  from '../../../../../helpers/apiErrorHandler'


export function getPendingUser(user, request) {
  if (isIncoming(user, request)) return request.from

  return request.to
}


export default function PendingItem({ user, pending, toggleModal }) {
  const tokens = getTokens()
  const pendingUser = getPendingUser(user, pending)
  const cache = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)

  const socket = getSocket(tokens?.access?.token)

  async function cancelPending(e) {
    e.stopPropagation()
    setIsLoading(true)

    try {
      await cancelPendingRequestApi(pending.id)
      if (isIncoming(user, pending)) {
        cache.invalidateQueries(PENDING_REQUESTS_KEY)
      } else {
        cache.invalidateQueries(OUT_GOING_REQUESTS_KEY)
      }

      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  }

  async function acceptPending(e) {
    e.stopPropagation()
    setIsLoading(true)

    try {
      console.log('acceptPendingRequestApi0', pending)
      const result = await acceptPendingRequestApi(pending.id)
      console.log('acceptPendingRequestApi1', result)
      ReactGA.event({
        category: 'Friend Request',
        action: 'Accepted Friend Request',
      })
      cache.invalidateQueries(PENDING_REQUESTS_KEY)
      cache.invalidateQueries(ALL_FRIENDS_KEY)

      socket.emit(ME_SOCKET.SEND_ACCEPT_FRIEND_REQUEST, {
        receiverId: result?.data?.from,
      })

      setIsLoading(false)
    } catch (err) {
      ReactGA.exception({
        description: apiErrorHandler(err),
        fatal: true,
      })
      setIsLoading(false)
    }
  }

  return (
    <div
      className='py-3 w-full hover:bg-gray-100 cursor-pointer border-t-1 border-gray-900'
      onClick={() => {
        toggleModal(pending)
      }}
    >
      <div className='flex flex-row justify-between w-full'>
        <div className='flex'>
          <div className='relative flex items-center justify-center'>
          <div className="avatar-xs">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {pendingUser.username.charAt(0).toUpperCase()}
                            </span>
                        </div>

          </div>
          <div className='flex items-start flex-col ml-4'>
            <p className='text-blacktext-sm font-bold'>
              {pendingUser.username}
            </p>
          </div>
        </div>

        <div className='flex'>
          {isIncoming(user, pending) && (
            <button
              onClick={acceptPending}
              disabled={isLoading}
              className='flex items-center justify-center p-2 mx-1 rounded-full active focus:outline-none'
            >
              <div className='ri-check-fill w-5 h-5  hover:text-green-300' />
            </button>
          )}

          <button
            onClick={cancelPending}
            disabled={isLoading}
            className='flex items-center justify-center p-2 mx-1 rounded-full active focus:outline-none'
          >
            <div className='ri-close-fill w-5 h-5 hover:text-red-500' />
          </button>
        </div>
      </div>
    </div>
  )
}
