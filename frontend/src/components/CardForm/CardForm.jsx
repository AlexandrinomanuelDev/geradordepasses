import useCardStore from '../../store/cardStore';
import { useDropzone } from 'react-dropzone';

const ACCEPT = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] };

function PhotoDropZone() {
  const { photoUrl, setPhoto } = useCardStore();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxFiles: 1,
    onDrop: (files) => { if (files[0]) setPhoto(files[0]); },
  });

  return (
    <div className="form-section">
      <h3>Foto do Colaborador</h3>
      <div
        {...getRootProps()}
        className={`photo-drop${isDragActive ? ' photo-drop--active' : ''}${photoUrl ? ' photo-drop--filled' : ''}`}
      >
        <input {...getInputProps()} />
        {photoUrl ? (
          <img src={photoUrl} alt="Foto" className="photo-preview" />
        ) : (
          <p>{isDragActive ? 'Solta aqui...' : 'Clica ou arrasta a foto'}</p>
        )}
      </div>
      {photoUrl && (
        <button className="btn-clear" onClick={() => setPhoto(null)} type="button">
          ✕ Remover foto
        </button>
      )}
    </div>
  );
}

export default function CardForm() {
  const { name, jobTitle, employeeId, admissionDate, qrData, setField } = useCardStore();

  return (
    <div className="card-form">
      <PhotoDropZone />

      <div className="form-section">
        <h3>Dados</h3>
        <label>
          Nome completo
          <input value={name} onChange={(e) => setField('name', e.target.value)} placeholder="Lídia Chipandia Ngonga" />
        </label>
        <label>
          Cargo
          <input value={jobTitle} onChange={(e) => setField('jobTitle', e.target.value)} placeholder="Assistente Comercial" />
        </label>
        <label>
          Nº Funcional
          <input value={employeeId} onChange={(e) => setField('employeeId', e.target.value)} placeholder="12" />
        </label>
        <label>
          Data de Admissão
          <input value={admissionDate} onChange={(e) => setField('admissionDate', e.target.value)} placeholder="18/11/2019" />
        </label>
      </div>

      <div className="form-section">
        <h3>QR Code</h3>
        <label>
          Dados / URL
          <input value={qrData} onChange={(e) => setField('qrData', e.target.value)} placeholder="https://fazendafilomena.pt" />
        </label>
      </div>
    </div>
  );
}
