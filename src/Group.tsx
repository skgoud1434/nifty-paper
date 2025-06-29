// Group.tsx

import React from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "react-feather";
import ConditionComponent from "./Condition";
import { Condition, ConditionGroup } from "./types";
import { findGroup } from "./utils";

type Props = {
  group: ConditionGroup;
  path: string[];
  rootGroup: ConditionGroup;
  fieldOptions: Record<string, string[]>;
  operatorOptions: { value: string; label: string }[];
  updateCondition: (
    path: string[],
    field: keyof Condition,
    value: string
  ) => void;
  addCondition: (path: string[]) => void;
  addGroup: (path: string[]) => void;
  removeItem: (path: string[]) => void;
  changeGroupLogic: (path: string[], logic: "AND" | "OR") => void;
  toggleCollapse: (path: string[]) => void;
};

const GroupComponent: React.FC<Props> = ({
  group,
  path,
  rootGroup,
  fieldOptions,
  operatorOptions,
  updateCondition,
  addCondition,
  addGroup,
  removeItem,
  changeGroupLogic,
  toggleCollapse,
}) => {
  const groupObj = findGroup(rootGroup, path);
  const isCollapsed = groupObj?.isCollapsed ?? false;

  return (
    <div className="group bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="group-header flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleCollapse(path)}
            className="text-gray-500 p-1"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
          <div className="flex items-center bg-white rounded-md">
            <button
              onClick={() => changeGroupLogic(path, "AND")}
              className={`px-3 py-1 ${
                group.logic === "AND" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              AND
            </button>
            <button
              onClick={() => changeGroupLogic(path, "OR")}
              className={`px-3 py-1 ${
                group.logic === "OR" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              OR
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addCondition(path)}
            className="px-2 py-1 text-sm bg-white border rounded"
          >
            <Plus size={14} /> Condition
          </button>
          <button
            onClick={() => addGroup(path)}
            className="px-2 py-1 text-sm bg-white border rounded"
          >
            <Plus size={14} /> Group
          </button>
          {path.length > 0 && (
            <button
              onClick={() => removeItem(path)}
              className="p-1 text-red-500"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="conditions space-y-3 pl-6 border-l ml-3">
          {group.conditions.map((item) =>
            "logic" in item ? (
              <GroupComponent
                key={item.id}
                group={item}
                path={[...path, item.id]}
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
            ) : (
              <ConditionComponent
                key={item.id}
                condition={item as Condition}
                path={[...path, item.id]}
                {...{
                  fieldOptions,
                  operatorOptions,
                  updateCondition,
                  removeItem,
                }}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GroupComponent;
