import { PerformanceMetrics } from '@/utils/calculations';

interface MetricItemProps {
  label: string;
  value: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  tooltip?: string;
}

interface PerformanceProps {
  metrics: PerformanceMetrics;
}

const MetricItem = ({ label, value, isPercentage = false, isCurrency = false, tooltip }: MetricItemProps) => (
  <div className="flex flex-col p-3 bg-[#1E1E1E] rounded-lg" title={tooltip}>
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`text-lg font-bold ${value >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
      {isCurrency && '$'}
      {isPercentage ? value.toFixed(2) + '%' : value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
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
          <MetricItem label="Avg Trade" value={metrics.avgTrade} isCurrency 
            tooltip="Net profit divided by total number of trades" />
          <MetricItem label="Commission Paid" value={metrics.commissionPaid} isCurrency />
        </div>

        <div className="space-y-3">
          <MetricItem label="Total Trades" value={metrics.totalTrades} />
          <MetricItem label="Winning Trades" value={metrics.winningTrades} />
          <MetricItem label="Losing Trades" value={metrics.losingTrades} />
          <MetricItem label="Win Rate" value={metrics.percentProfitable} isPercentage />
          <MetricItem label="Win/Loss Ratio" value={metrics.ratioAvgWinLoss} 
            tooltip="Average winning trade divided by average losing trade" />
        </div>

        <div className="space-y-3">
          <MetricItem label="Max Run-up" value={metrics.maxRunUp} isCurrency />
          <MetricItem label="Max Drawdown" value={metrics.maxDrawdown} isCurrency />
          <MetricItem label="Avg Win" value={metrics.avgWinningTrade} isCurrency />
          <MetricItem label="Avg Loss" value={metrics.avgLosingTrade} isCurrency />
          <div className="flex flex-col p-3 bg-[#1E1E1E] rounded-lg">
            <span className="text-gray-400 text-sm">Largest Trades</span>
            <span className="text-sm">
              <span className="text-[#00C805]">
                Win: ${metrics.largestWinningTrade.amount.toFixed(2)} ({metrics.largestWinningTrade.percentage.toFixed(2)}%)
              </span>
              <br />
              <span className="text-[#FF3B30]">
                Loss: ${metrics.largestLosingTrade.amount.toFixed(2)} ({metrics.largestLosingTrade.percentage.toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};