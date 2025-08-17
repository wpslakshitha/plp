'use client';

import { BuyerProfile, Property } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";

// This component will fetch properties and then allow finding matches for each
const MatchmakingPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [matches, setMatches] = useState<Record<string, BuyerProfile[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isMatching, setIsMatching] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get('/api/properties');
                setProperties(res.data);
            } catch (error) {
                console.error("Failed to fetch properties");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

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
    
    if (isLoading) return <div>Loading properties...</div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Seller-Buyer Matchmaking</h1>
            <div className="space-y-8">
                {properties.map(prop => (
                    <div key={prop.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">{prop.title}</h2>
                        <p className="text-neutral-600">{prop.location} - LKR {prop.price.toLocaleString()}</p>
                        <button 
                            onClick={() => findMatches(prop)}
                            disabled={isMatching[prop.id]}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isMatching[prop.id] ? "Finding..." : "Find Matches"}
                        </button>

                        {matches[prop.id] && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-semibold">{matches[prop.id].length} potential match(es) found:</h3>
                                {matches[prop.id].length > 0 ? (
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        {matches[prop.id].map(buyer => (
                                            <li key={buyer.id}>
                                                <strong>{buyer.name}</strong> - {buyer.email} (Budget: LKR {buyer.minBudget?.toLocaleString() || 'N/A'} - {buyer.maxBudget?.toLocaleString() || 'N/A'})
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="mt-2 text-neutral-500">No buyers found with matching criteria.</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchmakingPage;