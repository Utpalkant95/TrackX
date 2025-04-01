import { lazy } from "react"
const Loader = lazy(() => import("@/components/Loader/Loader"));

const  FallbackScreen = ()  =>{
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white">
      <div className="flex flex-col items-center space-y-4">
        <span className="text-3xl font-bold">
          Track<span className="text-[#00BFFF]">X</span>
        </span>
        <Loader size={48}/>
        <p className="text-lg">Loading your fitness journey...</p>
      </div>
    </div>
  )
}

export default FallbackScreen