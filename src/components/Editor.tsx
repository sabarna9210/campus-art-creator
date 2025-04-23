"use client";
import { Stage, Layer, Rect } from "react-konva";
import { useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";

export default function Editor() {
  const stageRef = useRef<any>(null);
  const { elements, addRect, updateElement } = useEditorStore();

  const exportPNG = () => {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (uri) {
      const a = document.createElement("a");
      a.href = uri;
      a.download = "design.png";
      a.click();
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-56 p-4 space-y-2 border-r">
        <Button onClick={addRect}>Add Rectangle</Button>
        <Button variant="secondary" onClick={exportPNG}>Export PNG</Button>
      </aside>

      <main className="flex-1 bg-gray-50">
        <Stage width={800} height={600} ref={stageRef} className="border">
          <Layer>
            {elements.map(el => (
              <Rect
                key={el.id}
                {...el}
                fill="skyblue"
                draggable
                onDragEnd={e =>
                  updateElement(el.id, e.target.position())
                }
                onTransformEnd={e => {
                  const node = e.target;
                  updateElement(el.id, {
                    width: node.width() * node.scaleX(),
                    height: node.height() * node.scaleY(),
                  });
                }}
              />
            ))}
          </Layer>
        </Stage>
      </main>
    </div>
  );
}
