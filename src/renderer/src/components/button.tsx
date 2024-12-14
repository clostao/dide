const classes = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white'
}

const base = 'rounded-md p-2'

export const Button = ({
  children,
  classType = 'primary',
  className,
  onClick
}: {
  children: React.ReactNode
  classType: keyof typeof classes
  className?: string
  onClick?: () => void
}): JSX.Element => {
  return (
    <button className={`${base} ${classes[classType]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
