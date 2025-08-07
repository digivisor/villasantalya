"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  User,
  Eye,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation'
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Header from "@/components/Header"
import ReactMarkdown from 'react-markdown'

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content?: string
  date: string
  author: string
  image: string
  tags: string[]
  category: string
  isActive?: boolean
  comments?: number
  views?: number
  slug: string
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/blogs`
    : "http://localhost:5000/api/blogs"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { slug } = params

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Tüm yazıları çek
        const resAll = await fetch(API_URL)
        const all = await resAll.json()
        setAllPosts(all)

        // Detay yazısını çek
        const res = await fetch(`${API_URL}/${slug}`)
        if (!res.ok) throw new Error("Blog bulunamadı")
        const data = await res.json()
        setPost(data)

        // İlgili yazılar
        const related = all
          .filter((p: BlogPost) => p.slug !== slug && (p.category === data.category || p.tags.some((t: string) => data.tags.includes(t))))
          .slice(0, 3)
        setRelatedPosts(related)

        // Önceki/sonraki yazılar (tarihe göre)
        const sorted = all
          .filter((p: BlogPost) => p.isActive !== false)
          .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const currentIndex = sorted.findIndex((p: BlogPost) => p.slug === slug)
        setNextPost(currentIndex > 0 ? sorted[currentIndex - 1] : null)
        setPrevPost(currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null)
      } catch (err) {
        router.push('/blog')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchData()
  }, [slug, router])

  if (loading) return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="text-xl text-gray-600">Yükleniyor...</div>
    </div>
  )
  if (!post) return null

  // Markdown içeriği HTML'e çevir (kısaca)
  const renderContent = (content: string) => {
    if (!content) return null
    content = content.replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    content = content.replace(/- (.*)/g, '<li class="ml-4 mb-1">• $1</li>')
    const paragraphs = content.split('\n\n')
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('<h2')) {
        return <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      } else if (paragraph.includes('<li')) {
        return (
          <ul key={index} className="my-4">
            <div dangerouslySetInnerHTML={{ __html: paragraph }} />
          </ul>
        )
      } else if (paragraph.trim()) {
        return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
      }
      return null
    })
  }
const getImageUrl = (imagePath: string) => {
  if (!imagePath.startsWith('http')) {
    return `https://api.villasantalya.com${imagePath}`;
  }
  return imagePath;
}
const formatToDayMonthYear = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0-indexli!
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <div className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-8">
            <Link href="/" className="hover:text-orange-500">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-orange-500">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[150px] md:max-w-[300px]">{post.title}</span>
          </div>
          {/* Blog Hero */}
          <div className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-xl md:rounded-3xl overflow-hidden mb-6 md:mb-12">
            <Image
              src={getImageUrl(post.image)}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            <div className="absolute top-3 md:top-6 left-3 md:left-6">
              <div className="bg-orange-500 text-white px-2 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                {post.category}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
              <div className="max-w-4xl">
                <div className="text-orange-500 text-xs md:text-sm font-semibold mb-1 md:mb-2 tracking-wider uppercase">
                  {formatToDayMonthYear(post.date)}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 md:mb-4 line-clamp-3">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/80 text-xs md:text-base">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatToDayMonthYear(post.date)}</span>
                  </div>
                  {post.comments && (
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{post.comments} yorum</span>
                    </div>
                  )}
                  {post.views && (
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{post.views} görüntüleme</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-md">
                {/* Content */}
                <div className="prose max-w-none text-sm md:text-base">
  <ReactMarkdown>{post.content || ''}</ReactMarkdown>
</div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                  {post.tags.map((tag, tagIndex) => (
                    <Link
                      href={`/blog?tag=${tag}`}
                      key={tagIndex}
                      className="bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                {/* Share */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                  <div className="text-gray-600 font-semibold text-sm md:text-base">Bu yazıyı paylaş:</div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" className="rounded-full text-blue-600 hover:bg-blue-50 h-8 w-8 md:h-10 md:w-10">
                      <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-sky-500 hover:bg-sky-50 h-8 w-8 md:h-10 md:w-10">
                      <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50 h-8 w-8 md:h-10 md:w-10">
                      <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-pink-600 hover:bg-pink-50 h-8 w-8 md:h-10 md:w-10">
                      <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </div>
                </div>
              </article>
              {/* Next/Prev Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                {prevPost && (
                  <Link href={`/blog/${prevPost.slug}`}>
                    <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md flex items-center space-x-3 md:space-x-4 hover:shadow-lg transition-shadow group">
                      <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <div>
                        <div className="text-xs md:text-sm text-gray-500 mb-1">Önceki Yazı</div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm md:text-base line-clamp-1">{prevPost.title}</h3>
                      </div>
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`}>
                    <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md flex items-center justify-end space-x-3 md:space-x-4 hover:shadow-lg transition-shadow group">
                      <div className="text-right">
                        <div className="text-xs md:text-sm text-gray-500 mb-1">Sonraki Yazı</div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm md:text-base line-clamp-1">{nextPost.title}</h3>
                      </div>
                      <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* Related Posts */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">İlgili Yazılar</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? relatedPosts.map((relatedPost) => (
                    <Link href={`/blog/${relatedPost.slug}`} key={relatedPost._id}>
                      <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={getImageUrl(relatedPost.image) || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-orange-500 text-xs font-semibold mb-1 tracking-wider uppercase">
                            {relatedPost.date}
                          </div>
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-gray-500 text-center py-4 text-sm">İlgili yazı bulunamadı</p>
                  )}
                </div>
              </div>
              {/* Tags */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link
                      href={`/blog?tag=${tag}`}
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Share */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Paylaş</h3>
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex-1 h-10 md:h-12">
                    <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-sky-500 hover:bg-sky-50 hover:text-sky-600 flex-1 h-10 md:h-12">
                    <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-pink-600 hover:bg-pink-50 hover:text-pink-700 flex-1 h-10 md:h-12">
                    <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-green-600 hover:bg-green-50 hover:text-green-700 flex-1 h-10 md:h-12">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}