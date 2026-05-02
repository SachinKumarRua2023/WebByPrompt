import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { promptsAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  Loader2,
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Heart,
  Trash2,
  RotateCcw,
  Calendar,
  User,
  Folder,
  Eye,
  ExternalLink,
} from 'lucide-react'

const PromptDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    fetchPrompt()
  }, [id])

  const fetchPrompt = async () => {
    setLoading(true)
    try {
      const response = await promptsAPI.getById(id)
      setPrompt(response.data)
    } catch (error) {
      toast.error('Failed to load prompt')
      navigate('/prompts')
    } finally {
      setLoading(false)
    }
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

  const toggleFavorite = async () => {
    try {
      await promptsAPI.toggleFavorite(id)
      fetchPrompt()
      toast.success('Favorite status updated')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const deletePrompt = async () => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return
    }

    try {
      await promptsAPI.delete(id)
      toast.success('Prompt deleted')
      navigate('/prompts')
    } catch (error) {
      toast.error('Failed to delete prompt')
    }
  }

  const regenerate = async () => {
    setRegenerating(true)
    try {
      await promptsAPI.regenerate(id)
      fetchPrompt()
      toast.success('Prompt regenerated successfully!')
    } catch (error) {
      toast.error('Failed to regenerate prompt')
    } finally {
      setRegenerating(false)
    }
  }

  const isOwner = prompt?.created_by?.id === user?.id

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Prompt not found</h2>
          <Link to="/prompts" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to Prompts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/prompts')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Prompts
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              <Folder className="h-3 w-3 mr-1" />
              {prompt.category.replace('_', ' ')}
            </span>
            {prompt.is_public && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Eye className="h-3 w-3 mr-1" />
                Public
              </span>
            )}
            {prompt.is_favorite && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {prompt.title}
          </h1>
          <p className="text-gray-600">{prompt.description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-4 space-x-4">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {new Date(prompt.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              By {prompt.created_by?.username || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => copyToClipboard(prompt.generated_prompt)}
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

          {isOwner && (
            <>
              <button
                onClick={toggleFavorite}
                className={`btn-secondary ${
                  prompt.is_favorite ? 'text-red-600' : ''
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    prompt.is_favorite ? 'fill-current' : ''
                  }`}
                />
                {prompt.is_favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button
                onClick={regenerate}
                disabled={regenerating}
                className="btn-secondary"
              >
                {regenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </button>
              <button
                onClick={deletePrompt}
                className="btn-danger"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Prompt */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Generated Prompt</h2>
              </div>
            </div>
            <div className="card-body">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {prompt.generated_prompt}
              </pre>
            </div>
          </div>

          {/* API Guidance */}
          {prompt.api_guidance && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold">API Integration Guide</h2>
                </div>
              </div>
              <div className="card-body">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {prompt.api_guidance}
                </pre>
              </div>
            </div>
          )}

          {/* Environment Setup */}
          {prompt.environment_setup && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">Environment Setup</h2>
                </div>
              </div>
              <div className="card-body">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {prompt.environment_setup}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Project Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Project Type
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {prompt.project_type || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Target Audience
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {prompt.target_audience || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tech Preferences
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {prompt.tech_preferences || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Constraints
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {prompt.constraints || 'None specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Suggested Tech Stack</h2>
            </div>
            <div className="card-body">
              <ul className="space-y-3">
                {prompt.tech_stack_suggestions?.map((tech, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Requirements Summary */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Requirements</h2>
            </div>
            <div className="card-body">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {prompt.requirements}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetail
