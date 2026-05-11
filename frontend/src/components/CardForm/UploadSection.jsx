import useCardStore from '../../store/cardStore';
import FileDropZone from '../shared/FileDropZone';

const ACCEPT = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] };

export default function UploadSection() {
  const { logoUrl, photoUrl, patternUrl, setFile } = useCardStore();

  return (
    <div className="form-section">
      <h3>Imagens</h3>
      <div className="upload-grid">
        <FileDropZone label="Logo da Empresa" accept={ACCEPT} onFile={(f) => setFile('logo', f)} previewUrl={logoUrl} />
        <FileDropZone label="Foto do Colaborador" accept={ACCEPT} onFile={(f) => setFile('photo', f)} previewUrl={photoUrl} />
        <FileDropZone label="Pattern Lateral (PNG)" accept={ACCEPT} onFile={(f) => setFile('pattern', f)} previewUrl={patternUrl} />
      </div>
    </div>
  );
}
