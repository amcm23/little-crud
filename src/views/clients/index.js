import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { baseUrl } from "../../constants/index";
import { Button } from "primereact/button";
import { FaPlusCircle, FaTrash, FaPen } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import AddDialog from "./addDialog";
import EditDialog from "./editDialog";
import Swal from "sweetalert2";

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

  function handleDelete(id) {
    Swal.fire({
      title: "Confirmar Eliminación.",
      showConfirmButton: true,
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        axios
          .delete(`${baseUrl}/clientes/${id}`)
          .then(response => {
            console.log(response.data);
            Swal.fire({
              title: "Eliminado",
              text: "Cliente eliminado con éxito.",
              timer: 1000,
              type: "success",
              showConfirmButton: false
            });
            fetchClients();
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }

  //Constante clientes la cual guarda un array que contendrá todos los clientes de la base de datos.
  const [clients, setClients] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [selectedClient, setSelectedClient] = useState([]);

  function showAddDialog() {
    setAddDialog(true);
  }

  useEffect(() => {
    {
      dataToEdit !== null && setEditDialog(true);
      console.log("data to edit: ", dataToEdit);
    }
  }, [dataToEdit]);

  function hideAddDialog() {
    setAddDialog(false);
    fetchClients();
  }

  function showEdit(client) {
    console.log(client);
    setDataToEdit(client);
  }

  function hideEditDialog() {
    setEditDialog(false);
    fetchClients();
  }

  function optionsFormatter(rowData, column) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada cliente y trae en rowData el objeto cliente
    return (
      <div>
        <Button
          type="button"
          label={<FaPen />}
          onClick={() => showEdit(rowData)}
          style={{ marginRight: "0.5rem" }}
        />
        <Button
          type="button"
          className="p-button-danger"
          label={<FaTrash />}
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
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
          {selectedClient.length > 0
            ? "Ha seleccionado: " + selectedClient.length
            : null}
        </div>
      </div>
      <DataTable
        responsive={true}
        value={clients}
        //selectionMode="multiple"
        //selection={selectedClient}
        //onSelectionChange={e =>
        //  setSelectedClient(selectedClient.concat(e.value))
        //}
        responsive={true}
        resizableColumns={true}
        columnResizeMode="fit">
        <Column
          field="id"
          header="ID"
          filter={true}
          style={{ width: "5%", overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="dni"
          header="DNI"
          filter={true}
          sortable={true}
          style={{ width: "10%", overflowX: "auto" }}
        />
        <Column
          field="nombre"
          header="Nombre"
          filter={true}
          sortable={true}
          style={{ width: "10%", overflowX: "auto" }}
        />
        <Column
          field="apellido"
          header="Apellidos"
          filter={true}
          sortable={true}
          style={{ overflowX: "auto", width: "15%" }}
        />
        <Column
          field="direccion"
          header="Dirección"
          filter={true}
          sortable={true}
          style={{ width: "15%", overflowX: "auto" }}
        />
        <Column
          field="fecha_nacimiento"
          header="Fecha Nac."
          filter={true}
          sortable={true}
          style={{ width: "10%", overflowX: "auto" }}
        />
        <Column
          field="telefono"
          header="Teléfono"
          filter={true}
          sortable={true}
          style={{ overflowX: "auto", width: "8%" }}
        />
        <Column
          field="email"
          header="Email"
          filter={true}
          sortable={true}
          style={{ overflowX: "auto", width: "15%" }}
        />
        <Column field="options" header="Opciones" body={optionsFormatter} />
      </DataTable>
      <Dialog
        contentStyle={{ maxHeight: "800px", overflow: "auto" }}
        header="Añadir Cliente"
        visible={addDialog}
        width="500px"
        maximizable={true}
        modal={true}
        onHide={() => setAddDialog(false)}>
        <AddDialog hideDialog={hideAddDialog} fetchClientes={fetchClients} />
      </Dialog>

      <Dialog
        contentStyle={{ maxHeight: "800px", overflow: "auto" }}
        header="Editar Cliente"
        visible={editDialog}
        width="500px"
        maximizable={true}
        modal={true}
        onHide={() => setEditDialog(false)}>
        <EditDialog hideDialog={hideEditDialog} data={dataToEdit} />
      </Dialog>
    </div>
  );
}

export default Clients;
