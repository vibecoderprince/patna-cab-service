// RideNexa shared interactions: navbar state, form feedback and scroll controls.
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".rn-navbar");
  const scrollTopButton = document.querySelector(".scroll-top");
  const toastElement = document.getElementById("successToast");
  const toast = toastElement && window.bootstrap ? new bootstrap.Toast(toastElement) : null;

  const setDefaultDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const dateValue = tomorrow.toISOString().slice(0, 10);
    const timeValue = "09:30";

    document.querySelectorAll('input[type="date"]').forEach((input) => {
      if (!input.value) {
        input.value = dateValue;
      }
      input.min = now.toISOString().slice(0, 10);
    });

    document.querySelectorAll('input[type="time"]').forEach((input) => {
      if (!input.value) {
        input.value = timeValue;
      }
    });
  };

  const updateChrome = () => {
    if (navbar) {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 40);
    }

    if (scrollTopButton) {
      scrollTopButton.classList.toggle("show", window.scrollY > 420);
    }
  };

  setDefaultDateTime();
  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll(".needs-feedback").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.remove("was-validated");
      if (toast) {
        toast.show();
      } else {
        alert("Thank you. RideNexa will contact you shortly.");
      }
    });
  });
});

// --- Single Page Application (SPA) Active Scrollspy Link Highlighter ---
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('header, section');
    const navLinks = document.querySelectorAll('.rn-navbar .nav-link');

    function activateNavbarLink() {
        let scrollPosition = window.scrollY || document.documentElement.scrollTop;
        
        // Offset padding taaki header screen par aate hi color change trigger ho jaye
        const offsetTrigger = 150; 

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offsetTrigger;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll aur Load dono events par active checker call hoga
    window.addEventListener('scroll', activateNavbarLink);
    window.addEventListener('load', activateNavbarLink);
});

// --- SPA HERO HEADER QUICK BOOKING AUTO-COMPLETION MODULE ---
window.addEventListener('DOMContentLoaded', () => {
    
    // Core Autocomplete suggestion engine function mapping
    function initHeroAutocomplete(inputId, dropdownId) {
        const inputField = document.getElementById(inputId);
        const suggestionDropdown = document.getElementById(dropdownId);

        if (!inputField || !suggestionDropdown) return;

        // Tracks keystroke strings inside input node fields
        inputField.addEventListener('input', function() {
            const queryValue = this.value.trim();

            // Drops call loops if character string count is less than 3
            if (queryValue.length < 3) {
                suggestionDropdown.classList.add('d-none');
                return;
            }

            // Calls Nominatim OpenStreetMap structural geo API wrapper link
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryValue)}&limit=5&countrycodes=in`)
                .then(response => response.json())
                .then(data => {
                    suggestionDropdown.innerHTML = '';
                    
                    if (data.length > 0) {
                        suggestionDropdown.classList.remove('d-none');
                        
                        data.forEach(item => {
                            const listItem = document.createElement('li');
                            listItem.className = 'list-group-item';
                            listItem.style.cursor = 'pointer';
                            listItem.style.fontSize = '13px';
                            listItem.textContent = item.display_name;

                            // Triggers on click selecting a suggestion node value
                            listItem.addEventListener('click', function() {
                                inputField.value = item.display_name;
                                suggestionDropdown.classList.add('d-none');
                            });
                            
                            suggestionDropdown.appendChild(listItem);
                        });
                    } else {
                        suggestionDropdown.classList.add('d-none');
                    }
                })
                .catch(error => console.error("Error loading mapping data metrics:", error));
        });

        // Hide autocomplete element block on focus loss checks
        document.addEventListener('click', function(event) {
            if (event.target !== inputField) {
                suggestionDropdown.classList.add('d-none');
            }
        });
    }

    // Launch configuration rules for home form nodes
    initHeroAutocomplete('homePickup', 'homePickupSuggestions');
    initHeroAutocomplete('homeDrop', 'homeDropSuggestions');
});

// --- FORCE ULTRA-SMOOTH FRONT-END SLIDER PERFORMANCE (WITH FULL HERO HOVER & FOCUS PAUSE) ---
document.addEventListener("DOMContentLoaded", () => {
  const heroCarouselElement = document.getElementById('masterHeroCarousel');
  const heroSectionElement = document.querySelector('.hero-section');
  
  if (heroCarouselElement && typeof bootstrap !== 'undefined') {
    // Slider instance initialization with customized loops
    const smoothCarousel = new bootstrap.Carousel(heroCarouselElement, {
      interval: 5500, // Slide badalne ka samay (5.5 seconds)
      ride: 'carousel',
      pause: hover,   // Bootstrap ka default element-specific pause false rakhenge
      wrap: true
    });

    // 1. GLOBAL MOUSE HOVER CONTROLS (Pure Hero Section par kahin bhi pointer aane par pause)
    if (heroSectionElement) {
      heroSectionElement.addEventListener('mouseenter', () => {
        smoothCarousel.pause();
      });
      
      heroSectionElement.addEventListener('mouseleave', () => {
        // Agar user abhi bhi kisi form input field par typing kar raha hai, toh mouse hatne par bhi pause rahega
        if (!heroSectionElement.contains(document.activeElement)) {
          smoothCarousel.cycle();
        }
      });
    }

    // 2. FORM TYPING FOCUS CONTROLS (Mobile aur Keyboard navigation ke liye safety fallback)
    const formsToPause = document.querySelectorAll('.hero-booking-card-wrapper, .custom-contact-card-ui, .premium-enquiry-form-card');
    
    formsToPause.forEach(card => {
      card.addEventListener('focusin', () => {
        smoothCarousel.pause();
      });
      
      card.addEventListener('focusout', () => {
        setTimeout(() => {
          // Check karega agar focus poore hero container ke bahar chala gaya hai tabhi slide chalegi
          if (heroSectionElement && !heroSectionElement.contains(document.activeElement)) {
            smoothCarousel.cycle();
          }
        }, 50);
      });
    });

    // Anti-flicker virtual blur trigger during active structural cycling updates
    heroCarouselElement.addEventListener('slide.bs.carousel', () => {
      const activeEl = document.activeElement;
      if (activeEl && !activeEl.closest('.hero-booking-card-wrapper, .custom-contact-card-ui, .premium-enquiry-form-card')) {
        document.querySelectorAll('.hero-section input, .hero-section select').forEach(el => el.blur());
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {

    const heroCarousel = document.getElementById("masterHeroCarousel");

    function goToWashSlide(planValue) {

        // Hero carousel ke 2nd slide (Car Wash) par le jao
        const carousel = bootstrap.Carousel.getOrCreateInstance(heroCarousel);
        carousel.to(1);

        // Thoda wait taki slide change ho jaye
        setTimeout(() => {

            // Wash section hero me scroll
            document.querySelector(".hero-section")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            // Package auto select
            const radio = document.querySelector(
                `input[name="heroWashPlan"][value="${planValue}"]`
            );

            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event("change"));
            }

        }, 500);
    }

    document.getElementById("selectBasic")?.addEventListener("click", e => {
        e.preventDefault();
        goToWashSlide("299");
    });

    document.getElementById("selectPremium")?.addEventListener("click", e => {
        e.preventDefault();
        goToWashSlide("499");
    });

    document.getElementById("selectInterior")?.addEventListener("click", e => {
        e.preventDefault();
        goToWashSlide("799");
    });

});