import React from "react";
import ManageMenu from "./ManageMenu";
import ManageTables from "./ManageTables";
import { getMenuItems, addMenuItem, deleteMenuItem } from "../../services/menuService";
import { getTables, addTable, deleteTable } from "../../services/tableService";


const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1 className="text-2xl font-bold">Panel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ManageMenu />
        <ManageTables />
      </div>
    </div>
  );
};

export default AdminPanel;
