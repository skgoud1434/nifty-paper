// types.ts

export type Condition = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

export type ConditionGroup = {
  id: string;
  logic: "AND" | "OR";
  conditions: (Condition | ConditionGroup)[];
  isCollapsed?: boolean;
};
