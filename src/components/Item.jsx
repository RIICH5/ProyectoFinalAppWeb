export const Item = ({ name, description, price, category, status }) => {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p>{description}</p>
      <p className="text-gray-600">Precio: ${price}</p>
      <p className={`text-sm ${status === "available" ? "text-green-600" : "text-red-600"}`}>
        {status === "available" ? "Disponible" : "Agotado"}
      </p>
      <p className="text-gray-500">Categoría: {category}</p>
    </div>
  );
};
