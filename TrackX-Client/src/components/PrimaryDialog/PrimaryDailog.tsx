import { X } from "lucide-react";
import React, { lazy } from "react";

const Dialog = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.Dialog,
  }))
);
const DialogTrigger = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.DialogTrigger,
  }))
);
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.DialogContent,
  }))
);
const DialogHeader = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.DialogHeader,
  }))
);
const DialogTitle = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.DialogTitle,
  }))
);
const DialogDescription = lazy(() =>
  import("@/components/ui/dialog").then((module) => ({
    default: module.DialogDescription,
  }))
);

interface IPrimaryDailog {
  btn: () => JSX.Element;
  children: React.ReactNode;
  title?: string;
  description?: string;
  openForm?: boolean;
  dialogClassName: string;
  onClick?: () => void;
}

const PrimaryDailog = ({
  btn,
  children,
  title,
  description,
  openForm,
  dialogClassName,
  onClick
}: IPrimaryDailog) => {
  return (
    <div className="relative">
      <Dialog open={openForm && openForm}>
        <DialogTrigger asChild>{btn()}</DialogTrigger>
        <DialogContent className={dialogClassName}>
        <div
          role="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClick}
        >
          <X className="h-4 w-4" />
        </div>
          {title || description ? (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          ) : (
            ""
          )}
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrimaryDailog;
