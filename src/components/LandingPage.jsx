import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Upload } from 'lucide-react'
import LogoPojokResep from '../assets/pores.png'

function LandingPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 to-white 
    flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Optional: Background Subtle Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-orange-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-100 rounded-full blur-3xl"></div>
      </div>

      <div
        className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-12 
      items-center justify-center relative z-10"
      >
        {/* Bagian Kiri - Ilustrasi */}
        <div className="flex items-center justify-center order-2 md:order-1">
          <img
            src={LogoPojokResep}
            alt="Pojok Resep"
            className="w-full max-w-md object-contain transform hover:scale-105 
            transition duration-300"
          />
        </div>

        {/* Bagian Kanan - Konten */}
        <div
          className="space-y-6 text-center md:text-left order-1 md:order-2 
        flex flex-col justify-center"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Temukan & Bagikan
              <span className="block text-orange-600">Resep Favoritmu</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Platform berbagi resep terlengkap. Temukan inspirasi masakan baru,
              bagikan kreasi kulinermu, dan terhubung dengan pecinta masak
              lainnya.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/recipe"
              className="bg-orange-500 text-white px-8 py-3 rounded-full 
              hover:bg-orange-600 transition flex items-center justify-center gap-2 
              shadow-md hover:shadow-lg"
            >
              <BookOpen size={20} />
              Lihat Semua Resep
            </Link>
            <Link
              to="/upload-recipe"
              className="bg-green-500 text-white px-8 py-3 rounded-full 
              hover:bg-green-600 transition flex items-center justify-center gap-2 
              shadow-md hover:shadow-lg"
            >
              <Upload size={20} />
              Unggah Resep Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
