import React from 'react'
import loader from '../static/loader.svg'
import './loader.css'

const Loader = () => {
  return (
    <div className='loader-main'>
        <img src={loader} alt="" />
    </div>
  )
}

export default Loader