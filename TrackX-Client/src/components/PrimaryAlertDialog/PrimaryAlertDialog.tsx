import { lazy, ReactNode } from "react";

const AlertDialog = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialog,
  }))
);
const AlertDialogTrigger = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogTrigger,
  }))
);

const AlertDialogContent = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogContent,
  }))
);

const AlertDialogFooter = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogFooter,
  }))
);

const AlertDialogCancel = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogCancel,
  }))
);

const AlertDialogAction = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogAction,
  }))
);

const AlertDialogHeader = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogHeader,
  }))
);
const AlertDialogTitle = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogTitle,
  }))
);

const AlertDialogDescription = lazy(() =>
  import("@/components/ui/alert-dialog").then((module) => ({
    default: module.AlertDialogDescription,
  }))
);

interface IPrimaryAlertDialog {
  trigger: () => JSX.Element;
  children?: ReactNode;
  btnName: string;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  des?: string;
}

const PrimaryAlertDialog = ({
  trigger,
  children,
  btnName,
  disabled,
  onClick,
  des,
  title,
}: IPrimaryAlertDialog) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger()}</AlertDialogTrigger>

      <AlertDialogContent className="bg-gray-900 text-white">
        {title || des ? (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {des && (
              <AlertDialogDescription className="text-gray-400">
                {des}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        ) : (
          ""
        )}
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className=" bg-[#00BFFF] hover:bg-[#33CCFF] text-white"
            type="submit"
            disabled={disabled}
            onClick={onClick}
          >
            {btnName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrimaryAlertDialog;
