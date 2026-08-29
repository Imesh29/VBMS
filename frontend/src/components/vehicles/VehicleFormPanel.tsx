import { useEffect, useState } from "react";
import { FaExclamationCircle, FaCar } from "react-icons/fa";

import SlidePanel from "../common/SlidePanel";
import type {
  Vehicle,
  VehiclePayload,
  VehicleStatus,
} from "../../types/vehicle";
import { formatVehicleStatus } from "../../utils/vehicle";

const VEHICLE_TYPES = ["Minibus", "SUV", "Sedan", "Van", "MPV", "Pickup Truck"];
const FUEL_TYPES = ["Diesel", "Petrol", "Hybrid", "Electric"];

interface VehicleForm {
  name: string;
  type: string;
  plateNumber: string;
  capacity: number;
  fuelType: string;
  driver: string;
  status: VehicleStatus;
  lastService: string;
}

const EMPTY_FORM: VehicleForm = {
  name: "",
  type: "Minibus",
  plateNumber: "",
  capacity: 8,
  fuelType: "Diesel",
  driver: "",
  status: "AVAILABLE",
  lastService: new Date().toISOString().slice(0, 10),
};

function toForm(v: Vehicle): VehicleForm {
  return {
    name: v.vehicle_name,
    type: v.vehicle_type,
    plateNumber: v.vehicle_number,
    capacity: v.capacity,
    fuelType: v.fuel_type,
    driver: v.driver_name,
    status: v.status,
    lastService: v.last_service_date?.slice(0, 10) || EMPTY_FORM.lastService,
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

interface VehicleFormPanelProps {
  open: boolean;
  onClose: () => void;
  editTarget: Vehicle | null;
  existingPlates: string[];
  onAdd: (payload: VehiclePayload) => Promise<unknown>;
  onEdit: (id: string, payload: VehiclePayload) => Promise<unknown>;
}

export default function VehicleFormPanel({
  open,
  onClose,
  editTarget,
  existingPlates,
  onAdd,
  onEdit,
}: VehicleFormPanelProps) {
  const [form, setForm] = useState<VehicleForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof VehicleForm, boolean>>
  >({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(editTarget ? toForm(editTarget) : EMPTY_FORM);
      setTouched({});
      setServerError(null);
    }
  }, [open, editTarget]);

  const plateDupe = existingPlates
    .filter((p) => p !== editTarget?.vehicle_number)
    .some((p) => p.toLowerCase() === form.plateNumber.trim().toLowerCase());

  const errors: Partial<Record<keyof VehicleForm, string>> = {};
  if (touched.name && !form.name.trim())
    errors.name = "Vehicle name is required";
  if (touched.plateNumber && !form.plateNumber.trim()) {
    errors.plateNumber = "Plate number is required";
  } else if (touched.plateNumber && plateDupe) {
    errors.plateNumber = "This plate number already exists";
  }
  if (touched.driver && !form.driver.trim()) {
    errors.driver = "Driver name is required";
  }
  if (touched.capacity && form.capacity < 1) {
    errors.capacity = "Capacity must be at least 1";
  }

  const canSave =
    form.name.trim() &&
    form.plateNumber.trim() &&
    !plateDupe &&
    form.driver.trim() &&
    form.capacity >= 1;

  function setF<K extends keyof VehicleForm>(k: K, v: VehicleForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function touchF(k: keyof VehicleForm) {
    setTouched((t) => ({ ...t, [k]: true }));
  }

  async function handleSave() {
    setTouched({ name: true, plateNumber: true, driver: true, capacity: true });
    if (!canSave) return;

    setSaving(true);
    setServerError(null);

    const payload: VehiclePayload = {
      vehicleName: form.name.trim(),
      vehicleType: form.type,
      vehicleNumber: form.plateNumber.trim().toUpperCase(),
      capacity: form.capacity,
      fuelType: form.fuelType,
      driverName: form.driver.trim(),
      lastServiceDate: form.lastService,
      status: form.status,
    };

    try {
      if (editTarget) {
        await onEdit(editTarget.id, payload);
      } else {
        await onAdd(payload);
      }
      onClose();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ||
          "Could not save this vehicle. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title={editTarget ? "Edit Vehicle" : "Add New Vehicle"}
      subtitle={
        editTarget
          ? `Editing ${editTarget.vehicle_name} · ${editTarget.vehicle_number}`
          : "Enter the vehicle details below. Fields marked * are required."
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
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      }
    >
      {serverError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {serverError}
        </div>
      )}

      {/* Vehicle preview card */}
      <div
        className="mb-6 flex min-h-[100px] items-center gap-4 rounded-[22px] border border-[#E7DDDD] bg-[#FCF9F9] px-5 py-5 sm:px-6"
        style={{ padding: "15px", marginBottom: "10px" }}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#641F1F] text-white shadow-sm">
          <FaCar className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold leading-6 text-[#242638]">
            {form.name.trim() || "New Vehicle"}
          </p>
          <p className="mt-0.5 truncate text-[13px] leading-5 text-[#7B8496]">
            {form.plateNumber.trim() || "Plate number not entered"}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-[#EEE4E4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6B2B2B]">
            {formatVehicleStatus(form.status)}
          </span>
        </div>
      </div>

      <p className={`${sectionCls} mb-5`} style={{ marginBottom: "5px" }}>
        Vehicle Information
      </p>

      {/* Vehicle Name */}
      <div className="mb-5" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Vehicle Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => setF("name", e.target.value)}
          onBlur={() => touchF("name")}
          placeholder="e.g. Toyota HiAce"
          className={errors.name ? inputErrCls : inputCls}
        />
        {errors.name && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Type + Fuel */}
      <div
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        style={{ marginBottom: "10px" }}
      >
        <div>
          <label className={labelCls}>
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.type}
            onChange={(e) => setF("type", e.target.value)}
            className={inputCls}
          >
            {VEHICLE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>
            Fuel Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.fuelType}
            onChange={(e) => setF("fuelType", e.target.value)}
            className={inputCls}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plate Number */}
      <div className="mb-5" style={{ marginBottom: "5px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Plate Number <span className="text-red-500">*</span>
        </label>
        <input
          value={form.plateNumber}
          onChange={(e) => setF("plateNumber", e.target.value.toUpperCase())}
          onBlur={() => touchF("plateNumber")}
          placeholder="e.g. WB-1234"
          className={errors.plateNumber ? inputErrCls : inputCls}
        />
        {errors.plateNumber && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.plateNumber}
          </p>
        )}
      </div>

      {/* Capacity + Status */}
      <div
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        style={{ marginBottom: "5px" }}
      >
        <div>
          <label className={labelCls} style={{ marginBottom: "5px" }}>
            Passenger Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={form.capacity}
            onChange={(e) => setF("capacity", Number(e.target.value))}
            onBlur={() => touchF("capacity")}
            className={errors.capacity ? inputErrCls : inputCls}
          />
          {errors.capacity && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
              <FaExclamationCircle className="h-3 w-3" />
              {errors.capacity}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>
            Initial Status <span className="text-red-500">*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) => setF("status", e.target.value as VehicleStatus)}
            className={inputCls}
          >
            <option value="AVAILABLE">Available</option>
            <option value="IN_USE">In Use</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Driver */}
      <div className="mb-5" style={{ marginBottom: "5px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Assigned Driver <span className="text-red-500">*</span>
        </label>
        <input
          value={form.driver}
          onChange={(e) => setF("driver", e.target.value)}
          onBlur={() => touchF("driver")}
          placeholder="e.g. Ahmad Razali"
          className={errors.driver ? inputErrCls : inputCls}
        />
        {errors.driver && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
            <FaExclamationCircle className="h-3 w-3" />
            {errors.driver}
          </p>
        )}
      </div>

      {/* Last Service */}
      <div className="mb-2" style={{ marginBottom: "10px" }}>
        <label className={labelCls} style={{ marginBottom: "5px" }}>
          Last Service Date
        </label>
        <input
          type="date"
          value={form.lastService}
          onChange={(e) => setF("lastService", e.target.value)}
          className={inputCls}
        />
      </div>
    </SlidePanel>
  );
}
