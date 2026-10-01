"use client";

import type { ChoiceCategory } from "@/app/(page)/(home)/type";
import { cn } from "@/lib/cn";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories } from "./choice-utils";
import { choiceHubStyles, filterCategoryVariants } from "./styles";

interface QuestionFilterBarProps {
  activeCategory: ChoiceCategory | "all";
  searchQuery: string;
  sort?: "popular" | "latest";
  onCategoryChange: (category: ChoiceCategory | "all") => void;
  onSearchQueryChange: (query: string) => void;
  onSortChange?: (sort: "popular" | "latest") => void;
}

export function QuestionFilterBar({
  activeCategory,
  searchQuery,
  sort,
  onCategoryChange,
  onSearchQueryChange,
  onSortChange,
}: QuestionFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const activeFilterCount =
    Number(activeCategory !== "all") +
    Number(Boolean(sort && sort !== "popular"));

  useEffect(() => {
    if (!isFilterOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!filterRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFilterOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFilterOpen]);

  return (
    <section className={choiceHubStyles.filterBar} aria-label="질문 탐색">
      <div className={choiceHubStyles.searchField}>
        <Search size={19} className={choiceHubStyles.searchIcon} />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="질문 제목을 검색해 보세요"
          aria-label="질문 제목 검색"
          className={choiceHubStyles.searchInput}
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="검색어 지우기"
            className={choiceHubStyles.searchClearButton}
            onClick={() => onSearchQueryChange("")}
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div ref={filterRef} className={choiceHubStyles.filterMenuRoot}>
        <button
          type="button"
          aria-label="질문 필터 열기"
          aria-expanded={isFilterOpen}
          aria-haspopup="dialog"
          className={cn(
            choiceHubStyles.filterTrigger,
            isFilterOpen && choiceHubStyles.filterTriggerOpen,
          )}
          onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
        >
          <SlidersHorizontal size={19} />
          <span className={choiceHubStyles.filterTriggerLabel}>필터</span>
          {activeFilterCount > 0 && (
            <span className={choiceHubStyles.filterCount}>
              {activeFilterCount}
            </span>
          )}
        </button>
        {isFilterOpen && (
          <div
            role="dialog"
            aria-label="질문 필터 설정"
            className={choiceHubStyles.filterPopover}
          >
            <div className={choiceHubStyles.filterSection}>
              <p className={choiceHubStyles.filterSectionTitle}>카테고리</p>
              <div className={choiceHubStyles.filterCategories}>
                {categories.map((category) => {
                  const isActive = activeCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      className={filterCategoryVariants({ active: isActive })}
                      onClick={() => onCategoryChange(category.value)}
                    >
                      {category.label}
                      {isActive && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
            {sort && onSortChange && (
              <div
                className={cn(
                  choiceHubStyles.filterSection,
                  choiceHubStyles.filterSortSection,
                )}
              >
                <p className={choiceHubStyles.filterSectionTitle}>정렬</p>
                <div className={choiceHubStyles.sortGroup}>
                  {(["popular", "latest"] as const).map((sortOption) => (
                    <button
                      key={sortOption}
                      type="button"
                      onClick={() => onSortChange(sortOption)}
                      className={cn(
                        choiceHubStyles.sortButton,
                        sort === sortOption && choiceHubStyles.sortButtonActive,
                      )}
                    >
                      {sortOption === "popular" ? "인기순" : "최신순"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
