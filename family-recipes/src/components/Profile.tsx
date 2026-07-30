// import { useState } from 'react'
import '../styles/Profile.css'
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ItemSelectBox from './ItemSelectBox';
import { useState, useEffect} from 'react';

  // TODO: add must have items - use ItemSelectBox
  // TODO: add favorite recipes - changes needed in view recipe
  // TODO: add filters (checkbox of options)
      // "in my kitchen"
          // saved in db as "MY KITCHEN"
      // "saved tag combination:" <TagBox />
          // + to add more, max of 5 tag combination filters
          // saved in db as "TAG: desc, desc, desc"

export default function Profile() {
  const nav = useNavigate();
  const { user, userProfile, refreshUserProfile } = useAuth();

  const [selectedMustItems, setSelectedMustItems] = useState<number[]>([]);
  const [dirty, setDirty] = useState<boolean>(false);


  useEffect(() => {
    if (userProfile) {
      setSelectedMustItems(userProfile.must_items ?? []);
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  if (!user || !userProfile) return;

  const updateMusts = async() => {
    console.log("list of must ids:", selectedMustItems);
    const { error } = await supabase
      .from("profiles")
      .update({
        must_items: selectedMustItems
      })
      .eq("id", user.id);
    if (error) throw Error("ERROR IN UPDATING MUST HAVE ITEMS IN PROFILE");
    setDirty(false);
    await refreshUserProfile();
  }  

  return (
    <>
        <div>
            <h1>{userProfile.display_name}</h1>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
        <div>
          <h2>Essentials in my kitchen</h2>
          <ItemSelectBox selectedItems={selectedMustItems} setSelectedItems={setSelectedMustItems} onClick={updateMusts} dirty={dirty} setDirty={setDirty}/>
        </div>
        <div>
          <h2>My Saved Filters</h2>
          <ul>
            {userProfile.saved_filters.map((filter, index) => (
              <li key={index}>{filter}</li>
            ))}
          </ul>
        </div>
    </>
  )
}
