import React from 'react'

function Input({
    type,
    name,
    placeholder,
    value,
    onChange,
    classes,
    label
}) {
  return (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white hover:text-white">{label}</label>
        <input
        
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={"bg-gray-100  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500  block w-full p-2.5"}
        />
    </div>
  )
}

export default Input