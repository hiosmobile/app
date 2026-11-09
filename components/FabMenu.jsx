import { useNavigate } from "react-router-dom";
import { InfoBubble, MenuActionBtn } from "./HiMaterial";

export default function FabMenu({ isOpen, onClose, onEditDashboard }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    onClose();
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleEditDashboard = () => {
    onClose();
    setTimeout(() => {
      if (onEditDashboard) onEditDashboard();
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
          <h2 className="blue-h2">Customise</h2>
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
            icon="dashboard_customize"
            text="Edit widgets"
            className="joinTop"
            onClick={handleEditDashboard}
          />
          <InfoBubble title="Tweak what's shown on your dashboard." className="joinBottom">
            This means you can tailor your dash to make the info more relevant to you.
          </InfoBubble>

          <MenuActionBtn
            icon="palette"
            text="Themes"
            className="joinTop"
            onClick={() => handleNavigation("/settings/appearance")}
          />
          <InfoBubble title="Change Harmony's appearance." className="joinBottom">
            You can change your wallpaper, colour, and glass preferences here.
          </InfoBubble>
        </div>
      </div>
    </>
  );
}
