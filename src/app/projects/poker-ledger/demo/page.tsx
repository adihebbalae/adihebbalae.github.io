'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PlayerData {
  name: string;
  bought: string;
  finalChips: string;
}

interface PlayerResult {
  name: string;
  bought: number;
  chipsIn: number;
  finalChips: number;
  netChips: number;
  netDollars: number;
}

export default function PokerLedgerPage() {
  const [buyin, setBuyin] = useState('5');
  const [chipsPerBuyin, setChipsPerBuyin] = useState('1000');
  const [numPlayers, setNumPlayers] = useState('3');
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [results, setResults] = useState<PlayerResult[] | null>(null);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [showPlayers, setShowPlayers] = useState(false);

  const generatePlayerInputs = useCallback(() => {
    const n = parseInt(numPlayers) || 0;
    const newPlayers: PlayerData[] = [];
    for (let i = 0; i < n; i++) {
      newPlayers.push({ name: '', bought: '', finalChips: '' });
    }
    setPlayers(newPlayers);
    setResults(null);
    setCollapsed({});
    setShowPlayers(true);
  }, [numPlayers]);

  const updatePlayer = (index: number, field: keyof PlayerData, value: string) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const togglePlayer = (index: number) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const calculate = () => {
    const buyinVal = parseFloat(buyin) || 0;
    const chipsVal = parseInt(chipsPerBuyin) || 1;
    const chipValue = buyinVal / chipsVal;

    const playerResults: PlayerResult[] = players.map((p, i) => {
      const bought = parseFloat(p.bought) || 0;
      const finalChips = parseInt(p.finalChips) || 0;
      const chipsIn = (bought / buyinVal) * chipsVal;
      const netChips = finalChips - chipsIn;
      const netDollars = netChips * chipValue;

      return {
        name: p.name || `Player ${i + 1}`,
        bought,
        chipsIn,
        finalChips,
        netChips,
        netDollars,
      };
    });

    setResults(playerResults);
  };

  const totalBought = results?.reduce((s, r) => s + r.bought, 0) ?? 0;
  const totalChipsIn = results?.reduce((s, r) => s + r.chipsIn, 0) ?? 0;
  const totalFinalChips = results?.reduce((s, r) => s + r.finalChips, 0) ?? 0;
  const totalNetDollars = results?.reduce((s, r) => s + r.netDollars, 0) ?? 0;
  const isBalanced = Math.abs(totalNetDollars) < 0.01;

  return (
    <div className="min-h-screen py-5 px-3 md:px-5" style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, #f5e6d3 100%)' }}>
      {/* Back Button */}
      <div className="max-w-[1200px] mx-auto mb-4">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-darker)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(136,8,8,0.1)] overflow-hidden">
        {/* Header */}
        <div
          className="relative text-white py-8 px-8 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none animate-[shimmer_6s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              top: '-50%', left: '-50%', width: '200%', height: '200%',
            }}
          />
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider relative z-10 drop-shadow-md">
            Poker Ledger
          </h1>
          <p className="text-lg font-light mt-2 opacity-90 relative z-10">
            Simplify your home game payouts
          </p>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Config Section */}
          <div className="bg-[var(--color-background)] p-4 md:p-6 rounded-lg mb-8 border-l-4 border-[var(--color-primary)]">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-4">
              Game Configuration
            </h2>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                  Base Buy-in Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={buyin}
                    onChange={(e) => setBuyin(e.target.value)}
                    className="w-full pl-6 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base
                               focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                               transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                  Chips per Buy-in
                </label>
                <input
                  type="number"
                  value={chipsPerBuyin}
                  onChange={(e) => setChipsPerBuyin(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                             focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                             transition-all duration-300"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                  Number of Players
                </label>
                <input
                  type="number"
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                             focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                             transition-all duration-300"
                />
              </div>
              <button
                onClick={generatePlayerInputs}
                className="px-8 py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-lg cursor-pointer
                           shadow-[0_4px_15px_rgba(136,8,8,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(136,8,8,0.15)]
                           active:translate-y-0 transition-all duration-300 w-full md:w-auto mt-4 md:mt-0"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
              >
                Set Players
              </button>
            </div>
          </div>

          {/* Player Sections */}
          {showPlayers && players.map((player, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg mb-4 p-4 md:p-6 transition-all duration-300
                         hover:shadow-[0_4px_20px_rgba(136,8,8,0.1)] hover:-translate-y-0.5"
            >
              <div
                className="cursor-pointer select-none flex items-center text-lg font-semibold text-[var(--color-primary)]
                           uppercase tracking-wider mb-4"
                onClick={() => togglePlayer(i)}
              >
                <span
                  className="inline-block w-5 h-[3px] bg-[var(--color-primary)] mr-2 transition-transform duration-200 origin-center"
                  style={{ transform: collapsed[i] ? 'rotate(90deg)' : 'none' }}
                />
                Player {i + 1}
                {player.name && ` — ${player.name}`}
              </div>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: collapsed[i] ? '0px' : '500px', opacity: collapsed[i] ? 0 : 1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter player name"
                      value={player.name}
                      onChange={(e) => updatePlayer(i, 'name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                                 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                                 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                      Total Buy-In
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={player.bought}
                      onChange={(e) => updatePlayer(i, 'bought', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                                 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                                 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[var(--color-tertiary)] text-sm uppercase tracking-wider">
                      Final Chips
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={player.finalChips}
                      onChange={(e) => updatePlayer(i, 'finalChips', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                                 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-transparent)]
                                 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Divider & Calculate Button */}
          {showPlayers && players.length > 0 && (
            <>
              <hr className="h-[2px] border-none my-8" style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }} />
              <button
                onClick={calculate}
                className="w-full px-8 py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-lg cursor-pointer
                           shadow-[0_4px_15px_rgba(136,8,8,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(136,8,8,0.15)]
                           active:translate-y-0 transition-all duration-300 mt-4"
                style={{ background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary) 100%)' }}
              >
                Calculate Results
              </button>
            </>
          )}

          {/* Results */}
          {results && (
            <div className="mt-8">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(136,8,8,0.1)]">
                  <thead>
                    <tr>
                      {['Name', 'Bought $', 'Chips In', 'Final Chips', 'Net Chips', 'Net $'].map((h) => (
                        <th
                          key={h}
                          className="py-4 px-4 text-center font-semibold uppercase tracking-wider text-sm text-white"
                          style={{ background: 'linear-gradient(135deg, var(--color-tertiary) 0%, #1a1a1a 100%)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="even:bg-gray-50 hover:bg-[var(--color-primary-transparent)] transition-colors">
                        <td className="py-4 px-4 text-center font-bold border-b border-gray-100">{r.name}</td>
                        <td className="py-4 px-4 text-center font-medium border-b border-gray-100">{r.bought.toFixed(2)}</td>
                        <td className="py-4 px-4 text-center font-medium border-b border-gray-100">{r.chipsIn.toFixed(0)}</td>
                        <td className="py-4 px-4 text-center font-medium border-b border-gray-100">{r.finalChips}</td>
                        <td className="py-4 px-4 text-center font-medium border-b border-gray-100">{r.netChips.toFixed(0)}</td>
                        <td className={`py-4 px-4 text-center font-semibold border-b border-gray-100 ${r.netDollars >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {r.netDollars >= 0 ? '+' : ''}{r.netDollars.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="font-bold border-t-2 border-[var(--color-primary)]" style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, #f0e6d3 100%)' }}>
                      <td className="py-4 px-4 text-center font-bold">TOTAL</td>
                      <td className="py-4 px-4 text-center font-bold">{totalBought.toFixed(2)}</td>
                      <td className="py-4 px-4 text-center font-bold">{totalChipsIn.toFixed(0)}</td>
                      <td className="py-4 px-4 text-center font-bold">{totalFinalChips}</td>
                      <td className="py-4 px-4 text-center font-bold">{(totalFinalChips - totalChipsIn).toFixed(0)}</td>
                      <td className="py-4 px-4 text-center font-bold">{totalNetDollars.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Table */}
              <div className="block md:hidden">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(136,8,8,0.1)]">
                  <thead>
                    <tr>
                      {['Name', 'Net $'].map((h) => (
                        <th
                          key={h}
                          className="py-4 px-3 text-center font-semibold uppercase tracking-wider text-sm text-white"
                          style={{ background: 'linear-gradient(135deg, var(--color-tertiary) 0%, #1a1a1a 100%)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="even:bg-gray-50 hover:bg-[var(--color-primary-transparent)] transition-colors">
                        <td className="py-4 px-3 text-center font-bold border-b border-gray-100">{r.name}</td>
                        <td className={`py-4 px-3 text-center font-semibold border-b border-gray-100 ${r.netDollars >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {r.netDollars >= 0 ? '+' : ''}{r.netDollars.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t-2 border-[var(--color-primary)]" style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, #f0e6d3 100%)' }}>
                      <td className="py-4 px-3 text-center font-bold">TOTAL</td>
                      <td className="py-4 px-3 text-center font-bold">{totalNetDollars.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Check */}
              <div
                className={`mt-4 p-4 rounded-lg font-semibold flex items-center gap-2 ${
                  isBalanced
                    ? 'text-green-500 bg-green-50 border border-green-200'
                    : 'text-red-500 bg-red-50 border border-red-200'
                }`}
              >
                {isBalanced
                  ? '✅ Balance check: TOTAL NET $ CHANGE sums to zero'
                  : '❌ Balance check: TOTAL NET $ CHANGE does NOT sum to zero'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
