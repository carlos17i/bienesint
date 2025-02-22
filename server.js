const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const QRCode = require("qrcode");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

// Middleware para CORS
app.use(
  cors({
    origin: '*', // Permite cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);


// Middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a la base de datos MySQL usando promesas
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => console.log("Conectado a la base de datos MySQL"))
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

// Crear router API
const apiRouter = express.Router();
apiRouter.get("/generateQRCode/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la información principal del bien
    const [bienes] = await db.query(`
      SELECT 
        b.id_bien,
        b.codigo_institucional,
        b.codigo_senescyt,
        b.clase_de_bien,
        b.modelo,
        b.serie,
        b.marca,
        b.estado,
        b.observaciones,
        b.nro_acta_entrega_recepcion,
        b.nro_acta_constatacion_fisica,
        b.valor,
        b.codigo_anterior,
        b.fecha_registro,
        pa.nombre_periodo AS periodo
      FROM bienes b
      LEFT JOIN periodos_academicos pa ON b.periodo_academico_id = pa.id_periodo
      WHERE b.id_bien = ?`, [id]);

    if (bienes.length === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }

    const bien = bienes[0];

    // Obtener ubicaciones del bien
    const [ubicaciones] = await db.query(`
      SELECT u.area, u.numero_aula, u.sede
      FROM bien_ubicacion bu
      JOIN ubicaciones u ON bu.id_ubicacion = u.id_ubicacion
      WHERE bu.id_bien = ?`, [id]);

    // Obtener categorías del bien
    const [categorias] = await db.query(`
      SELECT c.nombre_categoria AS categoria
      FROM bien_categoria bc
      JOIN categorias c ON bc.id_categoria = c.id_categoria
      WHERE bc.id_bien = ?`, [id]);

    // Obtener periodos académicos adicionales del bien (si aplica)
    const [periodos] = await db.query(`
      SELECT pa.nombre_periodo AS periodo_adicional
      FROM bien_periodo_academico bpa
      JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo
      WHERE bpa.id_bien = ?`, [id]);

    // Obtener el usuario relacionado al bien
    const [usuarios] = await db.query(`
      SELECT u.nombres, u.apellidos
      FROM bien_usuario bu
      JOIN usuarios u ON bu.id_usuario = u.id_usuario
      WHERE bu.id_bien = ?`, [id]);

    // Formatear la información
    const ubicacionesTexto = ubicaciones.length > 0 
      ? ubicaciones.map(u => `${u.area} - Aula ${u.numero_aula} (${u.sede})`).join(", ")
      : "No especificado";
    const categoriasTexto = categorias.length > 0 
      ? categorias.map(c => c.categoria).join(", ")
      : "No especificado";
    const periodosTexto = periodos.length > 0 
      ? periodos.map(p => p.periodo_adicional).join(", ")
      : "No especificado";
    const usuarioTexto = usuarios.length > 0 
      ? `${usuarios[0].nombres} ${usuarios[0].apellidos}`
      : "No asignado";

    // Crear el contenido del QR con toda la información
    const qrData = `
      ID: ${bien.id_bien}
      Código Institucional: ${bien.codigo_institucional}
      Código Senescyt: ${bien.codigo_senescyt}
      Clase de Bien: ${bien.clase_de_bien}
      Modelo: ${bien.modelo}
      Serie: ${bien.serie}
      Marca: ${bien.marca}
      Estado: ${bien.estado}
      Observaciones: ${bien.observaciones}
      Nº Acta Entrega-Recepción: ${bien.nro_acta_entrega_recepcion}
      Nº Acta Constatación Física: ${bien.nro_acta_constatacion_fisica}
      Valor: ${bien.valor}
      Código Anterior: ${bien.codigo_anterior}
      Fecha de Registro: ${bien.fecha_registro}
      Periodo Académico Principal: ${bien.periodo}
      Periodos Académicos Adicionales: ${periodosTexto}
      Ubicaciones: ${ubicacionesTexto}
      Categorías: ${categoriasTexto}
      Usuario Asignado: ${usuarioTexto}
    `;

    // Generar QR en base64
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    res.status(200).json({ qrCodeDataUrl });
  } catch (err) {
    console.error("Error al generar el código QR:", err);
    res.status(500).json({ error: "Error al generar el código QR" });
  }
});


