import React, {useState} from 'react';
import {DataTable, Column} from 'primereact/datatable';

function Bills() {

    //Constante clientes la cual guarda un array que contendrá todos los clientes de la base de datos.
    const [bills, setBills] = useState([{
        id: 1,
        client: "Pepe Ruiz Ball",
        date: "2018-19-19",
        
    }, {
        id: 2,
        client: "Palotes Pepe",
        date: "2018-19-19",
    }])

  return (
    <div >
        <DataTable value={bills}>
            <Column field="id" header="ID" />
            <Column field="client" header="Cliente" /> 
            <Column field="date" header="Fecha" />
        </DataTable>
    </div>
  );
}

export default Bills;