/* =========================================================
   RAJMUDRA ENTERPRISES
   PREMIUM INTERACTION ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const loader =
        document.getElementById("pageLoader");

    const header =
        document.getElementById("siteHeader");

    const menuBtn =
        document.getElementById("menuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const progress =
        document.getElementById("scrollProgress");

    const revealElements =
        document.querySelectorAll(".reveal");

    const counters =
        document.querySelectorAll(".counter");

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".desktop-nav a"
        );

    const parallaxElements =
        document.querySelectorAll(
            "[data-parallax]"
        );

    const year =
        document.getElementById("year");


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (loader) {
                loader.classList.add("hidden");
            }

        }, 450);

    });


    /* =====================================================
       HEADER
       ===================================================== */

    const updateHeader = () => {

        if (!header) {
            return;
        }

        if (window.scrollY > 35) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };


    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    const updateProgress = () => {

        if (!progress) {
            return;
        }

        const scrollTop =
            window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (scrollHeight <= 0) {

            progress.style.width = "0%";

            return;

        }

        const percentage =
            (scrollTop / scrollHeight) * 100;

        progress.style.width =
            `${Math.min(percentage, 100)}%`;

    };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (menuBtn && mobileNav) {

        menuBtn.addEventListener(
            "click",
            () => {

                const opened =
                    mobileNav.classList.toggle("open");

                menuBtn.classList.toggle(
                    "active",
                    opened
                );

                menuBtn.setAttribute(
                    "aria-expanded",
                    String(opened)
                );

                menuBtn.setAttribute(
                    "aria-label",
                    opened
                        ? "Close menu"
                        : "Open menu"
                );

            }
        );


        mobileNav
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileNav.classList.remove(
                            "open"
                        );

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
                );

            });

    }


    /* =====================================================
       ESCAPE CLOSE
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

                menuBtn.classList.remove(
                    "active"
                );

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       REVEAL OBSERVER
       ===================================================== */

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "visible"
                            );

                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: .12,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        revealElements.forEach(
            (element) => {

                observer.observe(element);

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       COUNTERS
       ===================================================== */

    const animateCounter = (
        element
    ) => {

        const target =
            Number(
                element.dataset.target
            );

        if (
            !Number.isFinite(target)
        ) {
            return;
        }

        if (reducedMotion) {

            element.textContent =
                target;

            return;

        }

        const duration = 1300;

        const start =
            performance.now();


        const update = (
            currentTime
        ) => {

            const elapsed =
                currentTime - start;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

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
                current;

            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    update
                );

            } else {

                element.textContent =
                    target;

            }

        };


        requestAnimationFrame(
            update
        );

    };


    if (
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            animateCounter(
                                entry.target
                            );

                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: .7
                }
            );


        counters.forEach(
            (counter) => {

                counterObserver.observe(
                    counter
                );

            }
        );

    } else {

        counters.forEach(
            animateCounter
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    if (
        "IntersectionObserver" in window &&
        sections.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const id =
                                entry.target.id;


                            navLinks.forEach(
                                (link) => {

                                    const href =
                                        link.getAttribute(
                                            "href"
                                        );

                                    link.classList.toggle(
                                        "active",
                                        href === `#${id}`
                                    );

                                }
                            );

                        }
                    );

                },
                {
                    rootMargin:
                        "-40% 0px -50% 0px"
                }
            );


        sections.forEach(
            (section) => {

                sectionObserver.observe(
                    section
                );

            }
        );

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

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

                        const position =
                            target
                                .getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight;

                        window.scrollTo({
                            top: position,
                            behavior:
                                reducedMotion
                                    ? "auto"
                                    : "smooth"
                        });

                    }
                );

            }
        );


    /* =====================================================
       PARALLAX
       ===================================================== */

    if (
        !reducedMotion &&
        parallaxElements.length
    ) {

        let ticking = false;


        const updateParallax = () => {

            const viewport =
                window.innerHeight;


            parallaxElements.forEach(
                (element) => {

                    const rect =
                        element.getBoundingClientRect();

                    if (
                        rect.bottom < -300 ||
                        rect.top > viewport + 300
                    ) {
                        return;
                    }

                    const center =
                        rect.top +
                        rect.height / 2;

                    const distance =
                        center -
                        viewport / 2;

                    const factor =
                        Number(
                            element.dataset.parallax
                        ) || .08;

                    const movement =
                        distance * factor * -1;


                    element.style.transform =
                        `translate3d(0, ${movement}px, 0)`;

                }
            );


            ticking = false;

        };


        window.addEventListener(
            "scroll",
            () => {

                if (ticking) {
                    return;
                }

                requestAnimationFrame(
                    updateParallax
                );

                ticking = true;

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       MAGNETIC BUTTON EFFECT
       ===================================================== */

    if (!reducedMotion) {

        const buttons =
            document.querySelectorAll(
                ".button, .header-cta"
            );


        buttons.forEach(
            (button) => {

                button.addEventListener(
                    "mousemove",
                    (event) => {

                        const rect =
                            button.getBoundingClientRect();

                        const x =
                            event.clientX -
                            rect.left -
                            rect.width / 2;

                        const y =
                            event.clientY -
                            rect.top -
                            rect.height / 2;

                        button.style.transform =
                            `translate(${x * .06}px, ${y * .06}px)`;

                    }
                );


                button.addEventListener(
                    "mouseleave",
                    () => {

                        button.style.transform =
                            "";

                    }
                );

            }
        );

    }


    /* =====================================================
       YEAR
       ===================================================== */

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       SCROLL EVENT
       ===================================================== */

    let scrollTicking = false;


    window.addEventListener(
        "scroll",
        () => {

            if (scrollTicking) {
                return;
            }

            requestAnimationFrame(
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
       INITIAL STATE
       ===================================================== */

    updateHeader();
    updateProgress();


    console.log(
        "Rajmudra Enterprises — premium experience initialized."
    );

});
