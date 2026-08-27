import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheck,
} from "react-icons/fa";

import SlidePanel from "../common/SlidePanel";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../constants/departments";

interface AccountPanelProps {
  open: boolean;
  onClose: () => void;
}

interface AccountForm {
  fullName: string;
  email: string;
  department: string;
  newPassword: string;
  confirmPassword: string;
}

const ROLE_LABEL: Record<string, string> = {
  USER: "Staff",
  DEAN: "Faculty Dean",
  ADMIN: "Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const inputCls =
  "h-12 w-full rounded-[18px] border border-[#E1E4EA] bg-[#FAFBFC] px-4 text-[15px] text-[#202234] outline-none transition-all placeholder:text-[#A4ACBC] hover:border-[#D5D9E1] focus:border-[#4C1D1D]/45 focus:bg-white focus:ring-4 focus:ring-[#4C1D1D]/[0.07]";
const inputErrCls =
  "h-12 w-full rounded-[18px] border border-red-300 bg-red-50/30 px-4 text-[15px] text-[#202234] outline-none transition-all placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";
const labelCls =
  "mb-2 block text-[12px] font-bold uppercase tracking-[0.025em] text-[#596579]";
const sectionCls =
  "text-[12px] font-bold uppercase tracking-[0.04em] text-[#9AA3B4]";

export default function AccountPanel({ open, onClose }: AccountPanelProps) {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState<AccountForm>({
    fullName: "",
    email: "",
    department: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<
    Partial<Record<keyof AccountForm, boolean>>
  >({});
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        department: user.department || "",
        newPassword: "",
        confirmPassword: "",
      });
      setTouched({});
      setShowPw(false);
      setSaved(false);
      setServerError(null);
    }
  }, [open, user]);

  if (!user) return null;

  const errors: Partial<Record<keyof AccountForm, string>> = {};
  if (touched.fullName && !form.fullName.trim()) {
    errors.fullName = "Name is required";
  }
  if (touched.email && !form.email.trim()) {
    errors.email = "Email is required";
  } else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (touched.department && !form.department) {
    errors.department = "Department is required";
  }
  if (touched.newPassword && form.newPassword && form.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  }
  if (
    touched.confirmPassword &&
    form.newPassword &&
    form.newPassword !== form.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  const canSave =
    form.fullName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.department &&
    (!form.newPassword ||
      (form.newPassword.length >= 6 &&
        form.newPassword === form.confirmPassword));

  function setF<K extends keyof AccountForm>(k: K, v: AccountForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function touchF(k: keyof AccountForm) {
    setTouched((t) => ({ ...t, [k]: true }));
  }

  async function handleSave() {
    setTouched({
      fullName: true,
      email: true,
      department: true,
      newPassword: true,
      confirmPassword: !!form.newPassword,
    });

    if (!canSave) return;

    setSaving(true);
    setServerError(null);

    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department,
        ...(form.newPassword ? { password: form.newPassword } : {}),
      });

      setSaved(true);
      setTimeout(onClose, 1400);
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ||
          "Could not update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="My Account"
      subtitle="Update your profile information and password"
      panelClassName="sm:max-w-[540px]"
      headerClassName="px-7 py-6 sm:px-8 sm:py-7"
      contentClassName="px-7 py-6 sm:px-8 sm:py-7 space-y-0"
      footerClassName="px-7 py-4 sm:px-8 sm:py-5"
      footer={
        saved ? (
          <div className="flex min-h-12 items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
            <FaCheck className="h-3.5 w-3.5" /> Changes saved successfully
          </div>
        ) : (
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
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )
      }
    >
      {serverError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {serverError}
        </div>
      )}

      {/* Identity card */}
      <div
        className="mb-5 flex min-h-[100px] items-center gap-4 rounded-[22px] border border-[#E7DDDD] bg-[#FCF9F9] px-5 py-5 sm:px-6"
        style={{ padding: "15px", marginBottom: "20px" }}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#641F1F] text-lg font-bold text-white shadow-sm">
          {initials(user.fullName)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold leading-6 text-[#242638]">
            {user.fullName}
          </p>
          <p className="mt-0.5 truncate text-[13px] leading-5 text-[#7B8496]">
            {user.email}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-[#EEE4E4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6B2B2B]">
            {ROLE_LABEL[user.role] || user.role}
          </span>
        </div>
      </div>

      <p className={`${sectionCls} mb-5`} style={{ paddingBottom: "10px" }}>
        Profile Information
      </p>

      {/* Full Name */}
      <div className="mb-5" style={{ paddingBottom: "10px" }}>
        <label className={labelCls} style={{ paddingBottom: "10px" }}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.fullName}
          onChange={(e) => setF("fullName", e.target.value)}
          onBlur={() => touchF("fullName")}
          placeholder="Your full name"
          className={errors.fullName ? inputErrCls : inputCls}
          style={{ padding: "5px" }}
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
        <label className={labelCls} style={{ paddingBottom: "10px" }}>
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setF("email", e.target.value)}
          onBlur={() => touchF("email")}
          placeholder="your@email.com"
          className={errors.email ? inputErrCls : inputCls}
          style={{ padding: "5px" }}
        />
        {errors.email && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Department */}
      <div className="mb-7" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ paddingBottom: "10px" }}>
          Department <span className="text-red-500">*</span>
        </label>
        <select
          value={form.department}
          onChange={(e) => setF("department", e.target.value)}
          onBlur={() => touchF("department")}
          className={`${errors.department ? inputErrCls : inputCls} cursor-pointer`}
        >
          <option value="">Select department…</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
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

      <div className="mb-5" style={{ marginBottom: "10px" }}>
        <p className={sectionCls} style={{ marginBottom: "10px" }}>
          Change Password
        </p>
        <p className="mt-2 text-[12px] leading-5 text-[#9AA3B4]">
          Leave both fields blank to keep your current password.
        </p>
      </div>

      {/* New Password */}
      <div className={form.newPassword ? "mb-5" : "mb-1"}>
        <label className={labelCls} style={{ marginBottom: "10px" }}>
          New Password
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setF("newPassword", e.target.value)}
            onBlur={() => touchF("newPassword")}
            placeholder="Min. 6 characters"
            style={{ padding: "5px" }}
            className={`${errors.newPassword ? inputErrCls : inputCls} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#A4ACBC] transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            {showPw ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <FaEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      {form.newPassword && (
        <div className="pb-1">
          <label className={labelCls}>Confirm New Password</label>
          <input
            type={showPw ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => setF("confirmPassword", e.target.value)}
            onBlur={() => touchF("confirmPassword")}
            placeholder="Re-enter new password"
            className={errors.confirmPassword ? inputErrCls : inputCls}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
              <FaExclamationCircle className="h-3 w-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}
    </SlidePanel>
  );
}
