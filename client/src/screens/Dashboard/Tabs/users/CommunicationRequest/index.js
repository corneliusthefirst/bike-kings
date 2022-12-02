/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import PendingItem from './PendingItem'
import PendingProfileModal from './PendingProfileModal'
import { ReactComponent as PendingUsersIcon} from '../../../../../assets/images/pending_user_icon.svg'
import { getLoggedInUser } from '../../../../../helpers/authUtils'
import { PendingRequests } from '../../../../../hooks/reactQuery'
import { useModal } from '../../../../../context/modal-context/modal-context'

function EmptyState() {
  return (
    <div className='flex flex-col justify-center w-full items-center'>
      <PendingUsersIcon width={150} className='mt-32' />
      <p className='p-2 text-tchatbox-popOutHeader mt-6'>
        There are no pending communication requests.
      </p>
    </div>
  )
}

function PendingHeader({ pendingRequestsData }) {
  const pendingCount = pendingRequestsData?.length ?? 0
  return (
    <div className='flex justify-start items-center w-full mt-2'>
      <h6 className='my-2 text-tchatbox-topIcons text-xs font-semibold'>
        PENDING — {pendingCount}
      </h6>
    </div>
  )
}
export default function CommunicationRequest({ pendingRequestsData }) {
  const  user  = getLoggedInUser()
  const [pendingProfile, setPendingProfile] = useState(null)
  const { data: pendingRequests } = PendingRequests()
  const modal = useModal()

  // update incoming friend requests with fresh data
  if (pendingRequests?.length) {
    pendingRequestsData = pendingRequests
  }

  function toggleModal(pending) {
    pendingProfile &&
      modal.showModal(
        <PendingProfileModal user={user} pending={pendingProfile} />,
        true,
        true
      )

    if (pending) {
      setPendingProfile(pending)
    }
  }

  if (pendingRequestsData?.length) {
    return (
      <div className='flex h-full flex-1'>
        <div className='flex flex-col w-full p-4'>
          <PendingHeader
            pendingRequestsData={pendingRequestsData}
          />

          <div className='flex w-full'>
            <div className='w-full flex flex-col'>
              {pendingRequestsData?.map((pending, index) => (
                <PendingItem
                  key={index}
                  user={user}
                  pending={pending}
                  toggleModal={toggleModal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='flex h-full flex-1'>
      <EmptyState />
    </div>
  )
}
