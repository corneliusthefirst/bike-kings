import React from 'react'
import { chatDividerFormat } from '../../../helpers/dateUtils'


export default function Divider({ date }) {
  return (
    <div className='flex h-1 border-b-1 justify-center text-center border-tchatbox-backgroundModifierAccent mx-4 my-2'>
      <span className='px-4 py-2 bg-tchatbox-selectMuted text-tchatbox-popOutHeader text-xxs'>
        {chatDividerFormat(date)}
      </span>
    </div>
  )
}
