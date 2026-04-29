import { Link } from 'react-router-dom'
import type { Profile } from '#/functions/profiles'

export function ProfileTable({ profiles }: { profiles: Profile[] }) {
  return (
    <div
      className="border border-border overflow-x-auto"
      style={{ borderRadius: 4 }}
    >
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-foreground text-background text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Gender</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">Age Group</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p, i) => (
            <tr
              key={p.id}
              className={`border-t border-border ${i % 2 === 1 ? 'bg-muted' : 'bg-background'}`}
            >
              <td className="px-4 py-3">
                <Link
                  to={`/profiles/${p.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{p.gender}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.age}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {p.country_id}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{p.age_group}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
