import { useNotification } from "../../context/NotificationContext";

export default function NotificationPopup() {
    const {
        notifications,
        markAsRead,
        clearNotifications,
        setShowPopup,
    } = useNotification();

    return (
        <div
            style={{
                position: "absolute",
                top: "50px",
                right: "0",
                width: "350px",
                maxHeight: "400px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "15px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f8f9fa",
                }}
            >
                <h3 style={{ margin: 0, fontSize: "16px" }}>Notifications</h3>
                {notifications.length > 0 && (
                    <button
                        onClick={clearNotifications}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#dc3545",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div
                style={{
                    overflowY: "auto",
                    flex: 1,
                    maxHeight: "340px",
                }}
            >
                {notifications.length === 0 ? (
                    <div
                        style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#999",
                        }}
                    >
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => {
                                markAsRead(notification.id);
                            }}
                            style={{
                                padding: "12px 15px",
                                borderBottom: "1px solid #f0f0f0",
                                cursor: "pointer",
                                backgroundColor: notification.read ? "#fff" : "#f0f7ff",
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#e9ecef";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = notification.read
                                    ? "#fff"
                                    : "#f0f7ff";
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: notification.read ? "normal" : "bold",
                                            fontSize: "14px",
                                            color: "#333",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {notification.type === "NEW_LISTING" ? "📦 " : "🛒 "}
                                        {notification.message}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                        }}
                                    >
                                        {new Date(notification.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                                {!notification.read && (
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: "#007bff",
                                            marginTop: "4px",
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div
                    style={{
                        padding: "10px 15px",
                        borderTop: "1px solid #eee",
                        textAlign: "center",
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    <button
                        onClick={() => setShowPopup(false)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#666",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}