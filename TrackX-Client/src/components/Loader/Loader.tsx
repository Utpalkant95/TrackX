import { Loader2 } from 'lucide-react';

interface ILoader {
  size : number;
}

const Loader = ({size} : ILoader) => {
  return (
    <Loader2 className="animate-spin text-[#00BFFF]" size={size}/>
  )
}

export default Loader