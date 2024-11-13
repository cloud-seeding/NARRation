// app/dates/VariableSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { NARRData } from "../types";

interface VariableSelectorProps {
  variables: string[];
  data: NARRData;
}

export default function VariableSelector({
  variables = [],
}: VariableSelectorProps) {
  const [selectedVariable, setSelectedVariable] = useState<string>("");

  useEffect(() => {
    if (variables.length > 0 && !selectedVariable) {
      setSelectedVariable(variables[0]);
    }
  }, [variables, selectedVariable]);

  const handleVariableChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value;
    setSelectedVariable(newValue);
    const customEvent = new CustomEvent("variableChange", {
      detail: newValue,
    });
    window.dispatchEvent(customEvent);
  };

  if (!variables.length) return null;

  return (
    <div className="flex items-center space-x-4">
      <label
        htmlFor="variable-select"
        className="text-sm font-medium text-gray-300"
      >
        Select Variable:
      </label>
      <select
        id="variable-select"
        value={selectedVariable}
        onChange={handleVariableChange}
        className="block w-48 rounded-md border border-gray-600 bg-gray-700 text-gray-100 py-2 px-3 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
      >
        {variables.map((variable) => (
          <option key={variable} value={variable} className="bg-gray-700">
            {variable.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
