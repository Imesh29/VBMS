import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle, FaUser } from "react-icons/fa";

import SlidePanel from "../common/SlidePanel";
import { DEPARTMENTS } from "../../constants/departments";
import { ROLE_LABEL, ROLE_BADGE_STYLE, initials } from "../../utils/user";

import type {
  ManagedUser,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../types/user";

interface UserForm {
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  password: string;
  isActive: boolean;
}

const EMPTY_FORM: UserForm = {
  fullName: "",
  email: "",
  role: "USER",
  department: "",
  password: "",
  isActive: true,
};

function toForm(u: ManagedUser): UserForm {
  return {
    fullName: u.full_name,
    email: u.email,
    role: u.role,
    department: u.department || "",
    password: "",
    isActive: u.is_active,
  };
}

const inputCls =
  "h-12 w-full rounded-[18px] border border-[#E1E4EA] bg-[#FAFBFC] px-4 text-[15px] text-[#202234] outline-none transition-all placeholder:text-[#A4ACBC] hover:border-[#D5D9E1] focus:border-[#4C1D1D]/45 focus:bg-white focus:ring-4 focus:ring-[#4C1D1D]/[0.07]";

const inputErrCls =
  "h-12 w-full rounded-[18px] border border-red-300 bg-red-50/30 px-4 text-[15px] text-[#202234] outline-none transition-all placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

const labelCls =
  "mb-2 block text-[12px] font-bold uppercase tracking-[0.025em] text-[#596579]";

const sectionCls =
  "text-[12px] font-bold uppercase tracking-[0.04em] text-[#9AA3B4]";

interface UserFormPanelProps {
  open: boolean;
  onClose: () => void;
  editTarget: ManagedUser | null;
  existingEmails: string[];
  onAdd: (payload: CreateUserPayload) => Promise<unknown>;
  onEdit: (id: string, payload: UpdateUserPayload) => Promise<unknown>;
}

export default function UserFormPanel({
  open,
  onClose,
  editTarget,
  existingEmails,
  onAdd,
  onEdit,
}: UserFormPanelProps) {
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof UserForm, boolean>>
  >({});
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(editTarget ? toForm(editTarget) : EMPTY_FORM);
      setTouched({});
      setShowPw(false);
      setServerError(null);
    }
  }, [open, editTarget]);

  const emailDupe = existingEmails
    .filter((e) => e !== editTarget?.email)
    .some((e) => e.toLowerCase() === form.email.trim().toLowerCase());

  const errors: Partial<Record<keyof UserForm, string>> = {};

  if (touched.fullName && !form.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (touched.email && !form.email.trim()) {
    errors.email = "Email is required";
  } else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  } else if (touched.email && emailDupe) {
    errors.email = "This email is already registered";
  }

  if (touched.department && !form.department) {
    errors.department = "Department is required";
  }

  if (touched.password && !editTarget && form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (
    touched.password &&
    editTarget &&
    form.password &&
    form.password.length < 6
  ) {
    errors.password = "Password must be at least 6 characters";
  }

  const canSave =
    form.fullName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    !emailDupe &&
    form.department &&
    (editTarget
      ? !form.password || form.password.length >= 6
      : form.password.length >= 6);

  function setF<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function touchF(key: keyof UserForm) {
    setTouched((current) => ({ ...current, [key]: true }));
  }

  async function handleSave() {
    setTouched({
      fullName: true,
      email: true,
      department: true,
      password: true,
    });

    if (!canSave) return;

    setSaving(true);
    setServerError(null);

    try {
      if (editTarget) {
        const payload: UpdateUserPayload = {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          department: form.department,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        };

        await onEdit(editTarget.id, payload);
      } else {
        const payload: CreateUserPayload = {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          department: form.department,
          isActive: form.isActive,
          password: form.password,
        };

        await onAdd(payload);
      }

      onClose();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ||
          "Could not save this user. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title={editTarget ? "Edit User" : "Add New User"}
      subtitle={
        editTarget
          ? `Editing ${editTarget.full_name} · ${editTarget.email}`
          : "Enter the user details below. Fields marked * are required."
      }
      panelClassName="sm:max-w-[540px]"
      headerClassName="px-7 py-6 sm:px-8 sm:py-7"
      contentClassName="px-7 py-6 sm:px-8 sm:py-7 space-y-0"
      footerClassName="px-7 py-4 sm:px-8 sm:py-5"
      footer={
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-[18px] border border-[#E0E4EA] bg-white text-sm font-semibold text-[#566174] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-[18px] bg-[#5A1E1E] text-sm font-bold text-white shadow-sm transition-all hover:bg-[#481717] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add User"}
          </button>
        </div>
      }
    >
      {serverError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {serverError}
        </div>
      )}

      {/* User preview card */}
      <div
        className="mb-6 flex min-h-[100px] items-center gap-4 rounded-[22px] border border-[#E7DDDD] bg-[#FCF9F9] px-5 py-5 sm:px-6"
        style={{ padding: "15px", marginBottom: "10px" }}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#641F1F] text-white shadow-sm">
          {form.fullName.trim() ? (
            <span className="text-[16px] font-bold">
              {initials(form.fullName)}
            </span>
          ) : (
            <FaUser className="h-6 w-6" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold leading-6 text-[#242638]">
            {form.fullName.trim() || "New User"}
          </p>

          <p className="mt-0.5 truncate text-[13px] leading-5 text-[#7B8496]">
            {form.email.trim() || "Email address not entered"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGE_STYLE[form.role]}`}
            >
              {ROLE_LABEL[form.role]}
            </span>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                form.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <p className={`${sectionCls} mb-5`} style={{ marginBottom: "5px" }}>
        User Information
      </p>

      {/* Full Name */}
      <div className="mb-5" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Full Name <span className="text-red-500">*</span>
        </label>

        <input
          value={form.fullName}
          onChange={(e) => setF("fullName", e.target.value)}
          onBlur={() => touchF("fullName")}
          placeholder="e.g. Siti Aminah Binti Razali"
          className={errors.fullName ? inputErrCls : inputCls}
        />

        {errors.fullName && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Email Address <span className="text-red-500">*</span>
        </label>

        <input
          type="email"
          value={form.email}
          onChange={(e) => setF("email", e.target.value)}
          onBlur={() => touchF("email")}
          placeholder="e.g. siti@uni.edu.my"
          className={errors.email ? inputErrCls : inputCls}
        />

        {errors.email && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Role + Status */}
      <div
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        style={{ marginBottom: "10px" }}
      >
        <div>
          <label className={labelCls} style={{ marginBottom: "5px" }}>
            Role <span className="text-red-500">*</span>
          </label>

          <select
            value={form.role}
            onChange={(e) => setF("role", e.target.value as UserRole)}
            className={inputCls}
          >
            <option value="USER">Staff</option>
            <option value="DEAN">Faculty Dean</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label className={labelCls} style={{ marginBottom: "5px" }}>
            Account Status
          </label>

          <button
            type="button"
            onClick={() => setF("isActive", !form.isActive)}
            className={`flex h-12 w-full items-center justify-between rounded-[18px] border px-4 transition-all ${
              form.isActive
                ? "border-emerald-200 bg-emerald-50/70"
                : "border-[#E1E4EA] bg-[#FAFBFC]"
            }`}
          >
            <span
              className={`text-[13px] font-semibold ${
                form.isActive ? "text-emerald-700" : "text-[#7B8496]"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </span>

            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${
                form.isActive ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Department */}
      <div className="mb-5" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Department <span className="text-red-500">*</span>
        </label>

        <select
          value={form.department}
          onChange={(e) => setF("department", e.target.value)}
          onBlur={() => touchF("department")}
          className={errors.department ? inputErrCls : inputCls}
        >
          <option value="">Select department…</option>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        {errors.department && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.department}
          </p>
        )}
      </div>

      <p className={`${sectionCls} mb-5 mt-6`} style={{ marginBottom: "5px" }}>
        {editTarget ? "Change Password" : "Password"}
      </p>

      {/* Password */}
      <div className="mb-2" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          {editTarget ? (
            <>
              New Password
              <span className="ml-1 normal-case font-normal text-[#A0A7B5]">
                (optional)
              </span>
            </>
          ) : (
            <>
              Initial Password <span className="text-red-500">*</span>
            </>
          )}
        </label>

        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={(e) => setF("password", e.target.value)}
            onBlur={() => touchF("password")}
            placeholder={
              editTarget
                ? "Leave blank to keep current password"
                : "Min. 6 characters"
            }
            className={`${errors.password ? inputErrCls : inputCls} pr-12`}
          />

          <button
            type="button"
            onClick={() => setShowPw((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4ACBC] transition-colors hover:text-[#596579]"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <FaEye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.password}
          </p>
        )}

        {editTarget && !errors.password && (
          <p className="mt-1.5 text-[11px] text-[#A0A7B5]">
            Leave this field blank to keep the current password.
          </p>
        )}
      </div>
    </SlidePanel>
  );
}
