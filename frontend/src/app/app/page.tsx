import { RecentActivity } from "@/components/activity/recent-activity";
import { FreighterWalletProvider } from "@/hooks/use-freighter-wallet";
import { AppExperience } from "./app-experience";

export default function Home() {
  return (
    <FreighterWalletProvider>
      <AppExperience
        sidebarActivity={<RecentActivity compact sidebar bare />}
      />
    </FreighterWalletProvider>
  );
}
