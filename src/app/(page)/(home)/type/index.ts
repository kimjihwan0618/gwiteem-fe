export interface HomePageState {
  activeSection: "dashboard" | "stocks";
}

export type HomePageAction = {
  type: "sectionChanged";
  section: HomePageState["activeSection"];
};
export * from "./briefing";
export * from "./favorites";
export * from "./guest";
export * from "./choices";
