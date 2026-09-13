import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function CancellationReasonModal({
  booking,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (booking) {
      setReason("");
      setError("");
    }
  }, [booking]);

  if (!booking) return null;

  const submit = () => {
    const cleanReason = reason.trim();

    if (!cleanReason) {
      setError("Please enter a cancellation reason.");
      return;
    }

    onSubmit(cleanReason);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        padding: "20px",
        backgroundColor: "rgba(17, 24, 39, 0.48)",
        backdropFilter: "blur(2px)",
      }}
      onMouseDown={submitting ? undefined : onClose}
    >
      <div
        className="w-full overflow-hidden bg-white"
        style={{
          maxWidth: "540px",
          borderRadius: "20px",
          boxShadow: "0 28px 80px rgba(15,23,42,0.28)",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-start"
          style={{
            gap: "15px",
            padding: "25px 28px 22px",
            borderBottom: "1px solid #EEF0F4",
          }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "#FEE2E2",
              color: "#EF4444",
            }}
          >
            <FaExclamationCircle style={{ width: "18px", height: "18px" }} />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                lineHeight: 1.3,
                fontWeight: 700,
                color: "#171A2B",
              }}
            >
              Cancel Booking Request
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12px",
                lineHeight: 1.5,
                color: "#98A2B3",
              }}
            >
              Booking <strong style={{ color: "#5B1E1D" }}>{booking.booking_reference}</strong>{" "}
              will be cancelled. This message will be sent to the requester.
            </p>
          </div>
        </div>

        <div style={{ padding: "28px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: "#475467",
            }}
          >
            REASON FOR CANCELLATION <span style={{ color: "#EF4444" }}>*</span>
          </label>

          <textarea
            value={reason}
            maxLength={500}
            rows={4}
            autoFocus
            onChange={(event) => {
              setReason(event.target.value);
              setError("");
            }}
            placeholder="e.g. Vehicle is unavailable due to maintenance. Please re-submit for the next available date."
            className="w-full resize-none outline-none"
            style={{
              minHeight: "104px",
              border: error ? "1px solid #FCA5A5" : "1px solid #C9BABA",
              borderRadius: "16px",
              padding: "14px 16px",
              fontSize: "13px",
              lineHeight: 1.55,
              color: "#344054",
              boxShadow: "0 0 0 2px rgba(91,30,29,0.06)",
            }}
          />

          <div
            className="flex items-center justify-between"
            style={{ marginTop: "7px", minHeight: "16px" }}
          >
            <span style={{ fontSize: "11px", color: "#DC2626" }}>{error}</span>
            <span style={{ fontSize: "10px", color: "#98A2B3" }}>{reason.length}/500</span>
          </div>

          <div className="mt-6 grid grid-cols-2" style={{ gap: "14px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                height: "52px",
                border: "1px solid #E4E7EC",
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                color: "#475467",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              style={{
                height: "52px",
                borderRadius: "16px",
                backgroundColor: "#EF0017",
                fontSize: "13px",
                fontWeight: 800,
                color: "#FFFFFF",
                opacity: submitting ? 0.65 : 1,
              }}
            >
              {submitting ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
