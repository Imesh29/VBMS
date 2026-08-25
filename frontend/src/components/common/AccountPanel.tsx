import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle, FaCheck } from "react-icons/fa";

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
  "w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4C1D1D]/15 focus:border-[#4C1D1D]/40 focus:bg-white transition-all placeholder:text-gray-400";
const inputErrCls =
  "w-full text-sm bg-red-50/30 border border-red-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all placeholder:text-gray-400";
const labelCls =
  "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5";

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
      setSaved(false);
      setServerError(null);
    }
  }, [open, user]);

  if (!user) return null;

  const errors: Partial<Record<keyof AccountForm, string>> = {};
  if (touched.fullName && !form.fullName.trim())
    errors.fullName = "Name is required";
  if (touched.email && !form.email.trim()) errors.email = "Email is required";
  else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  if (touched.department && !form.department)
    errors.department = "Department is required";
  if (touched.newPassword && form.newPassword && form.newPassword.length < 6)
    errors.newPassword = "Password must be at least 6 characters";
  if (
    touched.confirmPassword &&
    form.newPassword &&
    form.newPassword !== form.confirmPassword
  )
    errors.confirmPassword = "Passwords do not match";

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
      footer={
        saved ? (
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm justify-center py-1">
            <FaCheck className="w-3.5 h-3.5" /> Changes saved successfully
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-[#4C1D1D] text-white rounded-xl text-sm font-bold hover:bg-[#3A1515] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )
      }
    >
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
          {serverError}
        </div>
      )}

      {/* Identity strip */}
      <div className="bg-[#4C1D1D]/[0.04] border border-[#4C1D1D]/10 rounded-xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#4C1D1D] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials(user.fullName)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1C1C2E] truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4C1D1D]/10 text-[#4C1D1D] uppercase tracking-wide">
            {ROLE_LABEL[user.role] || user.role}
          </span>
        </div>
      </div>

      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-1">
        Profile Information
      </p>

      {/* Full Name */}
      <div>
        <label className={labelCls}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.fullName}
          onChange={(e) => setF("fullName", e.target.value)}
          onBlur={() => touchF("fullName")}
          placeholder="Your full name"
          className={errors.fullName ? inputErrCls : inputCls}
        />
        {errors.fullName && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelCls}>
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setF("email", e.target.value)}
          onBlur={() => touchF("email")}
          placeholder="your@email.com"
          className={errors.email ? inputErrCls : inputCls}
        />
        {errors.email && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Department */}
      <div>
        <label className={labelCls}>
          Department <span className="text-red-500">*</span>
        </label>
        <select
          value={form.department}
          onChange={(e) => setF("department", e.target.value)}
          onBlur={() => touchF("department")}
          className={errors.department ? inputErrCls : inputCls}
        >
          <option value="">Select department…</option>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {errors.department && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.department}
          </p>
        )}
      </div>

      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-2">
        Change Password
      </p>
      <p className="text-xs text-gray-400 -mt-2">
        Leave both fields blank to keep your current password.
      </p>

      {/* New Password */}
      <div>
        <label className={labelCls}>New Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setF("newPassword", e.target.value)}
            onBlur={() => touchF("newPassword")}
            placeholder="Min. 6 characters"
            className={(errors.newPassword ? inputErrCls : inputCls) + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? (
              <FaEyeSlash className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      {form.newPassword && (
        <div>
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
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <FaExclamationCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}
    </SlidePanel>
  );
}
