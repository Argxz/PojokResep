import React, { useEffect, useState } from 'react'
import { Users, BookOpen, MessageCircle, Star, LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardData } from '../redux/action/adminActions'
import { logoutUser } from '../redux/action/authActions'
import CommentsList from '../components/Admin/CommentList'

const DashboardCard = ({ icon, title, value, bgColor }) => (
  <div
    className={`
      ${bgColor} 
      rounded-2xl 
      p-6 
      shadow-lg 
      hover:scale-105 
      transition-transform 
      duration-300 
      flex 
      items-center 
      space-x-4
    `}
  >
    <div className="bg-white/20 p-3 rounded-full">{icon}</div>
    <div>
      <h3 className="text-white text-opacity-80 text-sm">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { dashboardData, loading, error } = useSelector((state) => state.admin)

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    setShowLogoutConfirm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="
              flex 
              items-center 
              bg-red-500 
              text-white 
              px-4 
              py-2 
              rounded-lg 
              hover:bg-red-600 
              transition-colors
            "
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<Users className="w-6 h-6 text-white" />}
            title="Total Users"
            value={dashboardData.totalUsers}
            bgColor="bg-blue-500"
          />
          <DashboardCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            title="Total Recipes"
            value={dashboardData.totalRecipes}
            bgColor="bg-green-500"
          />
          <DashboardCard
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            title="Total Comments"
            value={dashboardData.totalComments}
            bgColor="bg-purple-500"
          />
          <DashboardCard
            icon={<Star className="w-6 h-6 text-white" />}
            title="Total Ratings"
            value={dashboardData.totalRatings}
            bgColor="bg-orange-500"
          />
        </div>
        <div>
          <CommentsList />
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Konfirmasi Logout</h2>
              <p className="mb-6">Apakah Anda yakin ingin logout?</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
