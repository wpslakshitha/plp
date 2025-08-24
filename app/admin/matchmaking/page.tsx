'use client';

import { BuyerProfile, Property, PropertyType } from "@prisma/client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { FiRefreshCw, FiUserCheck, FiSearch } from "react-icons/fi";
import { IconType } from "react-icons";

// --- Reusable Component for a single Buyer Match ---
const BuyerMatchCard = ({ buyer }: { buyer: BuyerProfile }) => {
    const generateAvatarUrl = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    return (
        <div className="flex items-center gap-3 p-2 border-b last:border-b-0">
            <div className="flex-shrink-0">
                <Image 
                    src={generateAvatarUrl(buyer.name)} 
                    alt="avatar" 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                    style={{ width: 'auto', height: 'auto' }}
                />
            </div>
            <div>
                <p className="font-semibold text-sm">{buyer.name}</p>
                <p className="text-xs text-neutral-500">{buyer.email}</p>
            </div>
            <div className="ml-auto text-right text-xs">
                <p className="text-neutral-600">Budget:</p>
                <p className="font-medium text-rose-500">
                    LKR {Number(buyer.minBudget || 0).toLocaleString()} - {buyer.maxBudget ? Number(buyer.maxBudget).toLocaleString() : 'Any'}
                </p>
            </div>
        </div>
    )
}

// --- Reusable Component for a single Property Card ---
const MatchmakingPropertyCard = ({ property, onFindMatches, isMatching, matches }: { 
    property: Property, 
    onFindMatches: (property: Property) => void, 
    isMatching: boolean, 
    matches: BuyerProfile[] | undefined 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="w-full sm:w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                        src={property.imageUrls[0] || '/images/placeholder.jpg'} 
                        alt={property.title} 
                        fill 
                        sizes="80px"
                        className="object-cover" 
                    />
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-neutral-800">{property.title}</p>
                    <p className="text-sm text-neutral-500">{property.location}</p>
                    <p className="font-semibold text-rose-500 mt-1">LKR {Number(property.price).toLocaleString('en-US')}</p>
                </div>
                <button
                    onClick={() => onFindMatches(property)}
                    disabled={isMatching}
                    className="
                        flex items-center justify-center gap-2 bg-blue-500 text-white font-bold px-4 py-2 
                        rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition w-full sm:w-auto
                    ">
                    <FiRefreshCw className={isMatching ? 'animate-spin' : ''} />
                    {isMatching ? "Finding..." : "Find Matches"}
                </button>
            </div>
            
            {/* Collapsible Matches Section */}
            {matches && (
                <div className="border-t">
                    <div 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-4 bg-neutral-50 flex justify-between items-center cursor-pointer hover:bg-neutral-100"
                    >
                        <h3 className="flex items-center gap-2 font-semibold text-sm text-neutral-700">
                            <FiUserCheck className="text-green-500"/>
                            {matches.length} Potential Match(es) Found
                        </h3>
                    </div>
                    {isExpanded && matches.length > 0 && (
                        <div className="p-2">
                            {matches.map((buyer: BuyerProfile) => <BuyerMatchCard key={buyer.id} buyer={buyer} />)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// --- Main Matchmaking Page Component ---
const MatchmakingPage = () => {
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [matches, setMatches] = useState<Record<string, BuyerProfile[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isMatching, setIsMatching] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyType | 'ALL'>('ALL');

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/properties');
                setAllProperties(res.data);
            } catch (error) { console.error("Failed to fetch properties"); } 
            finally { setIsLoading(false); }
        };
        fetchProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        return allProperties.filter(prop => {
            const matchesSearch = searchTerm === '' || 
                prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = propertyTypeFilter === 'ALL' || prop.propertyType === propertyTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [allProperties, searchTerm, propertyTypeFilter]);

    const findMatches = async (property: Property) => {
        setIsMatching(prev => ({ ...prev, [property.id]: true }));
        try {
            const res = await axios.post(`/api/matchmaking`, { property });
            setMatches(prev => ({ ...prev, [property.id]: res.data }));
        } catch (error) {
            console.error("Failed to find matches");
            alert('Could not find matches.');
        } finally {
            setIsMatching(prev => ({ ...prev, [property.id]: false }));
        }
    };
    
    if (isLoading) return <div className="text-center p-8 pt-[100px]">Loading available properties...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Seller-Buyer Matchmaking Tool</h1>
            <p className="text-neutral-500 mb-8">Filter properties to find potential buyers based on their registered preferences.</p>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-grow">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <label className="font-semibold text-sm">Type:</label>
                    <select 
                        value={propertyTypeFilter}
                        onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyType | 'ALL')}
                        className="p-2 border rounded-lg bg-white w-full md:w-auto"
                    >
                        <option value="ALL">All Types</option>
                        <option value="HOUSE">House</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="LAND">Land</option>
                    </select>
                </div>
            </div>

            {/* Two-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map(prop => (
                   <MatchmakingPropertyCard 
                        key={prop.id}
                        property={prop}
                        onFindMatches={findMatches}
                        isMatching={isMatching[prop.id]}
                        matches={matches[prop.id]}
                   />
                ))}
            </div>

            {filteredProperties.length === 0 && (
                <div className="text-center bg-white p-12 rounded-2xl border border-dashed">
                    <h3 className="text-xl font-semibold">No Properties Match Your Filters</h3>
                    <p className="text-neutral-500 mt-2">Try adjusting your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default MatchmakingPage;