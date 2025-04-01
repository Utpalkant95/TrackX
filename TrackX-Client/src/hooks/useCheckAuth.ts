import { CheckAuth } from "@/Api/auth"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";

const useCheckAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['checkAuth'],
        queryFn: CheckAuth,
    })

    useEffect(() => {
        setIsAuthenticated(data?.authenticated)
    }, [data])

  return {
    isLoading, isAuthenticated,
    refetch
  }
}

export default useCheckAuth