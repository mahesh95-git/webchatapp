import Image from 'next/image'
import React from 'react'

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center  font-semibold">
     <div className="flex flex-col items-center justify-center">
     <Image src="/coffee_chat.png" alt="logo" width={200} height={200} />
     <h1 className="text-3xl">Welcome to CoffeeChat</h1>
     <p>Connect with your friends</p>
     </div>
    </div>
  )
}

export default Welcome
