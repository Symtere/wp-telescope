function debounce(func, wait, immediate) {
    var timeout;

    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/*
window.addEventListener('wheel', debounce(function(e) {
    slideAnim(event);
}, 90));
*/

//== Close offAsideMenuCanvas on resize
const asideMenu = document.getElementById('aside-menu');
if (null != asideMenu) {

    const offAsideMenuCanvas = new bootstrap.Offcanvas(asideMenu);

    window.addEventListener('resize', debounce((e) => {
        offAsideMenuCanvas.hide();
    }, 40));
}

//== Avoid menu close onclick inside dropdown menu
const asideDropdown = document.querySelector('#aside-menu .dropdown-menu');
if (asideDropdown != null) {

    document.querySelector('#aside-menu .dropdown-menu').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

//== Sticky header (for animation)
function addStickyClassToHeader() {

    const header = document.getElementById('header');

    if (null != header) {

        window.addEventListener('scroll', debounce((e) => {

            if (window.pageYOffset > 0) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        }, 10));
    }
}
addStickyClassToHeader();

//== Sliders
const swiperLoader = {

    on: {
        afterInit: (e) => {
            e.el.classList.remove('swiper-is-loading');
        },
    },
}

document.addEventListener('DOMContentLoaded', (event) => {

    //== Parallax
    function setBannerParallax() {
        const banners = document.querySelectorAll('.wp-block-cover.is-style-has-parallax');

        if (banners) {

            banners.forEach(banner => {
                banner.classList.add('jarallax');
                const bannerImg = banner.querySelector('.wp-block-cover__image-background');

                if (bannerImg) {
                    bannerImg.classList.add('jarallax-img');

                    jarallax(banner, {
                        speed: 0.5,
                        imgPosition: '50% 0',
                    });
                }
            });
        }
    }
    setBannerParallax();

    //== Header sticky if no banner first
    const noBannerFirst = document.querySelector('.site-main .container > .no-page-banner-first');
    const body = document.querySelector('body');

    if (null !== noBannerFirst && null !== body) {
        body.classList.add('has-header-bg');
    }

    //== Swiper news

    const swiper = new Swiper('.news-list', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: false,
        navigation: {
            nextEl: '.news-button-next',
            prevEl: '.news-button-prev',
        },
        breakpoints: {
            // when window width is >= 320px
            0: {
                slidesPerView: 1
            },
            // when window width is >= 480px
            575: {
                slidesPerView: 2
            },
            // when window width is >= 640px
            991: {
                slidesPerView: 3
            }
        }
    })
});
