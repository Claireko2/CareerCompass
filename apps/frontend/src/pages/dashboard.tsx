import MostInDemandBarChart from '@/components/charts/MostInDemandBarChart';
import SkillTrendLineChart from '@/components/charts/SkillTrendLineChart';
import RegionalSkillMap from '@/components/charts/RegionalSkillMap';

export default function Dashboard() {
    return (
        <div className="p-6 space-y-10">
            <h1 className="text-2xl font-bold">Market Insights Dashboard</h1>
            <MostInDemandBarChart />
            <SkillTrendLineChart />
            <RegionalSkillMap />
        </div>
    );
}
