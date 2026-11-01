import {createRoot} from 'react-dom/client';
import {LanguageProvider} from './i18n';
import {Portal} from './Portal';
import './archive.css';
import './tavern.css';
createRoot(document.getElementById('root')!).render(<LanguageProvider><Portal/></LanguageProvider>);
