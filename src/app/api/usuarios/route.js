import { connectDB } from "@/app/lib/mongodb";
import Usuario from "@/app/models/Usuario";

export async function GET() {
    await connectDB()
    const usuarios = await Usuario.find()
    return Response.json(usuarios)
}

export async function POST(request) {
    const data = await request.json()
    await connectDB()

    const nuevoUsuario = new Usuario(data)
    await nuevoUsuario.save()

    return Response.json({message: 'Usuario y Votacion creada', usuario: nuevoUsuario})
}

