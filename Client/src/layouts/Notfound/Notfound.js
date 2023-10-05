import React from 'react'

export const Notfound = () => {
  const fullScreenStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };
  return (
    <img
    src='https://th.bing.com/th/id/R.4c2da459aa1543942049f600f916dd14?rik=lvpD5UJjq6K1%2bA&pid=ImgRaw&r=0&sres=1&sresct=1'
    alt="Full Screen Image"
    style={fullScreenStyles}
  />  )
}
