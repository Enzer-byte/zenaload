"use client";

import { useEffect, useState } from "react";

export interface GameGuide {
  id: string;
  name: string;
  idLabel: string;
  formatNotice: string;
  steps: {
    title: string;
    description: string;
    badge?: string;
  }[];
  tip: string;
}

export const GAME_GUIDES: GameGuide[] = [
  {
    id: "free-fire",
    name: "Free Fire",
    idLabel: "Player UID",
    formatNotice: "6–12 digit numeric code",
    steps: [
      {
        title: "Open your profile",
        description: "Launch Free Fire and tap your avatar/profile banner in the top-left corner of the lobby screen.",
      },
      {
        title: "Locate your UID",
        description: "Under your player nickname, find your numeric UID (e.g. 1928374650).",
      },
      {
        title: "Copy the UID",
        description: "Tap the yellow copy icon right next to your UID to copy it to your clipboard.",
      },
    ],
    tip: "Make sure to paste your numeric UID, not your in-game nickname. Diamonds are delivered directly to this account number.",
  },
  {
    id: "cod-mobile",
    name: "Call of Duty: Mobile",
    idLabel: "Player UID",
    formatNotice: "Numeric UID (approx. 16–19 digits)",
    steps: [
      {
        title: "Go to Player Profile or Settings",
        description: "Tap on your Player Profile badge in the top-left of the main lobby, or tap the Settings gear icon (⚙️).",
      },
      {
        title: "View Legal & Privacy or Profile tab",
        description: "Tap the 'Player Profile' tab, or navigate to Settings → 'Legal & Privacy' at the bottom.",
      },
      {
        title: "Copy Player ID / UID",
        description: "Your numeric Player UID is displayed under your avatar or on the privacy page. Tap the copy icon next to it.",
      },
    ],
    tip: "Ensure you enter your numeric Player UID, not your Activision display name or OpenID.",
  },
  {
    id: "efootball",
    name: "eFootball",
    idLabel: "Owner ID",
    formatNotice: "9-digit numeric ID",
    steps: [
      {
        title: "Open Extras menu",
        description: "From the main eFootball home screen, tap the 'Extras' tab in the top navigation bar.",
      },
      {
        title: "Select User Information",
        description: "Tap on 'User Information' and then select 'User Details'.",
      },
      {
        title: "Find your Owner ID",
        description: "Your 9-digit Owner ID is displayed at the top of the User Details screen. Note it down or copy it.",
      },
    ],
    tip: "Provide your in-game Owner ID (e.g. 123-456-789), not your Konami ID login email address.",
  },
  {
    id: "blood-strike",
    name: "Blood Strike",
    idLabel: "User ID",
    formatNotice: "8–11 digit numeric code",
    steps: [
      {
        title: "Tap your Avatar",
        description: "In the Blood Strike lobby, tap your avatar profile picture in the top-left corner.",
      },
      {
        title: "Locate numeric User ID",
        description: "In the personal profile overview card, look directly below your Striker name to find your User ID.",
      },
      {
        title: "Copy to clipboard",
        description: "Tap the copy button next to the User ID.",
      },
    ],
    tip: "Only use your numeric User ID. Nicknames or server names cannot receive direct Gold top-ups.",
  },
  {
    id: "dls",
    name: "Dream League Soccer",
    idLabel: "Team / Profile ID",
    formatNotice: "Profile or Team code",
    steps: [
      {
        title: "Open Game Settings",
        description: "Launch Dream League Soccer (DLS) and tap the Settings gear icon in the top-left corner.",
      },
      {
        title: "Navigate to Advanced / Team Info",
        description: "Select 'Advanced' or 'Team Info' from the menu.",
      },
      {
        title: "Locate Profile Code",
        description: "Your unique Profile ID or Team Code is listed in the account section.",
      },
    ],
    tip: "Double-check the code characters carefully to ensure your coins reach your dream team immediately.",
  },
];

export function PlayerIdGuideModal({
  isOpen,
  onClose,
  initialGameId,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialGameId?: string;
}) {
  // Select initial guide matching the game id/slug, or fallback to first
  const defaultTab =
    GAME_GUIDES.find(
      (g) =>
        g.id === initialGameId ||
        initialGameId?.includes(g.id) ||
        g.id.includes(initialGameId ?? "")
    )?.id ?? GAME_GUIDES[0].id;

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync tab whenever modal opens or game changes
  useEffect(() => {
    if (initialGameId) {
      const match = GAME_GUIDES.find(
        (g) =>
          g.id === initialGameId ||
          initialGameId.includes(g.id) ||
          g.id.includes(initialGameId)
      );
      if (match) setActiveTab(match.id);
    }
  }, [initialGameId, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentGuide = GAME_GUIDES.find((g) => g.id === activeTab) ?? GAME_GUIDES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-id-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line bg-bg2/60 px-5 py-4">
          <div>
            <h2 id="player-id-guide-title" className="text-lg font-semibold text-ink">
              Where to find Player ID
            </h2>
            <p className="mt-0.5 text-xs text-ink2">
              Official guide for {currentGuide.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="rounded-lg p-1.5 text-mute hover:bg-elevated hover:text-ink transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Game Tabs */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-line bg-bg px-4 py-2.5 text-xs no-scrollbar">
          {GAME_GUIDES.map((g) => {
            const isActive = g.id === activeTab;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveTab(g.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition ${
                  isActive
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink2 hover:bg-card hover:text-ink"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Badge & expected format */}
          <div className="flex items-center justify-between rounded-xl border border-line/60 bg-elevated/60 px-3.5 py-2.5 text-xs">
            <span className="text-mute">Required Field:</span>
            <span className="font-semibold text-hi">
              {currentGuide.idLabel} ({currentGuide.formatNotice})
            </span>
          </div>

          {/* Visual Step-by-Step */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
              Follow these steps in-game
            </h3>
            <ol className="space-y-2.5">
              {currentGuide.steps.map((s, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 rounded-xl border border-line/40 bg-bg2/40 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand2">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-ink">{s.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink2">
                      {s.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Pro-Tip Box */}
          <div className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 p-3.5 text-xs">
            <span className="text-base">💡</span>
            <div>
              <p className="font-medium text-ink">Important Delivery Note</p>
              <p className="mt-0.5 leading-relaxed text-ink2">{currentGuide.tip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-bg2/40 px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition shadow-sm"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
}
