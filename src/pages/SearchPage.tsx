import { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { ProfileTable } from '@/components/ProfileTable'
import { useSearch } from '#/hooks/useSearch'

export function SearchPage() {
  const [query, setQuery] = useState('young males from Nigeria')
  const [submitted, setSubmitted] = useState('young males from Nigeria')
  const { data, isLoading } = useSearch(submitted, 1)

  return (
    <AppShell>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1 text-center">
          Query the profile dataset in natural language.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(query)
          }}
          className="mt-6 flex gap-2 max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search profiles in natural language e.g. young males from Nigeria"
            className="flex-1 h-11 px-4 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-foreground"
            style={{ borderRadius: 4 }}
          />
          <button
            type="submit"
            className="h-11 px-6 text-sm font-medium bg-foreground text-background hover:opacity-90"
            style={{ borderRadius: 4 }}
          >
            Search
          </button>
        </form>

        {submitted && (
          <div className="mt-8">
            <span
              className="inline-block text-xs text-muted-foreground bg-muted border border-border px-2.5 py-1"
              style={{ borderRadius: 4 }}
            >
              Showing results for "{submitted}"
            </span>
            <div className="mt-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading search results...
                </p>
              ) : (
                <ProfileTable profiles={data?.data ?? []} />
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
