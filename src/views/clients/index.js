import React, { useState, useEffect } from "react";
import { DataTable, Column } from "primereact/datatable";
import axios from "axios";
import { baseUrl } from "../../constants/index";
import { Button } from "primereact/button";
import { FaPlusCircle } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import AddDialog from "./addDialog";

function Clients() {
  function fetchClients() {
    axios
      .get(`${baseUrl}/clientes`)
      .then(response => {
        console.log(response.data);
        setClients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchClients();
  }, []);

  //Constante clientes la cual guarda un array que contendrá todos los clientes de la base de datos.
  const [clients, setClients] = useState([]);
  const [addDialog, setAddDialog] = useState(true); //change to false

  function showAddDialog() {
    setAddDialog(true);
  }

  function hideAddDialog() {
    setAddDialog(false);
    fetchClients();
  }

  return (
    <div>
      <div className="p-grid  p-justify-end">
        <div className="p-col-2">
          <Button
            onClick={showAddDialog}
            className="p-col p-button-raised p-button-rounded"
            style={{ marginBottom: "1rem" }}
            label={<FaPlusCircle size={20} />}
          />
        </div>
      </div>
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
      <Dialog
        header="Añadir Cliente"
        visible={addDialog}
        width="500px"
        maximizable={true}
        modal={true}
        onHide={() => setAddDialog(false)}>
        <AddDialog hideDialog={hideAddDialog} />
      </Dialog>
    </div>
  );
}

export default Clients;
