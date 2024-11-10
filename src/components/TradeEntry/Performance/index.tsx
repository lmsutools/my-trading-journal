import { PerformanceMetrics } from '@/utils/calculations';

interface MetricItemProps {
  label: string;
  value: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
}

interface PerformanceProps {
  metrics: PerformanceMetrics;
}

const MetricItem = ({ label, value, isPercentage = false, isCurrency = false }: MetricItemProps) => (
  <div className="flex flex-col p-3 bg-[#1E1E1E] rounded-lg">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`text-lg font-bold ${value >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
      {isCurrency && '$'}
      {isPercentage ? value.toFixed(2) + '%' : value.toLocaleString()}
    </span>
  </div>
);

export const Performance = ({ metrics }: PerformanceProps) => {
  return (
    <div className="bg-[#252525] p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <MetricItem label="Gross Profit" value={metrics.grossProfit} isCurrency />
          <MetricItem label="Net Profit" value={metrics.netProfit} isCurrency />
          <MetricItem label="Commission Paid" value={metrics.commissionPaid} isCurrency />
        </div>

        <div className="space-y-3">
          <MetricItem label="Total Trades" value={metrics.totalTrades} />
          <MetricItem label="Winning Trades" value={metrics.winningTrades} />
          <MetricItem label="Losing Trades" value={metrics.losingTrades} />
          <MetricItem label="Win Rate" value={metrics.percentProfitable} isPercentage />
        </div>

        <div className="space-y-3">
          <MetricItem label="Max Run-up" value={metrics.maxRunUp} isCurrency />
          <MetricItem label="Max Drawdown" value={metrics.maxDrawdown} isCurrency />
          <div className="flex flex-col p-3 bg-[#1E1E1E] rounded-lg">
            <span className="text-gray-400 text-sm">Current Streak</span>
            <span className={`text-lg font-bold ${
              metrics.currentStreak.type === 'win' ? 'text-[#00C805]' : 'text-[#FF3B30]'
            }`}>
              {metrics.currentStreak.count} {metrics.currentStreak.type}
            </span>
          </div>
          <div className="flex flex-col p-3 bg-[#1E1E1E] rounded-lg">
            <span className="text-gray-400 text-sm">Best Streaks</span>
            <span className="text-lg font-bold text-[#00C805]">
              {metrics.maxWinStreak}W / <span className="text-[#FF3B30]">{metrics.maxLossStreak}L</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};