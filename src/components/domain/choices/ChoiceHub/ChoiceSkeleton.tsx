import { Skeleton } from "@/components/ui/Skeleton";
import { choiceHubStyles } from "./styles";

export function ChoiceSkeleton() {
  return (
    <>
      <Skeleton className={choiceHubStyles.skeletonFeatured} />
      <div className={choiceHubStyles.skeletonGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className={choiceHubStyles.skeletonCard} />
        ))}
      </div>
    </>
  );
}
