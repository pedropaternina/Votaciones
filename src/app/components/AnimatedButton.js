'use client'
import { animate } from 'animejs'
import React from 'react'

const AnimatedButton = ({texto, click}) => {

    const handleMouseEnter = (e) => {
      animate(e.currentTarget, {
        scale: [1, 1.15],
        rotate: ['0deg', '5deg', '-5deg', '0deg'],
        backgroundColor: ['#15D52E', '#24AE36'],
        duration: 600,
        easing: 'easeInOutQuad'
      });
    }

    const handleMouseLeave = (e) => {
      animate(e.currentTarget, {
        scale: 1,
        rotate: '0deg',
        backgroundColor: '#15D52E',
        duration: 400,
        easing: 'easeOutQuad'
      });
    }

  return (
    <button
        onClickCapture={click}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-[#15D52E] text-white font-semibold px-16 py-6 rounded-full shadow-md hover:shadow-lg focus:outline-none"
    >
        {texto}
    </button>
  )
}

export default AnimatedButton
