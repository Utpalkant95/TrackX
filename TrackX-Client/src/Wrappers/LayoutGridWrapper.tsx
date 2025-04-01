const LayoutGridWrapper = ({ children, Cols=2 } : { children: React.ReactNode , Cols?: number}) => {
  const gridClass = `grid gap-8 md:grid-cols-2   ht-${Cols}`
  return (
    <div className={gridClass}>
      {children}
    </div>
  )
}

export default LayoutGridWrapper