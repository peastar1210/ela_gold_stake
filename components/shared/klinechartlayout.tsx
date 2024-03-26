import React from 'react'

export interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="k-line-chart-container">
      {children}
    </div>
  )
}


export default Layout