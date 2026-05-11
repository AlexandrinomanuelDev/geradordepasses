import { useRef } from 'react';
import useCardStore from '../../store/cardStore';
import { useCardPreview } from './useCardPreview';

export default function CardPreview() {
  const canvasRef = useRef(null);
  const state = useCardStore();
  useCardPreview(canvasRef, state);

  return (
    <div className="preview-wrapper">
      <span className="preview-label">Preview</span>
      <div className="preview-card">
        <canvas ref={canvasRef} width={400} height={600} />
      </div>
    </div>
  );
}
