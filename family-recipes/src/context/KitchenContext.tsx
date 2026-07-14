import {
  createContext,
  useContext,
  useState
} from "react";

type KitchenContextType = {
  dirty: boolean;
  setDirty: (value: boolean) => void;
};

const KitchenContext = createContext<KitchenContextType | null>(null);


export function KitchenProvider({ children } : { children: React.ReactNode }) {
  const [dirty, setDirty] = useState(false);

  return (
    <KitchenContext.Provider
      value={{
        dirty,
        setDirty
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}


export function useKitchen() {
  const context = useContext(KitchenContext);

  if (!context) {
    throw new Error(
      "useKitchen must be inside KitchenProvider"
    );
  }

  return context;
}