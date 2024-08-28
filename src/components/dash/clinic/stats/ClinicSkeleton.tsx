import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export default function ClinicSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium w-32">
          <Skeleton className="w-full h-5" />
        </CardTitle>
        <Skeleton className=" size-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="text-2xl font-bold w-32 h-8" />

        <DescriptionList>
          <DescriptionTerm>
            <Skeleton className="w-16 h-5 mb-2" />
          </DescriptionTerm>
          <DescriptionDetails>
            <Skeleton className="w-14 h-5 bg-lime-100" />
          </DescriptionDetails>
          <DescriptionTerm>
            <Skeleton className="w-16 h-5 mb-2" />
          </DescriptionTerm>
          <DescriptionDetails>
            <Skeleton className="w-14 h-5 bg-amber-100" />
          </DescriptionDetails>
          <DescriptionTerm>
            <Skeleton className="w-16 h-5 mb-2" />
          </DescriptionTerm>
          <DescriptionDetails>
            <Skeleton className="w-14 h-5 bg-rose-100" />
          </DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  );
}
