'use client'
import { Inter } from 'next/font/google'
import AnimatedButton from './components/AnimatedButton'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default function Home() {
  const votingSectionRef = useRef(null)
  const [showVoteForm, setShowVoteForm] = useState(false)
  const [selectedSide, setSelectedSide] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    votacion: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState({
    izquierda: 0,
    derecha: 0,
    total: 0
  })
  const [isLoadingResults, setIsLoadingResults] = useState(true)

  // Función para cargar resultados
  const fetchResults = async () => {
    try {
      const response = await fetch('/api/usuarios')
      if (!response.ok) throw new Error('Error cargando resultados')
      
      const usuarios = await response.json()
      
      const stats = {
        izquierda: usuarios.filter(user => user.votacion === true).length,
        derecha: usuarios.filter(user => user.votacion === false).length,
        total: usuarios.length
      }
      
      setResults(stats)
    } catch (error) {
      console.error('Error cargando resultados:', error)
    } finally {
      setIsLoadingResults(false)
    }
  }

  // Cargar resultados optimizado
  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 3

    const loadResults = async () => {
      if (!isMounted) return
      
      try {
        setIsLoadingResults(true)
        await fetchResults()
        retryCount = 0 // Reset retry count on success
      } catch (error) {
        console.error('Error loading results:', error)
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(loadResults, 2000 * retryCount) // Exponential backoff
        }
      }
    }

    loadResults()

    // Polling menos agresivo
    const interval = setInterval(() => {
      if (isMounted) {
        fetchResults().catch(console.error)
      }
    }, 30000) // 30 segundos en lugar de 5

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleVoteClick = (side) => {
    setSelectedSide(side)
    setShowVoteForm(true)
    setTimeout(() => {
      votingSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 100)
  }

  const scrollToVoting = () => {
    votingSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitVote = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const voteData = {
        nombre: formData.nombre,
        votacion: selectedSide === 'left'
      }

      if (formData.edad) {
        voteData.edad = parseInt(formData.edad)
      }

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      
      // Solo actualizar resultados después de votar exitosamente
      await fetchResults()
      
      alert(`¡Gracias por votar, ${formData.nombre}! Tu voto por la ${selectedSide === 'left' ? 'Izquierda' : 'Derecha'} ha sido registrado.`)
      
      setFormData({
        nombre: '',
        edad: '',
        votacion: true
      })
      setShowVoteForm(false)
      setSelectedSide('')

    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el voto: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cancelVote = () => {
    setShowVoteForm(false)
    setSelectedSide('')
    setFormData({
      nombre: '',
      edad: '',
      votacion: true
    })
  }

  // Calcular porcentajes
  const izquierdaPorcentaje = results.total > 0 ? (results.izquierda / results.total) * 100 : 0
  const derechaPorcentaje = results.total > 0 ? (results.derecha / results.total) * 100 : 0

  const ganador = results.izquierda > results.derecha ? 'IZQUIERDA' : 
                  results.derecha > results.izquierda ? 'DERECHA' : 'EMPATE'

  return (
    <>
      <main className="h-screen">
        <section className="relative grid grid-cols-1 lg:grid-cols-2 h-full">
          
          {/* Columna izquierda */}
          <div className={`${inter.variable} font-sans flex flex-col justify-center px-6 lg:px-12 py-8 lg:py-0`}>
            <h1 className="text-4xl lg:text-6xl font-semibold mb-4 lg:mb-6 text-black text-center lg:text-left">
              PARTICIPA ACTIVAMENTE EN LA DECISION.
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-black text-center lg:text-left">
              Tu voto refleja tu vision: Derecha o Izquierda, expresate con libertad!
            </h2>
            <p className="text-base lg:text-lg text-black text-center lg:text-left">
              Cada decision cuenta y cada opinion aporta. Este es tu espacio para compartir lo que piensas,
              ser parte del dialogo y vivir la experiencia de participar activamente.
            </p>

            {/* Resultados optimizados */}
            <div className="hidden lg:block mt-8 bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                RESULTADOS EN TIEMPO REAL
              </h3>
              
              {isLoadingResults ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando resultados...</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Izquierda: {results.izquierda} ({izquierdaPorcentaje.toFixed(1)}%)</span>
                      <span>Derecha: {results.derecha} ({derechaPorcentaje.toFixed(1)}%)</span>
                    </div>
                    
                    {/* BARRA DE PROGRESO CORREGIDA */}
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      {/* Parte azul (izquierda) */}
                      <div 
                        className="absolute top-0 left-0 h-4 bg-blue-600 transition-all duration-500"
                        style={{ width: `${izquierdaPorcentaje}%` }}
                      ></div>
                      
                      {/* Parte roja (derecha) - empieza donde termina la azul */}
                      <div 
                        className="absolute top-0 h-4 bg-red-600 transition-all duration-500"
                        style={{ 
                          left: `${izquierdaPorcentaje}%`,
                          width: `${derechaPorcentaje}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.izquierda}</div>
                      <div className="text-sm text-blue-800">Izquierda</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700">{results.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{results.derecha}</div>
                      <div className="text-sm text-red-800">Derecha</div>
                    </div>
                  </div>

                  <div className={`mt-4 p-3 rounded-lg text-center font-bold ${
                    ganador === 'IZQUIERDA' ? 'bg-blue-100 text-blue-800' :
                    ganador === 'DERECHA' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ganador === 'EMPATE' ? 'EMPATE' : `VA GANANDO: ${ganador}`}
                    <div className="text-xs font-normal mt-1 opacity-75">
                      Actualizado cada 30 segundos
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Columna derecha con collage */}
          <div className="relative flex items-center justify-center overflow-hidden p-4 lg:p-0">
            {/* Imagen principal */}
            <img
              src="https://www.agenciapi.co/sites/default/files/2023-10/elecciones-colombia-2023-portada.jpg"
              alt="Imagen principal"
              className="principal w-full lg:w-4/5 rounded-xl shadow-xl object-cover relative z-10 lg:translate-x-60"
            />

            {/* Imagen superior derecha (solo en desktop) */}
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.XTjSt9T0G7XZFFQJYPdzxAHaFD?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Imagen superior"
              className="hidden lg:block absolute top-[10%] right-[15%] w-1/3 rounded-lg shadow-lg object-cover z-20"
            />

            {/* Imagen inferior derecha (solo en desktop) */}
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.D3BcQVYbb0JSl5wCLVu2ugHaEw?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Imagen inferior"
              className="hidden lg:block absolute bottom-[10%] right-[15%] w-1/3 rounded-lg shadow-lg object-cover z-20"
            />
          </div>

          {/* Botón centrado horizontalmente */}
          <div className="absolute w-full flex justify-center bottom-8 lg:bottom-auto" style={{ top: 'auto', bottom: '2rem', lg: { top: '80vh' } }}>
            <AnimatedButton texto={'Ver Mas'} click={scrollToVoting} />
          </div>
        </section>
      </main>

      {/* Sección de Votación */}
      <section ref={votingSectionRef} className="min-h-screen">
        <div className="w-full h-screen">
          
          {/* Mostrar formulario o opciones de voto */}
          {showVoteForm ? (
            // FORMULARIO DE VOTO
            <div className="w-full h-full flex items-center justify-center bg-gray-50 p-6">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className={`text-center mb-6 p-4 rounded-lg ${
                  selectedSide === 'left' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-red-100 border-2 border-red-300'
                }`}>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Votando por: <span className={selectedSide === 'left' ? 'text-blue-600' : 'text-red-600'}>
                      {selectedSide === 'left' ? 'IZQUIERDA' : 'DERECHA'}
                    </span>
                  </h2>
                </div>

                <form onSubmit={handleSubmitVote} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edad (opcional)
                    </label>
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleFormChange}
                      min="1"
                      max="120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tu edad"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={cancelVote}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.nombre.trim()}
                      className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors ${
                        selectedSide === 'left' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting ? 'Enviando...' : 'Confirmar Voto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            // OPCIONES DE VOTO ORIGINALES CON RESULTADOS
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              
              {/* Parte Izquierda - Azul */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-500 relative flex items-center justify-center p-6 md:p-8">
                <div className="text-center text-white max-w-md">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">IZQUIERDA</h2>
                  <p className="text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
                    Por un futuro con igualdad, justicia social y oportunidades para todos
                  </p>
                  
                  {/* Resultados móvil */}
                  <div className="lg:hidden bg-blue-800 bg-opacity-50 rounded-lg p-4 mb-4">
                    <div className="text-3xl font-bold">{results.izquierda}</div>
                    <div className="text-sm opacity-90">Votos</div>
                    <div className="text-xs opacity-75">{izquierdaPorcentaje.toFixed(1)}%</div>
                  </div>
                  
                  <button
                    onClick={() => handleVoteClick('left')}
                    className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    VOTAR IZQUIERDA
                  </button>
                </div>
              </div>

              {/* Parte Derecha - Rojo */}
              <div className="bg-gradient-to-br from-red-700 to-red-500 relative flex items-center justify-center p-6 md:p-8">
                <div className="text-center text-white max-w-md">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">DERECHA</h2>
                  <p className="text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
                    Por la libertad individual, el crecimiento economico y la tradicion
                  </p>
                  
                  {/* Resultados móvil */}
                  <div className="lg:hidden bg-red-800 bg-opacity-50 rounded-lg p-4 mb-4">
                    <div className="text-3xl font-bold">{results.derecha}</div>
                    <div className="text-sm opacity-90">Votos</div>
                    <div className="text-xs opacity-75">{derechaPorcentaje.toFixed(1)}%</div>
                  </div>
                  
                  <button
                    onClick={() => handleVoteClick('right')}
                    className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-600 px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    VOTAR DERECHA
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  )
}