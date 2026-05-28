import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Users, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Users className="text-primary" /> Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="ks-card p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-primary mb-2">{users.length}</div>
            <div className="text-muted-foreground font-medium">Total Registered Users</div>
          </div>
        </div>

        <div className="ks-card overflow-hidden">
          <h2 className="text-lg font-medium p-4 border-b">User Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{user.full_name || "Unknown"}</td>
                      <td className="px-4 py-3 flex items-center gap-2"><Phone size={14} className="text-muted-foreground"/> {user.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-muted-foreground"/>
                          {user.district || user.state ? `${user.district || ''}, ${user.state || ''}` : "Not specified"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
