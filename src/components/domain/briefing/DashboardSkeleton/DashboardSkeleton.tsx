import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { dashboardSkeletonStyles } from "./styles";

export function DashboardSkeleton() {
  return (
    <div className={dashboardSkeletonStyles.root}>
      <AppHeader />
      <main className={dashboardSkeletonStyles.main}>
        <div className={dashboardSkeletonStyles.status}>
          <Skeleton className={dashboardSkeletonStyles.statusText} />
          <Skeleton className={dashboardSkeletonStyles.statusBadge} />
        </div>
        <div className={dashboardSkeletonStyles.primaryGrid}>
          <Card className={dashboardSkeletonStyles.hero}>
            <div className={dashboardSkeletonStyles.heroContent}>
              <Skeleton className={dashboardSkeletonStyles.badge} />
              <Skeleton className={dashboardSkeletonStyles.greeting} />
              <Skeleton className={dashboardSkeletonStyles.date} />
              <Skeleton className={dashboardSkeletonStyles.headline} />
              <Skeleton className={dashboardSkeletonStyles.description} />
              <div className={dashboardSkeletonStyles.actions}>
                <Skeleton className={dashboardSkeletonStyles.primaryAction} />
                <Skeleton className={dashboardSkeletonStyles.secondaryAction} />
              </div>
            </div>
            <Skeleton className={dashboardSkeletonStyles.map} />
          </Card>
          <Card className={dashboardSkeletonStyles.stockCard}>
            <Skeleton className={dashboardSkeletonStyles.stockTitle} />
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className={dashboardSkeletonStyles.stockRow}>
                <div className={dashboardSkeletonStyles.stockInfo}>
                  <Skeleton className={dashboardSkeletonStyles.stockName} />
                  <Skeleton className={dashboardSkeletonStyles.stockIssue} />
                </div>
                <Skeleton className={dashboardSkeletonStyles.stockValue} />
              </div>
            ))}
          </Card>
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
      </main>
    </div>
  );
}
