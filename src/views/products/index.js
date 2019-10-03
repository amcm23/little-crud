import React, {useState} from 'react';
import {DataTable, Column} from 'primereact/datatable';

function Clients() {

    //Constante clientes la cual guarda un array que contendrá todos los clientes de la base de datos.
    const [products, setProducts] = useState([{
        id: 1,
        name: "Colacao",
        price: 50,
        stock: 1000,
        category: "Alimentación"
        
    }, {
      id: 2,
      name: "Colacao",
      price: 50,
      stock: 1000,
      category: "Alimentación"
    }])

  return (
    <div >
    <DataTable value={products}>
    <Column field="id" header="ID" />
    <Column field="name" header="Nombre" />
    <Column field="price" header="Precio" />
    <Column field="stock" header="Stock" />
    <Column field="category" header="Categoría" />
</DataTable>
    </div>
  );
}

export default Clients;