import React, {useState, useEffect} from 'react';
import {DataTable, Column} from 'primereact/datatable';
import axios from 'axios'
import {baseUrl} from '../../constants/index'

function Clients() {

  useEffect(() => {
    axios.get(`${baseUrl}/clientes`)
          .then(response => {
            console.log(response.data);
            setClients(response.data)
          })
          .catch(error => {
            console.log(error);
          });
  }, [])

    //Constante clientes la cual guarda un array que contendrá todos los clientes de la base de datos.
    const [clients, setClients] = useState([{
        id: 1,
        dni:"48192761X",
        name: "Antonio",
        surname: "Cepeda Martínez",
        direction: "Calle Secuoya",
        birthDate: "23-05-1997", //TODO format with moment
        phone: "640378838",
        email: "antonio@example.com"
    }, {
        id: 2,
        dni:"85469217F",
        name: "Fran",
        surname: "Lorente Girol",
        direction: "Calle Secuoya sin rima",
        birthDate: "14-03-1993", //TODO format with moment
        phone: "521478623",
        email: "fran@example.com"
    }])

  return (
    <div >
    <DataTable responsive={true} value={clients}>
    <Column field="id" header="ID" />
    <Column field="dni" header="DNI" />
    <Column field="nombre" header="Nombre" />
    <Column field="apellido" header="Apellidos" />
    <Column field="direccion" header="Dirección" />
    <Column field="fecha_nacimiento" header="Fecha Nac." />
    <Column field="telefono" header="Teléfono" />
    <Column field="email" header="Email" />
</DataTable>
    </div>
  );
}

export default Clients;