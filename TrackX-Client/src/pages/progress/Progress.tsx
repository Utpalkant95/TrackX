import { lazy, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getExerciseList,
  getPersonalBest,
  getProgressGraph,
  getProgressReport,
  getWeeklyProgress,
} from "@/Api/progress";
import { useSelectExercise } from "@/hooks";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { IRES } from "@/Api/interfaces/Response";
const UiLayout = lazy(() => import("@/layout/UiLayout"));
const LayoutGridWrapper = lazy(() => import("@/Wrappers/LayoutGridWrapper"));
const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));
const PrimarySelect = lazy(
  () => import("@/components/PrimarySelect/PrimarySelect")
);
const LayoutContentWrapper = lazy(
  () => import("@/Wrappers/LayoutContentWrapper")
);
const AiInsights = lazy(() => import("@/Fragments/AiInsights"));
const ProgressGraphFrag = lazy(() => import("@/Fragments/ProgressGraphFrag"));

const dateRanges = [
  {
    key: "Last 7 days",
    value: "7",
  },
  {
    key: "Last 30 days",
    value: "30",
  },
  {
    key: "Last 90 days",
    value: "90",
  },
];

const _RenderPersonalBest = ({
  heading,
  value,
}: {
  heading: string;
  value: string;
}) => {
  return (
    <div>
      <Label className="text-gray-400">{heading}</Label>
      <p className="text-2xl font-bold text-white">{value} </p>
    </div>
  );
};

export default function Progress() {
  const { selectedExercise, setSelectedExercise } = useSelectExercise();
  const [dateRange, setDateRange] = useState<string>("30");

  const { data: personalBest } = useQuery({
    queryKey: ["persoanl-best"],
    queryFn: getPersonalBest,
  });

  const { data: weeklyProgress } = useQuery({
    queryKey: ["weekly-progress"],
    queryFn: getWeeklyProgress,
  });

  const { data } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExerciseList,
  });

  const tempExer = data?.map((item) => ({
    key: item,
    value: item,
  }));

  const { data: ProgressGraph } = useQuery({
    queryKey: ["getProgressGraph", selectedExercise, dateRange],
    queryFn: () => getProgressGraph({ exerciseName: selectedExercise, dateRange }),
    enabled: !!selectedExercise,
  });

  const { mutate: progressReportMutate } = useMutation({
    mutationKey: ["getProgressReport"],
    mutationFn: getProgressReport,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });

  return (
    <UiLayout>
      <LayoutContentWrapper
        header="Progress Tracker"
        des="Analyze your workout performance over time."
      />

      <LayoutGridWrapper Cols={2}>
        <div className="space-y-8">
          {/* Filters */}
          <PrimaryCard cardContentClassName="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <PrimarySelect
                  data={tempExer}
                  label="Select Exercise"
                  placeholder="Select exercise"
                  onValueChange={setSelectedExercise}
                  value={selectedExercise}
                />
              </div>
              <div className="w-full sm:w-auto">
                <PrimarySelect
                  data={dateRanges}
                  label="Date Range"
                  onValueChange={setDateRange}
                  placeholder="Select date range"
                  value={dateRange}
                />
              </div>
              {/* aur inputs */}
            </div>
          </PrimaryCard>

          {/* Progress Visualization */}

          <ProgressGraphFrag
            data={ProgressGraph}
            selectedExercise={` ${selectedExercise} Progress`}
          />

          {/* Weekly Progress Comparison */}
          <PrimaryCard title="Weekly Progress">
            <div className="space-y-2">
              <p className="text-green-400">
                {weeklyProgress?.data.weightProgress}
              </p>
              <p className="text-blue-400">
                {weeklyProgress?.data.repsProgress}
              </p>
            </div>
          </PrimaryCard>
        </div>

        <div className="space-y-8">
          {/* Personal Best Achievements */}
          <PrimaryCard title="Personal Bests">
            <div className="space-y-4">
              {personalBest?.map((item) => {
                return (
                  <_RenderPersonalBest
                    heading={item.title}
                    value={item.value}
                  />
                );
              })}
            </div>
          </PrimaryCard>

          {/* AI-Based Insights & Recommendations */}
          <AiInsights />

          {/* Quick Actions */}
          <PrimaryCard title="Quick Actions" cardContentClassName="space-y-4">
            <Button
              className="w-full bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
              onClick={() => progressReportMutate()}
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </PrimaryCard>
        </div>
      </LayoutGridWrapper>
    </UiLayout>
  );
}
