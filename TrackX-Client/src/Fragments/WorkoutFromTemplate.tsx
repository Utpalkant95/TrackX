import { Dispatch, SetStateAction, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/Api/template";
import { ITemplateData } from "@/Api/interfaces/Response";

interface IWorkoutFromTemplate {
  setSelectedTemplate:Dispatch<SetStateAction<ITemplateData | null | undefined>>;
  setOpenForm : Dispatch<SetStateAction<boolean>>
}

const WorkoutFromTemplate = ({
  setSelectedTemplate: setTemplate,
  setOpenForm
}: IWorkoutFromTemplate) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplateData | null>(null);
  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const filteredTemplates = data?.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 bg-[#2A2A2A] text-white border-gray-700"
        />
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {filteredTemplates?.map((template) => (
            <Card
              key={template._id}
              className={`bg-[#2A2A2A] border-2 transition-all cursor-pointer hover:bg-[#3A3A3A] ${
                selectedTemplate === template
                  ? "border-[#00BFFF]"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {template.exercises.length} exercise
                      {template.exercises.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1E1E1E] text-white"
                  >
                    {template.exercises[0]?.sets[0]?.difficulty || "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {template.exercises.map((exercise) => (
                      <div key={exercise._id} className="space-y-2">
                        <div className="font-medium text-white">
                          {exercise.name}
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={set._id}
                            className="flex justify-between py-1 pl-4"
                          >
                            <span>Set {setIndex + 1}</span>
                            <span>
                              {set.weight}kg × {set.reps} reps ({set.difficulty}
                              )
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            setTemplate(selectedTemplate)
            setOpenForm(true)
          }}
          disabled={!selectedTemplate}
          className="bg-[#00BFFF] text-white hover:bg-[#00A0D0]"
        >
          Import Template <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default WorkoutFromTemplate;
