"use client";

export const AssistantMessage = ({ content }: { content: string }) => {
  return (
    <div className="mb-4 flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-700 text-xs font-semibold text-white">
        AI
      </div>
      <div className="max-w-[75%] rounded-xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 md:max-w-[85%]">
        {content}
      </div>
    </div>
  );
};
