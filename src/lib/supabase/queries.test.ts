import { getEntries, createEntry, deleteEntry } from '@/lib/supabase/queries'

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: { getUser: jest.fn() },
    from: jest.fn()
  }
}))

type SupabaseMock = {
  auth: { getUser: jest.Mock }
  from: jest.Mock
}

const { supabase: mockSupabase } = jest.requireMock('@/lib/supabase/client') as {
  supabase: SupabaseMock
}

describe('supabase queries', () => {
  beforeEach(() => jest.clearAllMocks())

  // Utility to create a chained query builder mock
  const createBuilder = (overrides: Record<string, any> = {}) => {
    const builder: Record<string, any> = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    }

    // Apply overrides. If override is a raw value, treat it as the terminal response
    for (const key of Object.keys(overrides)) {
      const val = overrides[key]
      if (typeof val === 'function') {
        builder[key] = val
      } else {
        // treat as terminal resolved response for that method
        builder[key] = jest.fn().mockResolvedValue(val)
      }
    }

    return builder
  }

  // ────────────────────────────────────────────────
  it('fetches entries for the authenticated user', async () => {
    const userId = 'user-123'
    const entries = [
      { id: '1', user_id: userId, title: 'Entry A', content: 'Content', created_at: '2024-01-01' }
    ]

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })
    const mockBuilder = createBuilder({
      order: jest.fn().mockResolvedValue({ data: entries, error: null })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(getEntries()).resolves.toEqual(entries)

    expect(mockSupabase.from).toHaveBeenCalledWith('entries')
    expect(mockBuilder.eq).toHaveBeenCalledWith('user_id', userId)
    expect(mockBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('throws when no user session exists while fetching entries', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
    await expect(getEntries()).rejects.toThrow('User not authenticated')
    expect(mockSupabase.from).not.toHaveBeenCalled()
  })

  it('throws when Supabase returns an error while fetching entries', async () => {
    const userId = 'user-123'
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })

    const mockBuilder = createBuilder({
      order: jest.fn().mockResolvedValue({ data: null, error: new Error('DB failure') })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(getEntries()).rejects.toThrow('DB failure')
  })

  // ────────────────────────────────────────────────
  it('creates a new entry for the signed in user', async () => {
    const userId = 'user-789'
    const entryInput = { title: 'Hello', content: 'World' }
    const createdEntry = {
      id: '2',
      user_id: userId,
      title: `${entryInput.title}`,
      content: entryInput.content,
      created_at: new Date().toISOString()
    }

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })

    const mockBuilder = createBuilder({
      single: jest.fn().mockResolvedValue({ data: createdEntry, error: null })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(createEntry(entryInput as any)).resolves.toEqual(createdEntry)
    expect(mockBuilder.insert).toHaveBeenCalledTimes(1)

    const [payload] = mockBuilder.insert.mock.calls[0]
    expect(payload[0]).toMatchObject({
      user_id: userId,
      content: entryInput.content,
      title: `${entryInput.title}`
    })
    expect(payload[0].created_at).toEqual(expect.any(String))
  })

  it('throws when Supabase insert fails while creating entry', async () => {
    const userId = 'user-789'
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })

    const mockBuilder = createBuilder({
      single: jest.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(createEntry({ title: 'A', content: 'B' } as any)).rejects.toThrow('Insert failed')
  })

  // ────────────────────────────────────────────────
  it('deletes an entry by id', async () => {
    const deleted = [{ id: 'entry-1' }]
    const mockBuilder = createBuilder({
      eq: jest.fn().mockResolvedValue({ data: deleted, error: null })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(deleteEntry('entry-1')).resolves.toEqual(deleted)
    expect(mockSupabase.from).toHaveBeenCalledWith('entries')
    expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'entry-1')
  })

  it('throws when Supabase delete fails', async () => {
    const mockBuilder = createBuilder({
      eq: jest.fn().mockResolvedValue({ data: null, error: new Error('Delete failed') })
    })
    mockSupabase.from.mockReturnValue(mockBuilder)

    await expect(deleteEntry('entry-1')).rejects.toThrow('Delete failed')
  })
})
