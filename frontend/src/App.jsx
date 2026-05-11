import CatalogPage from './pages/CatalogPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CatalogPage />
    </QueryClientProvider>
  );
}

export default App;