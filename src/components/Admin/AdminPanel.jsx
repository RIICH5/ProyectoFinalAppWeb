import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importamos useNavigate
import ManageMenu from "./ManageMenu";
import ManageTables from "./ManageTables";
import { getMenuItems, addMenuItem, deleteMenuItem } from "../../services/menuService";
import { getTables, addTable, deleteTable } from "../../services/tableService";

const AdminPanel = () => {
  const navigate = useNavigate(); // 2. Usamos useNavigate para poder redirigir

  // Función para redirigir a la página de órdenes
  const goToOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="admin-panel">
      <h1 className="text-2xl font-bold">Panel Administrativo</h1>

      {/* 3. Botón para redirigir a las órdenes activas */}
      <button
        onClick={goToOrders}
        className="btn-go-to-orders mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Ver Órdenes Activas
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ManageMenu />
        <ManageTables />
      </div>
    </div>
  );
};

export default AdminPanel;