// API de usuarios - Obtener todos los usuarios
apiRouter.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios"); // Usar db.query con promesas
    res.json(rows); // Enviamos los resultados como JSON
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

// Endpoint para registrar un nuevo usuario
apiRouter.post("/usuarios", async (req, res) => {
  const {
    nombres,
    apellidos,
    telefono,
    correo_institucional,
    cedula,
    carrera,
  } = req.body;
  const query = `
    INSERT INTO usuarios (nombres, apellidos, telefono, correo_institucional, cedula, carrera)
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(query, [
      nombres,
      apellidos,
      telefono,
      correo_institucional,
      cedula,
      carrera,
    ]);
    const newUser = {
      id_usuario: result.insertId,
      nombres,
      apellidos,
      telefono,
      correo_institucional,
      cedula,
      carrera,
    };
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error al guardar el usuario:", err);
    res.status(500).json({ error: "Error al guardar el usuario" });
  }
});

// Endpoint para eliminar un usuario por ID
apiRouter.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM usuarios WHERE id_usuario = ?";

  try {
    const [result] = await db.query(query, [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

// Endpoint para actualizar un usuario
apiRouter.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombres,
    apellidos,
    telefono,
    correo_institucional,
    cedula,
    carrera,
  } = req.body;
  const query = `
    UPDATE usuarios
    SET nombres = ?, apellidos = ?, telefono = ?, correo_institucional = ?, cedula = ?, carrera = ?
    WHERE id_usuario = ?`;

  try {
    const [result] = await db.query(query, [
      nombres,
      apellidos,
      telefono,
      correo_institucional,
      cedula,
      carrera,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

//api para las ubicaciones
// Obtener todas las ubicaciones
apiRouter.get("/ubicaciones", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ubicaciones"); // Consulta a la tabla de ubicaciones
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las ubicaciones" });
  }
});

// Crear una nueva ubicación
apiRouter.post("/ubicaciones", async (req, res) => {
  try {
    const { area, numero_aula, sede, descripcion } = req.body;
    const query = `
      INSERT INTO ubicaciones (area, numero_aula, sede, descripcion)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      area,
      numero_aula,
      sede,
      descripcion,
    ]);
    const nuevaUbicacion = {
      id_ubicacion: result.insertId,
      area,
      numero_aula,
      sede,
      descripcion,
    };
    res.status(201).json(nuevaUbicacion);
  } catch (err) {
    res.status(500).json({ message: "Error al guardar la ubicación" });
  }
});

// Actualizar una ubicación
apiRouter.put("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { area, numero_aula, sede, descripcion } = req.body;
    const query = `
      UPDATE ubicaciones
      SET area = ?, numero_aula = ?, sede = ?, descripcion = ?
      WHERE id_ubicacion = ?
    `;
    const [result] = await db.query(query, [
      area,
      numero_aula,
      sede,
      descripcion,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Ubicación actualizada con éxito" });
    } else {
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar la ubicación" });
  }
});

// Eliminar una ubicación
apiRouter.delete("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM ubicaciones WHERE id_ubicacion = ?";
    const [result] = await db.query(query, [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Ubicación eliminada con éxito" });
    } else {
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar la ubicación" });
  }
});

//api periodosacademicos

apiRouter.get("/periodos_academicos", async (req, res) => {
  try {
    const [periodos] = await db.query("SELECT * FROM periodos_academicos");
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los períodos académicos" });
  }
});

