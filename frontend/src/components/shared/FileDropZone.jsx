import { useDropzone } from 'react-dropzone';

export default function FileDropZone({ label, accept, onFile, previewUrl }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    onDrop: (accepted) => { if (accepted[0]) onFile(accepted[0]); },
  });

  return (
    <div className="dropzone-wrapper">
      <span className="dropzone-label">{label}</span>
      <div
        {...getRootProps()}
        className={`dropzone${isDragActive ? ' dropzone--active' : ''}${previewUrl ? ' dropzone--has-file' : ''}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="dropzone-preview" />
        ) : (
          <p>{isDragActive ? 'Solta aqui...' : 'Clica ou arrasta uma imagem'}</p>
        )}
      </div>
      {previewUrl && (
        <button
          className="dropzone-clear"
          onClick={(e) => { e.stopPropagation(); onFile(null); }}
          type="button"
        >
          ✕ Remover
        </button>
      )}
    </div>
  );
}
