"use client";

import { useProfile } from "@/app/contexts/profile";
import { getInitials } from "@/utils";

export const UserMessage = ({ content }: { content: string }) => {
  const { profile } = useProfile();

  return (
    <div className="chat-message user">
      <div className="message-avatar user">
        {getInitials(profile?.name || "")}
      </div>
      <div className="message-content">{content}</div>
    </div>
  );
};
