import type { ManagedUser, UserRole, UserStats } from "../types/user";

export const ROLE_LABEL: Record<UserRole, string> = {
  USER: "Staff",
  DEAN: "Faculty Dean",
  ADMIN: "Admin",
};

export const ROLE_BADGE_STYLE: Record<UserRole, string> = {
  USER: "bg-blue-50 text-blue-700",
  DEAN: "bg-purple-50 text-purple-700",
  ADMIN: "bg-red-50 text-[#4C1D1D]",
};

export function computeUserStats(users: ManagedUser[]): UserStats {
  return users.reduce<UserStats>(
    (acc, u) => {
      if (u.role === "USER") acc.staff += 1;
      else if (u.role === "DEAN") acc.deans += 1;
      else if (u.role === "ADMIN") acc.admins += 1;

      return acc;
    },
    { staff: 0, deans: 0, admins: 0 },
  );
}

export function formatJoinDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function initials(name?: string | null): string {
  if (!name?.trim()) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
