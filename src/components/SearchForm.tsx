"use client";

import { useState } from "react";
import { type } from "../../.next/dev/types/routes";

interface Props {
  onSearch: (value: string) => void;
}

export default function SearchForm({ onSearch }: Props) {
  const [value, setValue] = useState("");

  function handleClick() {
    onSearch(value);
  }

  return (
    <form
      className="mb-[24px] flex gap-[24px]"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}>
      <input
        type="text"
        placeholder="Searching..."
        className="input-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="btn-primary cursor-pointer"
        type="submit"
        onClick={handleClick}>
        Search
      </button>

      {value && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setValue("");
            onSearch("");
          }}>
          Clear
        </button>
      )}
    </form>
  );
}
