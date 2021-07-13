import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

import * as serviceWorkerRegister from './serviceWorkerRegister'

import { AuthContextProvider } from "./contexts/AuthContext"
import { ThemeContextProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>    
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/:id" component={Room} />
            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;

serviceWorkerRegister.register();