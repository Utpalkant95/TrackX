import { lazy } from "react";
import {
  User,
  Mail,
  Calendar,
  Award,
  Dumbbell,
  Zap,
  Flame,
  Lock,
  LogOut,
  Trash2,
  LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useEraseAccount, useLogout, useUpdatePassword, useUserProfile, useUserSetting } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFitnessStats, updatePreferences } from "@/Api/User";
import { IFitnessStats, IRES } from "@/Api/interfaces/Response";
import { updateWorkoutReminder } from "@/Api/userSetting";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));
const ProfileAvatarFrag = lazy(() => import("@/Fragments/ProfileAvatarFrag"));
const UiLayout = lazy(() => import("@/layout/UiLayout"));
const LayoutGridWrapper = lazy(() => import("@/Wrappers/LayoutGridWrapper"));
const PrimaryAlertDialog = lazy(
  () => import("@/components/PrimaryAlertDialog/PrimaryAlertDialog")
);

const ICONS = [Dumbbell, Zap, Award, Flame];

const _RenderFitnessStats = ({
  data,
  ICON,
}: {
  data: IFitnessStats;
  ICON: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-800 p-4">
      <ICON className="mb-2 h-8 w-8 text-[#00BFFF]" />
      <span className="text-2xl font-bold">{data.value}</span>
      <span className="text-sm text-gray-400">{data.title}</span>
    </div>
  );
};

export default function Profile() {
  const {data, refetch} = useUserProfile();
  const {data : userSetting, refetch:userSettingRefetch} = useUserSetting();

  const { data: fitnessStats } = useQuery({
    queryKey: ["get-fitness-stats"],
    queryFn: getFitnessStats,
  });
  const { mutate } = useLogout();
  const { formik, isPending } = useUpdatePassword();
  const { isPending: erasePending, mutate: eraseMutate } = useEraseAccount();

  const formattedDateTime = new Date(
    data?.data?.createdAt as string
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const { mutate: saveUserSettingMutate } = useMutation({
    mutationKey: ["workout-remindere"],
    mutationFn: updateWorkoutReminder,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      userSettingRefetch();
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });

  const { mutate: updatePreferencesMutate } = useMutation({
    mutationKey: ["update-preferences"],
    mutationFn: updatePreferences,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      refetch();
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });
  return (
    <UiLayout>
      <ProfileAvatarFrag data={data} refetch={refetch} />

      <LayoutGridWrapper>
        {/* User Information Section */}
        <div className="md:col-span-2">
          <PrimaryCard title="Basic Information" cardClassName="mb-8">
            <div className="grid gap-4">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-[#00BFFF]" />
                <span>{data?.data?.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#00BFFF]" />
                <span>{data?.data?.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#00BFFF]" />
                <span>Joined: {formattedDateTime}</span>
              </div>
            </div>
          </PrimaryCard>
          <PrimaryCard title="Fitness Stats">
            <div className="grid grid-cols-2 gap-4">
              {fitnessStats?.map((stat, index: number) => {
                const ICON = ICONS[index];
                return <_RenderFitnessStats data={stat} ICON={ICON} />;
              })}
            </div>
          </PrimaryCard>
        </div>

        {/* Settings & Preferences */}
        <div>
          <PrimaryCard title="Settings & Preferences" cardClassName="mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Use Metric System ({data?.data?.preferences})</span>
                <Switch
                  checked={data?.data?.preferences === "kg" ? false : true}
                  onCheckedChange={(value) =>
                    updatePreferencesMutate(value ? "lbs" : "kg")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Workout Reminders</span>
                <Switch
                  checked={userSetting?.workoutReminder.workoutReminder}  
                  onCheckedChange={(value) => saveUserSettingMutate(value)}
                />
              </div>
              <PrimaryAlertDialog
                trigger={() => (
                  <Button className="w-full" variant="secondary">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                )}
                btnName={isPending ? "Updating..." : "Update Password"}
                disabled={isPending}
                onClick={() => formik.handleSubmit()}
              >
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    placeholder="Old Password"
                    name="oldPassword"
                    autoComplete="off"
                    className="pl-10 bg-[#2A2A2A] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    placeholder="New Password"
                    name="newPassword"
                    autoComplete="off"
                    className="pl-10 bg-[#2A2A2A] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </PrimaryAlertDialog>
            </div>
          </PrimaryCard>
          <PrimaryCard title="Account Actions">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 mb-2"
              variant="destructive"
              onClick={() => mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <PrimaryAlertDialog
              trigger={() => (
                <Button className="w-full" variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              )}
              title="Are you absolutely sure?"
              des="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
              btnName={erasePending ? "Deleting..." : "Delete Account"}
              disabled={erasePending}
              onClick={() => eraseMutate()}
            />
          </PrimaryCard>
        </div>
      </LayoutGridWrapper>
    </UiLayout>
  );
}
