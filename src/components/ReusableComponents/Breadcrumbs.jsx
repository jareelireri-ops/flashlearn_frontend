import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  const location = useLocation()
  
  const pathnames = location.pathname.split('/').filter((x) => x)
  
  if (!items && pathnames.length === 0) return null

  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
      <Link to="/" className="hover:text-gray-900 transition flex items-center">
        <Home size={16} />
      </Link>
      
      {items ? (
        items.filter(item => item.label !== 'Home').map((item, index, arr) => {
          const isLast = index === arr.length - 1
          
          return (
            <div key={item.label} className="flex items-center">
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              {isLast || !item.path ? (
                <span className="text-gray-900 font-semibold">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-gray-900 transition">
                  {item.label}
                </Link>
              )}
            </div>
          )
        })
      ) : (
        pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          
          const isLast = index === pathnames.length - 1
          
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
          
          return (
            <div key={name} className="flex items-center">
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              {isLast ? (
                <span className="text-gray-900 font-semibold">{formattedName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-gray-900 transition">
                  {formattedName}
                </Link>
              )}
            </div>
          )
        })
      )}
    </nav>
  )
}