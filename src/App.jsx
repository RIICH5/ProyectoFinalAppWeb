import { useState } from "react";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Orders } from "./components/Orders";
import { LoginForm } from "./components/LoginForm";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {isAuthenticated ? (
        <div className="container mx-auto px-4">
          {isAdmin ? <h1 className="text-3xl font-bold">Admin</h1> : <Menu />}
        </div>
      ) : (
        <LoginForm
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </>
  );
}

export default App;