// Crear un nuevo período académico
apiRouter.post("/periodos_academicos", async (req, res) => {
  const { nombre_periodo, fecha_inicio, fecha_fin, activo } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO periodos_academicos (nombre_periodo, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, ?)",
      [nombre_periodo, fecha_inicio, fecha_fin, activo]
    );
    res.status(201).json({
      id_periodo: result.insertId,
      nombre_periodo,
      fecha_inicio,
      fecha_fin,
      activo,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el período académico" });
  }
});

// Actualizar un período académico
apiRouter.put("/periodos_academicos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_periodo, fecha_inicio, fecha_fin, activo } = req.body;
  try {
    await db.query(
      "UPDATE periodos_academicos SET nombre_periodo = ?, fecha_inicio = ?, fecha_fin = ?, activo = ? WHERE id_periodo = ?",
      [nombre_periodo, fecha_inicio, fecha_fin, activo, id]
    );
    res.json({
      id_periodo: id,
      nombre_periodo,
      fecha_inicio,
      fecha_fin,
      activo,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el período académico" });
  }
});

// Eliminar un período académico
apiRouter.delete("/periodos_academicos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM periodos_academicos WHERE id_periodo = ?", [
      id,
    ]);
    res.json({ message: "Período académico eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el período académico" });
  }
});

// Activar o desactivar un período académico
apiRouter.patch("/periodos_academicos/:id/activo", async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    await db.query(
      "UPDATE periodos_academicos SET activo = ? WHERE id_periodo = ?",
      [activo, id]
    );
    res.json({ id_periodo: id, activo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cambiar el estado del período académico" });
  }
});

//API PARA GUARDAR UN BIEN :
// API para guardar un bien utilizando el stored procedure
apiRouter.post("/bienes", async (req, res) => {
  const {
    codigo_institucional,
    codigo_senescyt,
    clase_de_bien,
    modelo,
    serie,
    marca,
    estado,
    observaciones,
    nro_acta_entrega_recepcion,
    nro_acta_constatacion_fisica,
    valor,
    codigo_anterior,
    periodo_academico_id,
    categorias, // Lista de ID de categorías
    ubicaciones, // Lista de ID de ubicaciones
    usuarios, // Lista de ID de usuarios (custodios)
  } = req.body;

  try {
    // Llamada al stored procedure
    const [result] = await db.query(
      `CALL guardar_bien(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_institucional,
        codigo_senescyt,
        clase_de_bien,
        modelo,
        serie,
        marca,
        estado,
        observaciones,
        nro_acta_entrega_recepcion,
        nro_acta_constatacion_fisica,
        valor,
        codigo_anterior,
        periodo_academico_id,
        JSON.stringify(categorias), // Convertir las categorías a formato JSON
        JSON.stringify(ubicaciones), // Convertir las ubicaciones a formato JSON
        JSON.stringify(usuarios), // Convertir los usuarios a formato JSON
      ]
    );

    // Si la ejecución fue exitosa, retornar un mensaje de éxito
    res.status(201).json({ message: "Bien registrado con éxito", result });
  } catch (err) {
    console.error("Error al guardar el bien:", err);
    res.status(500).json({ error: "Error al guardar el bien" });
  }
});

// GET: Obtener todos los bienes
// GET: Obtener todos los bienes
apiRouter.get("/bienes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id_bien,
        b.codigo_institucional,
        b.codigo_senescyt,
        b.clase_de_bien,
        b.modelo,
        b.serie,
        b.marca,
        b.estado,
        b.observaciones,
        b.nro_acta_entrega_recepcion,
        b.nro_acta_constatacion_fisica,
        b.valor,
        b.codigo_anterior,
        b.fecha_registro,
        pa.nombre_periodo as periodo
      FROM bienes b
      LEFT JOIN periodos_academicos pa ON b.periodo_academico_id = pa.id_periodo
      ORDER BY b.fecha_registro DESC
    `);
    
    console.log('Bienes obtenidos:', rows); // Para debugging
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener los bienes:", err);
    res.status(500).json({ error: "Error al obtener los bienes" });
  }
});

