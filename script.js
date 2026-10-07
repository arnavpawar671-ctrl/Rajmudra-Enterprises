/* =========================================================
   RAJMUDRA ENTERPRISES
   PREMIUM INTERACTION ENGINE v2
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const loader = $("#pageLoader");
    const header = $("#siteHeader");
    const menuBtn = $("#menuBtn");
    const mobileNav = $("#mobileNav");
    const progress = $("#scrollProgress");
    const year = $("#year");

    const revealElements = $$(".reveal");
    const counters = $$(".counter");
    const sections = $$("main section[id]");
    const navLinks = $$(".desktop-nav a");
    const parallaxElements = $$("[data-parallax]");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.documentElement.classList.add("js-enabled");


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    const hideLoader = () => {
        if (!loader) return;

        loader.classList.add("hidden");

        // Remove it from accessibility tree
        loader.setAttribute("aria-hidden", "true");

        setTimeout(() => {
            loader.style.display = "none";
        }, 800);
    };

    if (document.readyState === "complete") {
        setTimeout(hideLoader, 350);
    } else {
        window.addEventListener("load", () => {
            setTimeout(hideLoader, 350);
        }, { once: true });
    }


    /* =====================================================
       HEADER
       ===================================================== */

    const updateHeader = () => {
        if (!header) return;

        const scrolled = window.scrollY > 40;

        header.classList.toggle(
            "scrolled",
            scrolled
        );
    };


    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    const updateProgress = () => {
        if (!progress) return;

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight;

        const viewportHeight =
            window.innerHeight;

        const scrollable =
            documentHeight - viewportHeight;

        if (scrollable <= 0) {
            progress.style.width = "0%";
            return;
        }

        const percentage =
            Math.min(
                Math.max(
                    (scrollTop / scrollable) * 100,
                    0
                ),
                100
            );

        progress.style.width =
            `${percentage}%`;
    };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const closeMobileMenu = () => {
        if (!mobileNav || !menuBtn) return;

        mobileNav.classList.remove("open");
        menuBtn.classList.remove("active");

        menuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        menuBtn.setAttribute(
            "aria-label",
            "Open menu"
        );

        document.body.classList.remove(
            "menu-open"
        );
    };


    const openMobileMenu = () => {
        if (!mobileNav || !menuBtn) return;

        mobileNav.classList.add("open");
        menuBtn.classList.add("active");

        menuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        menuBtn.setAttribute(
            "aria-label",
            "Close menu"
        );

        document.body.classList.add(
            "menu-open"
        );
    };


    if (menuBtn && mobileNav) {

        menuBtn.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.contains("open");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        });


        $$(".mobile-nav a", mobileNav)
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            });
    }


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            mobileNav?.classList.contains("open")
        ) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       CLICK OUTSIDE MOBILE MENU
       ===================================================== */

    document.addEventListener("click", event => {

        if (!mobileNav?.classList.contains("open")) {
            return;
        }

        const clickedInsideMenu =
            mobileNav.contains(event.target);

        const clickedButton =
            menuBtn?.contains(event.target);

        if (!clickedInsideMenu && !clickedButton) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       REVEAL ANIMATIONS
       ===================================================== */

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* =====================================================
       COUNTERS
       ===================================================== */

    const animateCounter = element => {

        const target =
            Number(element.dataset.target);

        if (!Number.isFinite(target)) {
            return;
        }

        if (reducedMotion) {
            element.textContent =
                target.toLocaleString();
            return;
        }

        const duration = 1400;
        const startTime = performance.now();

        const tick = currentTime => {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

            // Smooth ease-out
            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    4
                );

            const current =
                Math.round(
                    target * eased
                );

            element.textContent =
                current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent =
                    target.toLocaleString();
            }

        };

        requestAnimationFrame(tick);
    };


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(animateCounter);

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const setActiveNav = id => {

        navLinks.forEach(link => {

            const href =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${id}`
            );

        });

    };


    if (
        sections.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    const visibleSections =
                        entries
                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (!visibleSections.length) {
                        return;
                    }

                    setActiveNav(
                        visibleSections[0]
                            .target
                            .id
                    );

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: [
                        0,
                        0.1,
                        0.25,
                        0.5
                    ]
                }
            );


        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                href === "#"
            ) {
                return;
            }

            let target;

            try {
                target =
                    document.querySelector(href);
            } catch {
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight =
                header?.offsetHeight || 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                8;

            window.scrollTo({
                top:
                    Math.max(
                        targetPosition,
                        0
                    ),
                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth"
            });

            // Update URL without jumping
            if (
                history.replaceState &&
                href.startsWith("#")
            ) {
                history.replaceState(
                    null,
                    "",
                    href
                );
            }

        });

    });


    /* =====================================================
       PARALLAX
       ===================================================== */

    if (
        !reducedMotion &&
        parallaxElements.length
    ) {

        let parallaxTicking = false;

        const updateParallax = () => {

            const viewport =
                window.innerHeight;

            parallaxElements.forEach(element => {

                const rect =
                    element.getBoundingClientRect();

                if (
                    rect.bottom < -300 ||
                    rect.top > viewport + 300
                ) {
                    return;
                }

                const speed =
                    Number(
                        element.dataset.parallax
                    ) || 0.08;

                const center =
                    rect.top +
                    rect.height / 2;

                const distance =
                    center -
                    viewport / 2;

                const movement =
                    distance * speed * -1;

                element.style.transform =
                    `translate3d(0, ${movement}px, 0)`;

            });

            parallaxTicking = false;
        };


        const requestParallaxUpdate = () => {

            if (parallaxTicking) {
                return;
            }

            parallaxTicking = true;

            requestAnimationFrame(
                updateParallax
            );
        };


        window.addEventListener(
            "scroll",
            requestParallaxUpdate,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            requestParallaxUpdate,
            {
                passive: true
            }
        );

        updateParallax();

    }


    /* =====================================================
       MAGNETIC BUTTON EFFECT
       ===================================================== */

    if (!reducedMotion) {

        const magneticElements =
            $$(".button, .header-cta");

        magneticElements.forEach(element => {

            let raf = null;

            element.addEventListener(
                "pointermove",
                event => {

                    // Only use the effect for mouse/pen
                    if (
                        event.pointerType === "touch"
                    ) {
                        return;
                    }

                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    if (raf) {
                        cancelAnimationFrame(raf);
                    }

                    raf =
                        requestAnimationFrame(() => {

                            element.style.transform =
                                `translate3d(
                                    ${x * 0.055}px,
                                    ${y * 0.055}px,
                                    0
                                )`;

                        });

                }
            );


            element.addEventListener(
                "pointerleave",
                () => {

                    if (raf) {
                        cancelAnimationFrame(raf);
                    }

                    element.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       IMAGE HOVER EFFECT
       ===================================================== */

    if (!reducedMotion) {

        $$(".solution-card, .product-card")
            .forEach(card => {

                card.addEventListener(
                    "mouseenter",
                    () => {
                        card.classList.add(
                            "is-hovered"
                        );
                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {
                        card.classList.remove(
                            "is-hovered"
                        );
                    }
                );

            });

    }


    /* =====================================================
       DYNAMIC YEAR
       ===================================================== */

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       SCROLL ENGINE
       ===================================================== */

    let scrollTicking = false;

    const handleScroll = () => {

        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        requestAnimationFrame(() => {

            updateHeader();
            updateProgress();

            scrollTicking = false;

        });

    };


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            // Close mobile menu when returning
            // to desktop layout.
            if (
                window.innerWidth > 760 &&
                mobileNav?.classList.contains("open")
            ) {
                closeMobileMenu();
            }

            updateHeader();
            updateProgress();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateHeader();
    updateProgress();


    /* =====================================================
       DEV INFO
       ===================================================== */

    console.log(
        "%c RAJMUDRA ENTERPRISES ",
        "background:#63adff;color:#05070a;font-weight:700;padding:4px 8px;border-radius:4px;"
    );

    console.log(
        "Premium interaction engine initialized."
    );

});

(() => {
    const modal = document.getElementById("quoteModal");
    const form = document.getElementById("quoteForm");
    if (!modal || !form) return;
    const openers = document.querySelectorAll("[data-open-quote], .header-cta");
    const closers = modal.querySelectorAll("[data-close-quote]");
    const firstField = form.querySelector("select");
    const open = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("quote-modal-open"); window.setTimeout(() => firstField?.focus(),80); };
    const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("quote-modal-open"); };
    openers.forEach(el => el.addEventListener("click", event => {
        const href = el.getAttribute("href");
        if (el.matches(".header-cta") && href === "#contact" && window.innerWidth > 760) return;
        event.preventDefault(); open();
    }));
    closers.forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) close(); });
    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = "Quote Request — " + data.get("service");
        const body = [
            "Service: " + data.get("service"),
            "Name: " + data.get("name"),
            "Phone: " + data.get("phone"),
            "Company / Society: " + (data.get("company") || "Not provided"),
            "Location: " + (data.get("location") || "Not provided"),
            "",
            "Requirements:",
            data.get("requirements")
        ].join("\n");
        window.location.href = "mailto:info@rajmudraent.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        close();
    });
})();

/* =====================================================
   CINEMATIC MOTION ENGINE
   ===================================================== */
(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    if (reduce) return;

    document.body.insertAdjacentHTML("afterbegin", '<div class="motion-orb" aria-hidden="true"></div><div class="cursor-ring" aria-hidden="true"></div><div class="motion-progress" aria-hidden="true"></div>');
    document.body.classList.add("motion-ready");

    const reveal = [...document.querySelectorAll(".reveal, section, .solution-card, .service-card, .project-card, .about-card, .stat, .contact-details > *, footer, [data-motion-reveal]")];
    reveal.forEach((el,i) => {
        if (el.matches("section") || el.hasAttribute("data-motion-reveal")) return;
        if (!el.closest(".quote-modal")) {
            el.setAttribute("data-motion-reveal","");
            el.style.setProperty("--motion-delay", Math.min((i % 6) * 65, 325) + "ms");
        }
    });

    const scaleTargets = document.querySelectorAll(".hero-image, .hero-visual, .featured-image, [data-scroll-scale]");
    scaleTargets.forEach(el => { if (!el.hasAttribute("data-scroll-scale")) el.setAttribute("data-scroll-scale",""); });

    const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add("is-visible");
    }), {threshold:.12, rootMargin:"0px 0px -7% 0px"});
    document.querySelectorAll("[data-motion-reveal],[data-motion-scale]").forEach(el => io.observe(el));

    document.querySelectorAll(".solution-card, .service-card, .project-card, .about-card").forEach((el,i) => {
        el.setAttribute("data-motion-tilt","");
        el.classList.add("motion-shine");
        el.style.setProperty("--i", i % 6);
    });

    const tilt = el => {
        const rect=el.getBoundingClientRect(), x=(event.clientX-rect.left)/rect.width-.5, y=(event.clientY-rect.top)/rect.height-.5;
        el.style.transform="perspective(900px) rotateX("+(-y*5)+"deg) rotateY("+(x*5)+"deg) translateY(-4px)";
    };
    document.querySelectorAll("[data-motion-tilt]").forEach(el=>{
        el.addEventListener("mousemove",e=>{
            const rect=el.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;
            el.style.transform="perspective(900px) rotateX("+(-y*5)+"deg) rotateY("+(x*5)+"deg) translateY(-4px)";
        });
        el.addEventListener("mouseleave",()=>{el.style.transform=""});
    });

    const ring=document.querySelector(".cursor-ring"), orb=document.querySelector(".motion-orb");
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener("mousemove",e=>{
        mx=e.clientX; my=e.clientY;
        root.style.setProperty("--mx",(mx/innerWidth*100)+"%");
        root.style.setProperty("--my",(my/innerHeight*100)+"%");
    },{passive:true});
    const cursorFrame=()=>{
        rx+=(mx-rx)*.18; ry+=(my-ry)*.18;
        if(ring){ring.style.left=rx+"px";ring.style.top=ry+"px";ring.style.opacity="1"}
        if(orb){orb.style.left=mx+"px";orb.style.top=my+"px"}
        requestAnimationFrame(cursorFrame);
    };
    cursorFrame();
    document.querySelectorAll("a,button,[data-motion-tilt]").forEach(el=>{
        el.addEventListener("mouseenter",()=>ring?.classList.add("is-hover"));
        el.addEventListener("mouseleave",()=>ring?.classList.remove("is-hover"));
    });

    let ticking=false;
    const onScroll=()=>{
        if(ticking)return;ticking=true;
        requestAnimationFrame(()=>{
            const max=document.documentElement.scrollHeight-innerHeight, y=scrollY;
            document.querySelector(".motion-progress")?.style.setProperty("transform","scaleX("+(max?y/max:0)+")");
            document.querySelectorAll("[data-scroll-scale]").forEach(el=>{
                const r=el.getBoundingClientRect(), p=Math.max(0,Math.min(1,1-(r.top-innerHeight*.15)/(innerHeight*.85)));
                el.style.setProperty("--scroll-scale",(1+p*.035).toFixed(3));
            });
            ticking=false;
        });
    };
    addEventListener("scroll",onScroll,{passive:true}); onScroll();

    document.querySelectorAll("a,button").forEach(el=>{
        if(el.closest(".mobile-action-bar") || el.classList.contains("quote-modal-close")) return;
        el.classList.add("motion-magnetic");
        el.addEventListener("mousemove",e=>{
            const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;
            el.style.transform="translate3d("+x+"px,"+y+"px,0)";
        });
        el.addEventListener("mouseleave",()=>el.style.transform="");
    });
})();


/* =====================================================
   SERVICE DETAIL INTERACTION
   ===================================================== */
(() => {
    const modal = document.getElementById("serviceDetailModal");
    if (!modal) return;
    const title = document.getElementById("serviceDetailTitle");
    const label = document.getElementById("serviceDetailLabel");
    const description = document.getElementById("serviceDetailDescription");
    const list = document.getElementById("serviceDetailList");
    const serviceQuote = modal.querySelector("[data-service-quote]");
    const services = {
        "IT Hardware & Networking": {
            label: "INFRASTRUCTURE",
            description: "Business hardware and connectivity planned around the way your workplace actually operates.",
            items: ["Workstations & servers", "Networking & Wi-Fi", "AMC & on-site support"]
        },
        "CCTV & E-Surveillance": {
            label: "SURVEILLANCE",
            description: "Site-focused camera and monitoring infrastructure for better visibility across critical areas.",
            items: ["CCTV installation", "Remote monitoring", "Coverage planning"]
        },
        "Access Control": {
            label: "PHYSICAL SECURITY",
            description: "Controlled-entry solutions designed to help manage movement through offices, societies and restricted areas.",
            items: ["Access readers", "Entry management", "Turnstile systems"]
        },
        "Fire Alarm & Safety": {
            label: "LIFE SAFETY",
            description: "Fire detection and safety infrastructure planned to support earlier awareness and safer premises.",
            items: ["Fire alarm systems", "Detection devices", "Site planning"]
        },
        "AMC & Technical Support": {
            label: "SUPPORT",
            description: "Ongoing maintenance and technical support to help keep deployed systems reliable.",
            items: ["Preventive maintenance", "Troubleshooting", "On-site support"]
        }
    };
    let activeService = "";
    const open = service => {
        const data = services[service];
        if (!data) return;
        activeService = service;
        title.textContent = service;
        label.textContent = data.label;
        description.textContent = data.description;
        list.innerHTML = data.items.map((item, i) => '<div class="service-detail-item"><span>0'+(i+1)+'</span><b>'+item+'</b><em>↗</em></div>').join("");
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        modal.querySelector(".service-detail-close").focus();
    };
    const close = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    };
    document.addEventListener("click", e => {
        const trigger = e.target.closest("[data-service]");
        if (trigger) {
            e.preventDefault();
            open(trigger.dataset.service);
        }
        if (e.target.closest("[data-close-service]")) close();
        if (e.target.closest("[data-service-quote]")) {
            close();
            const quote = document.getElementById("quoteModal");
            const opener = document.querySelector("[data-open-quote]");
            if (opener) opener.click();
            else if (quote) {
                quote.classList.add("open");
                quote.setAttribute("aria-hidden", "false");
            }
            const select = document.querySelector('#quoteForm select[name="service"]');
            if (select && activeService) {
                const option = [...select.options].find(o => o.textContent === activeService);
                if (option) select.value = option.value;
            }
        }
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
})();


/* =====================================================
   GRAND WELCOME EXPERIENCE
   ===================================================== */
(() => {
    const welcome = document.getElementById("grandWelcome");
    const enter = document.getElementById("grandWelcomeEnter");
    if (!welcome) return;

    document.body.classList.add("welcome-active");

    let closed = false;

    const leaveWelcome = () => {
        if (closed) return;
        closed = true;
        welcome.classList.add("is-leaving");
        welcome.setAttribute("aria-hidden", "true");
        document.body.classList.remove("welcome-active");

        window.setTimeout(() => {
            welcome.remove();
        }, 1150);
    };

    enter?.addEventListener("click", leaveWelcome);

    // Give the intro enough time to feel cinematic, but don't trap the visitor.
    window.setTimeout(leaveWelcome, 4200);

    document.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === "Escape") {
            leaveWelcome();
        }
    }, { once: true });
})();


/* =====================================================
   GRAND WELCOME → HERO TRANSITION CONTROLLER
   ===================================================== */
(() => {
    const welcome = document.getElementById("grandWelcome");
    const enter = document.getElementById("grandWelcomeEnter");
    if (!welcome) return;

    document.body.classList.add("welcome-active");

    let closed = false;

    const leaveWelcome = () => {
        if (closed) return;
        closed = true;

        // Start the hero arrival at the exact moment the intro begins to dissolve.
        document.body.classList.add("welcome-exiting");
        welcome.classList.add("is-leaving");
        welcome.setAttribute("aria-hidden", "true");

        window.setTimeout(() => {
            document.body.classList.remove("welcome-active", "welcome-exiting");
            welcome.remove();
        }, 1180);
    };

    enter?.addEventListener("click", leaveWelcome);

    // Cinematic by default, but never blocks the visitor.
    window.setTimeout(leaveWelcome, 4200);

    document.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === "Escape") {
            leaveWelcome();
        }
    });
})();

/* =====================================================
   CINEMATIC VISUAL ENGINE — DEPTH + ENERGY + HUD
   ===================================================== */
(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const field = document.createElement("div");
    field.className = "visual-energy-field";
    field.setAttribute("aria-hidden","true");
    for (let i=0;i<7;i++) {
        const line=document.createElement("span");
        line.className="visual-energy-line";
        line.style.setProperty("--energy-angle",(-8+i*2.6)+"deg");
        line.style.setProperty("--energy-duration",(9+i*.8)+"s");
        line.style.setProperty("--energy-delay",(-i*1.7)+"s");
        field.appendChild(line);
    }
    document.body.appendChild(field);

    const hud=document.createElement("div");
    hud.className="visual-hud";
    hud.setAttribute("aria-hidden","true");
    const dot=document.createElement("span");
    dot.className="visual-hud-dot";
    dot.style.top="0%";
    const label=document.createElement("span");
    label.className="visual-hud-label";
    label.textContent="RAJMUDRA / SYSTEM";
    hud.append(dot,label);
    document.body.appendChild(hud);

    const depthTargets=document.querySelectorAll(
        ".hero-grid, .hero-overlay, .section-title, .section-description, .solution-visual, .project-card, .about-card, .contact-card, .footer-inner"
    );
    depthTargets.forEach((el,i)=>{
        el.setAttribute("data-visual-depth","");
        el.style.setProperty("--depth-factor",String((i%5+1)*.045));
    });

    document.querySelectorAll(
        ".solution-card, .project-card, .about-card, .product-card, .service-card, .stat, .contact-card"
    ).forEach(el=>el.setAttribute("data-visual-glow",""));

    document.querySelectorAll(".hero-visual, .solution-visual, .project-visual, .featured-image, .about-image").forEach(el=>{
        if(!el.querySelector(".visual-scan")){
            const scan=document.createElement("span");
            scan.className="visual-scan";
            scan.setAttribute("aria-hidden","true");
            el.appendChild(scan);
        }
    });

    let ticking=false;
    const update=()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{
            const h=window.innerHeight;
            document.querySelectorAll("[data-visual-depth]").forEach(el=>{
                const r=el.getBoundingClientRect();
                if(r.bottom<0||r.top>h) return;
                const center=r.top+r.height/2;
                const offset=(center-h/2)/h;
                const factor=Number(el.style.getPropertyValue("--depth-factor"))||.05;
                el.style.setProperty("--depth-shift",(offset*factor*-100)+"px");
            });

            const sections=[...document.querySelectorAll("main section")];
            if(sections.length){
                let active=0,best=Infinity;
                sections.forEach((s,i)=>{
                    const r=s.getBoundingClientRect();
                    const d=Math.abs(r.top-h*.42);
                    if(d<best){best=d;active=i;}
                });
                dot.style.top=((active/Math.max(1,sections.length-1))*100)+"%";
            }
            ticking=false;
        });
    };
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update,{passive:true});
    update();

    document.addEventListener("pointermove",e=>{
        const cards=document.querySelectorAll("[data-visual-glow]");
        cards.forEach(card=>{
            const r=card.getBoundingClientRect();
            if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){
                card.style.setProperty("--glow-x",((e.clientX-r.left)/r.width*100)+"%");
                card.style.setProperty("--glow-y",((e.clientY-r.top)/r.height*100)+"%");
            }
        });
    },{passive:true});
})();

/* HERO 2.0 — dynamic spotlight + command label */
(() => {
    const hero=document.querySelector(".hero");
    if(!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const label=document.createElement("div");
    label.className="hero-command-label";
    label.textContent="SECURE SYSTEM / ONLINE";
    label.setAttribute("aria-hidden","true");
    hero.appendChild(label);
    hero.addEventListener("pointermove",e=>{
        const r=hero.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5);
        const y=((e.clientY-r.top)/r.height-.5);
        hero.style.setProperty("--hero-mx",(x*100).toFixed(2)+"%");
        hero.style.setProperty("--hero-my",(y*100).toFixed(2)+"%");
        const visual=hero.querySelector(".hero-visual");
        if(visual) visual.style.transform="perspective(1200px) rotateX("+(-y*3.2)+"deg) rotateY("+(x*4.2)+"deg)";
    },{passive:true});
    hero.addEventListener("pointerleave",()=>{
        const visual=hero.querySelector(".hero-visual");
        if(visual) visual.style.transform="";
    });
})();

/* =====================================================
   CINEMATIC SCROLL EXPERIENCE 2.0
   ===================================================== */
(() => {
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce) return;

    const field=document.createElement("div");
    field.className="scroll-cinema-field";
    field.setAttribute("aria-hidden","true");
    for(let i=0;i<3;i++){
        const trail=document.createElement("span");
        trail.className="scroll-cinema-trail";
        field.appendChild(trail);
    }
    document.body.appendChild(field);

    const progress=document.createElement("div");
    progress.className="cinema-progress";
    progress.setAttribute("aria-hidden","true");
    const progressBar=document.createElement("span");
    progress.appendChild(progressBar);
    document.body.appendChild(progress);

    const sections=[...document.querySelectorAll("main section")];
    const revealTargets=[...document.querySelectorAll(
        "main section .section-heading, main section .section-description, " +
        ".solution-card, .project-card, .about-card, .contact-card, .product-card, " +
        ".service-card, .featured-image, .approach-step, .stat"
    )];

    revealTargets.forEach((el,i)=>{
        el.setAttribute("data-cinema-reveal","");
        el.setAttribute("data-cinema-stagger","");
        el.style.setProperty("--cinema-index",String(i%6));
        const rect=el.getBoundingClientRect();
        if(rect.left<window.innerWidth*.42) el.setAttribute("data-cinema-depth","left");
        else if(rect.left>window.innerWidth*.58) el.setAttribute("data-cinema-depth","right");
    });

    const parallaxTargets=[...document.querySelectorAll(
        ".solution-visual, .project-visual, .featured-image, .about-image, .hero-grid"
    )];
    parallaxTargets.forEach(el=>el.setAttribute("data-cinema-parallax",""));

    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("is-cinema-visible");
            }
        });
    },{threshold:.12,rootMargin:"0px 0px -8% 0px"});
    revealTargets.forEach(el=>observer.observe(el));

    let ticking=false;
    const update=()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{
            const doc=document.documentElement;
            const max=Math.max(1,doc.scrollHeight-window.innerHeight);
            const pct=Math.min(1,Math.max(0,window.scrollY/max));
            progressBar.style.width=(pct*100)+"%";
            field.style.setProperty("--scroll-glow-y",(pct*100)+"%");
            parallaxTargets.forEach((el,i)=>{
                const r=el.getBoundingClientRect();
                if(r.bottom<0||r.top>window.innerHeight) return;
                const center=r.top+r.height/2;
                const offset=(center-window.innerHeight/2)/window.innerHeight;
                el.style.transform="translate3d(0,"+(offset*(i%3+1)*-7).toFixed(1)+"px,0)";
            });
            sections.forEach(section=>{
                const r=section.getBoundingClientRect();
                section.classList.toggle("cinema-section-active",r.top<window.innerHeight*.58&&r.bottom>window.innerHeight*.22);
            });
            ticking=false;
        });
    };
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update,{passive:true});
    update();
})();
