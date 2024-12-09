import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Users, FolderOpen } from "lucide-react";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to your workspace</h1>
            <p className="text-blue-100">Manage your workspace settings and access key features</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <CardTitle>Workspace Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Configure your workspace preferences and options</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle>Team Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage team members and their access levels</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              <CardTitle>Resources</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Access documentation and helpful resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Customize your workspace settings to match your preferences</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Invite team members to collaborate in your workspace</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>Explore available features and documentation</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceIdPage;