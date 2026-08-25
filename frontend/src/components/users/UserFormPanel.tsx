import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";

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
  "w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4C1D1D]/15 focus:border-[#4C1D1D]/40 focus:bg-white transition-all placeholder:text-gray-400";
const inputErrCls =
  "w-full text-sm bg-red-50/30 border border-red-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all placeholder:text-gray-400";
const labelCls =
  "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5";

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
  if (touched.fullName && !form.fullName.trim())
    errors.fullName = "Full name is required";
  if (touched.email && !form.email.trim()) errors.email = "Email is required";
  else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  else if (touched.email && emailDupe)
    errors.email = "This email is already registered";
  if (touched.department && !form.department)
    errors.department = "Department is required";
  if (touched.password && !editTarget && form.password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (
    touched.password &&
    editTarget &&
    form.password &&
    form.password.length < 6
  )
    errors.password = "Password must be at least 6 characters";

  const canSave =
    form.fullName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    !emailDupe &&
    form.department &&
    (editTarget ? !form.password || form.password.length >= 6 : form.password.length >= 6);

  function setF<K extends keyof UserForm>(k: K, v: UserForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function touchF(k: keyof UserForm) {
    setTouched((t) => ({ ...t, [k]: true }));
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
        await onAdd({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          department: form.department,
          isActive: form.isActive,
          password: form.password,
        });
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
          ? `Editing: ${editTarget.full_name} · ${editTarget.email}`
          : "Create an account for a new system user. Fields marked * are required."
      }
      footer={
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
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add User"}
          </button>
        </div>
      }
    >
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className={labelCls}>
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
          placeholder="e.g. siti@uni.edu.my"
          className={errors.email ? inputErrCls : inputCls}
        />
        {errors.email && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Role + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
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
          <label className={labelCls}>Account Status</label>
          <div className="flex items-center h-[42px] gap-3">
            <button
              type="button"
              onClick={() => setF("isActive", !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isActive ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold ${
                form.isActive ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
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

      {/* Password */}
      <div>
        <label className={labelCls}>
          {editTarget ? (
            "Change Password"
          ) : (
            <>
              Initial Password <span className="text-red-500">*</span>
            </>
          )}
          {editTarget && (
            <span className="ml-1 text-gray-400 font-normal normal-case">
              (leave blank to keep current)
            </span>
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
            className={(errors.password ? inputErrCls : inputCls) + " pr-10"}
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
        {errors.password && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Preview */}
      {form.fullName && form.email && (
        <div className="bg-[#4C1D1D]/[0.04] border border-[#4C1D1D]/10 rounded-xl p-4">
          <p className="text-[10px] font-bold text-[#4C1D1D] uppercase tracking-widest mb-2">
            Preview
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4C1D1D] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials(form.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1C1C2E] truncate">
                {form.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">{form.email}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {ROLE_LABEL[form.role]} &bull; {form.department || "No department"}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE_STYLE[form.role]}`}
              >
                {ROLE_LABEL[form.role]}
              </span>
            </div>
          </div>
        </div>
      )}
    </SlidePanel>
  );
}
