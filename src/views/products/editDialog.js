import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { es } from "../../constants/spanish";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { categories } from "../../constants/options";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";

export default function EditDialog(props) {
  const { data } = props;

  useEffect(() => {
    //COMO EL SET STATE DEL COMPONENTE PADRE ES UNA FUNCIÓN ASÍNCRONA, TENGO QUE HACER UN USE EFFECT
    // QUE DETECTE CUANDO CAMBIA LA PROP DATA Y ASÍ COLOCAR POR DEFECTO LOS DATOS A EDITAR EN EL FORMULARIO
    data && console.log("data pro props: ", data.id);
    data && setId(data.id.toString());
    data && setName(data.nombre.toString());
    data && setPrice(data.precio.toString());
    data && setStock(data.stock.toString());
    data && setCategory(data.categoria.toString());
  }, [data]);

  const [id, setId] = useState();
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

    Axios.put(`${baseUrl}/productos/${id}`, values)
      .then(response => {
        console.log(response.data);
        props.hideDialog();
        setId();
        setName("");
        setPrice("");
        setCategory("");
        setStock("");
        Swal.fire({
          title: "Editado",
          text: "Producto editado con éxito.",
          timer: 1000,
          type: "success",
          showConfirmButton: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="content-section implementation">
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

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Button label="Confirmar" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
}
