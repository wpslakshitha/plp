'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";
import { useState } from 'react';

const StatCard = ({ title, value, icon: Icon, color }: any) => ( <div className="bg-white p-6 rounded-2xl shadow-sm border">
<div className={`p-3 rounded-lg inline-block ${color}`}>
<Icon size={24} className="text-white"/>
</div>
<p className="text-3xl font-bold mt-4">{value}</p>
<p className="text-sm text-neutral-500">{title}</p>
</div>);

export default function AnalyticsClientPage({ data }: { data: any }) {
    const { stats, charts } = data;
    const [timeFilter, setTimeFilter] = useState('6M');

    // Filter logic would go here if needed. For now, we use server-fetched data.

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Properties Pending Approval" value={stats.pendingCount} icon={FiClock} color="bg-yellow-500"/>
                 <StatCard title="Registered Buyer Profiles" value={stats.buyerCount} icon={FiUsers} color="bg-blue-500"/>
                 <StatCard title="Total Approved Properties" value={stats.approvedCount} icon={FiCheckCircle} color="bg-green-500"/>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Most Viewed Properties - Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                    <h3 className="font-semibold mb-4">Most Viewed Properties</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.mostViewedProperties} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" name="Total Views"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Locations - Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                     <h3 className="font-semibold mb-4">Top Locations by Views</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.topLocations} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis type="number" />
                           <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                           <Tooltip />
                           <Bar dataKey="views" fill="#82ca9d" name="Views"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Performance - Line Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Monthly Site Views</h3>
                    {/* Date Range Filter would go here */}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={charts.monthlyViews} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={2} name="Total Views"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}