import useCardStore from '../../store/cardStore';
import { generatePng, generatePdf, downloadBlob } from '../../api/generateApi';

export default function ExportBar() {
  const state = useCardStore();
  const { isGenerating, error, setGenerating, setError, clearError } = state;

  async function handleExport(type) {
    clearError();
    setGenerating(true);
    try {
      const blob = type === 'pdf' ? await generatePdf(state) : await generatePng(state);
      downloadBlob(blob, `passe.${type}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao gerar o passe');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="export-bar">
      {error && <p className="export-error">{error}</p>}
      <button
        className="btn btn--primary"
        onClick={() => handleExport('png')}
        disabled={isGenerating}
      >
        {isGenerating ? 'A gerar...' : 'Baixar PNG'}
      </button>
      <button
        className="btn btn--secondary"
        onClick={() => handleExport('pdf')}
        disabled={isGenerating}
      >
        {isGenerating ? 'A gerar...' : 'Baixar PDF'}
      </button>
    </div>
  );
}
