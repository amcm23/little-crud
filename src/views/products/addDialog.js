import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { es } from "../../constants/spanish";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import { categories } from "../../constants/options";

export default function AddDialog(props) {
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [category, setCategory] = useState();

  function submit() {
    const values = {
      nombre: name,
      precio: price,
      stock: stock,
      categoria: category
    };

    console.log("VALORES SUBMIT", values);

    Axios.post(`${baseUrl}/productos`, values)
      .then(response => {
        console.log(response.data);
        setName("");
        setPrice("");
        setStock("");
        setCategory("");
        props.fetchProductos();
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="content-section implementation">
      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <InputText
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <InputText
              placeholder="Precio"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="Stock"
              value={stock}
              onChange={e => setStock(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Dropdown
              value={category}
              options={categories}
              onChange={e => setCategory(e.target.value)}
              placeholder="Selecciona una categoría"
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Button label="Añadir" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
}
