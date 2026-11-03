"use client";

import { useState } from "react";

export function useQuestionSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");

  function submitSearch() {
    const normalized = searchQuery.trim();
    setSearchQuery(normalized);
    setSearch(normalized);
  }

  function resetSearch() {
    setSearchQuery("");
    setSearch("");
  }

  return {
    searchQuery,
    search,
    changeSearch: setSearchQuery,
    submitSearch,
    resetSearch,
  };
}
