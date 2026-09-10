import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { dashboardSkeletonStyles } from "./styles";

export function DashboardSkeleton() {
  return (
    <div className={dashboardSkeletonStyles.root}>
      <AppHeader />
      <main className={dashboardSkeletonStyles.main}>
        <div className={dashboardSkeletonStyles.briefingHeader}>
          <div className={dashboardSkeletonStyles.briefingIntro}>
            <Skeleton className={dashboardSkeletonStyles.greeting} />
            <Skeleton className={dashboardSkeletonStyles.date} />
          </div>
          <div className={dashboardSkeletonStyles.actions}>
            <Skeleton className={dashboardSkeletonStyles.primaryAction} />
            <Skeleton className={dashboardSkeletonStyles.secondaryAction} />
          </div>
        </div>
        <div className={dashboardSkeletonStyles.featureGrid}>
          {[0, 1, 2].map((card) => (
            <Card key={card} className={dashboardSkeletonStyles.featureCard}>
              <div className={dashboardSkeletonStyles.cardHeader}>
                <Skeleton className={dashboardSkeletonStyles.cardIcon} />
                <Skeleton className={dashboardSkeletonStyles.cardTitle} />
                <Skeleton className={dashboardSkeletonStyles.cardAction} />
              </div>
              <Skeleton className={dashboardSkeletonStyles.cardMetric} />
              <div className={dashboardSkeletonStyles.cardRows}>
                {[0, 1, 2].map((row) => (
                  <Skeleton
                    key={row}
                    className={dashboardSkeletonStyles.cardRow}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className={dashboardSkeletonStyles.secondaryGrid}>
          <Card className={dashboardSkeletonStyles.priorityCard}>
            <Skeleton className={dashboardSkeletonStyles.priorityTitle} />
            {[0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                className={dashboardSkeletonStyles.priorityRow}
              />
            ))}
          </Card>
          <Card className={dashboardSkeletonStyles.scheduleCard}>
            <Skeleton className={dashboardSkeletonStyles.scheduleTitle} />
            {[0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                className={dashboardSkeletonStyles.scheduleRow}
              />
            ))}
          </Card>
        </div>
        <Card className={dashboardSkeletonStyles.newsCard}>
          <Skeleton className={dashboardSkeletonStyles.newsTitle} />
          <div className={dashboardSkeletonStyles.newsGrid}>
            {[0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                className={dashboardSkeletonStyles.newsItem}
              />
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
