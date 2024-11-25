import React, { useState } from 'react'

const App = () => {
  const [activeTab, setActiveTab] = useState('login') // State untuk tab aktif

  return (
    <div className="flex h-screen">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center border-r border-gray-300">
        <img src="/src/assets/pores.png" alt="Logo" className="h-90" />
      </div>

      {/* Login/Register Section */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Navigation Tabs */}
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'login'
                ? 'bg-black text-white'
                : 'bg-white text-black border'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'register'
                ? 'bg-black text-white'
                : 'bg-white text-black border'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Box for Login/Register Forms */}
        <div className="w-96 bg-white p-8 rounded-lg shadow-lg border border-gray-300">
          {/* Content Based on Active Tab */}
          {activeTab === 'login' ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  Login
                </button>
              </form>
              <div className="mt-4 text-right">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">REGISTER</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Choose a username"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Create a password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  Register
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
