"use client";

import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export default function SearchForm({ onSearch }: Props) {
  const [value, setValue] = useState("");

  function handleClick() {
    onSearch(value);
  }

  return (
    <form className="mb-[24px] flex gap-[24px]">
      <input
        placeholder="Searching..."
        className="input-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="btn-primary cursor-pointer"
        type="button"
        onClick={handleClick}
      >
        Search
      </button>
    </form>
  );
}
