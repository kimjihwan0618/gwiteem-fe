import type { ChoiceCategory } from "@/app/(page)/(home)/type";
import { categories } from "./choice-utils";
import { categoryTabVariants, choiceHubStyles } from "./styles";

interface CategoryTabsProps {
  activeCategory: ChoiceCategory | "all";
  onCategoryChange: (category: ChoiceCategory | "all") => void;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className={choiceHubStyles.mobileCategories}>
      {categories.map((category) => (
        <button
          key={category.value}
          className={categoryTabVariants({
            active: activeCategory === category.value,
          })}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
