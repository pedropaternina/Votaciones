import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    votacion: {type: Boolean, required: true},
    edad: {type: Number, required: false}
})

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema)