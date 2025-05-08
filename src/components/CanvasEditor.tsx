'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

type Shape = {
  type: 'rect' | 'circle' | 'text';
  attrs: any;
};

export default function CanvasEditor() {
  const stageRef = useRef<any>(null);
  const [shapes, setShapes] = useState<Shape[]>([
    { type: 'rect', attrs: { x: 50, y: 60, width: 100, height: 100, fill: 'green', draggable: true } },
    { type: 'circle', attrs: { x: 250, y: 100, radius: 50, fill: 'blue', draggable: true } },
    { type: 'text', attrs: { x: 100, y: 200, text: 'Hello!', fontSize: 24, fill: 'black', draggable: true } },
  ]);

  const renderShape = (shape: Shape, i: number) => {
    switch (shape.type) {
      case 'rect':
        return <Rect key={i} {...shape.attrs} />;
      case 'circle':
        return <Circle key={i} {...shape.attrs} />;
      case 'text':
        return <Text key={i} {...shape.attrs} />;
      default:
        return null;
    }
  };

  const downloadJSON = () => {
    if (!stageRef.current) return;
    const json = stageRef.current.toJSON();
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

  const uploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const parsed = JSON.parse(json); // in case it's a stringified JSON string

        const layer = parsed?.children?.[0];
        const newShapes = layer?.children?.map((child: any) => ({
          type: child.className.toLowerCase(),
          attrs: child.attrs,
        })) || [];

        setShapes(newShapes);
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="space-x-2">
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export Template
        </button>

        <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Import Template
          <input type="file" accept="application/json" onChange={uploadJSON} className="hidden" />
        </label>
      </div>

      <Stage ref={stageRef} width={800} height={600} className="border border-gray-300 bg-white">
        <Layer>
          {shapes.map((shape, i) => renderShape(shape, i))}
        </Layer>
      </Stage>
    </div>
  );
}
