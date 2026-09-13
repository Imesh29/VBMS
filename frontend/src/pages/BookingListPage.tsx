import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaPen, FaSearch } from "react-icons/fa";

import AppShell from "../components/layout/AppShell";
import BookingStatusBadge from "../components/booking/BookingStatusBadge";
import BookingDetailsModal from "../components/booking/BookingDetailsModal";
import CancellationReasonModal from "../components/booking/CancellationReasonModal";
import { useAuth } from "../context/AuthContext";
import { getMyBookings } from "../api/bookingApi";
import { getPendingBookings, approveBooking } from "../api/deanApi";
import {
  getAllBookings,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "../api/adminApi";
import type { Booking, BookingStatus } from "../types/booking";

const filters: Array<"ALL" | BookingStatus> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export default function BookingListPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancellationBooking, setCancellationBooking] =
    useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    (
      location.state as {
        success?: string;
      } | null
    )?.success ?? "",
  );

  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (user.role === "USER") {
        const result = await getMyBookings({
          page: 1,
          limit: 100,
          sort: "created_at",
          order: "DESC",
        });
        setBookings(result.items);
        return;
      }

      if (user.role === "DEAN") {
        setBookings(await getPendingBookings());
        return;
      }

      if (user.role === "ADMIN") {
        const result = await getAllBookings({
          page: 1,
          limit: 100,
          sort: "created_at",
          order: "DESC",
        });
        setBookings(result.items);
        return;
      }

      setBookings([]);
    } catch (err: unknown) {
      console.error("Failed to load bookings:", err);

      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(apiError.response?.data?.message ?? "Unable to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, [user?.role]);

  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const statusMatches = filter === "ALL" || booking.status === filter;

      const searchableValues = [
        booking.booking_reference,
        booking.full_name,
        booking.email,
        booking.department,
        booking.vehicle_name,
        booking.vehicle_number,
        booking.destination,
        booking.purpose,
      ];

      const searchMatches =
        !query ||
        searchableValues.some((value) =>
          value?.toString().toLowerCase().includes(query),
        );

      return statusMatches && searchMatches;
    });
  }, [bookings, search, filter]);

  const handleAction = async (
    bookingId: string,
    action: "approve" | "confirm" | "complete",
  ) => {
    try {
      setActionId(bookingId);
      setError("");
      setSuccess("");

      if (action === "approve") await approveBooking(bookingId);
      if (action === "confirm") await confirmBooking(bookingId);
      if (action === "complete") await completeBooking(bookingId);

      const actionMessages = {
        approve: "Booking approved successfully.",
        confirm: "Booking confirmed successfully.",
        complete: "Booking completed successfully.",
      };

      setSuccess(actionMessages[action]);
      await loadBookings();
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ?? `Unable to ${action} booking.`,
      );
    } finally {
      setActionId(null);
    }
  };


  const handleCancellationSubmit = async (reason: string) => {
    if (!cancellationBooking) return;

    try {
      setActionId(cancellationBooking.id);
      setError("");
      setSuccess("");

      await cancelBooking(cancellationBooking.id, reason);

      setSuccess("Booking cancelled successfully. The requester has been notified.");
      setCancellationBooking(null);
      await loadBookings();
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ?? "Unable to cancel booking.",
      );
    } finally {
      setActionId(null);
    }
  };

  const subtitle =
    user?.role === "USER"
      ? "View and track your vehicle booking requests"
      : user?.role === "DEAN"
        ? "Review and approve pending booking requests"
        : "Manage and track all booking requests";

  return (
    <AppShell title="Bookings" subtitle={subtitle}>
      <div className="flex flex-col" style={{ gap: "24px" }}>
        {(success || error) && (
          <div
            className={error ? "text-red-700" : "text-emerald-700"}
            style={{
              borderRadius: "16px",
              border: error ? "1px solid #FECACA" : "1px solid #A7F3D0",
              backgroundColor: error ? "#FEF2F2" : "#ECFDF5",
              padding: "13px 18px",
              fontSize: "13px",
            }}
          >
            {error || success}
          </div>
        )}

        {/* Search + filters */}
        <div
          className="flex flex-col xl:flex-row xl:items-center"
          style={{ gap: "14px" }}
        >
          <div className="relative min-w-0 flex-1">
            <FaSearch
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: "19px",
                width: "16px",
                height: "16px",
                color: "#A3ACBA",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search booking, name, destination..."
              className="w-full outline-none"
              style={{
                height: "54px",
                borderRadius: "22px",
                border: "1px solid #E4E7EC",
                backgroundColor: "#FFFFFF",
                padding: "0 18px 0 49px",
                fontSize: "15px",
                color: "#475467",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.02)",
              }}
            />
          </div>

          <div className="flex flex-wrap" style={{ gap: "10px" }}>
            {filters.map((currentFilter) => {
              const active = filter === currentFilter;

              return (
                <button
                  key={currentFilter}
                  type="button"
                  onClick={() => setFilter(currentFilter)}
                  className="font-semibold transition-colors"
                  style={{
                    height: "54px",
                    minWidth: currentFilter === "ALL" ? "58px" : "96px",
                    padding: "0 18px",
                    borderRadius: "22px",
                    border: active ? "1px solid #5B1F1F" : "1px solid #E4E7EC",
                    backgroundColor: active ? "#5B1F1F" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#667085",
                    fontSize: "13px",
                    boxShadow: active
                      ? "0 4px 10px rgba(91,31,31,0.13)"
                      : "none",
                  }}
                >
                  {currentFilter === "ALL"
                    ? "All"
                    : currentFilter[0] + currentFilter.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-hidden bg-white"
          style={{
            borderRadius: "22px",
            border: "1px solid #E7EAF0",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #EEF0F4",
            }}
          >
            <p style={{ fontSize: "13px", color: "#98A2B3" }}>
              <span style={{ fontWeight: 700, color: "#202436" }}>
                {visibleBookings.length}
              </span>{" "}
              booking{visibleBookings.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div
              style={{
                padding: "56px 24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#98A2B3",
              }}
            >
              Loading bookings...
            </div>
          ) : visibleBookings.length === 0 ? (
            <div
              style={{
                padding: "56px 24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#98A2B3",
              }}
            >
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse text-left"
                style={{ minWidth: "1180px" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#FBFCFD" }}>
                    <Th>Ref No.</Th>
                    {user && user.role !== "USER" && <Th>Requester</Th>}
                    <Th>Vehicle</Th>
                    <Th>Destination</Th>
                    <Th>Departure</Th>
                    <Th>Pax</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody>
                  {visibleBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderTop: "1px solid #F1F3F6",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Td>
                        <p
                          style={{
                            margin: 0,
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                            lineHeight: "19px",
                            fontWeight: 700,
                            color: "#5B1F1F",
                          }}
                        >
                          {booking.booking_reference}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "11px",
                            color: "#A0A8B8",
                          }}
                        >
                          {booking.created_at
                            ? formatDate(booking.created_at)
                            : "—"}
                        </p>
                      </Td>

                      {user && user.role !== "USER" && (
                        <Td>
                          <div
                            className="flex items-center"
                            style={{ gap: "12px" }}
                          >
                            <RequesterAvatar name={booking.full_name} />
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  margin: 0,
                                  maxWidth: "165px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  color: "#1F2434",
                                }}
                              >
                                {booking.full_name || "Unknown User"}
                              </p>
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  maxWidth: "165px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "11px",
                                  color: "#98A2B3",
                                }}
                              >
                                {booking.department || booking.email || ""}
                              </p>
                            </div>
                          </div>
                        </Td>
                      )}

                      <Td>
                        <p
                          style={{
                            margin: 0,
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1F2434",
                          }}
                        >
                          {booking.vehicle_name || "—"}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            whiteSpace: "nowrap",
                            fontSize: "11px",
                            color: "#A0A8B8",
                          }}
                        >
                          {booking.vehicle_number || "—"}
                        </p>
                      </Td>

                      <Td>
                        <p
                          style={{
                            margin: 0,
                            maxWidth: "210px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#344054",
                          }}
                        >
                          {booking.destination}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            maxWidth: "210px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "11px",
                            color: "#A0A8B8",
                          }}
                        >
                          {booking.purpose}
                        </p>
                      </Td>

                      <Td>
                        <p
                          style={{
                            margin: 0,
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                            color: "#475467",
                          }}
                        >
                          {formatDate(booking.departure_date)}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "11px",
                            color: "#A0A8B8",
                          }}
                        >
                          {formatTime(booking.departure_date)}
                        </p>
                      </Td>

                      <Td>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#344054",
                          }}
                        >
                          {booking.passenger_count}
                        </span>
                      </Td>

                      <Td>
                        <BookingStatusBadge status={booking.status} />
                      </Td>

                      <Td>
                        <div
                          className="flex items-center"
                          style={{ gap: "8px", whiteSpace: "nowrap" }}
                        >
                          <button
                            type="button"
                            title="View booking"
                            onClick={() => setSelected(booking)}
                            className="flex items-center justify-center"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#F8FAFC",
                              color: "#98A2B3",
                            }}
                          >
                            <FaEye style={{ width: "13px", height: "13px" }} />
                          </button>

                          {user?.role === "USER" &&
                            booking.status === "PENDING" && (
                              <ActionButton
                                disabled={actionId === booking.id}
                                onClick={() =>
                                  navigate(`/bookings/${booking.id}/edit`)
                                }
                                variant="edit"
                              >
                                <span
                                  className="flex items-center"
                                  style={{ gap: "6px" }}
                                >
                                  <FaPen style={{ width: "10px", height: "10px" }} />
                                  Edit
                                </span>
                              </ActionButton>
                            )}

                          {user?.role === "DEAN" &&
                            booking.status === "PENDING" && (
                              <ActionButton
                                disabled={actionId === booking.id}
                                onClick={() =>
                                  void handleAction(booking.id, "approve")
                                }
                                variant="approve"
                              >
                                Approve
                              </ActionButton>
                            )}

                          {user?.role === "ADMIN" &&
                            booking.status === "APPROVED" && (
                              <>
                                <ActionButton
                                  disabled={actionId === booking.id}
                                  onClick={() =>
                                    void handleAction(booking.id, "confirm")
                                  }
                                  variant="success"
                                >
                                  Confirm
                                </ActionButton>

                                <ActionButton
                                  disabled={actionId === booking.id}
                                  onClick={() => setCancellationBooking(booking)}
                                  variant="danger"
                                >
                                  Cancel
                                </ActionButton>
                              </>
                            )}

                          {user?.role === "ADMIN" &&
                            booking.status === "CONFIRMED" && (
                              <>
                                <ActionButton
                                  disabled={actionId === booking.id}
                                  onClick={() =>
                                    void handleAction(booking.id, "complete")
                                  }
                                  variant="neutral"
                                >
                                  Complete
                                </ActionButton>

                                <ActionButton
                                  disabled={actionId === booking.id}
                                  onClick={() => setCancellationBooking(booking)}
                                  variant="danger"
                                >
                                  Cancel
                                </ActionButton>
                              </>
                            )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <BookingDetailsModal
        booking={selected}
        onClose={() => setSelected(null)}
      />

      <CancellationReasonModal
        booking={cancellationBooking}
        submitting={Boolean(
          cancellationBooking && actionId === cancellationBooking.id,
        )}
        onClose={() => setCancellationBooking(null)}
        onSubmit={(reason) => void handleCancellationSubmit(reason)}
      />
    </AppShell>
  );
}

