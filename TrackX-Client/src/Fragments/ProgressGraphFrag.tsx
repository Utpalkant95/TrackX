import { IProgressGraph } from "@/Api/interfaces/Response";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Dispatch, lazy, SetStateAction, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SelectExerciseFrag from "./SelectExerciseFrag";

const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));

interface IProgressGraphFrag {
  selectedExercise?: string;
  data: IProgressGraph[] | undefined;
  setSelectedExercise?: Dispatch<SetStateAction<string>>;
  flag?: boolean;
}

const ProgressGraphFrag = ({
  selectedExercise,
  data,
  setSelectedExercise,
  flag,
}: IProgressGraphFrag) => {
  const [showWeight, setShowWeight] = useState<boolean>(true);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  return (
    <PrimaryCard
      title={selectedExercise}
      headerComp={
        flag && <SelectExerciseFrag setSelectedExercise={setSelectedExercise} />
      }
    >
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Switch
            id="weight-toggle"
            checked={showWeight}
            onCheckedChange={setShowWeight}
          />
          <Label htmlFor="weight-toggle" className="text-white">
            {showWeight ? "Weight" : "Reps"}
          </Label>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChartType("line")}
            className={cn(
              "bg-[#2A2A2A] text-white",
              chartType === "line" && "bg-[#00BFFF]"
            )}
          >
            Line
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChartType("bar")}
            className={cn(
              "bg-[#2A2A2A] text-white",
              chartType === "bar" && "bg-[#00BFFF]"
            )}
          >
            Bar
          </Button>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "none",
                }}
                itemStyle={{ color: "#00BFFF" }}
              />
              <Line
                type="monotone"
                dataKey={showWeight ? "weight" : "reps"}
                stroke="#00BFFF"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "none",
                }}
                itemStyle={{ color: "#00BFFF" }}
              />
              <Bar dataKey={showWeight ? "weight" : "reps"} fill="#00BFFF" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </PrimaryCard>
  );
};

export default ProgressGraphFrag;
