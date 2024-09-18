import React from 'react'
import Header from '../../components/Header'
import { Toaster } from 'sonner'

const DiagramPage = () => {
  return (
    <div className="w-full ">
      <Header title={"Wiring Diagram Management"} />

    

      <Toaster richColors position="top-center" />
    </div>
  )
}

export default DiagramPage