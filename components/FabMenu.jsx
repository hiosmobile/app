import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuActionBtn } from "./HiMaterial";

export default function FabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <>
      <button className="fab" onClick={() => setIsOpen(true)}>
        <i className="material-symbols-rounded">menu</i>
      </button>

      <div
        className={`bottom-sheet-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`bottom-sheet ${isOpen ? "open" : ""}`}>
        <div className="bottom-sheet-drag-handle"></div>

        <div className="bottom-sheet-header">
          <h2 className="blue-h2">Menu</h2>
          <button className="close-button" onClick={() => setIsOpen(false)}>
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

/**
 *
 <MenuActionBtn
   icon="download_for_offline"
   text="Download Menus"
   className="joinTop"
   onClick={() =>
     window.open(
       "https://www.dropbox.com/scl/fo/7gmlnnjcau1np91ee83ht/h?rlkey=ifj506k3aal7ko7tfecy8oqyq&dl=0",
       "_blank",
     )
   }
 />
 */
