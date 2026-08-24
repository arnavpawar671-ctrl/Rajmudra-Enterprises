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
