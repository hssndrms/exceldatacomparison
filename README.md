# Excel Veri Karşılaştırma Aracı

Bu uygulama, iki farklı Excel dosyası setindeki verileri, kullanıcı tarafından tanımlanan anahtar kolonlara göre eşleştirerek ve sayısal bir kolonu karşılaştırarak analiz etmeyi sağlayan web tabanlı bir araçtır. Özellikle stok yönetimi, fatura-irsaliye kontrolü, mutabakat gibi işlemlerde büyük kolaylık sağlar.

## 🌟 Temel Özellikler

- **Çoklu Dosya Yükleme:** Hem "Kaynak" hem de "Hedef" için birden fazla Excel dosyası (.xlsx, .xls) yüklenebilir.
- **Sürükle ve Bırak:** Kolay dosya yüklemesi için sürükle-bırak desteği.
- **Çalışma Sayfası Seçimi:** Yüklenen her Excel dosyası için belirli bir çalışma sayfasını seçme veya tüm sayfaları birleştirme imkanı.
- **Esnek Yapılandırma:**
  - **Çoklu Anahtar Eşleştirme:** Satırları eşleştirmek için birden fazla anahtar kolon çifti (örn: `Ürün Kodu` ve `Sipariş No`) tanımlayabilme.
  - **Sayısal Karşılaştırma:** Hedefteki bir değeri (örn: talep edilen miktar), kaynaktaki değerlerle (örn: stok miktarı) karşılaştırmak için sayısal kolonları seçebilme.
  - **Özelleştirilebilir Sonuç Kolonları:** Sonuç tablosunda hangi kolonların gösterileceğini seçme imkanı.
- **Gelişmiş Sonuç Analizi:**
  - **Detaylı Durum Raporu:** Her satır için `Eşleşti`, `Kısmen Karşılandı` ve `Kaynakta Bulunamadı` gibi durum etiketleri.
  - **İnteraktif Sonuç Tablosu:** Sıralama, anlık arama (filtreleme) ve sayfalama özellikleriyle donatılmış dinamik tablo.
  - **Durum Filtreleri:** Sadece belirli durumdaki (örn: "Kısmen Karşılandı") sonuçları görmek için tek tıkla filtreleme.
- **Excel'e Aktarma:** Analiz sonuçlarını `.xlsx` formatında bilgisayarınıza indirebilme.
- **Modern Arayüz:** Kullanıcı dostu, duyarlı (responsive) ve karanlık mod desteğine sahip bir arayüz.

---

## 🚀 Nasıl Kullanılır?

Uygulama üç basit adımdan oluşur:

### Adım 1: Excel Dosyalarını Yükleme

1.  **Kaynak:** Karşılaştırmanın temelini oluşturan verileri içerir (örn: eldeki stokları veya kesilen faturaları içeren dosyalar).
2.  **Hedef:** Karşılanması veya kontrol edilmesi gereken verileri içerir (örn: gelen siparişleri veya iade irsaliyelerini içeren dosyalar).
3.  Dosyalarınızı ilgili kutucuklara sürükleyip bırakın veya tıklayarak seçin.
4.  Birden fazla dosya yükleyebilirsiniz. Veriler otomatik olarak birleştirilecektir.
5.  Dosya yüklendikten sonra, eğer dosyada birden fazla sayfa varsa, ilgili çalışma sayfasını seçin veya tüm sayfaları birleştirmek için "Tüm Sayfalar"ı seçin.
6.  Gerekli dosyaları yükledikten sonra **"İleri"** butonuna tıklayın.

### Adım 2: Karşılaştırmayı Yapılandırma

Bu adımda, uygulamanın verileri nasıl eşleştireceğini ve karşılaştıracağını tanımlarsınız.

1.  **Anahtar Kolon Eşleştirmesi:**
    - Kaynak ve Hedef dosyalarındaki hangi kolonların eşleştirileceğini seçin. Bu, bir satırın diğerindeki karşılığını bulmak için kullanılır.
    - Örneğin, Kaynak'taki `FaturaNo` ile Hedef'teki `İrsaliyeNo` eşleştirilebilir.
    - Gerekirse, **"+ Eşleşme Ekle"** butonuyla daha karmaşık eşleştirmeler için birden fazla anahtar (örn: hem `Ürün Kodu` hem de `Depo Kodu`) ekleyebilirsiniz.

2.  **Karşılaştırma Kolonu (Sayısal):**
    - Hedefteki hangi sayısal değerin, kaynaktaki hangi sayısal değerle karşılanacağını seçin.
    - Örneğin, Hedef'teki `İade Adedi`'nin, Kaynak'taki `Satış Miktarı`'ndan düşülerek kontrol edilmesi.

3.  **Sonuç Tablosu Kolonları:**
    - Sonuç ekranında görmek istediğiniz ek bilgi kolonlarını seçin.
    - Anahtar olarak seçtiğiniz kolonlar otomatik olarak seçilir ve kilitlenir.
    - Seçilen kolonlar, alt bölümde etiketler halinde gösterilir. Anahtar olmayan kolonları etiketlerin yanındaki "x" ikonuna basarak kolayca kaldırabilirsiniz.

4.  Yapılandırmayı tamamladıktan sonra **"Karşılaştırmayı Başlat"** butonuna tıklayın.

### Adım 3: Sonuçları Analiz Etme

Karşılaştırma tamamlandığında sonuçlar interaktif bir tabloda sunulur:

- **Durum Kolonu:** Her bir eşleşmenin sonucunu gösterir:
  - **Eşleşti:** Hedef miktar, kaynak tarafından tam olarak karşılandı.
  - **Kısmen Karşılandı:** Kaynaktaki miktar, hedefi karşılamaya yetmedi.
  - **Kaynakta Bulunamadı:** Hedefteki anahtar, kaynak verilerinde hiç bulunamadı.
- **Filtreleme ve Sıralama:**
  - Arama kutusunu kullanarak tüm tabloda anlık arama yapabilirsiniz.
  - Kolon başlıklarına tıklayarak verileri artan/azalan şekilde sıralayabilirsiniz.
  - **Durum Filtresi** butonlarını kullanarak sonuçları duruma göre filtreleyebilirsiniz.
- **Dışa Aktarma:** **"Excel Olarak İndir"** butonuyla filtrelenmiş ve sıralanmış güncel tabloyu bilgisayarınıza indirebilirsiniz.
- **Geri Dön & Yeniden Başla:** **"Geri"** butonuyla yapılandırmayı değiştirebilir veya **"Baştan Başla"** ile tüm süreci sıfırlayabilirsiniz.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com/)
- **Excel İşlemleri:**
  - [SheetJS (xlsx)](https://sheetjs.com/)
- **İkonlar:**
  - [Font Awesome](https://fontawesome.com/)
- **Benzersiz ID:**
  - [uuid](https://www.npmjs.com/package/uuid)
