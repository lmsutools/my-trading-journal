'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScriptableContext,
  ChartOptions
} from 'chart.js';
import { Settings, Trade } from '@/utils/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BalanceChartProps {
  tradeHistory: Trade[];
  settings: Settings;
}

export const BalanceChart = ({ tradeHistory, settings }: BalanceChartProps) => {
  const getBalanceHistory = (): number[] => {
    const balances = [settings.initialBalance];
    let currentBalance = settings.initialBalance;

    tradeHistory.slice().reverse().forEach(trade => {
      currentBalance += (trade.pnlUSD || 0);
      balances.push(currentBalance);
    });

    return balances;
  };

  const chartData: ChartData<'line'> = {
    labels: ['Initial', ...tradeHistory.map(t => 
      new Date(t.timestamp).toLocaleTimeString() + ' ' + 
      new Date(t.timestamp).toLocaleDateString()
    ).reverse()],
    datasets: [
      {
        label: 'Balance',
        data: getBalanceHistory(),
        borderColor: (context: ScriptableContext<'line'>) => {
          if (!context.chart.chartArea) return '#00C805';
          
          const gradient = context.chart.ctx.createLinearGradient(
            0,
            context.chart.chartArea.top,
            0,
            context.chart.chartArea.bottom
          );
          gradient.addColorStop(0, '#00C805');
          gradient.addColorStop(1, '#FF3B30');
          return gradient;
        },
        segment: {
          borderColor: (ctx) => {
            if (!ctx.p1.parsed) return '#00C805';
            return ctx.p1.parsed.y >= settings.initialBalance ? '#00C805' : '#FF3B30';
          }
        },
        tension: 0.1,
        pointBackgroundColor: (context: ScriptableContext<'line'>) => {
          if (typeof context.raw !== 'number') return '#00C805';
          return context.raw >= settings.initialBalance ? '#00C805' : '#FF3B30';
        },
        borderWidth: 2,
        fill: false,
        pointRadius: 4,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'white',
    scales: {
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value) => {
            if (typeof value !== 'number') return '';
            return `$${value.toLocaleString()}`;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Balance History',
        color: 'black',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl" style={{ height: '400px' }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};