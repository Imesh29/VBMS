import { useEffect, useState } from "react";
import { FaExclamationCircle, FaCar } from "react-icons/fa";

import SlidePanel from "../common/SlidePanel";
import type { Vehicle, VehiclePayload, VehicleStatus } from "../../types/vehicle";
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
  "w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4C1D1D]/15 focus:border-[#4C1D1D]/40 focus:bg-white transition-all placeholder:text-gray-400";
const inputErrCls =
  "w-full text-sm bg-red-50/30 border border-red-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all placeholder:text-gray-400";
const labelCls =
  "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5";

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
  if (touched.name && !form.name.trim()) errors.name = "Vehicle name is required";
  if (touched.plateNumber && !form.plateNumber.trim())
    errors.plateNumber = "Plate number is required";
  else if (touched.plateNumber && plateDupe)
    errors.plateNumber = "This plate number already exists";
  if (touched.driver && !form.driver.trim())
    errors.driver = "Driver name is required";
  if (touched.capacity && form.capacity < 1)
    errors.capacity = "Capacity must be at least 1";

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
          ? `Editing: ${editTarget.vehicle_name} · ${editTarget.vehicle_number}`
          : "Enter the vehicle details below. Fields marked * are required."
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
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      }
    >
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
          {serverError}
        </div>
      )}

      {/* Vehicle Name */}
      <div>
        <label className={labelCls}>
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
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Type + Fuel */}
      <div className="grid grid-cols-2 gap-3">
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
      <div>
        <label className={labelCls}>
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
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.plateNumber}
          </p>
        )}
      </div>

      {/* Capacity + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
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
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <FaExclamationCircle className="w-3 h-3" />
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
      <div>
        <label className={labelCls}>
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
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="w-3 h-3" />
            {errors.driver}
          </p>
        )}
      </div>

      {/* Last Service */}
      <div>
        <label className={labelCls}>Last Service Date</label>
        <input
          type="date"
          value={form.lastService}
          onChange={(e) => setF("lastService", e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Preview */}
      {form.name && form.plateNumber && (
        <div className="bg-[#4C1D1D]/[0.04] border border-[#4C1D1D]/10 rounded-xl p-4">
          <p className="text-[10px] font-bold text-[#4C1D1D] uppercase tracking-widest mb-2">
            Preview
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4C1D1D]/10 rounded-xl flex items-center justify-center shrink-0">
              <FaCar className="w-4 h-4 text-[#4C1D1D]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1C1C2E] truncate">
                {form.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {form.type} &bull; {form.plateNumber} &bull; {form.capacity} pax
                &bull; {form.fuelType}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                Driver: {form.driver || "—"}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {formatVehicleStatus(form.status)}
              </span>
            </div>
          </div>
        </div>
      )}
    </SlidePanel>
  );
}
