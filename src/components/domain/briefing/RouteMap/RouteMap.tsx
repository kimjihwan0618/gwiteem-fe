import { BriefcaseBusiness, House } from "lucide-react";
import type { Commute } from "@/app/(page)/(home)/type";
import { KakaoMap } from "./KakaoMap";
import { routeMapStyles } from "./styles";

export function RouteMap({
  origin,
  destination,
  routePolyline,
  originLabel,
  destinationLabel,
}: {
  origin?: Commute["origin"];
  destination?: Commute["destination"];
  routePolyline?: Commute["routePolyline"];
  originLabel?: string;
  destinationLabel?: string;
}) {
  return (
    <div className={routeMapStyles.root}>
      <KakaoMap
        origin={origin}
        destination={destination}
        routePolyline={routePolyline}
      />
      <div className={routeMapStyles.legend}>
        <div className={routeMapStyles.origin}>
          <House size={15} className={routeMapStyles.originIcon} />{" "}
          {origin?.label ?? originLabel ?? "출발지"}
        </div>
        <div className={routeMapStyles.destination}>
          <BriefcaseBusiness
            size={15}
            className={routeMapStyles.destinationIcon}
          />{" "}
          {destination?.label ?? destinationLabel ?? "도착지"}
        </div>
      </div>
    </div>
  );
}
