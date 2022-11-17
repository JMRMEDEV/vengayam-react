import "./styles.css";
import "./web-components/dashboard-component";

export default function App() {
  return (
    <div className="App">
      <dashboard-component widgets='["cash-in-cash-out", "task-list", "account-summary"]'></dashboard-component>
    </div>
  );
}
