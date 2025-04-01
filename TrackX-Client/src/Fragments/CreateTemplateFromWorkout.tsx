import { Dispatch, lazy, SetStateAction } from "react";
const Input = lazy(() =>
  import("@/components/ui/input").then((module) => ({ default: module.Input }))
);

interface ICreateTemplateFromWorkout {
  setTemplateName: Dispatch<SetStateAction<string>>;
}
const CreateTemplateFromWorkout = ({
  setTemplateName,
}: ICreateTemplateFromWorkout) => {
  return (
    <>
      <Input
        type="text"
        id="template-name"
        placeholder="enter template name eg: Legs Day"
        className="text-black"
        onChange={(e) => setTemplateName(e.target.value)}
        required
      />
    </>
  );
};

export default CreateTemplateFromWorkout;