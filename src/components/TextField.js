import React from 'react'

const TextField = ({label, value, id, fieldType, onChange, width}) => {
  return (
    <div className={`mb-4 ${width}`}>
      <label className="block text-gray-700 text-sm font-bold mb-2" for={id}>
        {label}
      </label>
      <input
        id={id}
        type= {fieldType || "text"}
        value={value}
        placeholder={label}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:shadow-outline"
      />
    </div>
  )
}

export default TextField;