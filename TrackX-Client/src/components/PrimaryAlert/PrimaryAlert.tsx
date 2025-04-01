import { LucideProps } from "lucide-react";
import { lazy } from "react";
const Alert = lazy(() =>
  import("@/components/ui/alert").then((module) => ({ default: module.Alert }))
);
const AlertDescription = lazy(() =>
  import("@/components/ui/alert").then((module) => ({
    default: module.AlertDescription,
  }))
);
const AlertTitle = lazy(() =>
  import("@/components/ui/alert").then((module) => ({
    default: module.AlertTitle,
  }))
);

interface IPrimaryAlert {
  title: string;
  description: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  alertClassName? : string;
}
const PrimaryAlert = ({ title, description, Icon, alertClassName }: IPrimaryAlert) => {
  return (
    <Alert className={alertClassName}>
      {Icon && <Icon className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default PrimaryAlert;
