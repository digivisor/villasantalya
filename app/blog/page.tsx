"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  User,
  TagIcon,
  MessageCircle,
  Eye,
  ArrowRight,
  Search
} from "lucide-react"
import Image from "next/image"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Link from "next/link"
import Header from "@/components/Header"

// Blog post veri tipi
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

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // API'den blogları çek
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
        const res = await fetch(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error("Bloglar alınamadı")
        const blogs = await res.json()
        setBlogPosts(Array.isArray(blogs) ? blogs : [])
      } catch (err) {
        setBlogPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])
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
  // Filtreleme işlevi
  const filteredPosts = blogPosts
    .filter(post => post.isActive !== false)
    .filter(post => {
      const matchesSearch = searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === null || post.category === selectedCategory
      const matchesTag = selectedTag === null || post.tags.includes(selectedTag)
      return matchesSearch && matchesCategory && matchesTag
    })

  // Benzersiz kategoriler ve etiketler
  const categories = Array.from(new Set(blogPosts.map(post => post.category)))
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)))

  // Son yazılar
  const recentPosts = blogPosts
    .filter(post => post.isActive !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(post => ({
      _id: post._id,
      title: post.title,
      date: post.date,
      image: post.image,
      slug: post.slug
    }))

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      {/* Hero Section */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image src="/about-hero-bg.jpg" alt="Blog Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Emlak Blogumuz</h1>
              <p className="text-base md:text-xl max-w-2xl mb-4 md:mb-6">Gayrimenkul dünyasındaki son gelişmeler, yatırım tavsiyeleri, tasarım fikirleri ve daha fazlası</p>
              <div className="flex items-center space-x-2 text-sm md:text-lg">
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Ana Sayfa
                </Link>
                <span>-</span>
                <span className="text-orange-500">Blog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Kategori Filtreleri */}
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={`text-xs md:text-sm ${selectedCategory === null ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                  size="sm"
                >
                  Tümü
                </Button>
                {categories.map((category, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`text-xs md:text-sm ${selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sonuç Sayısı */}
              <div className="text-gray-600 mb-6 md:mb-8 text-sm">
                {isLoading ? "Yükleniyor..." :
                  <>
                    {filteredPosts.length} yazı bulundu
                    {selectedCategory && <span> / Kategori: <span className="font-medium">{selectedCategory}</span></span>}
                    {selectedTag && <span> / Etiket: <span className="font-medium">#{selectedTag}</span></span>}
                    {searchTerm && <span> / Arama: <span className="font-medium">"{searchTerm}"</span></span>}
                    {(selectedCategory || selectedTag || searchTerm) && (
                      <button
                        onClick={() => {
                          setSelectedCategory(null)
                          setSelectedTag(null)
                          setSearchTerm("")
                        }}
                        className="ml-2 text-orange-500 hover:underline"
                      >
                        Filtreleri Temizle
                      </button>
                    )}
                  </>
                }
              </div>

              {/* Blog Posts */}
              <div className="grid gap-6 md:gap-8">
                {isLoading ? (
                  <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-3xl text-center">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Yazılar Yükleniyor...</h3>
                  </div>
                ) : filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                  <article
                    key={post._id}
                    className={`bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      index === 0 && !selectedCategory && !selectedTag && !searchTerm ? "lg:col-span-2" : ""
                    }`}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                      <Image
                        src={getImageUrl(post.image) || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />

                      {/* Category Tag */}
                      <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-orange-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                        {post.category}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-4 md:p-8">
                      {/* Date */}
                      <div className="text-orange-500 text-xs md:text-sm font-semibold mb-2 md:mb-4 tracking-wider uppercase">
                        {formatToDayMonthYear(post.date)}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6">{post.excerpt}</p>

                      {/* Meta Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{formatToDayMonthYear(post.date)}</span>
                          </div>
                          {post.comments && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{post.comments}</span>
                            </div>
                          )}
                          {post.views && (
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{post.views}</span>
                            </div>
                          )}
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-0 h-auto text-xs md:text-sm font-semibold"
                          >
                            Devamını Oku
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                          </Button>
                        </Link>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            onClick={() => setSelectedTag(tag)}
                            className="bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs hover:bg-orange-100 hover:text-orange-600 transition-colors duration-300 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-3xl text-center">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Aradığınız kriterlere uygun yazı bulunamadı</h3>
                    <p className="text-gray-600 mb-4">Farklı anahtar kelimeler deneyebilir veya filtreleri kaldırabilirsiniz</p>
                    <Button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedTag(null)
                        setSearchTerm("")
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Tüm Yazıları Göster
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* Search */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <div className="relative">
                  <Input
                    placeholder="Anahtar Kelime Girin"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 pr-10 md:pr-12 text-sm"
                  />
                  <Button
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 md:h-8 md:w-8 p-0 bg-orange-500 hover:bg-orange-600 rounded-md md:rounded-lg"
                  >
                    <Search className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Kategoriler</h3>
                <div className="space-y-2 md:space-y-3">
                  {categories.map((category, idx) => {
                    const count = blogPosts.filter(post => post.category === category && post.isActive !== false).length
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group"
                      >
                        <span className="font-medium text-gray-700 text-sm md:text-base group-hover:text-orange-500">{category}</span>
                        <span className="bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs">
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Son Yazılar</h3>
                <div className="space-y-3 md:space-y-4">
                  {recentPosts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post._id}>
                      <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={getImageUrl(post.image) || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-orange-500 text-xs font-semibold mb-1 tracking-wider uppercase">
                            {formatToDayMonthYear(post.date)}
                          </div>
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors duration-300 ${
                        selectedTag === tag 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Instagram</h3>
                <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                  {blogPosts.slice(0, 6).map((post, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                    >
                      <Image
                        src={getImageUrl(post.image) || "/placeholder.svg"}
                        alt={`Instagram ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  )
}