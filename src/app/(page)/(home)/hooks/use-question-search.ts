"use client";

import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";

export function useQuestionSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const commitSearch = useMemo(() => debounce(setSearch, 300), []);
  useEffect(() => () => commitSearch.cancel(), [commitSearch]);

  function changeSearch(value: string, isComposing = false) {
    setSearchQuery(value);
    commitSearch.cancel();
    if (!isComposing) commitSearch(value.trim());
  }

  return {
    searchQuery,
    search,
    changeSearch,
    isSearchPending: searchQuery.trim() !== search,
  };
}
