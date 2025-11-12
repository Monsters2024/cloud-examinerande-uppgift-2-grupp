import { signIn, signUp, signOut, getCurrentUser } from '@/lib/supabase/auth'

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn()
    }
  }
}))

type SupabaseAuthMock = {
  auth: {
    signInWithPassword: jest.Mock
    signUp: jest.Mock
    signOut: jest.Mock
    getUser: jest.Mock
  }
}

const { supabase: mockSupabase } = jest.requireMock('@/lib/supabase/client') as {
  supabase: SupabaseAuthMock
}

describe('supabase auth helpers', () => {
  beforeEach(() => jest.clearAllMocks())

  // ────────────── signIn ──────────────
  it('signs in with email and password', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' }
    const result = { session: { access_token: 'token' } }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: result, error: null })

    await expect(signIn(credentials)).resolves.toEqual(result)
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials)
  })

  it('throws when signInWithPassword returns an error', async () => {
    const credentials = { email: 'user@example.com', password: 'wrong' }
    const error = new Error('Invalid credentials')

    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error })

    await expect(signIn(credentials)).rejects.toThrow('Invalid credentials')
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials)
  })

  // ────────────── signUp ──────────────
  it('signs up a new user', async () => {
    const credentials = { email: 'new@example.com', password: 'secret' }
    const result = { user: { id: '123' } }

    mockSupabase.auth.signUp.mockResolvedValue({ data: result, error: null })

    await expect(signUp(credentials)).resolves.toEqual(result)
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(credentials)
  })

  it('throws when signUp returns an error', async () => {
    const credentials = { email: 'exists@example.com', password: 'secret' }
    const error = new Error('Email already registered')

    mockSupabase.auth.signUp.mockResolvedValue({ data: null, error })

    await expect(signUp(credentials)).rejects.toThrow('Email already registered')
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(credentials)
  })

  // ────────────── signOut ──────────────
  it('signs out the current user', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    await expect(signOut()).resolves.toBeUndefined()
    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
  })

  it('throws when signOut returns an error', async () => {
    const error = new Error('Failed to sign out')

    mockSupabase.auth.signOut.mockResolvedValue({ error })

    await expect(signOut()).rejects.toThrow('Failed to sign out')
    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
  })

  // ────────────── getCurrentUser ──────────────
  it('returns the current user object', async () => {
    const user = { id: 'current-user' }

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user }, error: null })

    await expect(getCurrentUser()).resolves.toEqual(user)
    expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1)
  })

  it('throws when getUser returns an error', async () => {
    const error = new Error('Failed to fetch user')

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error })

    // In your real helper, this error isn't thrown — so only test if you modify getCurrentUser to throw on error.
    // If you want to keep current logic (which ignores error), you can test for "null" instead.
    await expect(getCurrentUser()).rejects.toThrow('Failed to fetch user')
  })
})
