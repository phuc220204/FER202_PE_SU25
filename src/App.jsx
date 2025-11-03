import { useRoutes } from "react-router-dom";
import getRoutes from "./routes/AppRoutes";

function App() {
  const routes = getRoutes();

  const element = useRoutes(routes);

  return element;
}

export default App;
