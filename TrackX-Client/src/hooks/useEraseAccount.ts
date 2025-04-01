import { EraseAccount } from "@/Api/auth"
import { IRES } from "@/Api/interfaces/Response"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { enqueueSnackbar } from "notistack"

const useEraseAccount = () => {
    const {mutate, isPending} = useMutation({
        mutationKey : ["eraseAccount"],
        mutationFn : EraseAccount,
        onSuccess : (data) => {
            enqueueSnackbar(data.message, {variant : "success"})
        },
        onError : (error : AxiosError<IRES>) => {
            enqueueSnackbar(error.response?.data.message, {variant : "error"})
        }
    })
  return {
    mutate,
    isPending
  }
}

export default useEraseAccount