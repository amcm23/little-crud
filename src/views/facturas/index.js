import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { baseUrl } from "../../constants/index";
import { Button } from "primereact/button";
import { FaPlusCircle, FaTrash, FaPen, FaListAlt } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import AddDialog from "./addDialog";
import DetailsDialog from "./detailsDialog";
import { transformCategory } from "../../constants/options";

function Bills() {
  function fetchBills() {
    axios
      .get(`${baseUrl}/facturas`)
      .then(response => {
        console.log(response.data);
        setBills(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchBills();
  }, []);

  function handleDelete(id) {
    axios
      .delete(`${baseUrl}/facturas/${id}`)
      .then(response => {
        console.log(response.data);
        alert("eliminado con éxito");
        fetchBills();
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handleDetails(id) {
    setCurrentBillID(id);
    console.log("LA IDDDDD: ", id);
    setDetailsDialog(true);
  }

  //Constante billos la cual guarda un array que contendrá todos los billos de la base de datos.
  const [bills, setBills] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [selectedBill, setSelectedBill] = useState([]);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [currentBillID, setCurrentBillID] = useState();

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
    fetchBills();
  }

  function optionsFormatter(rowData, column) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada billo y trae en rowData el objeto billo
    return (
      <div>
        <Button
          style={{ margin: "0.5rem" }}
          tooltip="Detalles"
          tooltipOptions={{ position: "top" }}
          type="button"
          label={<FaListAlt />}
          onClick={() => handleDetails(rowData.id)}
        />
        <Button
          style={{ margin: "0.5rem" }}
          type="button"
          className="p-button-danger"
          label={<FaTrash />}
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  }

  function categoryFormatter(rowData) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada billo y trae en rowData el objeto billo
    return transformCategory(rowData.categoria);
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
          {selectedBill.length > 0
            ? "Ha seleccionado: " + selectedBill.length
            : null}
        </div>
      </div>
      <DataTable
        value={bills}
        //selectionMode="multiple"
        //selection={selectedBill}
        //onSelectionChange={e =>
        //  setSelectedBill(selectedBill.concat(e.value))
        //}
        responsive={true}
        resizableColumns={true}
        columnResizeMode="fit">
        <Column
          field="id"
          header="ID"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="id_cliente"
          header="Cliente"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="fecha"
          header="Fecha"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />

        <Column field="options" header="Opciones" body={optionsFormatter} />
      </DataTable>
      <Dialog
        header="Añadir Factura"
        visible={addDialog}
        style={{ width: "70vw" }}
        maximizable={true}
        modal={true}
        onHide={() => setAddDialog(false)}>
        <AddDialog hideDialog={hideAddDialog} fetchBills={fetchBills} />
      </Dialog>
      <Dialog
        header="Detalles"
        visible={detailsDialog}
        style={{ width: "80vw" }}
        maximizable={true}
        modal={true}
        onHide={() => setDetailsDialog(false)}>
        <DetailsDialog
          idFactura={currentBillID}
          hideDialog={hideAddDialog}
          fetchBills={fetchBills}
        />
      </Dialog>
    </div>
  );
}

export default Bills;
