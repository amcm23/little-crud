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
import { transformCategory } from "../../constants/options";
import Swal from "sweetalert2";

function Products() {
  function fetchProducts() {
    axios
      .get(`${baseUrl}/productos`)
      .then(response => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  function handleDelete(id) {
    axios
      .delete(`${baseUrl}/productos/${id}`)
      .then(response => {
        console.log(response.data);
        Swal.fire({
          title: "Eliminado",
          text: "Producto eliminado con éxito.",
          timer: 1000,
          type: "success",
          showConfirmButton: false
        });
        fetchProducts();
      })
      .catch(error => {
        console.log(error);
      });
  }

  //Constante productos la cual guarda un array que contendrá todos los productos de la base de datos.
  const [clients, setProducts] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);

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
    fetchProducts();
  }

  function showEdit(product) {
    console.log(product);
    setDataToEdit(product);
  }

  function hideEditDialog() {
    setEditDialog(false);
    fetchProducts();
  }

  function optionsFormatter(rowData, column) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada producto y trae en rowData el objeto producto
    return (
      <div>
        <Button
          type="button"
          label={<FaPen />}
          onClick={() => showEdit(rowData)}
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

  function categoryFormatter(rowData) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada producto y trae en rowData el objeto producto
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
          {selectedProduct.length > 0
            ? "Ha seleccionado: " + selectedProduct.length
            : null}
        </div>
      </div>
      <DataTable
        responsive={true}
        value={clients}
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
          field="nombre"
          header="Nombre"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="precio"
          header="Precio"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="stock"
          header="Stock"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="categoria"
          header="Categoria"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
          body={categoryFormatter}
        />
        <Column field="options" header="Opciones" body={optionsFormatter} />
      </DataTable>
      <Dialog
        header="Añadir Producto"
        visible={addDialog}
        width="500px"
        maximizable={true}
        modal={true}
        onHide={() => setAddDialog(false)}>
        <AddDialog hideDialog={hideAddDialog} fetchProductos={fetchProducts} />
      </Dialog>

      <Dialog
        header="Editar Producte"
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

export default Products;
