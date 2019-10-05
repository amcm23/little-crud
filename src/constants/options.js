import React from "react";

export const categories = [
  { label: "Tecnología", value: "1" },
  { label: "Electrodomésticos", value: "3" },
  { label: "Deportes", value: "4" },
  { label: "Hogar y Decoración", value: "5" },
  { label: "Juguetes", value: "6" },
  { label: "Videojuegos", value: "7" },
  { label: "Cine y música", value: "8" },
  { label: "Libros, ebooks y papelería", value: "9" }
];

export function transformCategory(categ) {
  switch (categ) {
    case 1:
      return <div>Tecnología</div>;
      break;
    case 3:
      return <div>Electrodomésticos</div>;
      break;
    case 4:
      return <div>Deportes</div>;
      break;
    case 5:
      return <div>Hogar y Decoración</div>;
      break;
    case 6:
      return <div>Juguetes</div>;
      break;
    case 7:
      return <div>Videojuegos</div>;
      break;
    case 8:
      return <div>Cine y música</div>;
      break;
    case 9:
      return <div>Libros, ebooks y papelería</div>;
      break;
    default:
      break;
  }
}
