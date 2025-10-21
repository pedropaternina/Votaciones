import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default function Home() {
  return (
    <main className="h-screen">
      <section className="relative grid grid-cols-2 h-full">
        
        {/* Columna izquierda */}
        <div className={`${inter.variable} font-sans flex flex-col justify-center px-12`}>
          <h1 className="text-6xl font-semibold mb-6 text-black">
            PARTICIPA ACTIVAMENTE EN LA DECISIÓN.
          </h1>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Tu voto refleja tu visión: Derecha o Izquierda, ¡exprésate con libertad!
          </h2>
          <p className="text-lg text-black">
            Cada decisión cuenta y cada opinión aporta. Este es tu espacio para compartir lo que piensas,
            ser parte del diálogo y vivir la experiencia de participar activamente.
          </p>
        </div>

        {/* Columna derecha con collage */}
        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Imagen principal */}
          <img
            src="https://www.agenciapi.co/sites/default/files/2023-10/elecciones-colombia-2023-portada.jpg"
            alt="Imagen principal"
            className="w-4/5 rounded-xl shadow-xl object-cover relative z-10"
          />

          {/* Imagen superior derecha (cubre esquina superior) */}
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.XTjSt9T0G7XZFFQJYPdzxAHaFD?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Imagen superior"
            className="absolute top-[10%] right-[15%] w-1/3 rounded-lg shadow-lg object-cover z-20"
          />

          {/* Imagen inferior derecha (cubre esquina inferior) */}
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.D3BcQVYbb0JSl5wCLVu2ugHaEw?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Imagen inferior"
            className="absolute bottom-[10%] right-[15%] w-1/3 rounded-lg shadow-lg object-cover z-20"
          />
        </div>

        {/* Botón centrado horizontalmente, en la parte inferior (80% vh) */}
        <div className="absolute w-full flex justify-center" style={{ top: '80vh' }}>
          <button className="bg-black text-white text-2xl font-bold px-16 py-6 rounded-full shadow-lg hover:bg-gray-800 transition-all">
            Votar
          </button>
        </div>
      </section>
    </main>
  )
}
