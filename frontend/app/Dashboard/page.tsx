'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashNav from '../Components/Sections/DashNav'
import BuyerNav from '../Components/Sections/BuyerNav'
import Newadd from '../Components/Forms/Newadd'

type ViewType = 'view' | 'edit' | 'create'

function page() {
  const [view, setview] = useState<ViewType>('view');
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
 

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:5000/users/me", {
        credentials: 'include'  
      });

      if (response.ok) {
        const data = await response.json();
        setRole(data.user.role);
        
      } else {
        router.push('/login');  
      }
    };

    fetchUser();
  }, []);

  if (!role) return <div>Loading...</div>;   

  return (
    <div className='flex w-full h-screen'>
      {role === 'seller' && (
        <>
          <DashNav setview={setview}  />
          <div className='flex-1 bg-gray-100 p-4'>
            {view === 'view' && <h1>Viewing Ads</h1>}
            {view === 'edit' && <h1>Editing Ad</h1>}
            {view === 'create' && <Newadd />}
          </div>
        </>
      )}

      {role === 'buyer' && (
        <BuyerNav />
      )}
    </div>
  );
}

export default page;