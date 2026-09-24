import { useNavigate } from "react-router-dom";
import { MenuActionBtn } from "./HiMaterial";

export default function FabMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    onClose();
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <>
      <div
        className={`bottom-sheet-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <div className={`bottom-sheet ${isOpen ? "open" : ""}`}>
        <div className="bottom-sheet-drag-handle" />

        <div className="bottom-sheet-header">
          <h2 className="blue-h2">Menu</h2>
          <button className="close-button" onClick={onClose}>
            <i
              className="material-symbols-rounded"
              style={{ color: "var(--primary)" }}
            >
              close
            </i>
          </button>
        </div>

        <div className="sheet-content">
          <MenuActionBtn
            icon="settings"
            text="Settings"
            className="joinTop"
            onClick={() => handleNavigation("/settings")}
          />

          <MenuActionBtn
            icon="help"
            text="Help"
            className="joinMiddle"
            onClick={() => handleNavigation("/help")}
          />

          <MenuActionBtn
            icon="feedback"
            text="Send feedback"
            className="joinBottom"
            onClick={() => handleNavigation("/help/feedback")}
          />
        </div>
      </div>
    </>
  );
}
