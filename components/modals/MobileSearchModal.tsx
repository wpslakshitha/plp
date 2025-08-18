'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { IoClose, IoSearch } from 'react-icons/io5';
import useMobileSearchModal from '@/hooks/useMobileSearchModal';

const propertyTypes = ['HOUSE', 'APARTMENT', 'LAND'];
const suggestedLocations = ["Colombo", "Kandy", "Galle", "Nuwara Eliya"];

const MobileSearchModal = () => {
  const searchModal = useMobileSearchModal();
  const router = useRouter();
  
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = () => {
    const query = { 
      location: location || undefined,
      propertyType: propertyType || undefined,
    };
    const url = qs.stringifyUrl({ url: '/', query }, { skipNull: true });
    router.push(url);
    searchModal.onClose();
  }

  if (!searchModal.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={searchModal.onClose}><IoClose size={28} /></button>
        <div className="flex-1 text-center font-bold">Filters</div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* Location Section */}
        <div>
          <h2 className="font-bold text-xl mb-4">Location</h2>
          <input 
            type="text" 
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border-2 rounded-lg mb-4 text-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            {suggestedLocations.map(loc => (
              <div key={loc} onClick={() => setLocation(loc)} 
                className={`p-3 border-2 rounded-lg cursor-pointer ${location === loc ? 'border-black' : 'border-neutral-200'}`}>
                {loc}
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Section */}
        <div>
          <h2 className="font-bold text-xl mb-4">Property Type</h2>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map(type => (
              <div key={type} onClick={() => setPropertyType(type)}
                className={`p-3 border-2 rounded-lg cursor-pointer ${propertyType === type ? 'border-black' : 'border-neutral-200'}`}>
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-between items-center">
        <button onClick={() => { setLocation(''); setPropertyType(''); }} className="font-bold underline">
          Clear all
        </button>
        <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-bold rounded-lg">
          <IoSearch />
          Show properties
        </button>
      </div>
    </div>
  );
};

export default MobileSearchModal;