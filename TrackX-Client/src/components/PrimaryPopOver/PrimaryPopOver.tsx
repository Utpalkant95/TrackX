import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface IPrimaryPopOver {
    btn : () => JSX.Element;
    children : React.ReactNode;
}
const PrimaryPopOver = ({btn, children} : IPrimaryPopOver) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {btn()}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#2A2A2A]" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default PrimaryPopOver;
