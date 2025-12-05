export default function Hero() {
  return (
    <div
      id="home"
      className="relative z-10 flex justify-between items-center max-w-7xl mx-auto px-8 pt-20"
    >
      <div className="max-w-2xl">
        <h1 className="text-white text-6xl font-bold leading-tight drop-shadow-lg">
          Website <span className="block">GIS</span>{" "}
          <span className="block">Potensi</span>{" "}
          <span className="block">Pariwisata dan Ekonomi</span>{" "}
          <span className="block">Kabupaten Kulon Progo</span>{" "}
          <span className="block">(WebPotensi)</span>
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-xl">
        <p className="text-xl mb-6">
      Selamat datang di Web Potensi Kulon Progo, sistem berbasis Geographic Information System (GIS) 
      yang menghadirkan peta potensi pariwisata dan ekonomi lokal secara interaktif.
      Jelajahi keindahan pantai selatan, perbukitan Menoreh, air terjun alami, hingga desa wisata 
      yang menyimpan kearifan budaya dan keramahan masyarakat. 
      Kulon Progo bukan hanya destinasi wisata, tetapi juga pusat pertumbuhan ekonomi kreatif, UMKM unggulan, serta agribisnis.
        </p>
        <p className="text-xl">
          Dapatkan rekomendasi wisata, nyaman dengan mudah bersama kami! 🚀
        </p>
      </div>
    </div>
  );
}
