import React, { memo } from 'react'
import ReactDOM from 'react-dom'

const CustomPortal = memo(({ selectors, children }) => {
  return ReactDOM.createPortal(children, document.body.querySelector(selectors))
})

export default CustomPortal
