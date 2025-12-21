import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MigrationProvider } from "./context/MigrationContext";
import { Toaster } from "@/components/ui/sonner";

import LandingPage from "./pages/LandingPage";
import ConnectionPage from "./pages/ConnectionPage";
import DiffViewerPage from "./pages/DiffViewerPage";
import ExecutionResultsPage from "./pages/ExecutionResultsPage";
import MigrationHistoryPage from "./pages/MigrationHistoryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MigrationProvider>
        <Router>
          <div className="dark">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/connect" element={<ConnectionPage />} />
              <Route path="/diff" element={<DiffViewerPage />} />
              <Route path="/results" element={<ExecutionResultsPage />} />
              <Route path="/history" element={<MigrationHistoryPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </MigrationProvider>
    </QueryClientProvider>
  );
}

export default App;
