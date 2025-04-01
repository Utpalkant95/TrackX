import { IProfileSectionWrapperAtom } from "@/Api/interfaces/Project";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProfileSectionWrapperAtom = ({children, title, className} : IProfileSectionWrapperAtom) => {
  return (
    <Card className={`bg-gray-900 text-white ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileSectionWrapperAtom;
