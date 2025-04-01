import { useRef } from "react";
import { IProfileAvatarFrag } from "@/Api/interfaces/Project";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "@/Api/User";
import { enqueueSnackbar } from "notistack";
import { IRES } from "@/Api/interfaces/Response";
import { AxiosError } from "axios";

const ProfileAvatarFrag = ({ data, refetch }: IProfileAvatarFrag) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: uploadAvatar,

    onSuccess: (data: IRES) => {
      enqueueSnackbar(data.message, { variant: "success" });
      refetch();
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
      mutate(formData);
      e.target.value = "";
    }
  };
  return (
    <div className="mb-8 rounded-lg bg-gradient-to-r from-gray-800 to-[#00BFFF] p-8 text-center">
      <div className="relative mx-auto mb-4 h-32 w-32">
        <img
          src={data?.data?.avatar.secure_url}
          alt="User Avatar"
          className="rounded-full bg-cover overflow-hidden h-32 w-32"
        />
        {isPending && (
          <div className="absolute top-0 h-32 flex items-center justify-center w-32 rounded-full bg-[#00000080]">
            <Loader2 className="h-10 w-10 animate-spin text-[#00BFFF]" />
          </div>
        )}
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">{data?.data?.name}</h1>
      <p className="mb-4 text-gray-300">{data?.data?.email}</p>
      {/* edit account wala form  */}

      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
      >
        Edit Avatar
      </Button>

      {/* INpiut for image */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleOnChange}
      />
    </div>
  );
};

export default ProfileAvatarFrag;
