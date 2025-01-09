"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State for storing the value
  const [value, setValue] = useState<T>(initialValue);

  // Initialize value only after the component mounts
  useEffect(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) {
      setValue(JSON.parse(jsonValue));
    } else {
      setValue(initialValue);
    }
  }, []);

  // Update localStorage when value changes
  useEffect(() => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
