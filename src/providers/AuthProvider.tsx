import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  session: any | null
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  session: null
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const signIn = async () => {
      try {
        // Eerst uitloggen om schone staat te hebben
        await supabase.auth.signOut()

        // Dan inloggen
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: import.meta.env['VITE_SUPABASE_USER'] as string,
          password: import.meta.env['VITE_SUPABASE_PASSWORD'] as string
        })

        if (signInError) {
          console.error('Auth error:', signInError)
          setError(signInError.message)
          setIsAuthenticated(false)
          setSession(null)
        } else {
          console.log('Auth successful:', data)
          setIsAuthenticated(true)
          setSession(data.session)
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error during auth:', err)
        setError('Er ging iets mis bij het inloggen')
        setIsAuthenticated(false)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    signIn()

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setIsAuthenticated(!!session)
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
      setIsAuthenticated(false)
      setIsLoading(true)
      setError(null)
      setSession(null)
    }
  }, [])

  // Toon loading state
  if (isLoading) {
    return <div>Loading auth...</div>
  }

  // Toon error state
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error, session }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook voor makkelijk gebruik
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 