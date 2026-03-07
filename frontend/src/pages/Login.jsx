import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Title, Subheading } from '../components'
import { useAuth } from '../contexts/AuthContext'
import creditPurple1 from '../assets/credit_purple1.png'
import creditPurple2 from '../assets/credit_purple2.png'
import creditMagenta1 from '../assets/credit_magenta1.png'
import creditMagenta2 from '../assets/credit_magenta2.png'
import creditCyan1 from '../assets/credit_cyan1.png'

const CARD_TRANSITION = 'transform 0.2s ease-out'

const inputClass =
  'w-full font-mono text-[clamp(1.125rem,2vw+0.75rem,1.375rem)] border-4 border-black rounded-none px-[clamp(0.75rem,2vw+0.5rem,1rem)] py-[clamp(0.5rem,1.25vw+0.5rem,0.75rem)] bg-white focus:outline-none focus:ring-2 focus:ring-brand-magenta focus:ring-offset-0'

const labelClass = 'block font-medium text-[clamp(1.125rem,2vw+0.5rem,1.375rem)] text-black mb-1'

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
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    function handleMove(e) {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const cx = (mouse.x - 0.5) * 48
  const cy = (mouse.y - 0.5) * 48
  const vy = 1

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
        setError(error.message?.toLowerCase().includes('rate limit') ? 'Too many attempts. Please wait a bit and try again.' : error.message)
      } else {
        navigate('/')
      }
    } else {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message?.toLowerCase().includes('rate limit') ? 'Too many sign-up emails sent. Please wait an hour and try again.' : error.message)
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
    <main className="flex-1 flex flex-col items-center justify-center relative px-[clamp(1rem,4vw+0.5rem,3rem)] pt-[clamp(1rem,4vw+0.5rem,2.5rem)] pb-[clamp(2rem,6vw+1rem,4rem)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <img
          src={creditPurple1}
          alt=""
          className="absolute w-[clamp(6rem,14vw+2rem,9rem)] object-contain opacity-90"
          style={{
            top: '18%',
            left: '14%',
            transform: `translate(${cx * 0.9}px, ${cy * vy}px)`,
            transition: CARD_TRANSITION,
          }}
        />
        <img
          src={creditPurple2}
          alt=""
          className="absolute w-[clamp(6rem,14vw+2rem,9rem)] object-contain opacity-90"
          style={{
            top: '18%',
            right: '14%',
            transform: `translate(${-cx * 1.2}px, ${cy * vy}px)`,
            transition: CARD_TRANSITION,
          }}
        />
        <img
          src={creditMagenta1}
          alt=""
          className="absolute w-[clamp(6rem,14vw+2rem,9rem)] object-contain opacity-90"
          style={{
            top: '50%',
            left: '12%',
            transform: `translate(${-cx * 0.75}px, ${cy * vy}px)`,
            transition: CARD_TRANSITION,
          }}
        />
        <img
          src={creditMagenta2}
          alt=""
          className="absolute w-[clamp(6rem,14vw+2rem,9rem)] object-contain opacity-90"
          style={{
            top: '50%',
            right: '12%',
            transform: `translate(${cx * 1.1}px, ${-cy * vy}px)`,
            transition: CARD_TRANSITION,
          }}
        />
        <img
          src={creditCyan1}
          alt=""
          className="absolute w-[clamp(6rem,14vw+2rem,9rem)] object-contain opacity-90"
          style={{
            top: '78%',
            left: '14%',
            transform: `translate(${-cx * 1.05}px, ${-cy * vy}px)`,
            transition: CARD_TRANSITION,
          }}
        />
      </div>
      <div className="w-full max-w-md relative z-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-sans font-semibold text-[clamp(0.875rem,1.5vw+0.5rem,1rem)] text-black hover:text-brand-magenta mb-6 cursor-pointer border-0 bg-transparent p-0"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" strokeWidth={2.5} />
          Go back
        </button>
      </div>
      <div className="w-full max-w-md border-4 border-black p-[clamp(1.5rem,4vw+1rem,2.5rem)] bg-white relative z-10">
        <Title className="text-black text-[clamp(2rem,5vw+1.5rem,3.5rem)]">
          {isLogin ? 'Log in' : 'Sign up'}
        </Title>
        <Subheading
          as="p"
          mono
          className={`text-black/80 ${isLogin ? 'mt-2 text-[clamp(0.75rem,1.25vw+0.5rem,0.9375rem)]' : 'mt-2 mb-0 text-[clamp(0.65rem,1vw+0.4rem,0.8125rem)]'}`}
        >
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
        <form onSubmit={handleSubmit} className={isLogin ? 'mt-[clamp(1.5rem,4vw+1rem,2.5rem)] space-y-[clamp(1rem,2.5vw+0.5rem,1.5rem)]' : 'mt-[clamp(1rem,3vw+0.5rem,1.5rem)] space-y-[clamp(1rem,2.5vw+0.5rem,1.5rem)]'}>
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
            <div className="-mt-2">
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
            <div className="text-right -mt-5">
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
            className="w-full bg-brand-magenta text-white font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] rounded-none text-[clamp(1.125rem,2.5vw+0.75rem,1.5rem)] border-4 border-black shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <p className="mt-6 font-mono text-[clamp(0.875rem,1.5vw+0.5rem,1.0625rem)] text-black/70 text-center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="text-brand-cyan font-medium hover:underline cursor-pointer text-[clamp(1rem,1.75vw+0.5rem,1.25rem)]"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="text-brand-cyan font-medium hover:underline cursor-pointer text-[clamp(1rem,1.75vw+0.5rem,1.25rem)]"
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
