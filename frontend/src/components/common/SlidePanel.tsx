import type { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Shared right-hand slide-in panel used for all "Add / Edit" forms
 * (Vehicles, Users, My Account). Click the backdrop or the X to close.
 */
export default function SlidePanel({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
}: SlidePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[460px] bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2
              className="font-bold text-[#1C1C2E] text-base"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
          >
            <FaTimes className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
