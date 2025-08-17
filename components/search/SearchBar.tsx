'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { BiSearch } from 'react-icons/bi';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { GrLocation } from 'react-icons/gr';

const propertyTypes = ['HOUSE', 'APARTMENT', 'LAND'];

const suggestedLocations = [
    { name: "Colombo", description: "The bustling commercial capital" },
    { name: "Kandy", description: "The cultural heart of Sri Lanka" },
    { name: "Galle", description: "Historic fort city" },
    { name: "Nuwara Eliya", description: "Scenic hill country" },
    { name: "Matara", description: "Popular southern beach destination" },
];

const SearchBar = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [activeTab, setActiveTab] = useState<'location' | 'type' | null>(null);
  const searchRef = useRef(null);
  const scrollPosition = useScrollPosition();
  
  const isScrolled = scrollPosition > 10;
  
  useOnClickOutside(searchRef, () => setActiveTab(null));

  const handleSearch = () => {
    const query = { 
      location: location || undefined,
      propertyType: propertyType || undefined,
    };
    const url = qs.stringifyUrl({ url: '/', query }, { skipNull: true });
    router.push(url);
    setActiveTab(null);
  }
  
  const handleSuggestionClick = (loc: string) => {
    setLocation(loc);
    // Immediately move to the next step or search
    setActiveTab('type'); 
  }

  // This is the small search bar shown on scroll
  if (isScrolled) {
    return (
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // On click, scroll to top to show big search
        className="
          border-[1px] w-full md:w-auto py-2 px-4 rounded-full shadow-sm 
          hover:shadow-md transition cursor-pointer flex items-center
        ">
        <div className="text-sm font-semibold px-6">{location || 'Any Location'}</div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">{propertyType || 'Any Type'}</div>
        <div className="p-2 bg-rose-500 rounded-full text-white ml-2 cursor-pointer">
          <BiSearch size={18} />
        </div>
      </div>
    );
  }

  // This is the LARGE, interactive search bar shown at the top
  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
        <div className="bg-neutral-100 p-2 rounded-full border-[1px] shadow-md flex items-center justify-between">
            {/* Location Tab */}
            <div 
                onClick={() => setActiveTab('location')} 
                className={`flex-1 px-6 py-3 cursor-pointer rounded-full ${activeTab === 'location' ? 'bg-white shadow-lg' : 'hover:bg-neutral-200'}`}>
                <p className="font-bold text-xs">Location</p>
                <p className="text-sm text-neutral-500">{location || 'Search destinations'}</p>
            </div>
            
            {/* Property Type Tab */}
            <div 
                onClick={() => setActiveTab('type')} 
                className={`flex-1 px-6 py-3 cursor-pointer rounded-full ${activeTab === 'type' ? 'bg-white shadow-lg' : 'hover:bg-neutral-200'} border-x-[1px]`}>
                <p className="font-bold text-xs">Property Type</p>
                <p className="text-sm text-neutral-500">{propertyType || 'Which type?'}</p>
            </div>

            {/* Search Button */}
            <div onClick={handleSearch} className="flex items-center gap-3 pl-6 pr-2 cursor-pointer">
                <div className="p-3 bg-rose-500 rounded-full text-white">
                    <BiSearch size={18} />
                </div>
            </div>
        </div>

      {/* --- DROPDOWNS --- */}
      {activeTab === 'location' && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 border">
          <h3 className="font-semibold mb-4 text-gray-500">Search by region</h3>
          {suggestedLocations.map(item => (
              <div key={item.name} onClick={() => handleSuggestionClick(item.name)} className="flex items-center gap-4 p-2 hover:bg-neutral-100 rounded-lg cursor-pointer">
                  <div className="p-3 border rounded-lg bg-gray-50">
                      <GrLocation size={24} />
                  </div>
                  <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                  </div>
              </div>
          ))}
        </div>
      )}
      {activeTab === 'type' && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg p-6 border">
          <div className="grid grid-cols-3 gap-4">
            {propertyTypes.map(type => (
              <div key={type} onClick={() => { setPropertyType(type); handleSearch(); }}
                  className="p-4 border rounded-lg text-center cursor-pointer hover:border-black hover:shadow-md transition">
                <p className="font-bold">{type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;