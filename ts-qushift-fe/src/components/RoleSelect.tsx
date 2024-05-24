import { forwardRef } from "react";

import { ElementOf } from "@/types/utils";

export const roles = ["general", "admin", "banned"] as const;
export type Role = ElementOf<typeof roles>;

export const RoleSelect = forwardRef<HTMLSelectElement>((props, ref) => {
  return (
    <select {...props} ref={ref}>
      {roles.map((role) => (
        <option value={role} key={role}>
          {role}
        </option>
      ))}
    </select>
  );
});

RoleSelect.displayName = "RoleSelect";
