import { Building, Users, Star, Award } from "lucide-react"

const stats = [
  {
    icon: Building,
    number: "2M+",
    label: "Emlak Portföyü",
    description: "Geniş villa ve emlak seçenekleri",
  },
  {
    icon: Users,
    number: "46,789",
    label: "Mutlu Müşteri",
    description: "Memnun müşteri sayımız",
  },
  {
    icon: Star,
    number: "4.8",
    label: "Müşteri Puanı",
    description: "5 üzerinden ortalama puan",
  },
  {
    icon: Award,
    number: "15+",
    label: "Yıllık Deneyim",
    description: "Sektördeki tecrübemiz",
  },
]

export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">BAŞARILARIMIZ</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Rakamlarla VillasAntalya</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
