import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME, tools } from "./constants";
import type { ToolKey } from "./types";

type SidebarProps = {
  activeTool: ToolKey;
  searchValue: string;
  isTyping: boolean;
  isCollapsed: boolean;
  onToolChange: (tool: ToolKey) => void;
  onSearchChange: (value: string) => void;
  onOpenSettings: () => void;
  onCollapsedChange: (collapsed: boolean) => void;
};

type IndicatorStyle = {
  top: number;
  height: number;
};

export default function Sidebar({
  activeTool,
  searchValue,
  isTyping,
  isCollapsed,
  onToolChange,
  onSearchChange,
  onOpenSettings,
  onCollapsedChange,
}: SidebarProps) {
  const asideRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Partial<Record<ToolKey, HTMLButtonElement | null>>>(
    {},
  );
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const filteredTools = useMemo(
    () =>
      tools.filter((tool) =>
        tool.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  const updateIndicatorStyle = useCallback(() => {
    const activeToolVisible = filteredTools.some(
      (tool) => tool.key === activeTool,
    );
    if (!activeToolVisible) {
      setIndicatorStyle(null);
      return;
    }

    const target = itemRefs.current[activeTool];
    const container = sidebarRef.current;
    if (!target || !container) {
      setIndicatorStyle(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicatorStyle({
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    });
  }, [activeTool, filteredTools]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 920px)");

    const syncMode = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setMobileToolsOpen(false);
      }
    };

    syncMode();
    mediaQuery.addEventListener("change", syncMode);

    return () => mediaQuery.removeEventListener("change", syncMode);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileToolsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !mobileToolsOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const sidebar = asideRef.current;
      if (!sidebar) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !sidebar.contains(target)) {
        setMobileToolsOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const sidebar = asideRef.current;
      if (!sidebar) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !sidebar.contains(target)) {
        setMobileToolsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isMobile, mobileToolsOpen]);

  useEffect(() => {
    updateIndicatorStyle();

    const frameId = window.requestAnimationFrame(updateIndicatorStyle);
    const timeoutId = window.setTimeout(updateIndicatorStyle, 260);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [updateIndicatorStyle, isCollapsed, isMobile, mobileToolsOpen]);

  useEffect(() => {
    const handleResize = () => updateIndicatorStyle();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicatorStyle]);

  const handleSearchFocus = () => {
    if (isMobile) {
      setMobileToolsOpen(true);
      return;
    }

    if (isCollapsed) {
      onCollapsedChange(false);
      window.setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileToolsOpen((value) => !value);
      return;
    }

    onCollapsedChange(!isCollapsed);
  };

  const showToolsList = !isMobile || mobileToolsOpen;

  return (
    <aside
      ref={asideRef}
      className={`sidebar ${isCollapsed && !isMobile ? "collapsed" : ""} ${isMobile ? "mobile" : ""} ${mobileToolsOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-top">
        <header className="brand-wrap">
          <div className="logo-mark">
            <Icon icon="tabler:flask-2" width="18" />
          </div>
          <h1 className="app-logo">{APP_NAME}</h1>

          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            data-tooltip={
              isMobile
                ? mobileToolsOpen
                  ? "Hide tools"
                  : "Show tools"
                : isCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
            }
          >
            <Icon
              icon={
                isMobile
                  ? mobileToolsOpen
                    ? "tabler:layout-sidebar-right-collapse"
                    : "tabler:layout-sidebar-right-expand"
                  : isCollapsed
                    ? "tabler:layout-sidebar-left-expand"
                    : "tabler:layout-sidebar-left-collapse"
              }
              width="16"
            />
          </button>
        </header>

        <div
          className={`search-shell ${isTyping ? "typing" : ""}`}
          onClick={handleSearchFocus}
          data-tooltip="Search tools"
        >
          <Icon icon="tabler:search" width="16" className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onFocus={handleSearchFocus}
            onBlur={(event) => {
              if (!isMobile) {
                return;
              }

              const nextTarget = event.relatedTarget;
              if (
                nextTarget instanceof Node &&
                asideRef.current?.contains(nextTarget)
              ) {
                return;
              }

              window.setTimeout(() => {
                const activeElement = document.activeElement;
                if (
                  activeElement instanceof Node &&
                  asideRef.current?.contains(activeElement)
                ) {
                  return;
                }
                setMobileToolsOpen(false);
              }, 0);
            }}
            onChange={(event) => {
              if (isMobile) {
                setMobileToolsOpen(true);
              }
              onSearchChange(event.target.value);
            }}
            placeholder="Search tools"
            aria-label="Search tools"
          />
        </div>
      </div>

      {showToolsList ? (
        <div className="sidebar-tools">
          <div className="tool-list" ref={sidebarRef}>
            {indicatorStyle ? (
              <div
                className="active-indicator"
                style={{
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                }}
              />
            ) : null}

            {filteredTools.map((tool) => (
              <button
                key={tool.key}
                type="button"
                ref={(node) => {
                  itemRefs.current[tool.key] = node;
                }}
                className={`tool-item ${activeTool === tool.key ? "active" : ""}`}
                onClick={() => {
                  onToolChange(tool.key);
                  if (isMobile) {
                    setMobileToolsOpen(false);
                  }
                }}
                data-tooltip={tool.label}
              >
                <Icon icon={tool.icon} width="18" />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="settings-button"
            onClick={onOpenSettings}
            data-tooltip="Settings"
          >
            <Icon icon="tabler:settings" width="18" />
            Settings
          </button>
        </div>
      ) : null}
    </aside>
  );
}
