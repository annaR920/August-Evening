import "./App.css";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingCategoriePie from "./components/SpendingByCategoryPie";
import SavingGoals from "./components/SavingGoals";
import DiscretionaryExpense from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";

function App() {
  return (
    <div className="main-container">
      <Header />
      <MonthlyOverviewBar />
      <SpendingCategoriePie />
      <Income />
      <FixedExpenses />
      <DiscretionaryExpense />
      <SavingGoals />
    </div>
  );
}

export default App;
