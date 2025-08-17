interface DashboardStatsProps {
  total: number; approved: number; pending: number; rejected: number;
}
const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className={`p-4 rounded-lg shadow ${color}`}>
        <p className="text-sm text-white/80">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);
export default function DashboardStats({ total, approved, pending, rejected }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Listings" value={total} color="bg-blue-500" />
            <StatCard title="Approved" value={approved} color="bg-green-500" />
            <StatCard title="Pending Review" value={pending} color="bg-yellow-500" />
            <StatCard title="Rejected" value={rejected} color="bg-red-500" />
        </div>
    );
}