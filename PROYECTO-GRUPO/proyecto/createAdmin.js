require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Ajusta el path si tu archivo se llama distinto (usuario.js / user.js)
const Usuario = require("./src/models/usuario");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    const correo = "admin@demo.com";
    const clavePlano = "Admin123";
    const hash = await bcrypt.hash(clavePlano, 10);

    // Si tu esquema tiene enum de roles, asegúrate de incluir 'admin' ahí.
    const dataAdmin = {
      nombre: "Administrador",
      correo, // <- tu schema pide 'correo'
      clave: hash, // <- tu schema pide 'clave'
      rol: "admin",
      direccion: "Sede central", // <- requerido
      telefono: "5555-5555", // <- requerido
      // agrega aquí cualquier otro requerido que te pida tu schema
    };

    // upsert: si existe, lo actualiza; si no, lo crea
    const res = await Usuario.findOneAndUpdate(
      { correo },
      { $set: dataAdmin },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Usuario admin listo:", {
      correo: res.correo,
      rol: res.rol,
    });
    console.log(
      "➡️  Credenciales de prueba -> correo:",
      correo,
      "  clave:",
      clavePlano
    );
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
