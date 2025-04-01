import { lazy, useState } from "react";
import { ArrowRight, Dumbbell, Zap, Flame, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getWorkoutPerformance } from "@/Api/workout";
import { Link } from "react-router-dom";
import { getProgressGraph } from "@/Api/progress";
const UiLayout = lazy(() => import("@/layout/UiLayout"));
const LayoutGridWrapper = lazy(() => import("@/Wrappers/LayoutGridWrapper"));
const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));
const LayoutContentWrapper = lazy(
  () => import("@/Wrappers/LayoutContentWrapper")
);
const AiInsights = lazy(() => import("@/Fragments/AiInsights"));
const ProgressGraphFrag = lazy(() => import("@/Fragments/ProgressGraphFrag"));
const RecentWorkoutFrag = lazy(() => import("@/Fragments/RecentWorkoutFrag"));

const ICONS = [Dumbbell, Flame, Zap];

const PersonalBestItem = ({
  Icon,
  description,
  exerciseName,
  title,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
  exerciseName: string;
}) => {
  return (
    <PrimaryCard
      title={title}
      cardHeaderClassName="pb-2"
      cardTitleClassName="text-sm font-medium"
      Icon={Icon}
    >
      <div className="text-2xl font-bold">{exerciseName}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </PrimaryCard>
  );
};

export default function Dashboard() {
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  const { data: performanceData } = useQuery({
    queryKey: ["get-workout-performance"],
    queryFn: getWorkoutPerformance,
  });

  const { data: ProgressGraph } = useQuery({
    queryKey: ["getProgressGraph", selectedExercise],
    queryFn: () => getProgressGraph({ exerciseName: selectedExercise }),
    enabled: !!selectedExercise,
  });
  return (
    <UiLayout>
      <LayoutContentWrapper
        header="Dashboard"
        des="Track your progress and stay on top of your workouts."
      />
      <LayoutGridWrapper Cols={2}>
        <div className="space-y-8">
          {/* Today's Workout Plan */}
          <PrimaryCard title="Today's Workout Plan">
            <p className="text-gray-400 mb-4">
              No workout scheduled for today.
            </p>
            <Link to={"/workouts"}>
              <Button className="w-full bg-[#00BFFF] text-white hover:bg-[#00A0D0]">
                Quick Start Workout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </PrimaryCard>

          {/* Recent Workouts */}

          <RecentWorkoutFrag title="Recent Workouts" />
        </div>

        <div className="space-y-8">
          {/* Progress & Analytics Overview */}
          <ProgressGraphFrag
            data={ProgressGraph}
            selectedExercise="Weekly Progress"
            setSelectedExercise={setSelectedExercise}
            flag={true}
          />

          {/* Personal Bests */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {performanceData?.map((item, index) => {
              const ICON = ICONS[index];
              return (
                <PersonalBestItem
                  Icon={ICON}
                  title= {item.title}
                  description={item.valueTitle}
                  exerciseName={item.value}
                />
              );
            })}
          </div>

          {/* AI-Based Insights & Recommendations */}
          <AiInsights />
        </div>
      </LayoutGridWrapper>
    </UiLayout>
  );
}
