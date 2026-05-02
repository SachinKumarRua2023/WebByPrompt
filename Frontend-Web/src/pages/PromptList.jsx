import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { promptsAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  Loader2,
  FileText,
  Heart,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  PlusCircle,
  Star,
  Clock,
  User,
} from 'lucide-react'

const PromptList = () => {
  const { isAuthenticated } = useAuth()
  const [prompts, setPrompts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    mine: false,
    favorites: false,
    public: false,
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchPrompts()
  }, [filter])

  const fetchCategories = async () => {
    try {
      const response = await promptsAPI.getCategories()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchPrompts = async () => {
    setLoading(true)
    try {
      let response
      if (filter.favorites) {
        response = await promptsAPI.getFavorites()
      } else if (filter.public) {
        response = await promptsAPI.getPublic({ category: filter.category })
      } else {
        response = await promptsAPI.getAll({
          category: filter.category,
          mine: filter.mine,
        })
      }
      setPrompts(response.data.results || response.data.prompts || [])
    } catch (error) {
      toast.error('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id) => {
    try {
      await promptsAPI.toggleFavorite(id)
      fetchPrompts()
      toast.success('Favorite status updated')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const deletePrompt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return
    }

    try {
      await promptsAPI.delete(id)
      fetchPrompts()
      toast.success('Prompt deleted')
    } catch (error) {
      toast.error('Failed to delete prompt')
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query) ||
      prompt.category.toLowerCase().includes(query)
    )
  })

  const getCategoryLabel = (value) => {
    const category = categories.find((c) => c.value === value)
    return category ? category.label : value
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prompts</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage your generated prompts
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/generate" className="btn-primary">
            <PlusCircle className="h-4 w-4 mr-2" />
            Generate New
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filter.category}
                  onChange={(e) =>
                    setFilter({ ...filter, category: e.target.value })
                  }
                  className="select pl-9"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggle Filters */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setFilter({
                      ...filter,
                      mine: !filter.mine,
                      favorites: false,
                      public: false,
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.mine
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-1" />
                  My Prompts
                </button>
                <button
                  onClick={() =>
                    setFilter({
                      ...filter,
                      favorites: !filter.favorites,
                      mine: false,
                      public: false,
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.favorites
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="h-4 w-4 inline mr-1" />
                  Favorites
                </button>
              </div>
            )}

            <button
              onClick={() =>
                setFilter({
                  ...filter,
                  public: !filter.public,
                  mine: false,
                  favorites: false,
                })
              }
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.public
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Star className="h-4 w-4 inline mr-1" />
              Public
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : isAuthenticated
              ? "You haven't created any prompts yet"
              : 'Login to create and manage your prompts'}
          </p>
          {isAuthenticated && (
            <Link to="/generate" className="btn-primary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate Your First Prompt
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {getCategoryLabel(prompt.category)}
                  </span>
                  {prompt.is_favorite && (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {prompt.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {prompt.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(prompt.created_at).toLocaleDateString()}
                  {prompt.created_by_username && (
                    <>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      {prompt.created_by_username}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Link
                    to={`/prompts/${prompt.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>

                  <div className="flex items-center space-x-2">
                    {isAuthenticated && prompt.is_owner !== false && (
                      <>
                        <button
                          onClick={() => toggleFavorite(prompt.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prompt.is_favorite
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              prompt.is_favorite ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => deletePrompt(prompt.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PromptList
