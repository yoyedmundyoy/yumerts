import React, { useEffect, useRef } from 'react';

// Define proper TypeScript interfaces
interface Troop {
  troopId: string;
  faction: string;
  troopType: string;
  currentCoordinate: Coordinate;
  targetCoordinate?: Coordinate;
  health: number;
}

interface Coordinate {
  x: number;
  y: number;
}

interface CanvasProps {
  inputReceived: (input: { troopId: string; targetCoordinate: Coordinate }) => void;
}

const YumertsCanvas: React.FC<CanvasProps> = ({ inputReceived }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [troops, setTroops] = React.useState<Troop[]>([]);
  const [selectedTroop, setSelectedTroop] = React.useState<Troop | null>(null);

  // Preload images
  const loadImages = async () => {
    const imagePromises = {
      background: loadImage('/GrassTexture.png'),
      archer: loadImage('/Archer.png'),
      infantry: loadImage('/Infantry.png'),
      cavalry: loadImage('/Cavalry.png'),
    };

    try {
      const images = await Promise.all(Object.values(imagePromises));
      return {
        background: images[0],
        archer: images[1],
        infantry: images[2],
        cavalry: images[3],
      };
    } catch (error) {
      console.error('Error loading images:', error);
      return null;
    }
  };

  // Load image helper function
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  };

  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const cellSize = canvas.width / gridSize;

    // Load all images first
    const images = await loadImages();
    if (!images) return;

    // Draw background
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += cellSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += cellSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#888';
    ctx.stroke();

    // Draw troops
    for (const troop of troops) {
      const { x, y } = troop.currentCoordinate;
      
      // Draw troop background
      ctx.fillStyle = troop.faction === "0" ? 'rgba(0, 0, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect((x - 1) * cellSize, (y - 1) * cellSize, cellSize, cellSize);

      // Draw troop icon based on type
      let troopImage;
      switch (troop.troopType) {
        case "0":
          troopImage = images.infantry;
          break;
        case "1":
          troopImage = images.archer;
          break;
        case "2":
          troopImage = images.cavalry;
          break;
      }

      if (troopImage) {
        ctx.drawImage(
          troopImage,
          (x - 1) * cellSize,
          (y - 1) * cellSize,
          cellSize,
          cellSize
        );
      }

      // Draw movement arrows
      if (troop.targetCoordinate) {
        const { x: endX, y: endY } = troop.targetCoordinate;
        ctx.beginPath();
        ctx.moveTo((x - 1) * cellSize + cellSize / 2, (y - 1) * cellSize + cellSize / 2);
        ctx.lineTo((endX - 1) * cellSize + cellSize / 2, (endY - 1) * cellSize + cellSize / 2);
        ctx.strokeStyle = 'yellow';
        ctx.stroke();

        // Draw arrowhead
        const headlen = 10;
        const angle = Math.atan2(endY - troop.currentCoordinate.y, endX - troop.currentCoordinate.x);
        ctx.beginPath();
        ctx.moveTo((endX - 1) * cellSize + cellSize / 2, (endY - 1) * cellSize + cellSize / 2);
        ctx.lineTo(
          (endX - 1) * cellSize + cellSize / 2 - headlen * Math.cos(angle - Math.PI / 6),
          (endY - 1) * cellSize + cellSize / 2 - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo((endX - 1) * cellSize + cellSize / 2, (endY - 1) * cellSize + cellSize / 2);
        ctx.lineTo(
          (endX - 1) * cellSize + cellSize / 2 - headlen * Math.cos(angle + Math.PI / 6),
          (endY - 1) * cellSize + cellSize / 2 - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }

      // Draw health indicators
      if (troop.health < 100) {
        const crackCount = Math.floor((100 - troop.health) / 20);
        ctx.strokeStyle = 'black';
        for (let i = 0; i < crackCount; i++) {
          const crackX = (x - 1) * cellSize + Math.random() * cellSize;
          const crackY = (y - 1) * cellSize + Math.random() * cellSize;
          ctx.beginPath();
          ctx.moveTo(crackX, crackY);
          ctx.lineTo(crackX + Math.random() * 10 - 5, crackY + Math.random() * 10 - 5);
          ctx.stroke();
        }
      }
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [troops]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / 20;
    const x = Math.floor((event.clientX - rect.left) / cellSize) + 1;
    const y = Math.floor((event.clientY - rect.top) / cellSize) + 1;

    const clickedTroop: Troop | undefined = troops.find((troop: Troop) => 
      troop.currentCoordinate.x === x && troop.currentCoordinate.y === y
    );

    if (clickedTroop) {
      setSelectedTroop(clickedTroop);
    } else if (selectedTroop) {
      inputReceived({
        troopId: selectedTroop.troopId,
        targetCoordinate: { x, y }
      });
    } else {
      console.log("No troop on this cell", x, y)
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Battle Canvas</h1>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onClick={handleCanvasClick}
        className="border border-gray-300"
      />
      {selectedTroop && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Selected Troop: {selectedTroop.troopId}</p>
          <p>Health: {selectedTroop.health}%</p>
        </div>
      )}
    </div>
  );
};

export default YumertsCanvas;