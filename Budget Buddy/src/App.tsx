import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingCategoriePie from "./components/SpendingByCategoryPie";
import SavingGoals from "./components/SavingGoals";
import DiscretionaryExpense from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";
import CreditsPage from "./components/CreditsPage"; 

// Temporary landing page
function Dashboard() {
  return (
    <>
      <Header />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>BudgetBuddy Dashboard (Coming Soon)</h1>
        <Link to="/credits" style={{ color: "#00bcd4", textDecoration: "underline" }}>
          View Credits Page
        </Link>
      </div>
      
      <MonthlyOverviewBar />
      <SpendingCategoriePie />
      <Income />
      <FixedExpenses />
      <DiscretionaryExpense />
      <SavingGoals />
      
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/credits" element={<CreditsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
