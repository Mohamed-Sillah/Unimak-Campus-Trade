import { useNotification } from "../../context/NotificationContext";
import NotificationPopup from "./NotificationPopup";

export default function NotificationIcon() {
    const { unreadCount, showPopup, setShowPopup } = useNotification();

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <button
                onClick={() => setShowPopup(!showPopup)}
                style={{
                    position: "relative",
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            backgroundColor: "#f53d4fff",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                        }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {showPopup && <NotificationPopup />}
        </div>
    );
}