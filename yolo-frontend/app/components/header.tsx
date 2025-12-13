"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfile, signOut } from "@/api";
import { getInitials } from "@/utils";
import { useProfile, Profile } from "@/app/contexts/profile";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { profile, setProfile } = useProfile();

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getProfile();
      setProfile(response.data as Profile);
      return response.data as Profile;
    },
    enabled: !profile,
  });

  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      sessionStorage.removeItem("access-token");
      localStorage.removeItem("access-token");
      setProfile(null);
      router.push("/auth");
    },
  });

  const handleLogout = () => signOutMutation.mutate();

  return (
    <header className="sticky top-0 z-100 border-b border-slate-200 bg-white px-0 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 md:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-800">
            <svg
              viewBox="0 0 24 24"
              className="h-[22px] w-[22px] stroke-white stroke-[2.5] fill-none"
            >
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-[-0.3px] text-slate-900 sm:text-base">
            AI Vision Platform
          </h1>
        </div>
        <div className="flex items-center gap-5">
          {!isLoading && !error && (
            <div className="flex items-center gap-3 rounded-[24px] bg-slate-50 px-2 py-2 pr-4 transition-colors hover:bg-slate-100 cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-700 text-sm font-semibold text-white">
                {getInitials(profile?.name || data?.name || "")}
              </div>
              <div className="hidden flex-col md:flex">
                <div className="text-sm font-semibold leading-tight text-slate-900">
                  {profile?.name || data?.name || ""}
                </div>
                <div className="text-xs text-slate-500">
                  {profile?.email || data?.email || ""}
                </div>
              </div>
            </div>
          )}
          <button
            className="rounded-lg border-[1.5px] border-slate-200 bg-white px-[18px] py-2 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer font-['Inter',sans-serif]"
            onClick={handleLogout}
            disabled={signOutMutation.isPending}
          >
            {signOutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
};
