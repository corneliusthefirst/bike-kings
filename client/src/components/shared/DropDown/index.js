/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'

export default function DropDown({ ButtonComponent, buttonClasses, items }) {
  const [open, setOpen] = useState(false)

  return (
    <div className='relative'>
      <ButtonComponent
        className={buttonClasses}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className='w-48 px-2 py-2 bg-white top-0 right-7 rounded-mdx shadow-lg absolute'>
          {items.map((item, i) => {
            return (
              <a
                key={i}
                href='#'
                className={item.style}
                onClick={() => item.cb()}
              >
                {item.text}
                {item.icon}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
