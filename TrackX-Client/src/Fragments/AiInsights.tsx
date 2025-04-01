import { getAiInsights } from "@/Api/progress";
import { PrimaryAlert, PrimaryCard } from "@/components";
import { useQuery } from "@tanstack/react-query";



const AiInsights = () => {
    const {data : aiInsights} = useQuery({
        queryKey: ["ai-insights"],
        queryFn: getAiInsights,
      });
  return (
    <PrimaryCard title="AI Insights" cardContentClassName="space-y-4">
      {aiInsights?.map((insight) => {
        return (
          <PrimaryAlert
            alertClassName="bg-[#2A2A2A] border-orange-500"
            title={insight.type.replace(/([A-Z])/g, " $1").toLocaleUpperCase()}
            description={insight.message}
          />
        );
      })}
    </PrimaryCard>
  );
};

export default AiInsights;