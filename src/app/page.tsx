import { TradeEntry } from '@/components/TradeEntry/TradeEntry';

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <h1 className="text-2xl font-bold text-center mb-8">Trading Journal</h1>
      <TradeEntry />
    </main>
  );
}