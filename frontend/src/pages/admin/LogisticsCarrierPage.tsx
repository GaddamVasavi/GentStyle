import React, { useState } from 'react';
import { supplyChainService } from '../../services/supplyChain.service';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Truck, Globe2 } from 'lucide-react';

export const LogisticsCarrierPage: React.FC = () => {
  const [originCountry, setOriginCountry] = useState('Italy');
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [weightKg, setWeightKg] = useState(3.5);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompute = async () => {
    setIsLoading(true);
    try {
      const res = await supplyChainService.getCarrierQuotes(originCountry, destinationCountry, weightKg);
      setQuotes(res.data || []);
    } catch {
      alert('Error fetching carrier rates');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="border-b border-gentborder pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Truck className="w-4 h-4" />
          Global White-Glove Logistics
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Carrier Matrix & Cross-Border Routing
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Real-time rate calculation across DHL Express, FedEx Priority, and UPS Worldwide with automatic DDP customs classification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
          <h3 className="font-serif font-bold text-white text-base">Rate Calculator</h3>
          <div className="space-y-4">
            <Input label="Origin Country" value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
            <Input label="Destination Country" value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} />
            <Input label="Consignment Weight (kg)" type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
            <Button variant="gold" size="md" className="w-full" onClick={handleCompute} disabled={isLoading}>
              {isLoading ? 'Querying Carrier API...' : 'Compute Dynamic Carrier Rates'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif font-bold text-white text-base">Carrier Routing Options</h3>
          {quotes.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 border border-gentborder text-center space-y-2">
              <Globe2 className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-xs text-gray-400">Enter consignment parameters to calculate live carrier transit rates.</p>
            </div>
          ) : (
            quotes.map((q, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-5 border border-gentborder flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">{q.carrierName}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Estimated Transit: <strong className="text-emerald-400">{q.estimatedTransitDays} Business Days</strong>
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono">Insurance Covered: ${q.insuranceCoveredUsd.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-xl text-gold-300">${q.rateUsd.toFixed(2)}</span>
                  <p className="text-[10px] text-gray-400 uppercase">DDP Included</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
