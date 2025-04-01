import {
  Home,
  Dumbbell,
  LineChart,
  ClipboardList,
  Settings,
  User,
  LogIn,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogout, useUserProfile } from "@/hooks";
import { lazy } from "react";

const MobileMenu = lazy(() => import("./MobileNavBar"));

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Progress", href: "/progress", icon: LineChart },
  { name: "Templates", href: "/templates", icon: ClipboardList },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const pathname = useLocation().pathname;
  const {mutate} = useLogout();
  const {data} = useUserProfile();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-[#121212] px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            Track<span className="text-[#00BFFF]">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800",
                pathname === item.href && "bg-gray-800 text-[#00BFFF]"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src= {data?.data?.avatar.secure_url} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-900 text-white"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={"/profile"}>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to={"/settings"}>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => mutate()}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-white" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#121212] p-0">
              <MobileMenu navItems={navItems} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}