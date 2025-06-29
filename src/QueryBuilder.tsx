// QueryBuilder.tsx

import React, { useState } from "react";
import GroupComponent from "./Group";
import { ConditionGroup } from "./types";
import { generateId, updateGroup } from "./utils";

const QueryBuilder = () => {
  const fieldOptions = {
    Status: ["Open", "In Progress", "Closed"],
    Priority: ["Low", "Medium", "High"],
    "Assigned To": ["User A", "User B", "User C"],
    Category: ["Bug", "Feature", "Task"],
  };

  const operatorOptions = [
    { value: "equals", label: "equals" },
    { value: "not equals", label: "not equals" },
    { value: "contains", label: "contains" },
    { value: "does not contain", label: "does not contain" },
  ];

  const initialGroup: ConditionGroup = {
    id: generateId(),
    logic: "AND",
    conditions: [
      {
        id: generateId(),
        field: "Status",
        operator: "equals",
        value: "Open",
      },
    ],
  };

  const [rootGroup, setRootGroup] = useState<ConditionGroup>(initialGroup);
  const [output, setOutput] = useState<any>(null);

  const addCondition = (path: string[]) => {
    const newCond = {
      id: generateId(),
      field: "Status",
      operator: "equals",
      value: "Open",
    };
    setRootGroup((prev) =>
      updateGroup(prev, path, (g) => ({
        ...g,
        conditions: [...g.conditions, newCond],
      }))
    );
  };

  const addGroup = (path: string[]) => {
    const newGroup: ConditionGroup = {
      id: generateId(),
      logic: "AND",
      conditions: [
        {
          id: generateId(),
          field: "Status",
          operator: "equals",
          value: "Open",
        },
      ],
    };
    setRootGroup((prev) =>
      updateGroup(prev, path, (g) => ({
        ...g,
        conditions: [...g.conditions, newGroup],
      }))
    );
  };

  const removeItem = (path: string[]) => {
    const parentPath = path.slice(0, -1);
    const id = path[path.length - 1];
    setRootGroup((prev) =>
      updateGroup(prev, parentPath, (g) => ({
        ...g,
        conditions: g.conditions.filter((item) => item.id !== id),
      }))
    );
  };

  const changeGroupLogic = (path: string[], logic: "AND" | "OR") => {
    setRootGroup((prev) => updateGroup(prev, path, { logic }));
  };

  const toggleCollapse = (path: string[]) => {
    setRootGroup((prev) =>
      updateGroup(prev, path, (g) => ({ ...g, isCollapsed: !g.isCollapsed }))
    );
  };

  const updateCondition = (path: string[], field: any, value: string) => {
    const groupPath = path.slice(0, -1);
    const id = path[path.length - 1];
    setRootGroup((prev) =>
      updateGroup(prev, groupPath, (g) => ({
        ...g,
        conditions: g.conditions.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }))
    );
  };

  const generateQuery = () => {
    const clean = (group: ConditionGroup): any => ({
      logic: group.logic,
      conditions: group.conditions.map((item) =>
        "logic" in item
          ? clean(item)
          : { field: item.field, operator: item.operator, value: item.value }
      ),
    });
    setOutput(clean(rootGroup));
  };

  return (
    <div className="query-builder p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Advanced Query Builder</h1>
      <GroupComponent
        group={rootGroup}
        path={[]}
        {...{
          rootGroup,
          fieldOptions,
          operatorOptions,
          updateCondition,
          addCondition,
          addGroup,
          removeItem,
          changeGroupLogic,
          toggleCollapse,
        }}
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={generateQuery}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate Query
        </button>
      </div>

      {output && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">Output</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
