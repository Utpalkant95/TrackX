import { LucideProps } from "lucide-react";
import { lazy } from "react";
const Card = lazy(() =>
  import("@/components/ui/card").then((module) => ({
    default: module.Card,
  }))
);
const CardContent = lazy(() =>
  import("@/components/ui/card").then((module) => ({
    default: module.CardContent,
  }))
);
const CardDescription = lazy(() =>
  import("@/components/ui/card").then((module) => ({
    default: module.CardDescription,
  }))
);
const CardHeader = lazy(() =>
  import("@/components/ui/card").then((module) => ({
    default: module.CardHeader,
  }))
);
const CardTitle = lazy(() =>
  import("@/components/ui/card").then((module) => ({
    default: module.CardTitle,
  }))
);

interface IPrimaryCard {
  title?: string;
  children: React.ReactNode;
  cardClassName?: string;
  cardHeaderClassName?: string;
  cardTitleClassName?: string;
  cardContentClassName?: string;
  des?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  headerComp?: React.ReactNode;
}

const PrimaryCard = ({
  children,
  title,
  cardClassName,
  cardContentClassName,
  cardHeaderClassName,
  cardTitleClassName,
  Icon,
  des,
  headerComp,
}: IPrimaryCard) => {
  return (
    <Card className={`bg-[#1E1E1E] text-white ${cardClassName}`}>
      {title && (
        <CardHeader className={cardHeaderClassName}>
          <div className="flex justify-between items-center">
            {title && (
              <CardTitle className={cardTitleClassName}>
                {Icon && <Icon className="h-4 w-4 inline-block mr-1" />}
                {title}
              </CardTitle>
            )}
            {headerComp && <div>{headerComp}</div>}
          </div>
          {des && <CardDescription>{des}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cardContentClassName}>{children}</CardContent>
    </Card>
  );
};

export default PrimaryCard;
