import CardForm from './components/CardForm/CardForm';
import CardPreview from './components/CardPreview/CardPreview';
import ExportBar from './components/ExportBar/ExportBar';
import './styles/global.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src="/LOGO.png" alt="Fazenda Filomena" />
        <h1>Gerador de Passes</h1>
      </header>
      <main className="app-main">
        <aside className="app-sidebar">
          <CardForm />
          <ExportBar />
        </aside>
        <section className="app-preview">
          <CardPreview />
        </section>
      </main>
    </div>
  );
}
