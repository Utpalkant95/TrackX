import { Input } from "@/components/ui/input";
import { LucideProps } from "lucide-react";
import React from "react";

interface IFormInputWrapperAtom {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInputWrapperAtom = ({
  Icon,
  name,
  onChange,
  placeholder,
  type,
  value,
}: IFormInputWrapperAtom) => {
  return (
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 bg-[#2A2A2A] border-gray-600 text-white placeholder-gray-400"
      />
    </div>
  );
};

export default FormInputWrapperAtom;