import { IconType } from "react-icons";
import { FiGrid, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

interface DashboardStatsProps {
  total: number; approved: number; pending: number; rejected: number;
}

const StatCard: React.FC<{ title: string; value: number; icon: IconType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-neutral-200 flex items-center gap-4">
        <div className="bg-neutral-100 p-3 rounded-lg">
            <Icon size={24} className="text-neutral-600"/>
        </div>
        <div>
            <p className="text-3xl font-bold text-neutral-800">{value}</p>
            <p className="text-sm text-neutral-500">{title}</p>
        </div>
    </div>
);

export default function DashboardStats({ total, approved, pending, rejected }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Listings" value={total} icon={FiGrid} />
            <StatCard title="Approved" value={approved} icon={FiCheckCircle} />
            <StatCard title="Pending" value={pending} icon={FiClock} />
            <StatCard title="Rejected" value={rejected} icon={FiXCircle} />
        </div>
    );
}