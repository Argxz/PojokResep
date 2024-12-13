import React, { useEffect, useState } from 'react'
import {
  Users,
  BookOpen,
  MessageCircle,
  Star,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDashboardData,
  fetchAllUsers,
  openUserModal,
} from '../redux/action/adminActions'
import { logoutUser } from '../redux/action/authActions'
import CommentsList from '../components/Admin/CommentList'
import RecipeTables from '../components/Admin/recipeTable'
import UserModal from '../components/Admin/UserModal'

// Component for individual dashboard cards
const DashboardCard = ({ icon, title, value, bgColor, trend, onClick }) => (
  <div
    onClick={onClick}
    className={`
      ${bgColor} 
      rounded-3xl 
      p-6 
      shadow-lg 
      hover:shadow-2xl 
      transform 
      hover:-translate-y-2 
      transition-all 
      duration-300 
      relative 
      overflow-hidden
      group cursor-pointer
    `}
  >
    <div className="flex justify-between items-start">
      <div className="bg-white/20 p-3 rounded-full mb-4">{icon}</div>
      {trend && (
        <div className="flex items-center text-white/80">
          <TrendingUp className="w-5 h-5 mr-1" />
          <span>{trend}%</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-white/80 text-sm uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
    <div
      className="
        absolute 
        -right-8 
        -bottom-8 
        w-24 
        h-24 
        bg-white/10 
        rounded-full 
        group-hover:scale-110 
        transition-transform 
        duration-300
      "
    />
  </div>
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { dashboardData, userModalOpen, loading, error } = useSelector(
    (state) => state.admin,
  )
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  // Handle click on the user card
  const handleUserCardClick = () => {
    dispatch(fetchAllUsers())
    dispatch(openUserModal())
  }

  // Handle logout action
  const handleLogout = () => {
    dispatch(logoutUser())
    setShowLogoutConfirm(false)
  }

  // Render loading screen if data is still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-pulse flex flex-col items-center">
          <LayoutDashboard className="w-16 h-16 text-blue-500 mb-4" />
          <span className="text-xl text-blue-600">Loading Dashboard...</span>
        </div>
      </div>
    )
  }

  // Render error screen if there's an error
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Dashboard Error
          </h2>
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date())}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="
              flex 
              items-center 
              bg-red-500 
              text-white 
              px-6 
              py-3 
              rounded-full 
              hover:bg-red-600 
              transition-all 
              group
            "
          >
            <LogOut className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            icon={<Users className="w-7 h-7 text-white" />}
            title="Total Users"
            value={dashboardData.totalUsers}
            bgColor="bg-blue-500"
            trend={15}
            onClick={handleUserCardClick}
          />

          {/* Render User Modal if open */}
          {userModalOpen && <UserModal />}
          <DashboardCard
            icon={<BookOpen className="w-7 h-7 text-white" />}
            title="Total Recipes"
            value={dashboardData.totalRecipes}
            bgColor="bg-green-500"
            trend={10}
          />
          <DashboardCard
            icon={<MessageCircle className="w-7 h-7 text-white" />}
            title="Total Comments"
            value={dashboardData.totalComments}
            bgColor="bg-purple-500"
            trend={20}
          />
          <DashboardCard
            icon={<Star className="w-7 h-7 text-white" />}
            title="Total Ratings"
            value={dashboardData.totalRatings}
            bgColor="bg-orange-500"
            trend={12}
          />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <CommentsList />
          <RecipeTables />
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 text-center">
              <LogOut className="mx-auto w-20 h-20 text-red-500 mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Logout Confirmation
              </h2>
              <p className="text-gray-600 mb-8">
                Are you sure you want to log out of the admin dashboard?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="
                    bg-red-500 
                     text-white 
                    px-6 
                    py-3 
                    rounded-full 
                    hover:bg-red-600 
                    transition-colors
                    flex 
                    items-center 
                    space-x-2
                  "
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="
                    bg-gray-200 
                    text-gray-800 
                    px-6 
                    py-3 
                    rounded-full 
                    hover:bg-gray-300 
                    transition-colors
                  "
                >
                  Cancel
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
