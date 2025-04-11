import { useState } from "react";
import { Facebook, Linkedin, Link2, Twitter, X } from "lucide-react";

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SharePopup({ isOpen, onClose }: SharePopupProps) {
  const [copyStatus, setCopyStatus] = useState("");
  const shareUrl = "https://sql.com";
  const shareTitle = "SQL Noir - Learn SQL by solving crimes";

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      onClick: () => {
        window.open(
          `https://x.com/intent/tweet?text=${encodeURIComponent(
            shareTitle
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Copy Link",
      icon: Link2,
      onClick: async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopyStatus("Link copied!");
        setTimeout(() => setCopyStatus(""), 2000);
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                 bg-amber-50 rounded-xl shadow-xl p-6 w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-detective text-xl text-amber-900">
            Solve crimes together!
          </h3>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.onClick}
              className="flex items-center justify-center gap-2 p-3 rounded-lg
                       bg-amber-100 hover:bg-amber-200 text-amber-900
                       transition-colors duration-200 relative"
            >
              <option.icon className="w-5 h-5" />
              <span className="font-medium">
                {option.name === "Copy Link" && copyStatus
                  ? copyStatus
                  : option.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
