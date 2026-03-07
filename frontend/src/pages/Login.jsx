import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Title, Subheading } from '../components'
import { useAuth } from '../contexts/AuthContext'

const inputClass =
  'w-full font-mono text-[clamp(0.875rem,1.5vw+0.5rem,1rem)] border-2 border-black rounded-none px-[clamp(0.75rem,2vw+0.5rem,1rem)] py-[clamp(0.5rem,1.25vw+0.5rem,0.75rem)] bg-white focus:outline-none focus:ring-2 focus:ring-brand-magenta focus:ring-offset-0'

const labelClass = 'block font-medium text-[clamp(0.875rem,1.5vw+0.5rem,1rem)] text-black mb-1'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } else {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for confirmation!')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setIsLogin(true)
      }
    }
    
    setLoading(false)
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-[clamp(1rem,4vw+0.5rem,3rem)] py-[clamp(2rem,6vw+1rem,4rem)]">
      <div className="w-full max-w-md border-2 border-black p-[clamp(1.5rem,4vw+1rem,2.5rem)] bg-white">
        <Title className="text-black text-[clamp(2rem,5vw+1.5rem,3.5rem)]">
          {isLogin ? 'Log in' : 'Sign up'}
        </Title>
        <Subheading as="p" mono className="mt-2 text-black/80 text-[clamp(0.875rem,1.5vw+0.5rem,1.125rem)]">
          {isLogin ? 'Welcome back. Sign in to your account.' : 'Create an account to get started.'}
        </Subheading>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-[clamp(1.5rem,4vw+1rem,2.5rem)] space-y-[clamp(1rem,2.5vw+0.5rem,1.5rem)]">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete="new-password"
                required
              />
            </div>
          )}
          {isLogin && (
            <div className="text-right">
              <a
                href="#"
                className="font-mono text-[clamp(0.75rem,1.25vw+0.5rem,0.875rem)] text-black/70 hover:text-brand-magenta hover:underline cursor-pointer"
              >
                Forgot password?
              </a>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-magenta text-white font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] rounded-none text-[clamp(0.875rem,2vw+0.5rem,1.25rem)] shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <p className="mt-6 font-mono text-[clamp(0.75rem,1.25vw+0.5rem,0.875rem)] text-black/70 text-center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="text-brand-cyan font-medium hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="text-brand-cyan font-medium hover:underline cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  )
}
