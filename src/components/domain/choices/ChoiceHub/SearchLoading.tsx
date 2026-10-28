import { LoaderCircle } from "lucide-react";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { choiceHubStyles as styles } from "./styles";

export function SearchLoading() {
  return (
    <div aria-busy="true">
      <div className={styles.searchLoading} role="status" aria-live="polite">
        <LoaderCircle
          className={styles.searchSpinner}
          size={20}
          aria-hidden="true"
        />
        <span>loading</span>
      </div>
      <ChoiceSkeleton />
    </div>
  );
}
