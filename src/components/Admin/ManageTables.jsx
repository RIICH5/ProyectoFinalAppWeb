import React, { useState, useEffect } from "react";
import { getTables, addTable, deleteTable, updateTable } from "../../services/tableService"; // Asegúrate de que updateTable esté en el servicio

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ tableNumber: "", status: "available" });
  const [editTable, setEditTable] = useState(null); // Estado para la mesa que se está editando

  // Fetch tables on mount
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const tableList = await getTables();
    setTables(tableList);
  };

  const handleAddTable = async () => {
    await addTable(newTable);
    fetchTables(); // Refresh list
    setNewTable({ tableNumber: "", status: "available" });
  };

  const handleDeleteTable = async (id) => {
    await deleteTable(id);
    fetchTables();
  };

  const handleEditTable = (table) => {
    setEditTable(table); // Pre-cargar los datos de la mesa en el formulario de edición
  };

  const handleSaveEditTable = async () => {
    await updateTable(editTable); // Actualizar la mesa en Firestore
    fetchTables(); // Refrescar lista
    setEditTable(null); // Cerrar el formulario de edición
  };

  return (
    <div className="manage-tables">
      <h2 className="text-xl font-bold mb-4">Gestión de Mesas</h2>

      {/* Formulario de Agregar Mesa */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="Número de Mesa"
          value={newTable.tableNumber}
          onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newTable.status}
          onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="available">Disponible</option>
          <option value="occupied">Ocupada</option>
        </select>
        <button onClick={handleAddTable} className="bg-blue-500 text-white p-2 rounded">
          Agregar Mesa
        </button>
      </div>

      {/* Formulario de Edición */}
      {editTable && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Mesa</h3>
          <input
            type="number"
            value={editTable.tableNumber}
            onChange={(e) => setEditTable({ ...editTable, tableNumber: e.target.value })}
            className="border p-2 mr-2"
          />
          <select
            value={editTable.status}
            onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
            className="border p-2 mr-2"
          >
            <option value="available">Disponible</option>
            <option value="occupied">Ocupada</option>
          </select>
          <button onClick={handleSaveEditTable} className="bg-green-500 text-white p-2 rounded">
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Lista de Mesas */}
      <ul>
        {tables.map((table) => (
          <li key={table.id} className="flex justify-between items-center border-b py-2">
            <span>Mesa {table.tableNumber} - {table.status}</span>
            <button
              onClick={() => handleEditTable(table)}
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteTable(table.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTables;
