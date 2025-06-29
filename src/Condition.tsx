// Condition.tsx

import React from "react";
import { Trash2 } from "react-feather";
import { Condition } from "./types";

type Props = {
  condition: Condition;
  path: string[];
  fieldOptions: Record<string, string[]>;
  operatorOptions: { value: string; label: string }[];
  updateCondition: (
    path: string[],
    field: keyof Condition,
    value: string
  ) => void;
  removeItem: (path: string[]) => void;
};

const ConditionComponent: React.FC<Props> = ({
  condition,
  path,
  fieldOptions,
  operatorOptions,
  updateCondition,
  removeItem,
}) => (
  <div className="condition flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
    <select
      value={condition.field}
      onChange={(e) => updateCondition(path, "field", e.target.value)}
      className="flex-1 p-2 border border-gray-300 rounded-md"
    >
      {Object.keys(fieldOptions).map((field) => (
        <option key={field} value={field}>
          {field}
        </option>
      ))}
    </select>

    <select
      value={condition.operator}
      onChange={(e) => updateCondition(path, "operator", e.target.value)}
      className="flex-1 p-2 border border-gray-300 rounded-md"
    >
      {operatorOptions.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>

    <select
      value={condition.value}
      onChange={(e) => updateCondition(path, "value", e.target.value)}
      className="flex-1 p-2 border border-gray-300 rounded-md"
    >
      {fieldOptions[condition.field].map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>

    <button
      onClick={() => removeItem(path)}
      className="p-2 text-red-500 hover:text-red-700"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

export default ConditionComponent;
