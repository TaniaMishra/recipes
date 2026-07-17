import { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

type Category = { have: Item[], low: Item[], out: Item[] };

type KitchenContextType = {
  dirty: boolean;
  setDirty: (value: boolean) => void;
  kitchenItemsByCat: Category[];
  setKitchenItemsByCat: (value: Category[]) => void;
  fetchAllKitchenItems: () => void;
  updateKitchen: () => void;
  maxRows: number;
  ctgTitles: string[];
  allItems: Item[];
  setAllItems: (value: Item[]) => void;
  fetchAllitems: () => void;
}

const KitchenContext = createContext<KitchenContextType | null>(null);


export function KitchenProvider({ children } : { children: React.ReactNode }) {
    const { user } = useAuth();
    const [dirty, setDirty] = useState(false);
    const [maxRows, setMaxRows] = useState<number>(0);
    const ctgTitles = ["Produce", "Non-Produce Fridge", "Pantry", "Frozen", "Condiments", "Spices"];
    const [allItems, setAllItems] = useState<Item[]>([]);

    const initialState = (): Category => ({ have: [], low: [], out: [] });
    const [kitchenItemsByCat, setKitchenItemsByCat] = useState<Category[]>([
      initialState(), // Produce
      initialState(), // Non-Produce Fridge
      initialState(), // Pantry
      initialState(), // Frozen
      initialState(), // Condiments
      initialState() // Spices
    ]);

    const updateMaxRowsState = () => {
      const newMax = Math.max(
        ...kitchenItemsByCat.flatMap(ctg => [
          ctg.have?.length ?? 0,
          ctg.low?.length ?? 0,
          ctg.out?.length ?? 0,
        ])
      )
      setMaxRows(newMax);
    }

    async function fetchAllitems() {
      const { data, error } = await supabase
        .from("kitchen")
        .select("*");
      if (error || !data) return null;
      setAllItems(data);
    }

    type ItemStatus = "have_items" | "low_items" | "out_items";
    async function getKitchenItems(status: ItemStatus) {
        if (!user) return null;
        // get list of item ids for have, low, and out for logged in user, return null if select fails
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("have_items, low_items, out_items")
          .eq("id", user.id)
          .single();
        if (profileError || !profile) return null;
        // get kitchen items that match the status list of ids, return null if select fails
        const ids = profile[status] ?? [];
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", ids);
        if (error || !data) return null;
        // return kitchen items for specified status
        return data;
    }

    async function fetchAllKitchenItems() {
      const haveItems = await getKitchenItems("have_items");
      const lowItems = await getKitchenItems("low_items");
      const outItems = await getKitchenItems("out_items");
      if (!haveItems || !lowItems || !outItems) return;
      setKitchenItemsByCat([
        {
          have: haveItems.filter(item => item.category === 'Produce'),
          low: lowItems.filter(item => item.category === 'Produce'),
          out: outItems.filter(item => item.category === 'Produce')
        },
        {
          have: haveItems.filter(item => item.category === 'Non-Produce Fridge'),
          low: lowItems.filter(item => item.category === 'Non-Produce Fridge'),
          out: outItems.filter(item => item.category === 'Non-Produce Fridge')
        },
        {
          have: haveItems.filter(item => item.category === 'Pantry'),
          low: lowItems.filter(item => item.category === 'Pantry'),
          out: outItems.filter(item => item.category === 'Pantry')
        },
        {
          have: haveItems.filter(item => item.category === 'Frozen'),
          low: lowItems.filter(item => item.category === 'Frozen'),
          out: outItems.filter(item => item.category === 'Frozen')
        },
        {
          have: haveItems.filter(item => item.category === 'Condiments'),
          low: lowItems.filter(item => item.category === 'Condiments'),
          out: outItems.filter(item => item.category === 'Condiments')
        },
        {
          have: haveItems.filter(item => item.category === 'Spices'),
          low: lowItems.filter(item => item.category === 'Spices'),
          out: outItems.filter(item => item.category === 'Spices')
        }
      ]);
      updateMaxRowsState();
    }
  
    // update database if dirty
    const updateKitchen = async () => {
      if (!user) return;
      if (!dirty) return;
      // get list of item ids for each status
      const have = kitchenItemsByCat.flatMap(cat =>
        cat.have.map(item => item.item_id)
      );
      const low = kitchenItemsByCat.flatMap(cat =>
        cat.low.map(item => item.item_id)
      );
      const out = kitchenItemsByCat.flatMap(cat =>
        cat.out.map(item => item.item_id)
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          have_items: have,
          low_items: low,
          out_items: out
        })
        .eq("id", user.id);
      if (error) return 1;
      setDirty(false);
    };

  return (
    <KitchenContext.Provider
      value={{
        dirty,
        setDirty,
        kitchenItemsByCat,
        setKitchenItemsByCat,
        fetchAllKitchenItems,
        updateKitchen,
        maxRows,
        ctgTitles,
        allItems,
        setAllItems,
        fetchAllitems
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