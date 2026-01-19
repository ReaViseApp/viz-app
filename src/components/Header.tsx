import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShieldAvatar } from "./ShieldAvatar"
import { RegistrationModal } from "./RegistrationModal"
import { LoginModal } from "./LoginModal"
import { NotificationBell } from "./NotificationBell"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { MagnifyingGlass, X, Clock, TrendUp } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

interface Post {
  id: string
  userId?: string
  username?: string
  author?: {
    username: string
    avatar: string
    id?: string
  }
  title?: string
  caption?: string
  hashtags?: string[]
  [key: string]: any
}

interface HeaderProps {
  onNavigateToProfile?: () => void
  onNavigateToSettings?: () => void
  onNavigateToHome?: () => void
  onSearch?: (results: SearchResult[]) => void
}

interface SearchResult {
  type: "hashtag" | "user" | "post"
  id: string
  label: string
  username?: string
  avatar?: string
  hashtag?: string
  postId?: string
}

export function Header({ onNavigateToProfile, onNavigateToSettings, onNavigateToHome, onSearch }: HeaderProps) {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useKV<User | null>("viz-current-user", null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allUsers] = useKV<User[]>("viz-users", [])
  const [allPosts] = useKV<Post[]>("viz-posts", [])
  const [searchHistory, setSearchHistory] = useKV<SearchResult[]>("viz-search-history", [])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getTrendingHashtags = (): SearchResult[] => {
    const hashtagCount = new Map<string, number>()
    
    allPosts?.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => {
          const cleanTag = tag.replace("#", "").toLowerCase()
          hashtagCount.set(cleanTag, (hashtagCount.get(cleanTag) || 0) + 1)
        })
      }
    })

    const sorted = Array.from(hashtagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({
        type: "hashtag" as const,
        id: tag,
        label: `#${tag}`,
        hashtag: tag,
        count,
      }))

    return sorted
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const results: SearchResult[] = []

    if (query.startsWith("#")) {
      const hashtagQuery = query.slice(1)
      const hashtagSet = new Set<string>()
      
      allPosts?.forEach(post => {
        if (post.hashtags) {
          post.hashtags.forEach(tag => {
            const cleanTag = tag.replace("#", "").toLowerCase()
            if (cleanTag.includes(hashtagQuery)) {
              hashtagSet.add(cleanTag)
            }
          })
        }
      })

      hashtagSet.forEach(tag => {
        results.push({
          type: "hashtag",
          id: tag,
          label: `#${tag}`,
          hashtag: tag,
        })
      })
    } else if (query.startsWith("@")) {
      const usernameQuery = query.slice(1)
      
      allUsers?.forEach(user => {
        if (user.username.toLowerCase().includes(usernameQuery)) {
          results.push({
            type: "user",
            id: user.vizBizId,
            label: user.username,
            username: user.username,
            avatar: user.avatar,
          })
        }
      })
    } else {
      allUsers?.forEach(user => {
        if (user.username.toLowerCase().includes(query)) {
          results.push({
            type: "user",
            id: user.vizBizId,
            label: user.username,
            username: user.username,
            avatar: user.avatar,
          })
        }
      })

      const hashtagSet = new Set<string>()
      allPosts?.forEach(post => {
        if (post.hashtags) {
          post.hashtags.forEach(tag => {
            const cleanTag = tag.replace("#", "").toLowerCase()
            if (cleanTag.includes(query)) {
              hashtagSet.add(cleanTag)
            }
          })
        }
      })

      hashtagSet.forEach(tag => {
        results.push({
          type: "hashtag",
          id: tag,
          label: `#${tag}`,
          hashtag: tag,
        })
      })
    }

    setSearchResults(results.slice(0, 10))
    setShowResults(results.length > 0)
  }, [searchQuery, allUsers, allPosts])

  const handleLogout = () => {
    setCurrentUser(null)
    toast.success("You've been logged out")
  }

  const handleProfileClick = () => {
    onNavigateToProfile?.()
  }

  const handleLogoClick = () => {
    onNavigateToHome?.()
  }

  const handleSearchResultClick = (result: SearchResult) => {
    setShowResults(false)
    setShowSuggestions(false)
    setSearchQuery("")
    
    setSearchHistory((currentHistory) => {
      const history = currentHistory || []
      const filtered = history.filter(
        item => !(item.type === result.type && item.id === result.id)
      )
      return [result, ...filtered].slice(0, 10)
    })
    
    if (result.type === "hashtag") {
      const postsWithHashtag = allPosts?.filter(post => {
        const postHashtags = post.hashtags || []
        const captionHashtags = (post.caption?.match(/#\w+/g) || []).map(h => h.replace("#", ""))
        const allHashtags = [...postHashtags, ...captionHashtags]
        return allHashtags.some(tag => tag.replace("#", "").toLowerCase() === result.hashtag)
      }) || []
      onSearch?.(postsWithHashtag.map(p => ({ ...result, postId: p.id })))
      toast.success(`Found ${postsWithHashtag.length} posts with #${result.hashtag}`)
    } else if (result.type === "user") {
      const userPosts = allPosts?.filter(post => {
        const postUsername = post.author?.username || post.username
        return postUsername?.toLowerCase() === result.username?.toLowerCase()
      }) || []
      onSearch?.([result])
      toast.success(`Viewing posts from @${result.username}`)
    }
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    setShowSuggestions(false)
    toast.success("Search history cleared")
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    setShowSuggestions(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-3 px-4">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-foreground">Viz.</h1>
          </button>

          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <MagnifyingGlass 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                size={18}
                weight="bold"
              />
              <Input
                type="text"
                placeholder="Search by @username or #hashtag"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowResults(true)
                  } else {
                    setShowSuggestions(true)
                  }
                }}
                className="pl-10 pr-10 h-9 bg-muted/50 border-border focus-visible:ring-primary text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                  >
                    {result.type === "user" && result.avatar && (
                      <ShieldAvatar src={result.avatar} alt={result.username || ""} size="small" />
                    )}
                    {result.type === "hashtag" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">#</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {result.type === "user" ? `@${result.label}` : result.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.type === "user" ? "User" : "Hashtag"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && !searchQuery && (!searchHistory || searchHistory.length === 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">🔥 Trending Hashtags</h3>
                  </div>
                </div>
                {getTrendingHashtags().length > 0 ? (
                  <div>
                    {getTrendingHashtags().map((result, index) => (
                      <button
                        key={`trending-${result.id}-${index}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                      >
                        <TrendUp size={18} className="text-primary flex-shrink-0" weight="bold" />
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">#</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{result.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No trending hashtags yet
                  </div>
                )}
              </div>
            )}

            {showSuggestions && !searchQuery && searchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                <div className="px-4 py-2 border-b border-border sticky top-0 bg-background z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Recent Searches</h3>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-primary hover:text-accent transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                {searchHistory.map((result, index) => (
                  <button
                    key={`history-${result.type}-${result.id}-${index}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left group"
                  >
                    <Clock size={18} className="text-muted-foreground flex-shrink-0" weight="bold" />
                    {result.type === "user" && result.avatar && (
                      <ShieldAvatar src={result.avatar} alt={result.username || ""} size="small" />
                    )}
                    {result.type === "hashtag" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">#</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {result.type === "user" ? `@${result.label}` : result.label}
                      </div>
                    </div>
                  </button>
                ))}
                
                {getTrendingHashtags().length > 0 && (
                  <>
                    <div className="px-4 py-2 border-t border-border mt-2">
                      <h3 className="text-sm font-semibold text-foreground">🔥 Trending Hashtags</h3>
                    </div>
                    {getTrendingHashtags().map((result, index) => (
                      <button
                        key={`trending-${result.id}-${index}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                      >
                        <TrendUp size={18} className="text-primary flex-shrink-0" weight="bold" />
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">#</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{result.label}</div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          
          {!currentUser ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLogin(true)}
                className="border-primary text-primary hover:bg-primary/10 text-xs md:text-sm"
              >
                Log In
              </Button>
              <Button 
                size="sm"
                onClick={() => setShowRegistration(true)}
                className="bg-primary text-primary-foreground hover:bg-accent text-xs md:text-sm whitespace-nowrap"
              >
                Sign Up for Viz.
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <ShieldAvatar 
                      src={currentUser.avatar} 
                      alt={currentUser.username}
                      size="small"
                    />
                    <span className="font-bold text-sm hidden md:inline">{currentUser.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 bg-background shadow-[0_4px_12px_rgba(255,182,193,0.2)]"
                >
                  <DropdownMenuItem onClick={handleProfileClick}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigateToSettings?.()}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      <RegistrationModal
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onRegistrationSuccess={(user) => setCurrentUser(user)}
      />

      <LoginModal
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  )
}
