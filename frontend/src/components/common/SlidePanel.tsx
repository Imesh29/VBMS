import type { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  panelClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

/**
 * Shared right-hand slide-in panel used for all "Add / Edit" forms
 * (Vehicles, Users, My Account). Click the backdrop or the X to close.
 *
 * Optional className props allow individual panels to tune spacing/width
 * without changing the styling of every other slide panel in the app.
 */
export default function SlidePanel({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  panelClassName = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
}: SlidePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <aside
        className={`relative flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl ${panelClassName}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ padding: "20px" }}
      >
        <div
          className={`flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5 ${headerClassName}`}
          style={{ paddingBottom: "15px" }}
        >
          <div className="min-w-0 pr-4">
            <h2
              className="text-base font-bold text-[#1C1C2E]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs leading-5 text-gray-400">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${contentClassName}`}
        >
          {children}
        </div>

        {footer && (
          <div
            className={`shrink-0 border-t border-gray-100 bg-white px-6 py-4 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}
