"use client";

import type { ChoiceCategory } from "@/app/(page)/(home)/type";
import { cn } from "@/lib/cn";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories } from "./choice-utils";
import { choiceHubStyles, filterCategoryVariants } from "./styles";

interface QuestionFilterBarProps {
  activeCategories: ChoiceCategory[];
  searchQuery: string;
  sort?: "popular" | "latest";
  onCategoriesChange: (categories: ChoiceCategory[]) => void;
  onSearchQueryChange: (query: string) => void;
  onSortChange?: (sort: "popular" | "latest") => void;
}

export function QuestionFilterBar({
  activeCategories,
  searchQuery,
  sort,
  onCategoriesChange,
  onSearchQueryChange,
  onSortChange,
}: QuestionFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [draftCategories, setDraftCategories] = useState<ChoiceCategory[]>([]);
  const [draftSort, setDraftSort] = useState<"popular" | "latest">(
    sort ?? "popular",
  );
  const filterRef = useRef<HTMLDivElement>(null);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const activeFilterCount =
    activeCategories.length + Number(Boolean(sort && sort !== "popular"));

  function toggleFilter() {
    if (!isFilterOpen) {
      setDraftCategories(activeCategories);
      setDraftSort(sort ?? "popular");
    }
    setIsFilterOpen((isOpen) => !isOpen);
  }

  function toggleCategory(category: ChoiceCategory | "all") {
    if (category === "all") {
      setDraftCategories([]);
      return;
    }
    setDraftCategories((selected) =>
      selected.includes(category)
        ? selected.filter((item) => item !== category)
        : [...selected, category],
    );
  }

  function applyFilter() {
    onCategoriesChange(draftCategories);
    if (sort && onSortChange) onSortChange(draftSort);
    setIsFilterOpen(false);
  }

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

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting && entry.boundingClientRect.top < 74);
      },
      { rootMargin: "-74px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={stickySentinelRef}
        aria-hidden="true"
        className={choiceHubStyles.stickySentinel}
      />
      <section
        className={cn(
          choiceHubStyles.filterBar,
          isStuck && choiceHubStyles.filterBarStuck,
        )}
        aria-label="질문 탐색"
      >
        <div
          className={cn(
            choiceHubStyles.searchField,
            isStuck && choiceHubStyles.searchFieldStuck,
          )}
        >
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
              onClick={toggleFilter}
            >
              <SlidersHorizontal size={19} />
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
                      const isActive =
                        category.value === "all"
                          ? draftCategories.length === 0
                          : draftCategories.includes(category.value);
                      return (
                        <button
                          key={category.value}
                          className={filterCategoryVariants({
                            active: isActive,
                          })}
                          onClick={() => toggleCategory(category.value)}
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
                          onClick={() => setDraftSort(sortOption)}
                          className={cn(
                            choiceHubStyles.sortButton,
                            draftSort === sortOption &&
                              choiceHubStyles.sortButtonActive,
                          )}
                        >
                          {sortOption === "popular" ? "인기순" : "최신순"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className={choiceHubStyles.filterActions}>
                  <button
                    type="button"
                    className={choiceHubStyles.filterApplyButton}
                    onClick={applyFilter}
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
