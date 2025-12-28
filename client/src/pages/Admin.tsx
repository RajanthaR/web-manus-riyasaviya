import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Car,
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Database,
  Users,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: chatSessions, isLoading: sessionsLoading } = trpc.admin.getChatSessions.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: chatMessages, isLoading: messagesLoading } = trpc.admin.getChatMessages.useQuery(
    { sessionId: selectedSession || "" },
    { enabled: !!selectedSession && isAuthenticated && user?.role === "admin" }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Admin dashboard එකට පිවිසීමට login වන්න
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              ඔබට admin privileges නැත
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                මුල් පිටුවට
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">RiyaSaviya</span>
              <Badge variant="secondary">Admin</Badge>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Site එකට
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats?.totalListings || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Listings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats?.goodDeals || 0}</p>
                      <p className="text-sm text-muted-foreground">Good Deals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats?.totalModels || 0}</p>
                      <p className="text-sm text-muted-foreground">Vehicle Models</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats?.totalChats || 0}</p>
                      <p className="text-sm text-muted-foreground">Chat Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chats" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chats" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Sessions
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              Data Overview
            </TabsTrigger>
          </TabsList>

          {/* Chat Sessions Tab */}
          <TabsContent value="chats">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Sessions List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Chat Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {sessionsLoading ? (
                      <div className="p-4 space-y-2">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                      </div>
                    ) : chatSessions && chatSessions.length > 0 ? (
                      <div className="divide-y">
                        {chatSessions.map((session) => (
                          <button
                            key={session.sessionId}
                            onClick={() => setSelectedSession(session.sessionId)}
                            className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                              selectedSession === session.sessionId ? "bg-muted" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-muted-foreground">
                                {session.sessionId.slice(0, 8)}...
                              </span>
                              <Badge variant="secondary">{session.messageCount} msgs</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(session.lastMessage).toLocaleString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No chat sessions yet
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Messages View */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedSession ? `Session: ${selectedSession.slice(0, 8)}...` : "Select a session"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[450px]">
                    {!selectedSession ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a chat session to view messages
                      </div>
                    ) : messagesLoading ? (
                      <div className="space-y-4">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-16 w-3/4" />
                          ))}
                      </div>
                    ) : chatMessages && chatMessages.length > 0 ? (
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No messages in this session
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Overview Tab */}
          <TabsContent value="data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Listings by Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Toyota Vitz", "Suzuki Wagon R", "Honda Vezel", "Toyota Axio"].map(
                      (model) => (
                        <div key={model} className="flex items-center justify-between">
                          <span>{model}</span>
                          <Badge variant="outline">View listings</Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Riyasewana</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Ikman.lk</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" disabled>
                      <Database className="h-4 w-4 mr-2" />
                      Refresh Data (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recalculate Prices (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