// PUT: Actualizar un bien
apiRouter.put("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    codigo_institucional,
    codigo_senescyt,
    clase_de_bien,
    modelo,
    serie,
    marca,
    estado,
    observaciones,
    nro_acta_entrega_recepcion,
    nro_acta_constatacion_fisica,
    valor,
    codigo_anterior,
    periodo_academico_id,
    categorias,
    ubicaciones,
    usuarios,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE bienes SET 
        codigo_institucional = ?, 
        codigo_senescyt = ?, 
        clase_de_bien = ?, 
        modelo = ?, 
        serie = ?, 
        marca = ?, 
        estado = ?, 
        observaciones = ?, 
        nro_acta_entrega_recepcion = ?, 
        nro_acta_constatacion_fisica = ?, 
        valor = ?, 
        codigo_anterior = ?, 
        periodo_academico_id = ? 
      WHERE id_bien = ?`,
      [
        codigo_institucional,
        codigo_senescyt,
        clase_de_bien,
        modelo,
        serie,
        marca,
        estado,
        observaciones,
        nro_acta_entrega_recepcion,
        nro_acta_constatacion_fisica,
        valor,
        codigo_anterior,
        periodo_academico_id,
        id,
      ]
    );

    if (result.affectedRows > 0) {
      // Actualizar categorías, ubicaciones y usuarios asociados (deberías manejar esto con otros stored procedures)
      // Código para actualizar las relaciones si es necesario

      res.status(200).json({ message: "Bien actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Bien no encontrado para actualizar" });
    }
  } catch (err) {
    console.error("Error al actualizar el bien:", err);
    res.status(500).json({ error: "Error al actualizar el bien" });
  }
});

// DELETE: Eliminar un bien
apiRouter.delete("/bienes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar registros en bien_usuario relacionados con el bien
    await db.query("DELETE FROM bien_usuario WHERE id_bien = ?", [id]);

    // Eliminar registros en bien_periodo_academico relacionados con el bien
    await db.query("DELETE FROM bien_periodo_academico WHERE id_bien = ?", [id]);

    // Eliminar el bien después de eliminar los registros relacionados
    const [result] = await db.query("DELETE FROM bienes WHERE id_bien = ?", [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Bien eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Bien no encontrado para eliminar" });
    }
  } catch (err) {
    console.error("Error al eliminar el bien:", err);
    res.status(500).json({ error: "Error al eliminar el bien" });
  }
});




//api de categoria
apiRouter.get("/categorias", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM categorias");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

// Obtener una categoría por ID
apiRouter.get("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM categorias WHERE id_categoria = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    res.status(500).json({ message: "Error al obtener la categoría" });
  }
});

// Crear una nueva categoría (POST ajustado)
apiRouter.post("/categorias", async (req, res) => {
  const { nombre_categoria } = req.body;

  // Validar que el nombre_categoria esté presente
  if (!nombre_categoria) {
    return res
      .status(400)
      .json({ message: "El nombre de la categoría es obligatorio" });
  }

  try {
    // Insertar la categoría en la base de datos
    const [result] = await db.execute(
      "INSERT INTO categorias (nombre_categoria) VALUES (?)",
      [nombre_categoria]
    );

    // Si la inserción fue exitosa, retornamos la categoría creada
    res.status(201).json({
      id_categoria: result.insertId,
      nombre_categoria: nombre_categoria,
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear la categoría" });
  }
});

// Actualizar una categoría (PUT)
apiRouter.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;

  if (!nombre_categoria) {
    return res
      .status(400)
      .json({ message: "El nombre de la categoría es obligatorio" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?",
      [nombre_categoria, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});

// Eliminar una categoría (DELETE)
apiRouter.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
});

// Usar el router API
app.use("/api", apiRouter);

// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});