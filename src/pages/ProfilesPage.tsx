import { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { ProfileTable } from '@/components/ProfileTable'
import { useProfiles } from '#/hooks/useProfiles'
import type { Filters } from '#/hooks/useProfiles'
import { CreateProfileForm } from '@/components/CreateProfileForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '#/lib/api'

export function ProfilesPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 10 })
  const { data, isFetching } = useProfiles(filters)
  const response = data ?? {
    data: [],
    total: 0,
    total_pages: 0,
    page: 1,
    limit: 10,
    status: '',
    links: { self: '', next: null, prev: null },
  }

  const params = new URLSearchParams(
    Object.entries(filters).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value)
        return acc
      },
      {},
    ),
  )

  async function handleExport() {
    const res = await api.get(`/api/profiles/export?${params.toString()}`, {
      responseType: 'blob',
    })

    const disposition = res.headers['content-disposition'] ?? ''
    const filename = disposition.includes('filename=')
      ? disposition.split('filename=')[1].replace(/"/g, '').trim()
      : `profiles_${Date.now()}.csv`

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <div className="max-w-7xl">
        <h1 className="text-2xl font-semibold tracking-tight">Profiles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {response.total.toLocaleString()} profiles in the dataset.
        </p>

        <div
          className="mt-6 flex flex-wrap items-end gap-3 p-4 bg-muted border border-border"
          style={{ borderRadius: 4 }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Gender</label>
            <Select
              value={filters.gender ?? 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  gender: value === 'all' ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Country</label>
            <Input
              value={filters.country_id ?? ''}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  country_id: event.target.value.trim() || undefined,
                }))
              }
              placeholder="NG, US..."
              className="w-[140px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Age Group</label>
            <Select
              value={filters.age_group ?? 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  age_group: value === 'all' ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="teenager">Teenager</SelectItem>
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Sort By</label>
            <Select
              value={filters.sort_by ?? 'created_at'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sort_by: value }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="created_at">Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Order</label>
            <Select
              value={filters.order ?? 'desc'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, order: value }))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-3">
          <Button onClick={handleExport} className="h-9">
            Export CSV
          </Button>
        </div>
        <CreateProfileForm />

        <div className="mt-6">
          {isFetching ? (
            <p className="text-sm text-muted-foreground">Loading profiles...</p>
          ) : (
            <ProfileTable profiles={response.data} />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-muted-foreground">
            Page {response.page || filters.page || 1} of {response.total_pages}{' '}
            - {response.total.toLocaleString()} total profiles
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page ?? 1) - 1),
                }))
              }
              disabled={(filters.page ?? 1) <= 1 || isFetching}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.min(response.total_pages, (prev.page ?? 1) + 1),
                }))
              }
              disabled={
                (filters.page ?? 1) >= response.total_pages || isFetching
              }
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
