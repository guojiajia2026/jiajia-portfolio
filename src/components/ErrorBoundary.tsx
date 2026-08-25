import { Component, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6"
          style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FDE8F0 50%, #F5E6F5 100%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-white rounded-xl-3xl p-8 max-w-md w-full text-center shadow-card"
          >
            <div className="w-16 h-16 rounded-full bg-pink-light/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-pink-primary" />
            </div>
            <h2 className="text-xl-2xl font-bold text-text-primary mb-2">
              页面出了点小问题
            </h2>
            <p className="text-sm-md text-text-tertiary mb-1">
              Something went wrong
            </p>
            <pre className="text-xs-sm text-text-faint bg-pink-light/8 rounded-xl-md p-3 mb-4 overflow-auto max-h-32 text-left">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl-md bg-gradient-pink text-white text-sm-md font-medium shadow-card hover:shadow-card-hover transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              刷新页面
            </button>
          </motion.div>
        </div>
      )
    }
    return this.props.children
  }
}
