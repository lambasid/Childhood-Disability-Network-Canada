import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultResources, type Resource } from "@/lib/resourcesData";

type ResourceInput = Omit<Resource, "id">;

type ResourcesContextValue = {
  resources: Resource[];
  addResource: (resource: ResourceInput) => void;
  updateResource: (id: string, updates: ResourceInput) => void;
  deleteResource: (id: string) => void;
};

const STORAGE_KEY = "cdnc-resources";

const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined);

const safeParse = (value: string | null): Resource[] => {
  if (!value) return defaultResources;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // fall through to default
  }
  return defaultResources;
};

const createId = () => crypto.randomUUID?.() ?? `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ResourcesProvider = ({ children }: { children: React.ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>(() => safeParse(typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);

  const value = useMemo(
    () => ({
      resources,
      addResource: (resource: ResourceInput) => {
        setResources((prev) => [...prev, { ...resource, id: createId() }]);
      },
      updateResource: (id: string, updates: ResourceInput) => {
        setResources((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      },
      deleteResource: (id: string) => {
        setResources((prev) => prev.filter((item) => item.id !== id));
      },
    }),
    [resources]
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
};

export const useResources = () => {
  const ctx = useContext(ResourcesContext);
  if (!ctx) {
    throw new Error("useResources must be used within a ResourcesProvider");
  }
  return ctx;
};
