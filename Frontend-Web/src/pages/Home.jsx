import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Sparkles,
  Code2,
  Database,
  Wrench,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Prompt Generation',
      description:
        'AI-powered prompts with full project understanding. Get comprehensive guidance tailored to your needs.',
      color: 'bg-blue-500',
    },
    {
      icon: Code2,
      title: 'Tech Stack Suggestions',
      description:
        'Get recommendations for the best technologies and frameworks based on your project requirements.',
      color: 'bg-purple-500',
    },
    {
      icon: Database,
      title: 'API Integration Guidance',
      description:
        'Comprehensive API usage instructions and integration patterns for your project.',
      color: 'bg-green-500',
    },
    {
      icon: Wrench,
      title: 'Environment Setup',
      description:
        'Step-by-step environment configuration guides to get you started quickly.',
      color: 'bg-orange-500',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Prompts Generated' },
    { value: '5K+', label: 'Active Users' },
    { value: '50+', label: 'Categories' },
    { value: '99%', label: 'Satisfaction' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Generate High-Quality
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AI Prompts
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Create comprehensive, production-ready prompts for your software
              projects. Get tech stack suggestions, API guidance, and setup
              instructions instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/generate" className="btn-primary text-lg px-8 py-4">
                  Generate Prompt
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/prompts"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Browse Prompts
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and guidance for developers, data scientists,
              and engineers to create better software faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div
                    className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate professional prompts in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe Your Project',
                description:
                  'Tell us about your project type, requirements, and target audience.',
                icon: Globe,
              },
              {
                step: '02',
                title: 'AI Generation',
                description:
                  'Our system generates a comprehensive prompt with tech stack suggestions.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Start Building',
                description:
                  'Use your generated prompt with detailed setup and API guidance.',
                icon: Shield,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="text-5xl font-bold text-primary-100 mb-4">
                      {item.step}
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                      <item.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Generate Your First Prompt?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building better software with
              AI-powered prompts.
            </p>
            <Link
              to={isAuthenticated ? '/generate' : '/register'}
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'Generate Prompt' : 'Get Started Free'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
