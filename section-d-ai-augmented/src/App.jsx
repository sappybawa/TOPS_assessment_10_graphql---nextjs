import { useState } from 'react';
import CategoryFilterOriginal from './CategoryFilter.original.jsx';
import CategoryFilterFixed from './CategoryFilter.jsx';

// Toggle between the AI's original code and the corrected version to compare behaviour.
export default function App() {
  const [version, setVersion] = useState('fixed');
  return (
    <main>
      <div className="switch">
        <button onClick={() => setVersion('original')} className={version === 'original' ? 'on' : ''}>AI original</button>
        <button onClick={() => setVersion('fixed')} className={version === 'fixed' ? 'on' : ''}>Corrected</button>
      </div>
      {version === 'original' ? <CategoryFilterOriginal /> : <CategoryFilterFixed />}
    </main>
  );
}
