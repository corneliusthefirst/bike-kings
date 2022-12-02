/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useQueryClient } from 'react-query'
import { cancelPendingRequestApi } from '../../../../../api/friend'
import { OUT_GOING_REQUESTS_KEY, PENDING_REQUESTS_KEY } from '../../../../../constants/queryKeys'
import { useModal } from '../../../../../context/modal-context/modal-context'
import { isIncoming } from '../../../../../helpers/friendObject'
import { getPendingUser } from './PendingItem'


export default function PendingProfileModal({ user, pending }) {
  const cache = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)
  const pendingUser = getPendingUser(user, pending)
  const modal = useModal()
  async function cancelPending() {
    setIsLoading(true)

    try {
      await cancelPendingRequestApi(pending.id)
      if (isIncoming(user, pending)) {
        cache.invalidateQueries(PENDING_REQUESTS_KEY)
      } else {
        cache.invalidateQueries(OUT_GOING_REQUESTS_KEY)
      }

      setIsLoading(false)
      modal.hideModal()
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col lg:w-11/12 xl:w-8/12 md:w-10/12 sm:w-11/12 w-full bg-white'>
      <div
        className={`w-full h-20 relative rounded-t-lg`}
      >
        <div className='flex items-center absolute bottom-0 left-0 -mb-16 ml-4'>
          <div className='flex flex-col'>
            <div className='relative flex justify-center'>
            <div className={"item-user-img " + pendingUser?.status + " align-self-center me-3 ms-0"}>
                        <div className="avatar-xs">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {pendingUser.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {
                          pendingUser?.status && <span className={`user-status ${pendingUser?.status === 'AVAILABLE' ? 'online': 'away'}`}></span>
                        }
                    </div>
              <span className='bg-green-300 w-6 h-6 rounded-full absolute right-0 bottom-0 border-6 border-gray-900 mr-0 mb-2'></span>
            </div>
            <div className='flex items-center'>
              <p className='text-black text-md font-bold'>
                {pendingUser.username}
              </p>
              <p className='text-black text-md'>
                #
                {isIncoming(user, pending)
                  ? pending.from.shortId
                  : pending.to.shortId}
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center absolute bottom-0 right-0 -mb-16 mr-4'>
          {isIncoming(user, pending) && (
            <button
              disabled={isLoading}
              className='p-2 px-3 mx-1 text-xs bg-green-300 hover:bg-green-500 text-white rounded-md focus:outline-none'
            >
              Accept
            </button>
          )}
          <button
            onClick={cancelPending}
            disabled={isLoading}
            className='p-2 px-3 mx-1 text-xs bg-gray-300 hover:bg-gray-500 text-white rounded-md focus:outline-none'
          >
            {isIncoming(user, pending) ? 'Ignore' : 'Cancel request'}
          </button>
        </div>
      </div>
    </div>
  )
}
