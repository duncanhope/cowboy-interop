import { useState, useEffect } from "react";
import { isOpenFin } from "./openfinSync";
declare const fin: any;

interface ApplicationInfo {
  isPlatformApp: boolean;
  isRunning: boolean;
  uuid: string;
}

export function useOpenFinApplicationUUIDs() {
  if (!isOpenFin) {
    return [];
  }

  const [applicationUUIDs, setApplicationUUIDs] = useState<string[]>([]);

  useEffect(() => {
    const updateApplicationUUIDs = async () => {
      try {
        const applicationInfos: ApplicationInfo[] =
          await fin.System.getAllApplications();
        const uuids = applicationInfos
          .filter((info) => info.isRunning)
          .map((info) => info.uuid);
        setApplicationUUIDs(uuids);
      } catch (error) {
        console.error("Error getting application UUIDs:", error);
      }
    };

    // Get the initial list of application UUIDs
    updateApplicationUUIDs();

    // Subscribe to changes in the list of application UUIDs
    fin.System.addListener("application-created", updateApplicationUUIDs);
    fin.System.addListener("application-closed", updateApplicationUUIDs);

    // Unsubscribe from events when the component unmounts
    return () => {
      fin.System.removeListener("application-created", updateApplicationUUIDs);
      fin.System.removeListener("application-closed", updateApplicationUUIDs);
    };
  }, []);

  return applicationUUIDs;
}
