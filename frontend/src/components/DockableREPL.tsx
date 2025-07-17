import React, { useState, useRef, useEffect } from "react";
import { REPLPanel } from "./REPLPanel";
import type { Language, ExecutionRecord } from "../types";
import "./DockableREPL.css";

interface DockableREPLProps {
  sessionId: string | null;
  language: Language | null;
  onExecute: (code: string) => Promise<unknown>;
  history: ExecutionRecord[];
  variables: Record<string, unknown>;
  isExecuting?: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onPositionChange?: (position: DockPosition, size: { width: number; height: number }) => void;
}

type DockPosition = "bottom" | "right";

export const DockableREPL: React.FC<DockableREPLProps> = ({ sessionId, language, onExecute, history, variables, isExecuting, isVisible, onToggleVisibility, onPositionChange }) => {
  const [dockPosition, setDockPosition] = useState<DockPosition>("bottom");
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      if (dockPosition === "right") {
        const newWidth = window.innerWidth - e.clientX;
        setSize((prev) => ({
          ...prev,
          width: Math.max(350, Math.min(window.innerWidth * 0.7, newWidth)),
        }));
      } else {
        const newHeight = window.innerHeight - e.clientY;
        setSize((prev) => ({
          ...prev,
          height: Math.max(250, Math.min(window.innerHeight * 0.8, newHeight)),
        }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, dockPosition]);

  const toggleDockPosition = () => {
    setDockPosition((prev) => (prev === "bottom" ? "right" : "bottom"));
  };

  // Notify parent of position/size changes
  useEffect(() => {
    if (onPositionChange && isVisible) {
      onPositionChange(dockPosition, size);
    }
  }, [dockPosition, size, isVisible, onPositionChange]);

  if (!isVisible) return null;

  const replStyle = dockPosition === "right" ? { width: `${size.width}px`, height: "100%" } : { width: "100%", height: `${size.height}px` };

  return (
    <div ref={containerRef} className={`dockable-repl dockable-repl--${dockPosition}`} style={replStyle}>
      {/* Resize handle */}
      <div ref={resizeRef} className={`resize-handle resize-handle--${dockPosition}`} onMouseDown={handleMouseDown} />

      {/* Consolidated REPL Header */}
      <div className="repl-header">
        <div className="repl-title">
          <span className="repl-icon">⚡</span>
          REPL - {language?.name || "No Language"}
          {sessionId && <span className="session-indicator">●</span>}
        </div>
        <div className="repl-controls">
          <button onClick={() => setShowVariables(!showVariables)} className="control-button" disabled={Object.keys(variables).length === 0} title="Toggle variables panel">
            Variables ({Object.keys(variables).length})
          </button>
          <button onClick={() => console.log("Clear history")} className="control-button" disabled={history.length === 0} title="Clear execution history">
            Clear
          </button>
          <div className="divider"></div>
          <button className="dock-toggle-btn" onClick={toggleDockPosition} title={`Dock to ${dockPosition === "bottom" ? "right" : "bottom"}`}>
            {dockPosition === "bottom" ? "⟷" : "⟱"}
          </button>
          <button className="close-btn" onClick={onToggleVisibility} title="Close REPL">
            ✕
          </button>
        </div>
      </div>

      {/* Variables Panel */}
      {showVariables && Object.keys(variables).length > 0 && (
        <div className="variables-panel">
          <h4>Current Variables:</h4>
          <div className="variables-list">
            {Object.entries(variables).map(([name, value]) => (
              <div key={name} className="variable-item">
                <span className="variable-name">{name}</span>
                <span className="variable-value">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPL Content */}
      <div className="repl-content">
        <REPLPanel sessionId={sessionId} language={language} onExecute={onExecute} history={history} isExecuting={isExecuting} />
      </div>
    </div>
  );
};
