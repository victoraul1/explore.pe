'use client';

import { IGuide } from '@/models/Guide';
import GuideCard from './GuideCard';

interface GuideGridProps {
  guides: IGuide[];
  onSelectGuide: (guide: IGuide) => void;
  selectedGuide?: IGuide | null;
}

export default function GuideGrid({ guides, onSelectGuide, selectedGuide }: GuideGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {guides.map((guide) => (
        <GuideCard
          key={guide._id}
          guide={guide}
          onSelect={onSelectGuide}
          isSelected={selectedGuide?._id === guide._id}
        />
      ))}
    </div>
  );
}