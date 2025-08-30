# Excel Veri Karşılaştırma Aracı

Bu uygulama, iki farklı Excel dosyası setindeki verileri, kullanıcı tarafından tanımlanan anahtar kolonlara göre eşleştirerek ve sayısal bir kolonu karşılaştırarak analiz etmeyi sağlayan web tabanlı bir araçtır. Özellikle stok yönetimi, fatura-irsaliye kontrolü, mutabakat gibi işlemlerde büyük kolaylık sağlar.

---

## İçindekiler

- [Ana Özellikler](#-ana-özellikler)
- [Bu Araç Ne İşe Yarar?](#-bu-araç-ne-i̇şe-yarar)
- [Nasıl Kullanılır?](#-nasıl-kullanılır)
  - [Adım 1: Dosyaları Yükleme](#adım-1-dosyaları-yükleme)
  - [Adım 2: Yapılandırma](#adım-2-yapılandırma)
  - [Adım 3: Sonuçları Analiz Etme](#adım-3-sonuçları-analiz-etme)
- [Yerel Geliştirme](#-yerel-geliştirme)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)

---

## 🌟 Ana Özellikler

- **📂 Çoklu Dosya Desteği:** Hem "Kaynak" hem de "Hedef" için birden fazla Excel dosyası (.xlsx, .xls) yükleyin.
- **👆 Sürükle ve Bırak:** Kolay ve hızlı dosya yüklemesi için modern sürükle-bırak arayüzü.
- **📄 Çalışma Sayfası Seçimi:** Her dosya için belirli bir çalışma sayfasını seçin veya tüm sayfaları tek seferde birleştirin.
- **🔗 Esnek Eşleştirme:**
  - Satırları eşleştirmek için birden fazla anahtar kolon çifti (örn: `Ürün Kodu` + `Sipariş No`) tanımlayın.
  - Karşılaştırılacak sayısal kolonları (örn: `Miktar`, `Tutar`) serbestçe seçin.
- **📊 Özelleştirilebilir Sonuçlar:** Sonuç tablosunda hangi kolonların gösterileceğini kendiniz belirleyin.
- **🔬 Gelişmiş Analiz Tablosu:**
  - **Durum Raporu:** Her satır için `Eşleşti`, `Kısmen Karşılandı` ve `Kaynakta Bulunamadı` durumları.
  - **İnteraktif Arayüz:** Anlık arama, sıralama ve sayfalama özellikleriyle verileri kolayca inceleyin.
  - **Hızlı Filtreleme:** Tek tıkla sadece belirli durumdaki sonuçları görüntüleyin.
- **⬇️ Excel'e Aktarma:** Analiz sonuçlarını `.xlsx` formatında tek tıkla indirin.
- **🌙 Modern Arayüz:** Kullanıcı dostu, duyarlı (responsive) ve karanlık mod desteği.

---

## 🤔 Bu Araç Ne İşe Yarar?

Farklı departmanlardan veya sistemlerden gelen, birbiriyle ilişkili ama farklı formatlardaki Excel listelerini karşılaştırmak için idealdir. Bazı kullanım senaryoları:

- **E-Ticaret:** Satış raporları ile iade faturalarını karşılaştırarak hangi ürünlerin ne kadar iade edildiğini bulma.
- **Stok Yönetimi:** Depo sayım sonuçları ile sistemdeki stok kayıtlarını karşılaştırarak farkları tespit etme.
- **Muhasebe:** Müşteri faturaları ile yapılan ödemeleri (banka ekstreleri) eşleştirerek borç-alacak takibi yapma (mutabakat).
- **Lojistik:** Sevk irsaliyeleri ile teslimat raporlarını karşılaştırarak eksik veya fazla teslimatları bulma.

---

## 🚀 Nasıl Kullanılır?

Uygulama üç basit adımdan oluşur:

### Adım 1: Dosyaları Yükleme

1.  **Kaynak:** Karşılaştırmanın temelini oluşturan verilerdir (örn: eldeki stoklar, kesilen faturalar).
2.  **Hedef:** Kontrol edilmesi gereken verilerdir (örn: gelen siparişler, iade irsaliyeleri).
3.  Dosyaları ilgili kutucuklara yükleyin. İsterseniz birden fazla dosya ekleyebilirsiniz; veriler otomatik olarak birleştirilir.
4.  Eğer Excel dosyanızda birden fazla sayfa varsa, ilgili çalışma sayfasını seçin veya hepsini kullanmak için "Tüm Sayfalar" seçeneğini bırakın.
5.  **"İleri"** butonuna tıklayarak sonraki adıma geçin.

### Adım 2: Yapılandırma

Bu adımda, uygulamanın verileri nasıl eşleştireceğini ve karşılaştıracağını belirlersiniz.

1.  **Anahtar Kolon Eşleştirmesi:**
    - Kaynak ve Hedef'teki hangi kolonların birbiriyle eş olduğunu belirtin. Bu, "Fatura No" ile "İrsaliye No" gibi farklı isimdeki ama aynı veriyi içeren kolonlar olabilir.
    - Gerekirse, **"+ Eşleşme Ekle"** butonuyla daha güvenilir bir eşleştirme için birden fazla anahtar (örn: `Ürün Kodu` + `Depo Kodu`) ekleyebilirsiniz.

2.  **Karşılaştırma Kolonu (Sayısal):**
    - Hangi sayısal değerlerin karşılaştırılacağını seçin. Örneğin, Hedef'teki `İade Adedi`'nin, Kaynak'taki `Satış Miktarı` ile karşılaştırılması.

3.  **Sonuç Tablosu Kolonları:** 
    - Sonuç ekranında görmek istediğiniz ek bilgi kolonlarını seçin. Anahtar olarak seçilen kolonlar varsayılan olarak eklenir.

4.  Yapılandırmayı tamamladıktan sonra **"Karşılaştırmayı Başlat"** butonuna tıklayın.

### Adım 3: Sonuçları Analiz Etme

Karşılaştırma sonuçları, gelişmiş özelliklere sahip bir tabloda sunulur:

- **Arama:** Tablonun üzerindeki arama kutusuna yazarak tüm sonuçlar içinde anlık filtreleme yapın.
- **Sıralama:** Kolon başlıklarına tıklayarak verileri artan/azalan şekilde sıralayın.
- **Filtreleme:** **Durum Filtresi** butonları ile sadece `Eşleşti` veya `Kısmen Karşılandı` gibi belirli sonuçları görün.
- **İndirme:** **"Excel Olarak İndir"** butonuyla o anki tablo görünümünü (filtrelenmiş ve sıralanmış haliyle) bilgisayarınıza indirin.
- **Gezinme:** **"Geri"** butonuyla yapılandırmayı değiştirebilir veya **"Baştan Başla"** ile tüm süreci sıfırlayabilirsiniz.

---

## 💻 Yerel Geliştirme

Projeyi kendi bilgisayarınızda çalıştırmak için:

1.  **Depoyu klonlayın:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama genellikle `http://localhost:5173` adresinde çalışmaya başlayacaktır.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React, TypeScript
- **Stil:** Tailwind CSS
- **Excel İşlemleri:** SheetJS (xlsx)
- **İkonlar:** Font Awesome
- **Build Aracı:** Vite
