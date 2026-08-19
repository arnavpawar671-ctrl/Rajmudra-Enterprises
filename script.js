/* =========================================================
   RAJMUDRA ENTERPRISES — PREMIUM INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const header = document.getElementById("siteHeader");
    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");

    const progressBar =
        document.querySelector(".scroll-progress");

    const revealElements =
        document.querySelectorAll(".reveal");

    const counters =
        document.querySelectorAll("[data-count]");

    const parallaxElements =
        document.querySelectorAll("[data-parallax]");

    const yearElement =
        document.getElementById("year");


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };


    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    const updateProgress = () => {

        if (!progressBar) return;

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {

            progressBar.style.width = "0%";

            return;

        }

        const progress =
            (scrollTop / documentHeight) * 100;

        progressBar.style.width =
            `${Math.min(progress, 100)}%`;

    };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (menuBtn && mobileNav) {

        menuBtn.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.toggle("open");

                menuBtn.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                menuBtn.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close menu"
                        : "Open menu"
                );

                if (isOpen) {

                    menuBtn.classList.add("active");

                } else {

                    menuBtn.classList.remove("active");

                }

            }
        );


        /* Close mobile menu after navigation */

        const mobileLinks =
            mobileNav.querySelectorAll("a");

        mobileLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {

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

                }
            );

        });

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    if (
        !reducedMotion &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add(
                "is-visible"
            );

        });

    }


    /* =====================================================
       COUNTER ANIMATION
       ===================================================== */

    const animateCounter = (element) => {

        const target =
            Number(element.dataset.count);

        if (!Number.isFinite(target)) {
            return;
        }

        if (reducedMotion) {

            element.textContent =
                target.toString();

            return;

        }

        const duration = 1200;

        const startTime =
            performance.now();


        const updateCounter = (currentTime) => {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Smooth ease-out curve
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.round(
                    target * eased
                );


            element.textContent =
                current.toString();


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                element.textContent =
                    target.toString();

            }

        };


        requestAnimationFrame(
            updateCounter
        );

    };


    /* =====================================================
       COUNTER OBSERVER
       ===================================================== */

    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

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
                    threshold: 0.6
                }
            );


        counters.forEach((counter) => {

            counterObserver.observe(
                counter
            );

        });

    } else {

        counters.forEach((counter) => {

            animateCounter(counter);

        });

    }


    /* =====================================================
       PARALLAX
       ===================================================== */

    if (
        !reducedMotion &&
        parallaxElements.length
    ) {

        let ticking = false;


        const updateParallax = () => {

            const viewportHeight =
                window.innerHeight;


            parallaxElements.forEach(
                (element) => {

                    const rect =
                        element.getBoundingClientRect();


                    /*
                     * Ignore elements far outside
                     * the viewport.
                     */

                    if (
                        rect.bottom < -200 ||
                        rect.top > viewportHeight + 200
                    ) {
                        return;
                    }


                    const center =
                        rect.top +
                        rect.height / 2;


                    const distance =
                        center -
                        viewportHeight / 2;


                    const movement =
                        distance * -0.025;


                    element.style.transform =
                        `translate3d(0, ${movement}px, 0)`;

                }
            );


            ticking = false;

        };


        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateParallax
                    );

                    ticking = true;

                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".desktop-nav a[href^='#'], .mobile-nav a[href^='#']"
        );


    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;


                        navLinks.forEach((link) => {

                            const href =
                                link.getAttribute("href");


                            if (
                                href === `#${id}`
                            ) {

                                link.classList.add(
                                    "active"
                                );

                            } else {

                                link.classList.remove(
                                    "active"
                                );

                            }

                        });

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach((section) => {

            sectionObserver.observe(
                section
            );

        });

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight +
                        1;


                    window.scrollTo({

                        top: targetPosition,

                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }
            );

        });


    /* =====================================================
       IMAGE LOADING EFFECT
       ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach((image) => {

        if (image.complete) {

            image.classList.add(
                "loaded"
            );

        } else {

            image.addEventListener(
                "load",
                () => {

                    image.classList.add(
                        "loaded"
                    );

                },
                {
                    once: true
                }
            );

        }

    });


    /* =====================================================
       UPDATE YEAR
       ===================================================== */

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       INITIAL SCROLL STATE
       ===================================================== */

    updateHeader();
    updateProgress();


    /* =====================================================
       SCROLL EVENTS
       ===================================================== */

    let scrollTicking = false;


    window.addEventListener(
        "scroll",
        () => {

            if (scrollTicking) {
                return;
            }


            window.requestAnimationFrame(
                () => {

                    updateHeader();
                    updateProgress();

                    scrollTicking = false;

                }
            );


            scrollTicking = true;

        },
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

            updateHeader();
            updateProgress();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       KEYBOARD ACCESSIBILITY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                mobileNav &&
                mobileNav.classList.contains("open")
            ) {

                mobileNav.classList.remove(
                    "open"
                );

                if (menuBtn) {

                    menuBtn.classList.remove(
                        "active"
                    );

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuBtn.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                }

            }

        }
    );


    /* =====================================================
       PREVENT BROKEN IMAGE FEEL
       ===================================================== */

    images.forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

            }
        );

    });


    console.log(
        "Rajmudra Enterprises — Premium experience loaded."
    );

});
