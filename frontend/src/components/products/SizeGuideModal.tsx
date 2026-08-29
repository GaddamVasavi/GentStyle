import React from 'react';
import { Modal } from '../common/Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gentleman's Sartorial Size Matrix" maxWidth="lg">
      <div className="space-y-6 text-xs text-gray-300">
        <div>
          <h4 className="text-white font-serif font-bold text-sm mb-2">Suits & Blazers (Chest & Waist Measurement)</h4>
          <div className="overflow-x-auto border border-gentborder rounded-lg">
            <table className="w-full text-center">
              <thead className="bg-[#12151b] text-gray-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">US / UK</th>
                  <th className="p-2.5">EU Size</th>
                  <th className="p-2.5">Chest (Inches)</th>
                  <th className="p-2.5">Waist (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gentborder text-gray-200">
                <tr><td className="p-2 font-mono font-semibold">36R (S)</td><td>46</td><td>36 - 38"</td><td>30 - 31"</td></tr>
                <tr><td className="p-2 font-mono font-semibold">38R (M)</td><td>48</td><td>38 - 40"</td><td>32 - 33"</td></tr>
                <tr><td className="p-2 font-mono font-semibold">40R (L)</td><td>50</td><td>40 - 42"</td><td>34 - 35"</td></tr>
                <tr><td className="p-2 font-mono font-semibold">42R (XL)</td><td>52</td><td>42 - 44"</td><td>36 - 37"</td></tr>
                <tr><td className="p-2 font-mono font-semibold">44R (XXL)</td><td>54</td><td>44 - 46"</td><td>38 - 40"</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-white font-serif font-bold text-sm mb-2">Footwear Conversion (Oxfords & Boots)</h4>
          <div className="overflow-x-auto border border-gentborder rounded-lg">
            <table className="w-full text-center">
              <thead className="bg-[#12151b] text-gray-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">US Size</th>
                  <th className="p-2.5">UK Size</th>
                  <th className="p-2.5">EU Size</th>
                  <th className="p-2.5">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gentborder text-gray-200">
                <tr><td className="p-2 font-mono font-semibold">8.0</td><td>7.5</td><td>41.0</td><td>26.0 cm</td></tr>
                <tr><td className="p-2 font-mono font-semibold">9.0</td><td>8.5</td><td>42.5</td><td>27.0 cm</td></tr>
                <tr><td className="p-2 font-mono font-semibold">10.0</td><td>9.5</td><td>43.5</td><td>28.0 cm</td></tr>
                <tr><td className="p-2 font-mono font-semibold">11.0</td><td>10.5</td><td>45.0</td><td>29.0 cm</td></tr>
                <tr><td className="p-2 font-mono font-semibold">12.0</td><td>11.5</td><td>46.0</td><td>30.0 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 italic">
          * Complimentary bespoke sleeve and hem tailoring is included on all full-price suit and trouser purchases.
        </p>
      </div>
    </Modal>
  );
};
