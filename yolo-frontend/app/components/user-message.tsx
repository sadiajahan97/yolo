"use client";

import { useProfile } from "@/app/contexts/profile";
import { getInitials } from "@/utils";

export const UserMessage = ({ content }: { content: string }) => {
  const { profile } = useProfile();

  return (
    <div className="mb-4 flex flex-row-reverse gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-700 text-xs font-semibold text-white">
        {getInitials(profile?.name || "")}
      </div>
      <div className="max-w-[75%] rounded-xl rounded-br-sm bg-blue-600 px-4 py-3 text-sm leading-relaxed text-white md:max-w-[85%]">
        {content}
      </div>
    </div>
  );
};
