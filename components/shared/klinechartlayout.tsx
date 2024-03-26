import React from 'react'

export interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="k-line-chart-container absolute z-[20]">
      {children}
    </div>
  )
}


export default Layout