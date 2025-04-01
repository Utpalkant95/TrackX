import { Dispatch, SetStateAction } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// type Data = {
//   key : string;
//   value : string;
// }

interface IPrimarySelect {
  label?: string;
  placeholder: string;
  data:{
    key : string,
    value : string
  }[] | undefined;
  onValueChange ?: Dispatch<SetStateAction<string>>;
  value : string;
  defaultValue ?: string;
}

const PrimarySelect = ({ label, placeholder, data, onValueChange,value, defaultValue }: IPrimarySelect) => {
  return (
    <>
      <Label htmlFor="exercise-select" className="text-white mb-2 block w-full">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange} defaultValue={defaultValue} >
        <SelectTrigger
          id="exercise-select"
          className="w-full sm:min-w-[180px] bg-[#2A2A2A] text-white"
        > 
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#2A2A2A] text-white">
          {data?.map((item) => (
            <SelectItem key={item.key} value={item.value}>
              {item.key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default PrimarySelect;