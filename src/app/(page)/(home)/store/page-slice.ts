import type { HomePageAction, HomePageState } from "../type";

export const homePageInitialState: HomePageState = {
  activeSection: "dashboard",
};

export function homePageReducer(
  state: HomePageState,
  action: HomePageAction,
): HomePageState {
  if (action.type === "sectionChanged") {
    return { ...state, activeSection: action.section };
  }

  return state;
}
