/**
 * FAHMI AYATULLAH, S.Ag — Core Script
 * Estetika: Editorial Jurnalisme • Dramaturgi Teater • Sastra & Abstrak Noir
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. AMBIENT ABSTRACT THEATRE CANVAS (Fluid Ink & Theatrical Haze)
       ========================================================================== */
    const canvas = document.getElementById('ambientCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const numParticles = Math.min(35, Math.floor(width / 35));
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.45;
                this.speedY = (Math.random() - 0.5) * 0.45;
                this.alpha = Math.random() * 0.35 + 0.1;
                // Palette: Gold, Warm Amber, Crimson
                const colors = ['207, 168, 70', '229, 139, 53', '208, 74, 54', '180, 160, 130'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Subtle magnetic drift toward mouse
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200 && dist > 20) {
                    this.x += (dx / dist) * 0.2;
                    this.y += (dy / dist) * 0.2;
                }

                // Wrap boundaries
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles with subtle abstract ink filaments
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(207, 168, 70, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    /* ==========================================================================
       2. SPOTLIGHT GLOW (Theatrical Spotlight Cursor Follower)
       ========================================================================== */
    const spotlight = document.getElementById('spotlightGlow');
    if (spotlight && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
        });
    }

    /* ==========================================================================
       3. SCROLL PROGRESS & HEADER STATE
       ========================================================================== */
    const progressBar = document.getElementById('scrollProgressBar');
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active Navigation Spy
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.desktop-menu .nav-link');
        let currentSectionId = '';

        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            if (scrollTop >= top && scrollTop < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. MOBILE MENU DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.add('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    /* ==========================================================================
       5. ARCHIVE FILTERING
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const archiveCards = document.querySelectorAll('.archive-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterValue = pill.getAttribute('data-filter');

            archiveCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    /* ==========================================================================
       6. INTERACTIVE DOSSIER MODAL & ESSAY REPOSITORY
       ========================================================================== */
    const dossierModal = document.getElementById('dossierModal');
    const dossierBackdrop = document.getElementById('dossierBackdrop');
    const dossierCloseBtn = document.getElementById('dossierCloseBtn');
    const dossierModalTitle = document.getElementById('dossierModalTitle');
    const dossierModalBody = document.getElementById('dossierModalBody');
    const dossierTag = document.getElementById('dossierTag');
    const dossierSourceNote = document.getElementById('dossierSourceNote');

    const dossierData = {
        'lentera-biru': {
            tag: 'JURNALISTIK INVESTIGATIF & KURASI REDAKSI',
            title: 'Lentera Biru Press: Investigasi & Narasi Publik Surabaya',
            source: 'Arsip Liputan Lentera Biru Press (2022-2023)',
            content: `
                <p><strong>Latar Belakang & Tanggung Jawab:</strong> Sebagai jurnalis dan tim editorial Lentera Biru Press, Fahmi Ayatullah memimpin penulisan laporan mendalam <em>(in-depth reporting)</em> berbasis riset lapangan dan investigasi sosial di lingkungan mahasiswa serta masyarakat perkotaan Surabaya.</p>
                
                <blockquote>"Jurnalisme bukanlah pengeras suara bagi yang berkuasa, melainkan lentera yang menerangi sudut-sudut gelap yang sengaja dipadamkan."</blockquote>
                
                <h4>Metodologi Liputan:</h4>
                <p>Setiap naskah dirancang melalui triangulasi data yang ketat: wawancara saksi kunci, penelusuran dokumen kebijakan kampus/daerah, dan observasi partisipatoris. Fahmi memastikan sudut pandang naratif mampu membongkar persoalan struktural tanpa kehilangan empati kemanusiaan.</p>

                <h4>Dampak & Capaian:</h4>
                <p>Menghasilkan serangkaian artikel advokasi mahasiswa yang mendorong transparansi anggaran kegiatan, ruang aman kebebasan berekspresi di kampus, serta kurasi edisi khusus sastra mahasiswa bertajuk perlawanan budaya.</p>
            `
        },
        'naskah-monolog': {
            tag: 'DRAMATURGI & NASKAH TEATER',
            title: 'Naskah Monolog: "Gumam dari Balik Tirai yang Robek"',
            source: 'Dokumen Naskah Monolog Fahmi Ayatullah (2024)',
            content: `
                <p><strong>Sinopsis Lakon:</strong> Berkisah tentang seorang penjaga arsip kota tua yang menyaksikan bagaimana kenangan, nama-nama jalan, dan riwayat orang kecil dihapus satu per satu demi proyek pembangunan megalopolis.</p>

                <blockquote>[Panggung hening. Aktor memegang sebongkah arang dan menuliskan angka tahun di lantai kayu: 1945, 1965, 1998, 2026.]<br><br>
                "Kalian menutup mata pada masa lalu karena takut melihat betapa miripnya wajah kalian dengan para penindas masa silam!"</blockquote>

                <h4>Eksplorasi Artistik:</h4>
                <p>Naskah ini memadukan struktur monolog klasik dengan ritme deklamasi puisi pesisir. Dialog yang dibangun menggunakan bahasa metaforik yang tajam, menuntut aktor mengeksplorasi ketegangan fisik dan modulasi suara dari gumaman lirih hingga jeritan batin.</p>

                <h4>Relevansi Pementasan:</h4>
                <p>Telah dibacakan dalam lingkaran pentas laboratorium teater independen dan diapresiasi oleh komunitas seniman panggung sebagai naskah yang berani menantang amnesia sejarah kolektif.</p>
            `
        },
        'dialektika-alam': {
            tag: 'ESAI FILSAFAT & EKOLOGI KRITIS',
            title: 'Pemikiran Peradaban Ekologis pada "Dialectics of Nature"',
            source: 'Publikasi: Mengeja.id & Daras Kajian Filsafat',
            content: `
                <p><strong>Intisari Esai:</strong> Melalui pembacaan mendalam atas karya Friedrich Engels <em>Dialectics of Nature</em>, esai ini meninjau ulang hubungan integral antara alam dan manusia dalam konteks krisis iklim abad ke-21.</p>

                <blockquote>"Janganlah kita terlalu berpuas diri dengan kemenangan-kemenangan kita atas alam. Untuk setiap kemenangan semacam itu, alam membalas dendam kepada kita." — F. Engels</blockquote>

                <h4>Tesis Pokok:</h4>
                <p>Alam bukan objek mekanistik yang statis, melainkan totalitas dinamis yang saling bertaut. Ketika modernisme memperlakukan tanah, laut, dan hutan semata-mata sebagai komoditas yang diekstraksi tanpa batas, hukum-hukum ekologis yang terlanggar akan menuntut konsekuensi berupa bencana ekologis.</p>

                <h4>Implikasi Praksis:</h4>
                <p>Fahmi menawarkan gagasan "Etika Resonansi Alam", di mana peradaban manusia harus bertransformasi dari paradigma penaklukan menuju keselarasan dialektis yang mengakui hak-hak intrinsik ekosistem.</p>
            `
        },
        'daras-filsafat': {
            tag: 'EPISTEMOLOGI & TEORI SIBERNETIK',
            title: 'Daras Filsafat: Penawaran Epistemologi Sibernetik',
            source: 'Publikasi: darasfilsafat.com (Kajian Kontemporer)',
            content: `
                <p><strong>Gagasan Kunci:</strong> Menghadapi era ledakan kecerdasan artifisial dan polarisasi opini digital, kerangka epistemologi klasik yang linier terbukti kewalahan. Esai ini mengajukan epistemologi sibernetik sebagai pisau analisis baru.</p>

                <h4>Tiga Pilar Epistemologi Sibernetik:</h4>
                <p><strong>1. Umpan Balik (Feedback Loop):</strong> Pengetahuan tidak lagi dipahami sebagai cerminan pasif objek di luar sana, melainkan interaksi melingkar antara pengamat dan sistem yang diamati.</p>
                <p><strong>2. Sirkularitas Makna:</strong> Kesadaran bahwa setiap tindakan komunikasi kita di ruang digital secara bersamaan mengubah struktur lingkungan tempat kita berpikir.</p>
                <p><strong>3. Etika Tanggung Jawab Epistemik:</strong> Peneliti dan intelektual tidak dapat berpura-pura netral; mereka adalah bagian dari pusaran arus informasi yang mereka ciptakan.</p>
            `
        },
        'petik-laut': {
            tag: 'SASTRA MARITIM & ETNOGRAFI PESISIR',
            title: 'Buih Doa Petik Laut: Spiritualitas Nelayan & Debur Ombak',
            source: 'Catatan Budaya Pesisir Muncar, Banyuwangi',
            content: `
                <p><strong>Deskripsi Karya:</strong> Sebuah reportase sastrawi (literary journalism) yang menyelami tradisi Petik Laut di Pelabuhan Muncar, Banyuwangi—pelabuhan ikan tradisional tersibuk di Selat Bali.</p>

                <blockquote>"Di atas perahu slerek yang dicat warna-warni, sesaji bukan sekadar kepala kerbau dan beras kuning; ia adalah tanda pasrah seorang pelaut yang sadar bahwa di hadapan samudra, kesombongan manusia hanyalah buih yang segera lenyap."</blockquote>

                <h4>Nuansa Naratif:</h4>
                <p>Fahmi membedah ketegangan antara kearifan lokal nelayan tradisional, dinamika modernisasi alat tangkap, dan pergulatan spiritualitas masyarakat pesisir yang merawat pertautan intim antara doa, pasang surut air laut, dan keberlangsungan hidup keluarga mereka.</p>
            `
        },
        'tata-letak': {
            tag: 'DESAIN KOMUNIKASI VISUAL & TATA LETAK',
            title: 'Tipografi Editorial & Tata Letak Buku Komunitas',
            source: 'Portofolio Desain Grafis & InDesign Fahmi Ayatullah',
            content: `
                <p><strong>Pendekatan Desain:</strong> Desain tata letak <em>(layout)</em> bukan sekadar menempatkan teks di atas halaman putih, melainkan membangun arsitektur pembacaan yang menghormati ritme nafas pembaca.</p>

                <h4>Keahlian & Penguasaan Perangkat:</h4>
                <p><strong>• Adobe InDesign:</strong> Penyusunan grid modular, master page fleksibel, hierarchi tipografi (heading, sub-kicker, drop-cap, footnote), dan persiapan pracetak (pre-flight & CMYK color profiling).</p>
                <p><strong>• Adobe Photoshop & Illustrator:</strong> Pengolahan aset foto dokumenter bertekstur chiaroscuro dan vektor ilustrasi pendukung.</p>
                <p><strong>• Filosofi Desain:</strong> "Tata letak yang baik adalah tata letak yang tak kasat mata saat dibaca, namun membekaskan kejelasan dan keanggunan dalam benak."</p>
            `
        },
        'banalitas': {
            tag: 'FILSAFAT SOSIAL & KRITIK DIGITAL',
            title: 'Banalitas Intelektual di Ruang Publik Digital',
            source: 'Naskah Esai Kritik Budaya Fahmi Ayatullah',
            content: `
                <p>Sebuah gugatan terhadap fenomena perdebatan digital kontemporer yang didorong oleh algoritma kemarahan kilat. Intelektual yang kehilangan daya kontemplatif rentan tergelincir menjadi komentator instan yang sibuk mengejar metrik atensi alih-alih merawat substansi kebenaran.</p>
                <blockquote>"Ketika kecepatan dipuja melampaui kedalaman, gumaman dangkal akan dinobatkan sebagai pencerahan."</blockquote>
            `
        },
        'laut-murung': {
            tag: 'PROSA SASTRA & REFLEKSI MARITIM',
            title: 'Beberapa Hari Ini Laut Menampilkan Wajah yang Murung',
            source: 'Kumpulan Prosa Selat Bali Fahmi Ayatullah',
            content: `
                <p>Catatan liris mengenai jeda paceklik di kampung nelayan pesisir timur Jawa. Melukiskan jaring-jaring yang dijemur di dermaga kayu basah, tatapan para juragan perahu yang menanti angin teduh, dan obrolan malam di warung kopi pesisir yang menyulam harapan di tengah gemuruh ombak pasang.</p>
            `
        },
        'obituari': {
            tag: 'BIOGRAFI & OBITUARI TOKOH',
            title: 'Obituari KH. Ach Fauzi Imron: Suluk Guru dan Pengabdian Sunyi',
            source: 'Arsip Biografi Intelektual Pesantren',
            content: `
                <p>Mengurai perjalanan spiritual dan intelektual almarhum KH. Ach Fauzi Imron. Bagaimana seorang ulama tasawuf mengabdikan hidupnya dalam mendidik santri tanpa meminta sorotan lampu kamera, mengajarkan kesederhanaan hidup sebagai bentuk jihad kebudayaan yang paling luhur.</p>
            `
        }
    };

    function openDossier(key) {
        const data = dossierData[key];
        if (!data || !dossierModal) return;

        dossierTag.textContent = data.tag;
        dossierModalTitle.textContent = data.title;
        dossierModalBody.innerHTML = data.content;
        dossierSourceNote.textContent = data.source;

        dossierModal.classList.add('active');
        dossierModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDossier() {
        if (!dossierModal) return;
        dossierModal.classList.remove('active');
        dossierModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click handlers to all buttons opening dossiers
    document.querySelectorAll('[data-dossier]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-dossier');
            openDossier(key);
        });
    });

    if (dossierCloseBtn) dossierCloseBtn.addEventListener('click', closeDossier);
    if (dossierBackdrop) dossierBackdrop.addEventListener('click', closeDossier);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dossierModal && dossierModal.classList.contains('active')) {
            closeDossier();
        }
    });

    /* ==========================================================================
       7. THEATRICAL MONOLOGUE READER (Font Resizer & Audio Atmosphere)
       ========================================================================== */
    const scriptFontToggle = document.getElementById('scriptFontToggle');
    const scriptBodyText = document.getElementById('scriptBodyText');
    const scriptPlayAtmosphere = document.getElementById('scriptPlayAtmosphere');

    if (scriptFontToggle && scriptBodyText) {
        scriptFontToggle.addEventListener('click', () => {
            scriptBodyText.classList.toggle('large-text');
            scriptFontToggle.classList.toggle('active');
        });
    }

    // Pure Web Audio API Ambient Stage Tone (Warm 174 Hz Solfeggio / Theatrical Haze)
    let audioCtx = null;
    let isPlayingAudio = false;
    let osc1 = null;
    let osc2 = null;
    let gainNode = null;

    if (scriptPlayAtmosphere) {
        scriptPlayAtmosphere.addEventListener('click', () => {
            if (!isPlayingAudio) {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (!audioCtx) audioCtx = new AudioContext();

                    if (audioCtx.state === 'suspended') {
                        audioCtx.resume();
                    }

                    gainNode = audioCtx.createGain();
                    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 3);

                    // Low warm fundamental (174 Hz)
                    osc1 = audioCtx.createOscillator();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(174, audioCtx.currentTime);

                    // Harmonic shimmer (348.5 Hz)
                    osc2 = audioCtx.createOscillator();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(348.5, audioCtx.currentTime);

                    osc1.connect(gainNode);
                    osc2.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    osc1.start();
                    osc2.start();

                    isPlayingAudio = true;
                    scriptPlayAtmosphere.classList.add('active');
                    scriptPlayAtmosphere.querySelector('span').textContent = 'Hening Aktif (Klik Tutup)';
                } catch (err) {
                    console.log('Audio Context not allowed:', err);
                }
            } else {
                if (gainNode && audioCtx) {
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
                    setTimeout(() => {
                        if (osc1) osc1.stop();
                        if (osc2) osc2.stop();
                    }, 1500);
                }
                isPlayingAudio = false;
                scriptPlayAtmosphere.classList.remove('active');
                scriptPlayAtmosphere.querySelector('span').textContent = 'Hening Panggung';
            }
        });
    }

    /* ==========================================================================
       8. DYNAMIC QUOTATION GENERATOR (Pojok Kontemplasi)
       ========================================================================== */
    const quotes = [
        {
            text: "“Saya tidak menjual jasa. Saya menawarkan komitmen, pikiran, dan waktu untuk mendampingi proses yang bermakna. Setiap program adalah ruang belajar bersama.”",
            author: "— Fahmi Ayatullah, S.Ag (Nilai Dedikasi)"
        },
        {
            text: "“Jurnalisme dan teater bertemu pada satu titik nurani: keduanya menolak kepalsuan yang dibungkus rapi oleh kemapanan.”",
            author: "— Fahmi Ayatullah (Catatan Laboratorium Naskah)"
        },
        {
            text: "“Kata-kata yang ditulis tanpa kesungguhan hati hanyalah jelaga di atas kertas; ia lekas hilang ditiup kepalsuan zaman.”",
            author: "— Fahmi Ayatullah (Manifesto Sastra)"
        },
        {
            text: "“Dialektika bukan sekadar seni mendebat lawan, melainkan keberanian meruntuhkan kepongahan pikiran sendiri demi menemukan kebenaran yang lebih jernih.”",
            author: "— Fahmi Ayatullah (Daras Filsafat)"
        },
        {
            text: "“Di hadapan laut Selat Bali, aku belajar bahwa doa paling khusyuk sering kali lahir bukan dari lisan yang fasih, melainkan dari gemetar tangan nelayan yang menebar jaring di kegelapan.”",
            author: "— Fahmi Ayatullah (Buih Doa Petik Laut)"
        }
    ];

    let currentQuoteIndex = 0;
    const dynamicQuoteText = document.getElementById('dynamicQuoteText');
    const dynamicQuoteAuthor = document.getElementById('dynamicQuoteAuthor');
    const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

    if (refreshQuoteBtn && dynamicQuoteText && dynamicQuoteAuthor) {
        refreshQuoteBtn.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            dynamicQuoteText.style.opacity = '0';
            dynamicQuoteAuthor.style.opacity = '0';

            setTimeout(() => {
                dynamicQuoteText.textContent = quotes[currentQuoteIndex].text;
                dynamicQuoteAuthor.textContent = quotes[currentQuoteIndex].author;
                dynamicQuoteText.style.opacity = '1';
                dynamicQuoteAuthor.style.opacity = '1';
            }, 300);
        });
    }

    /* ==========================================================================
       9. WHATSAPP MESSAGE COMPOSER
       ========================================================================== */
    const collabForm = document.getElementById('collabForm');
    if (collabForm) {
        collabForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const senderName = document.getElementById('senderName').value.trim();
            const collabTopic = document.getElementById('collabTopic').value;
            const senderMessage = document.getElementById('senderMessage').value.trim();

            const message = `Halo Fahmi Ayatullah, S.Ag, perkenalkan saya *${senderName}*.\n\nSaya tertarik mengajak Anda berdiskusi / berkolaborasi mengenai: *${collabTopic}*.\n\nCatatan Gagasan:\n"${senderMessage}"\n\nTerima kasih.`;
            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/6282213297661?text=${encodedMessage}`;

            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

});
