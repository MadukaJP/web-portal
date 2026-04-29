export const keys = {
  me: () => ['me'] as const,
  profiles: (filters?: object) => ['profiles', filters] as const,
  profile: (id: string) => ['profile', id] as const,
  search: (q: string, page = 1) => ['search', q, page] as const,
}
