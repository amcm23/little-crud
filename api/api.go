package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/go-chi/chi"
	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

type Cliente struct {
	ID              uint64 `json:"id"`
	DNI             string `json:"dni"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	Direccion       string `json:"direccion"`
	FechaNacimiento string `json:"fecha_nacimiento"`
	Telefono        string `json:"telefono"`
	Email           string `json:"email"`
}

type Factura struct {
	ID      uint64 `json:"id"`
	Cliente string `json:"id_cliente"`
	Fecha   string `json:"fecha"`
}

type Detalle struct {
	ID        uint64  `json:"id"`
	Factura   uint64  `json:"id_factura"`
	Producto  uint64  `json:"id_producto"`
	Cantidad  int     `json:"cantidad"`
	Precio    float32 `json:"precio"`
	Descuento float32 `json:"descuento"`
	Impuesto  float32 `json:"impuesto"`
}

type Producto struct {
	ID        uint64  `json:"id"`
	Nombre    string  `json:"nombre"`
	Precio    float32 `json:"precio"`
	Stock     int     `json:"stock"`
	Categoria int     `json:"categoria"`
}

type Categoria struct {
	ID       uint64  `json:"id"`
	Nombre   string  `json:"nombre"`
	Impuesto float32 `json:"impuesto"`
}

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "falor_fralg:fralg100@gmail.com@tcp(falorente.salesianas.es)/falorente_clientes")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
	/*router := mux.NewRouter().StrictSlash(true)
	//mux.CORSMethodMiddleware(router)

	router.HandleFunc("/posts", getPosts).Methods("GET")
	router.HandleFunc("/posts", createPost).Methods("POST")
	//router.HandleFunc("/posts/{id}", getPost).Methods("GET")
	//router.HandleFunc("/posts/{id}", updatePost).Methods("PUT")
	router.HandleFunc("/posts/{id}", deletePost).Methods("DELETE", "OPTIONS")
	http.ListenAndServe(":8000", handlers.CORS()(router))

	c := cors.New(cors.Options{
		AllowedMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowedOrigins:     []string{"*"},
		AllowCredentials:   true,
		AllowedHeaders:     []string{"Content-Type", "Bearer", "Bearer ", "content-type", "Origin", "Accept"},
		OptionsPassthrough: true,
	})

	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":8000", handler))*/
	r := chi.NewRouter()

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	r.Use(cors.Handler)
	r.Get("/clientes", getClientes)
	r.Get("/clientes/{id}", getCliente)
	r.Delete("/clientes/{id}", deleteCliente)
	r.Post("/clientes", createCliente)
	r.Put("/clientes/{id}", updateCliente)

	r.Get("/facturas", getFacturas)
	r.Get("/facturas/{id}", getFactura)
	r.Delete("/facturas/{id:[0-9]+}", deleteFactura)
	r.Post("/facturas", createFactura)
	r.Put("/facturas/{id}", updateFactura)

	r.Get("/detalles", getDetalles)
	r.Get("/detalles/{id}", getDetalle)
	r.Delete("/detalles/{id}", deleteDetalle)
	r.Post("/detalles", createDetalle)
	r.Put("/detalles/{id}", updateDetalle)

	r.Get("/productos", getProductos)
	r.Get("/productos/{id}", getProducto)
	r.Delete("/productos/{id}", deleteProducto)
	r.Post("/productos", createProducto)
	r.Put("/productos/{id}", updateProducto)

	r.Get("/categorias", getCategorias)
	r.Get("/categorias/{id}", getCategoria)
	r.Delete("/categorias/{id}", deleteCategoria)
	r.Post("/categorias", createCategoria)
	r.Put("/categorias/{id}", updateCategoria)

	http.ListenAndServe(":8000", r)
}

func deleteCliente(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	//w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE")
	//w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	/*log.Println("DELETE: " + id)
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM clientes WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Cliente with ID = %s was deleted", params["id"])*/
	id := chi.URLParam(r, "id")

	query, err := db.Prepare("delete from clientes where id=?")
	catch(err)
	_, er := query.Exec(id)
	catch(er)
	query.Close()
}

func catch(err error) {
	if err != nil {
		panic(err)
	}
}

func getClientes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var clientes []Cliente
	result, err := db.Query("SELECT * from clientes")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var cliente Cliente
		err := result.Scan(&cliente.ID, &cliente.DNI, &cliente.Nombre, &cliente.Apellido, &cliente.Direccion, &cliente.FechaNacimiento, &cliente.Telefono, &cliente.Email)
		if err != nil {
			panic(err.Error())
		}
		clientes = append(clientes, cliente)
	}
	json.NewEncoder(w).Encode(clientes)
}

func createCliente(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	//w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	//w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	stmt, err := db.Prepare("INSERT INTO clientes(dni,nombre,apellido,direccion,fecha_nacimiento,telefono,email) VALUES(?,?,?,?,?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	dni := keyVal["dni"]
	nombre := keyVal["nombre"]
	apellido := keyVal["apellido"]
	direccion := keyVal["direccion"]
	fecha_nacimiento := keyVal["fecha_nacimiento"]
	telefono := keyVal["telefono"]
	email := keyVal["email"]
	_, err = stmt.Exec(dni, nombre, apellido, direccion, fecha_nacimiento, telefono, email)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New post was created")
}

func getCliente(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	result, err := db.Query("SELECT * FROM clientes WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var cliente Cliente
	for result.Next() {
		err := result.Scan(&cliente.ID, &cliente.DNI, &cliente.Nombre, &cliente.Apellido, &cliente.Direccion, &cliente.FechaNacimiento, &cliente.Telefono, &cliente.Email)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(cliente)
}

func updateCliente(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	stmt, err := db.Prepare("UPDATE clientes SET dni= ?, nombre = ?, apellido= ?, direccion=?,fecha_nacimiento=?,telefono=?,email=?  WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	dni := keyVal["dni"]
	nombre := keyVal["nombre"]
	apellido := keyVal["apellido"]
	direccion := keyVal["direccion"]
	fecha_nacimiento := keyVal["fecha_nacimiento"]
	telefono := keyVal["telefono"]
	email := keyVal["email"]
	_, err = stmt.Exec(dni, nombre, apellido, direccion, fecha_nacimiento, telefono, email)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Cliente actualizado")
}

func deleteFactura(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "num_factura")

	query, err := db.Prepare("delete from facturas where id=?")
	catch(err)
	_, er := query.Exec(id)
	catch(er)
	query.Close()
}

func getFacturas(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var facturas []Factura
	result, err := db.Query("SELECT * from facturas")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var factura Factura
		err := result.Scan(&factura.ID, &factura.Cliente, &factura.Fecha)
		if err != nil {
			panic(err.Error())
		}
		facturas = append(facturas, factura)
	}
	json.NewEncoder(w).Encode(facturas)
}

func getFactura(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	result, err := db.Query("SELECT * FROM facturas WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var factura Factura
	for result.Next() {
		err := result.Scan(&factura.ID, &factura.Cliente, &factura.Fecha)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(factura)
}

func createFactura(w http.ResponseWriter, r *http.Request) {
	stmt, err := db.Prepare("INSERT INTO facturas(id_cliente,fecha) VALUES(?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	//num_factura := keyVal["num_factura"]
	id_cliente := keyVal["id_cliente"]
	fecha := keyVal["fecha"]
	_, err = stmt.Exec(id_cliente, fecha)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New post was created")
}

func updateFactura(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	stmt, err := db.Prepare("UPDATE facturas SET id_cliente = ?, fecha= ?  WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	id_cliente := keyVal["id_cliente"]
	fecha := keyVal["fecha"]
	_, err = stmt.Exec(id_cliente, fecha)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Factura actualizado")
}

func deleteDetalle(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	query, err := db.Prepare("delete from detalles where num_detalle=?")
	catch(err)
	_, er := query.Exec(id)
	catch(er)
	query.Close()
}

func getDetalles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var detalles []Detalle
	result, err := db.Query("SELECT * from detalles")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var detalle Detalle
		err := result.Scan(&detalle.ID, &detalle.Factura, &detalle.Producto, &detalle.Cantidad, &detalle.Precio, &detalle.Descuento, &detalle.Impuesto)
		if err != nil {
			panic(err.Error())
		}
		detalles = append(detalles, detalle)
	}
	json.NewEncoder(w).Encode(detalles)
}

func getDetalle(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	result, err := db.Query("SELECT * FROM detalles WHERE num_detalle = " + id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var detalle Detalle
	for result.Next() {
		err := result.Scan(&detalle.ID, &detalle.Factura, &detalle.Producto, &detalle.Cantidad, &detalle.Precio, &detalle.Descuento, &detalle.Impuesto)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(detalle)
}

func createDetalle(w http.ResponseWriter, r *http.Request) {
	stmt, err := db.Prepare("INSERT INTO detalles(id_factura,id_producto,cantidad,precio, descuento, impuesto) VALUES(?,?,?,?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	//num_factura := keyVal["num_factura"]
	id_factura := keyVal["id_factura"]
	id_producto := keyVal["id_producto"]
	cantidad := keyVal["cantidad"]
	precio := keyVal["precio"]
	descuento := keyVal["descuento"]
	impuesto := keyVal["impuesto"]
	_, err = stmt.Exec(id_factura, id_producto, cantidad, precio, descuento, impuesto)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New post was created")
}

func updateDetalle(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	stmt, err := db.Prepare("UPDATE detalles SET id_factura = ?,id_producto = ?, cantidad = ?,precio= ?,descuento = ?,impuesto = ? WHERE num_detalle = " + id)
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	id_factura := keyVal["id_factura"]
	id_producto := keyVal["id_producto"]
	cantidad := keyVal["cantidad"]
	precio := keyVal["precio"]
	descuento := keyVal["descuento"]
	impuesto := keyVal["impuesto"]
	_, err = stmt.Exec(id_factura, id_producto, cantidad, precio, descuento, impuesto)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Detalle actualizado")
}

func deleteProducto(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	query, err := db.Prepare("delete from productos where id=?")
	catch(err)
	_, er := query.Exec(id)
	catch(er)
	query.Close()
}

func getProductos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var productos []Producto
	result, err := db.Query("SELECT * from productos")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var producto Producto
		err := result.Scan(&producto.ID, &producto.Nombre, &producto.Precio, &producto.Stock, &producto.Categoria)
		if err != nil {
			panic(err.Error())
		}
		productos = append(productos, producto)
	}
	json.NewEncoder(w).Encode(productos)
}

func getProducto(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	result, err := db.Query("SELECT * FROM productos WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var producto Producto
	for result.Next() {
		err := result.Scan(&producto.ID, &producto.Nombre, &producto.Precio, &producto.Stock, &producto.Categoria)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(producto)
}

func createProducto(w http.ResponseWriter, r *http.Request) {
	stmt, err := db.Prepare("INSERT INTO productos(nombre,precio,stock,categoria) VALUES(?,?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	//num_factura := keyVal["num_factura"]
	nombre := keyVal["nombre"]
	precio := keyVal["precio"]
	stock := keyVal["stock"]
	categoria := keyVal["categoria"]
	_, err = stmt.Exec(nombre, precio, stock, categoria)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New post was created")
}

func updateProducto(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	stmt, err := db.Prepare("UPDATE productos SET nombre = ?, precio= ?, stock=?, categoria=?  WHERE id = " + id)
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	nombre := keyVal["nombre"]
	precio := keyVal["precio"]
	stock := keyVal["stock"]
	categoria := keyVal["categoria"]
	_, err = stmt.Exec(nombre, precio, stock, categoria)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Producto actualizado")
}

func deleteCategoria(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	query, err := db.Prepare("delete from categorias where codigo=?")
	catch(err)
	_, er := query.Exec(id)
	catch(er)
	query.Close()
}

func getCategorias(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var categorias []Categoria
	result, err := db.Query("SELECT * from categorias")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var categoria Categoria
		err := result.Scan(&categoria.ID, &categoria.Nombre, &categoria.Impuesto)
		if err != nil {
			panic(err.Error())
		}
		categorias = append(categorias, categoria)
	}
	json.NewEncoder(w).Encode(categorias)
}

func getCategoria(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	result, err := db.Query("SELECT * FROM categorias WHERE codigo = " + id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var categoria Categoria
	for result.Next() {
		err := result.Scan(&categoria.ID, &categoria.Nombre, &categoria.Impuesto)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(categoria)
}

func createCategoria(w http.ResponseWriter, r *http.Request) {
	stmt, err := db.Prepare("INSERT INTO categorias(nombre,impuesto) VALUES(?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	//num_factura := keyVal["num_factura"]
	nombre := keyVal["nombre"]
	impuesto := keyVal["impuesto"]
	_, err = stmt.Exec(nombre, impuesto)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New post was created")
}

func updateCategoria(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	stmt, err := db.Prepare("UPDATE categorias SET nombre = ?, impuesto= ? WHERE codigo = " + id)
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	nombre := keyVal["nombre"]
	impuesto := keyVal["impuesto"]
	_, err = stmt.Exec(nombre, impuesto)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Categoria actualizada")
}
