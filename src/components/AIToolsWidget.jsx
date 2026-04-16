"use client";

import { useState } from "react";

export default function AIToolsWidget() {
  const [openTool, setOpenTool] = useState(null);

  const tools = [
    { id: "ai-assistance", label: "AI Assistance", color: "indigo", route: "/ai-assistance" },
    { id: "notes", label: "Notes", color: "emerald", route: "/notes" },
    { id: "assignment-guide", label: "Assignment Guide", color: "yellow", route: "/assignment-guide" },
    { id: "image-analyzer", label: "Image Analyzer", color: "pink", route: "/image-analyzer" },
  ];

  return (
    <>
      {/* Floating button group */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setOpenTool(openTool === tool.id ? null : tool.id)}
            title={tool.label}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/60 dark:border-gray-800/60 bg-${tool.color}-50 dark:bg-${tool.color}-900/20 hover:scale-105 transition-transform`}
          >
            <span className="sr-only">{tool.label}</span>
            <svg className="w-6 h-6 text-current" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2h-4l-4 3v-3H4a2 2 0 01-2-2V5z" />
            </svg>
          </button>
        ))}
      </div>

      {/* Slide-over panel */}
      {openTool && (
        <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 z-50 bg-white dark:bg-gray-900 shadow-2xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{tools.find((t) => t.id === openTool)?.label}</h3>
            <div className="flex items-center gap-2">
              <a
                href={tools.find((t) => t.id === openTool)?.route}
                className="text-sm text-gray-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </a>
              <button
                onClick={() => setOpenTool(null)}
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
          <div className="h-[calc(100%-64px)]">
            <iframe
              src={tools.find((t) => t.id === openTool)?.route}
              className="w-full h-full border-0"
              title={openTool}
            />
          </div>
        </div>
      )}
    </>
  );
}
