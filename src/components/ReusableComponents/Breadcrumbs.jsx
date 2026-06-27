import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const location = useLocation()
  
  // Split the URL pathname into segments, filtering out empty strings
  const pathnames = location.pathname.split('/').filter((x) => x)
  
  // Don't render breadcrumbs on the home page (landing page)
  if (pathnames.length === 0) return null

  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
      {/* Home Icon */}
      <Link to="/" className="hover:text-gray-900 transition flex items-center">
        <Home size={16} />
      </Link>
      
      {/* Dynamically generate links based on the URL path */}
      {pathnames.map((name, index) => {
        // Build the route URL up to this specific segment
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        
        // Check if this is the last item in the breadcrumb trail
        const isLast = index === pathnames.length - 1
        
        // Capitalize first letter and replace hyphens with spaces
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
      })}
    </nav>
  )
}