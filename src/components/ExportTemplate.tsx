import React from 'react';
import { Stage } from 'react-konva';

interface ExportProps {
  stageRef: React.RefObject<any>;
}

export default function ExportTemplate({ stageRef }: ExportProps) {
  const downloadJSON = () => {
    if (!stageRef.current) return;
    // Serialize the stage to JSON
    const json = stageRef.current.toJSON();
    // Create a blob and trigger download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={downloadJSON} className="btn">
      Export Template JSON
    </button>
  );
}