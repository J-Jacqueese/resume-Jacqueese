import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./components/Login";
import Board from "./components/Board";
import { User } from "../api/client";

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {user ? (
        <DndProvider backend={HTML5Backend}>
          <Board user={user} onLogout={() => setUser(null)} />
        </DndProvider>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}
