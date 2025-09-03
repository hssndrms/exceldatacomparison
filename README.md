# Excel Veri Karşılaştırma Aracı - Kullanıcı Kılavuzu

Bu uygulama, iki farklı Excel dosyası setindeki verileri, kullanıcı tarafından tanımlanan anahtar kolonlara göre eşleştirerek ve sayısal bir kolonu karşılaştırarak analiz etmeyi sağlayan web tabanlı bir araçtır. Özellikle stok yönetimi, fatura-irsaliye kontrolü, mutabakat gibi işlemlerde büyük kolaylık sağlar.

Bu kılavuz, uygulamayı en verimli şekilde nasıl kullanacağınızı adım adım anlatacaktır.

---

## İçindekiler

- [🌟 Ana Özellikler](#-ana-özellikler)
- [🤔 Bu Araç Ne İşe Yarar? (Kullanım Senaryoları)](#-bu-araç-ne-i̇şe-yarar-kullanım-senaryoları)
- [🚀 Nasıl Kullanılır? (Detaylı Anlatım)](#-nasıl-kullanılır-detaylı-anlatım)
  - [Adım 1: Dosyaları Yükleme](#adım-1-dosyaları-yükleme)
  - [Adım 2: Karşılaştırmayı Yapılandırma](#adım-2-karşılaştırmayı-yapılandırma)
  - [Adım 3: Sonuçları Analiz Etme](#adım-3-sonuçları-analiz-etme)
- [❓ Sıkça Sorulan Sorular ve Hata Yönetimi](#-sıkça-sorulan-sorular-ve-hata-yönetimi)
- [💻 Yerel Geliştirme](#-yerel-geliştirme)
- [🛠️ Kullanılan Teknolojiler](#-kullanılan-teknolojiler)

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

## 🤔 Bu Araç Ne İşe Yarar? (Kullanım Senaryoları)

Farklı departmanlardan veya sistemlerden gelen, birbiriyle ilişkili ama farklı formatlardaki Excel listelerini karşılaştırmak için idealdir. Bazı kullanım senaryoları:

- **E-Ticaret:** Satış raporları ile iade faturalarını karşılaştırarak hangi ürünlerin ne kadar iade edildiğini bulma.
- **Stok Yönetimi:** Depo sayım sonuçları ile sistemdeki stok kayıtlarını karşılaştırarak farkları tespit etme.
- **Muhasebe:** Müşteri faturaları ile yapılan ödemeleri (banka ekstreleri) eşleştirerek borç-alacak takibi yapma (mutabakat).
- **Lojistik:** Sevk irsaliyeleri ile teslimat raporlarını karşılaştırarak eksik veya fazla teslimatları bulma.

---

## 🚀 Nasıl Kullanılır? (Detaylı Anlatım)

Uygulama üç basit adımdan oluşur:

### Adım 1: Dosyaları Yükleme

Bu adımda karşılaştırılacak veri setlerini uygulamaya yüklersiniz.

1.  **"Kaynak" ve "Hedef" Ne Anlama Geliyor?**
    - **Kaynak:** Ana veri setinizdir. Genellikle eldeki varlığı veya ana listeyi temsil eder. (Örn: Depodaki ürün stokları, kesilen tüm faturalar).
    - **Hedef:** Kaynak ile karşılaştırılacak, kontrol edilecek olan veri setidir. (Örn: Gelen siparişler, yapılan iadeler).
    - **Örnek Mantık:** "Hedef'teki her bir kalem için Kaynak'ta yeterli karşılık var mı?" sorusunu sorar.

2.  **Dosyaları Yükleme:**
    - Dosyalarınızı ilgili kutucuğun üzerine **sürükleyip bırakabilir** veya kutucuğa **tıklayarak** bilgisayarınızdan seçebilirsiniz.
    - Her bir bölüme (Kaynak/Hedef) **birden fazla dosya** yükleyebilirsiniz. Yüklediğiniz tüm dosyaların verileri, o bölüm için tek bir listede otomatik olarak birleştirilir.

3.  **Çalışma Sayfası Seçimi:**
    - Bir Excel dosyası yüklediğinizde, içindeki çalışma sayfaları (sheet'ler) algılanır.
    - Dosya kartının altındaki **açılır menüden** işlem yapmak istediğiniz sayfayı seçebilirsiniz.
    - Eğer dosyadaki tüm sayfalardaki verileri birleştirmek istiyorsanız **"Tüm Sayfalar"** seçeneğini seçili bırakın.

4.  **Kontroller ve Doğrulama:**
    - **Başlık Uyum Kontrolü:** Aynı bölüme (örn: Kaynak) yüklediğiniz birden fazla dosyanın **kolon başlıkları birebir aynı olmalıdır**. Eğer bir dosyada farklı başlıklar varsa, o dosya kırmızı bir çerçeve ile işaretlenir ve "Kolon başlıkları uyumsuz!" uyarısı gösterilir. Devam etmeden önce bu dosyaları kaldırmalı veya başlıklarını düzelterek yeniden yüklemelisiniz.
    - **İleri Butonu:** "Kaynak" ve "Hedef" bölümlerinin her ikisinde de en az bir geçerli dosya bulunana kadar **"İleri"** butonu aktif olmaz.

5.  Her iki tarafa da dosyalarınızı yükledikten ve gerekli kontrolleri yaptıktan sonra **"İleri"** butonuna basarak bir sonraki adıma geçin.

### Adım 2: Karşılaştırmayı Yapılandırma

Bu en önemli adımdır. Uygulamaya verileri nasıl eşleştireceğini ve neyi karşılaştıracağını burada söylersiniz.

1.  **Anahtar Kolon Eşleştirmesi:**
    - **Amaç:** Kaynak ve Hedef listelerindeki hangi satırların birbiriyle ilişkili olduğunu belirtmek için kullanılır.
    - **Nasıl Yapılır:** Sol taraftaki açılır menüden Kaynak dosyanızdaki bir kolonu (örn: `Ürün Kodu`), sağ taraftaki menüden ise Hedef dosyanızdaki eşleşen kolonu (örn: `Stok Kodu`) seçin. Bu iki kolonun isimleri farklı olabilir, ancak içerdikleri veri aynı olmalıdır.
    - **Çoklu Anahtar:** Eşleşmenin daha doğru olması için birden fazla koşul gerekebilir (örn: `Ürün Kodu` + `Depo`). **"+ Eşleşme Ekle"** butonuna basarak yeni bir eşleştirme satırı ekleyebilirsiniz.
    - **Kontrol:** Bir anahtar kolonu seçtiğinizde, seçiminizi doğrulamanıza yardımcı olmak için o kolonun ilk satırındaki örnek veri gösterilir.

2.  **Karşılaştırma Kolonu (Sayısal):**
    - **Amaç:** Eşleşen satırlar arasında hangi sayısal değerin karşılaştırılacağını seçmektir.
    - **Nasıl Yapılır:**
        - **Kaynak'tan Seç:** Kaynak dosyasındaki sayısal veriyi içeren kolonu seçin (örn: `Stok Miktarı`).
        - **Hedef'ten Seç:** Hedef dosyasındaki sayısal veriyi içeren kolonu seçin (örn: `Sipariş Adedi`).
    - **Önemli:** Bu kolonların **sayısal değerler** içermesi gerekir. Metin içeren hücreler karşılaştırmada `0` olarak kabul edilir.

3.  **Sonuç Tablosu Kolonları:**
    - **Amaç:** Üçüncü adımda oluşacak sonuç tablosunda hangi ek bilgilerin gösterileceğini belirlemek.
    - **Nasıl Yapılır:** Açılır menüye tıklayarak Kaynak ve Hedef dosyalarınızdaki tüm kolonların bir listesini görebilirsiniz. Sonuç tablosunda görmek istediklerinizi seçin.
    - **Kontrol:** Anahtar olarak belirlediğiniz kolonlar sonuç tablosuna otomatik olarak eklenir ve bu menüden kaldırılamaz (yeşil `anahtar` ikonu ile işaretlenirler). Seçtiğiniz diğer kolonları ise küçük `x` ikonuna basarak kolayca kaldırabilirsiniz.

4.  **İşlemi Başlatma:**
    - Tüm gerekli alanları (en az bir anahtar çifti, iki karşılaştırma kolonu) doldurduğunuzda **"Karşılaştırmayı Başlat"** butonu aktif hale gelecektir. Bu butona basarak analizi başlatın.
    - **"Geri"** butonu ile dosya yükleme ekranına dönebilirsiniz.

### Adım 3: Sonuçları Analiz Etme

Karşılaştırma bittiğinde, sonuçlar gelişmiş bir tablo arayüzünde sunulur.

1.  **Tabloyu Anlamak:**
    - **Durum:** Her satırın karşılaştırma sonucunu özetler:
        - `Eşleşti`: Hedef'teki miktar, Kaynak'taki toplam miktarla karşılanabiliyor.
        - `Kısmen Karşılandı`: Hedef'teki miktar, Kaynak'taki toplam miktardan daha fazla. Kaynak'taki tüm miktar kullanılmış.
        - `Kaynakta Bulunamadı`: Hedef'teki satırın anahtar değeri, Kaynak listesinde hiç bulunamadı.
    - Diğer kolonlar, yapılandırma adımında seçtiğiniz verileri ve karşılaştırma sonucundaki sayısal değerleri (`Hedef Miktar`, `Kullanılan Kaynak`, `Kalan Miktarlar` vb.) gösterir.

2.  **Tablo Kontrolleri:**
    - **Arama:** Tablonun üzerindeki arama kutusuna herhangi bir metin yazarak tüm sonuçlar içinde anında filtreleme yapabilirsiniz.
    - **Durum Filtresi:** Arama kutusunun yanındaki butonlara (`Tümü`, `Eşleşti`, `Kısmen Karşılandı` vb.) tıklayarak sadece ilgili durumdaki sonuçları hızlıca listeleyebilirsiniz.
    - **Sıralama:** Herhangi bir kolonun başlığına tıklayarak tabloyu o kolona göre artan veya azalan sırada sıralayabilirsiniz.
    - **Sayfalama:** Tablonun altındaki sayfa numaraları ve "Önceki"/"Sonraki" butonları ile sonuçlar arasında gezinebilirsiniz. Ayrıca, sayfa başına gösterilecek satır sayısını (25, 50, 100, 200) değiştirebilirsiniz.

3.  **Sonuçları Dışa Aktarma:**
    - **"Excel Olarak İndir"** butonu, o an ekranda gördüğünüz (filtrelenmiş ve sıralanmış) veriyi `.xlsx` formatında bilgisayarınıza indirir. Bu sayede özel raporlar oluşturabilirsiniz.

4.  **Navigasyon:**
    - **"Geri"** butonu ile bir önceki adıma, yani yapılandırma ekranına dönebilirsiniz.
    - **"Baştan Başla"** butonu tüm süreci sıfırlar ve sizi ilk adıma (dosya yükleme) geri götürür.

---

## ❓ Sıkça Sorulan Sorular ve Hata Yönetimi

- **"Kolon başlıklarım neden uyumsuz hatası alıyorum?"**
  - Aynı bölüme (Kaynak veya Hedef) yüklediğiniz tüm Excel dosyalarının ilk satırındaki başlıkların **birebir aynı sırada ve aynı isimde** olması gerekmektedir. Boşluk, büyük-küçük harf gibi farklılıklar bile bu hataya neden olabilir. Lütfen dosyalarınızı kontrol edip tekrar yükleyin.

- **"Karşılaştırmayı Başlat butonu neden aktif değil?"**
  - 2. Adım'daki tüm zorunlu alanları doldurduğunuzdan emin olun:
    1.  En az bir "Anahtar Kolon Eşleştirmesi" satırı tam olarak doldurulmuş olmalı (hem Kaynak hem Hedef seçili).
    2.  "Karşılaştırma Kolonu" için hem Kaynak hem de Hedef seçimi yapılmış olmalı.

- **"Dosyam çok büyük, uygulama yavaşlar mı?"**
  - Tüm işlemler tarayıcınızda (bilgisayarınızın kaynaklarıyla) yapılır. Bu nedenle on binlerce satırlık çok büyük dosyalar tarayıcının yavaşlamasına veya yanıt vermemesine neden olabilir. Performans sorunu yaşarsanız, dosyalarınızı daha küçük parçalara bölerek işlemi tekrarlamayı düşünebilirsiniz.

- **"Sonuç tablosunda beklemediğim sonuçlar görüyorum."**
  - Lütfen 2. Adım'daki "Anahtar Kolon" ve "Karşılaştırma Kolonu" seçimlerinizi tekrar kontrol edin. Yanlış kolonları eşleştirmek, hatalı analiz sonuçlarına yol açacaktır.

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
