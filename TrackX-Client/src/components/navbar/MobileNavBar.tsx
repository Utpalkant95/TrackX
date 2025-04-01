import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { IMobileMenuProps } from "@/Api/interfaces/Project"

export default function MobileMenu({ navItems }: IMobileMenuProps) {
  const pathname = useLocation().pathname

  return (
    <div className="flex h-full flex-col bg-[#121212] py-4">
      <div className="mb-4 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            Track<span className="text-[#00BFFF]">X</span>
          </span>
        </Link>
      </div>
      <nav className="space-y-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800",
              pathname === item.href && "bg-gray-800 text-[#00BFFF]",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

