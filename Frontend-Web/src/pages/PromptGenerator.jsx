import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { promptsAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  Loader2,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  FileText,
  Terminal,
  Database,
  Wrench,
  Save,
  RotateCcw,
} from 'lucide-react'

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'developer',
    project_type: '',
    target_audience: '',
    tech_preferences: '',
    requirements: '',
    constraints: '',
    is_public: false,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await promptsAPI.getCategories()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.requirements) {
      toast.error('Please fill in the title and requirements')
      return
    }

    setLoading(true)

    try {
      const response = await promptsAPI.create(formData)
      setGeneratedPrompt(response.data)
      toast.success('Prompt generated successfully!')
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Failed to generate prompt'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'developer',
      project_type: '',
      target_audience: '',
      tech_preferences: '',
      requirements: '',
      constraints: '',
      is_public: false,
    })
    setGeneratedPrompt(null)
  }

  if (generatedPrompt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/prompts')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Prompts
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {generatedPrompt.title}
            </h1>
            <p className="text-gray-600">
              Category: {generatedPrompt.category.replace('_', ' ')}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="btn-secondary"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Generate New
            </button>
            <button
              onClick={() => copyToClipboard(generatedPrompt.generated_prompt)}
              className="btn-primary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Prompt */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">Generated Prompt</h2>
                </div>
              </div>
              <div className="card-body">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {generatedPrompt.generated_prompt}
                </pre>
              </div>
            </div>

            {/* API Guidance */}
            {generatedPrompt.api_guidance && (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold">API Integration Guide</h2>
                  </div>
                </div>
                <div className="card-body">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {generatedPrompt.api_guidance}
                  </pre>
                </div>
              </div>
            )}

            {/* Environment Setup */}
            {generatedPrompt.environment_setup && (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-5 w-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Environment Setup</h2>
                  </div>
                </div>
                <div className="card-body">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {generatedPrompt.environment_setup}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold">Tech Stack</h2>
                </div>
              </div>
              <div className="card-body">
                <ul className="space-y-2">
                  {generatedPrompt.tech_stack_suggestions?.map((tech, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <span className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Project Details */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Project Details</h2>
              </div>
              <div className="card-body space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Project Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {generatedPrompt.project_type || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Target Audience
                  </label>
                  <p className="text-sm text-gray-900">
                    {generatedPrompt.target_audience || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Tech Preferences
                  </label>
                  <p className="text-sm text-gray-900">
                    {generatedPrompt.tech_preferences || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body">
                <button
                  onClick={() => navigate('/prompts')}
                  className="w-full btn-secondary mb-3"
                >
                  <Save className="h-4 w-4 mr-2" />
                  View All Prompts
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Your prompt has been saved to your collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generate Prompt
        </h1>
        <p className="text-gray-600">
          Describe your project and we'll generate a comprehensive prompt with
          tech stack suggestions and setup instructions.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input mt-1"
                placeholder="e.g., E-commerce Dashboard with Real-time Analytics"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Brief Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Short summary of your project"
              />
            </div>

            {/* Category & Project Type */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="select mt-1"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="project_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Type *
                </label>
                <input
                  type="text"
                  id="project_type"
                  name="project_type"
                  required
                  value={formData.project_type}
                  onChange={handleChange}
                  className="input mt-1"
                  placeholder="e.g., Web App, API, Mobile App"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label
                htmlFor="target_audience"
                className="block text-sm font-medium text-gray-700"
              >
                Target Audience
              </label>
              <input
                type="text"
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Who will use this project?"
              />
            </div>

            {/* Tech Preferences */}
            <div>
              <label
                htmlFor="tech_preferences"
                className="block text-sm font-medium text-gray-700"
              >
                Technology Preferences (optional)
              </label>
              <input
                type="text"
                id="tech_preferences"
                name="tech_preferences"
                value={formData.tech_preferences}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Any preferred frameworks or technologies?"
              />
            </div>

            {/* Requirements */}
            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700"
              >
                Project Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                required
                value={formData.requirements}
                onChange={handleChange}
                className="textarea mt-1"
                placeholder="Describe the features, functionality, and goals of your project in detail..."
              />
            </div>

            {/* Constraints */}
            <div>
              <label
                htmlFor="constraints"
                className="block text-sm font-medium text-gray-700"
              >
                Constraints (optional)
              </label>
              <textarea
                id="constraints"
                name="constraints"
                rows={3}
                value={formData.constraints}
                onChange={handleChange}
                className="textarea mt-1"
                placeholder="Any budget, time, or technical constraints?"
              />
            </div>

            {/* Public Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_public"
                className="ml-2 text-sm text-gray-700"
              >
                Make this prompt public (visible to all users)
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Prompt
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PromptGenerator
