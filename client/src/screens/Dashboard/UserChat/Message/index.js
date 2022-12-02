/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { getTime, chatMainTime, isSameTime } from '../../../../helpers/dateUtils'
import DropDown from '../../../../components/shared/DropDown'
import DeleteModal from './DeleteModal'
import EditMessage from './EditMessage'

import {ReactComponent as HorizontalThreeDots } from '../../../../assets/images/horizontal_three_dots_icon.svg'
import {ReactComponent as PenIcon }  from '../../../../assets/images/pen_icon.svg'
import {ReactComponent as AddEmojiIcon}   from '../../../../assets/images/add_emoji_icon.svg'
import {ReactComponent as DeleteIcon } from '../../../../assets/images/delete_icon.svg'
import { useModal } from '../../../../context/modal-context/modal-context'
import { getLoggedInUser } from '../../../../helpers/authUtils'


export default function Message({
  chat,
  isSameTimePrev = false,
  isSameTimeNext = false,
  currentMsgEditId,
  setEditMessage,
}) {
  const me = getLoggedInUser()

  const [showSetting, setShowSetting] = useState(false)
  const { senderId, message, id } = chat
  const isAuthor = me?.id === senderId.id
  const modal = useModal()
  function editModalToggle() {
    setEditMessage(id)
    setShowSetting(false)
  }

  useEffect(() => {}, [currentMsgEditId])

  function showDeleteModal() {
    setShowSetting(false)
    modal.showModal(<DeleteModal chat={chat} onClose={modal.hideModal} />, true)
  }

  function ShowEditedLabel(chat) {
    if (isSameTime(chat.createdAt, chat.updatedAt)) return null

    return (
      <>
        <span className='text-gray-500 text-xs'> (edited)</span>
      </>
    )
  }

  const dropDownItems = [
    {
      text: 'Edit Message',
      icon: <PenIcon className='w-4 h-4' />,
      cb: editModalToggle,
      style:
        'flex justify-between items-center text-sm px-4 py-1 mb-1 text-green-300 hover:text-green-500 rounded hover:text-white',
    },
    {
      text: 'Delete Message',
      icon: <DeleteIcon className='w-4 h-4' />,
      cb: showDeleteModal,
      style:
        'flex justify-between items-center text-sm px-4 py-1 text-red-300 hover:text-red-500 rounded hover:text-white',
    },
  ]
  return (
    <div
      className={classNames(
        'w-full flex justify-between relative',
        {
          'bg-soft-primary': currentMsgEditId === id,
        }  ,
        {
          
        })}
      onMouseEnter={() => setShowSetting(true)}
      onMouseLeave={() => setShowSetting(false)}
    >
      {isSameTimePrev ? (
        <div className='w-full flex justify-start items-center px-4 -mt-5 ml-2'>
          <div className='flex w-full'>
            <p
              style={{fontSize: '10px'}}
              className={classNames(
                'w-12 flex flex-shrink-0 justify-center mt-1 pr-1',
                {
                  invisible: !showSetting,
                }
              )}
            >
              {getTime(chat?.createdAt)}
            </p>
            {currentMsgEditId === id ? (
              <EditMessage chat={chat} onClose={setEditMessage} />
            ) : (
              <p className={`${isAuthor ? 'bg-soft-primary' : 'bg-gray-100'} mt-2  px-3 py-2 rounded-full break-all  text-sm font-light text-left`}>
                {message}
                {ShowEditedLabel(chat)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          className={classNames('w-full flex justify-start items-start px-4', {
            'my-4': isSameTimeNext === false,
            'mt-4': isSameTimeNext === true
          })}
        >
          <div className='flex justify-center'>
          <div className={"chat-user-img " + chat?.senderId?.status + " align-self-center me-2 ms-0"}>
                                <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {chat?.senderId.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {
                                    chat?.senderId.status && <span className="user-status"></span>
                                }
                            </div>
          </div>
          
          <div className='w-full flex flex-col ml-4'>
            <div className='flex items-center'>
              <a href='#' className='text-black hover:underline text-sm'>
                {senderId.username}
              </a>
              <span className='text-black mx-2 text-xs'>
                {chatMainTime(chat.createdAt)}
              </span>
            </div>
            {currentMsgEditId === id ? (
            <div className='z-10'>
                <EditMessage chat={chat} onClose={setEditMessage} />
            </div>
            ) : (
              <div className='flex  w-full '>
                <p className={`${isAuthor ? 'bg-soft-primary' : 'bg-gray-100'} mt-2  px-3 py-2 rounded-full break-all  text-sm font-light text-left`}>
                  {message}
                  {ShowEditedLabel(chat)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showSetting && (
        <ul className='flex bg-tchatbox-600 absolute -top-3 right-5 hover:shadow-lg rounded-md'>
          <li className='mr-2 p-1 cursor-pointer hover:bg-tchatbox-itemHover'>
            <AddEmojiIcon className='w-5 h-5 text-tchatbox-500' />
          </li>
          {isAuthor && (
            <li
              className='mr-2 p-1 cursor-pointer hover:bg-tchatbox-itemHover'
              onClick={editModalToggle}
            >
              <PenIcon className='w-5 h-5 text-grey-500' />
            </li>
          )}
          {isAuthor && (
            <li className='mr-2 p-1 cursor-pointer hover:bg-grey-100'>
              <DropDown
                ButtonComponent={HorizontalThreeDots}
                buttonClasses='w-5 h-5'
                items={dropDownItems}
              />
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
