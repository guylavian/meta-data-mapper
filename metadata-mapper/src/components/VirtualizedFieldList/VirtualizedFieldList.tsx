import React from 'react';
import { FixedSizeList } from 'react-window';
import { Field } from '../../types/mapping';

interface VirtualizedFieldListProps {
  fields: Field[];
  itemHeight: number;
  maxHeight: number;
  renderItem: (field: Field) => React.ReactNode;
}

export const VirtualizedFieldList: React.FC<VirtualizedFieldListProps> = ({
  fields,
  itemHeight,
  maxHeight,
  renderItem
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(fields[index])}
    </div>
  );

  return (
    <FixedSizeList
      height={Math.min(fields.length * itemHeight, maxHeight)}
      itemCount={fields.length}
      itemSize={itemHeight}
      width="100%"
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {Row}
    </FixedSizeList>
  );
}; 