function RequesterAvatar({ name }: { name?: string | null }) {
  const value = name
    ? name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "?";

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: "#5B1F1F",
        fontSize: "11px",
      }}
    >
      {value}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant: "approve" | "success" | "danger" | "neutral" | "edit";
}) {
  const styleMap = {
    approve: {
      backgroundColor: "#EFF6FF",
      color: "#2563EB",
      border: "1px solid #DBEAFE",
    },
    success: {
      backgroundColor: "#ECFDF5",
      color: "#047857",
      border: "1px solid #D1FAE5",
    },
    danger: {
      backgroundColor: "#FFF1F2",
      color: "#E11D48",
      border: "1px solid #FFE4E6",
    },
    neutral: {
      backgroundColor: "#F2F4F7",
      color: "#475467",
      border: "1px solid #EAECF0",
    },
    edit: {
      backgroundColor: "#FFF7ED",
      color: "#C2410C",
      border: "1px solid #FFEDD5",
    },
  } as const;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        ...styleMap[variant],
        minHeight: "34px",
        padding: "0 13px",
        borderRadius: "17px",
        fontSize: "11px",
      }}
    >
      {children}
    </button>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-CA");
}

function formatTime(date?: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        padding: "15px 24px",
        whiteSpace: "nowrap",
        textAlign: "left",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#98A2B3",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return (
    <td
      style={{
        padding: "18px 24px",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}
