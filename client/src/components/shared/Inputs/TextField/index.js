import React from 'react'
import { useField } from 'formik'

export default function TextField({ label, ...props }) {
  const { fieldClass, labelClass, inputClass, name, type } = props
  const [field, { error, touched }] = useField(props)

  return (
    <div className={fieldClass}>
      {error != null && touched && (
        <span className='text-tchatbox-red text-xs'>{error}</span>
      )}
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input className={inputClass} {...field} name={name} type={type} />
    </div>
  )
}
