'use strict';

class QueryApi {

    constructor(config) {

        this.config = {
            id: config.id,
            endpoint: config.endpoint,
            query: {
                per_page: parseInt(config?.query?.per_page) || 6,
                page: parseInt(config?.query?.page) || 1,
                args: config?.query?.args || '',
            },
            containerClass: (config?.containerClass || '' == config?.containerClass) ? config?.containerClass : '',
            contentClass: (config?.contentClass || '' == config?.contentClass) ? config?.contentClass : 'row',
            loadmore: config?.loadmore || false,
            loadmoreArgs: {
                more: config?.loadmore?.more || 'Voir plus',
                spinner: (config?.loadmore?.spinner || '' == config?.loadmore?.spinner) ? config?.loadmore?.spinner : `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`,
                loading: (config?.loadmore?.loading || '' == config?.loadmore?.loading) ? config?.loadmore?.loading : `Chargement...`,
                btnClassName: (config?.loadmore?.btnClassName || '' == config?.loadmore?.btnClassName) ? config?.loadmore?.btnClassName : 'btn btn-primary',
            },
            pagination: config?.pagination || false,
            paginationArgs: {
                arrows: ( Boolean(config?.pagination?.arrows) || undefined == config?.pagination?.arrows ) ? true : false,
                next: config?.pagination?.next || 'Suivant',
                prev: config?.pagination?.prev || 'Précédent',
            },
            informations: (undefined == config?.informations) || (false !== Boolean(config?.informations)) ? true : false,
            informationsArgs: {
                results: ( Boolean(config?.informations?.results) || undefined == config?.informations?.results ) ? true : false,
                pages: ( Boolean(config?.informations?.pages) || undefined == config?.informations?.pages ) ? true : false,
                loading: ( Boolean(config?.informations?.loading) || undefined == config?.informations?.loading ) ? true : false,
            },
            skeleton: config?.skeleton || false,
            skeletonArgs: {
                nbItems: config?.skeleton?.nbItems || '',
                className: config?.skeleton?.className || 'skeletons-list row',
                template: config?.skeleton?.template || `
                    <div class="skeleton-card col-sm-4">
                        <div class="ske-img primary-light-loading"></div>
                        <div class="ske-title gray-loading"></div>
                        <div class="ske-sub-title col-8 gray-loading"></div>
                    </div>
                `,
            },
            selectors: {
                container: `#${config.id}`,
                content: `#${config.id} .content-area`,
                pagination: `#${config.id} .pagination-area`,
                loadmoreBtn: `#${config.id} .btn-load-more`,
                informations: `#${config.id} .informations-area`,
                filters: `#${config.id} .filters-area`,
                filter: `#${config.id} .filter-by`,
                search: `#${config.id} .search-area`,
                searchForm: `#${config.id} .search-area form`,
                searchBtn: `#${config.id} .search-area button`,
                searchInput: `#${config.id} .search-area input`,
                skeleton: `#${config.id} .skeleton-area`,
                skeletonList: `#${config.id} .skeletons-list`,
                skeletonTpl: `#${config.id} .skeleton-template`,
            },
            messages: {
                nbItem: config?.messages?.nbItem || "contenu",
                nbItems: config?.messages?.nbItems || "contenus",
                emptyContent: config?.messages?.emptyContent || `Aucun contenu`,
                emptyFilter: config?.messages?.emptyFilter || `pour les critères sélectionnés`,
                emptySearch: config?.messages?.emptySearch || `pour votre recherche`,
                error: config?.messages?.error || "Chargement impossible, une erreur est survenue",
                loading: config?.messages?.loading || "Chargement en cours...",
                result: config?.messages?.results || "résultat pour",
                results: config?.messages?.results || "résultats pour",
                pageResults: (config?.messages?.pageResults || '' == config?.messages?.pageResults) ? config?.messages?.pageResults : "page",
            },
            debug: Boolean(config?.debug) || false,
        };

        this.options();
        this.init();
    }

    options() {
        this.config.query = {...this.config.query,...this.config.query.args};
        this.config.skeleton = this.config.skeleton ? {...this.config.skeleton,...this.config.skeletonArgs} : this.config.skeleton;
        this.config.pagination = this.config.pagination ? {...this.config.pagination,...this.config.paginationArgs} : this.config.pagination;
        this.config.loadmore = this.config.loadmore ? {...this.config.loadmore,...this.config.loadmoreArgs} : this.config.loadmore;
        this.config.informations = this.config.informations ? {...this.config.informations,...this.config.informationsArgs} : false;

        delete this.config.query.args;
        delete this.config.skeletonArgs;
        delete this.config.paginationArgs;
        delete this.config.loadmoreArgs;
        delete this.config.informationsArgs;

        if ( this.config.pagination && this.config.loadmore ) {
            this.config.pagination = false;
        }

        this.config.paginate = this.config.pagination ? 'pagination' : ((this.config.loadmore) ? ('loadmore') : false);
    }

    init() {

        if ( !this.config.id ) {
            return;
        }

        if ( this.config.debug ) {
            console.log(this.config);
        }

        const appContainer = document.getElementById(this.config.id);

        if ( null !== appContainer ) {
            appContainer.classList.add('app-container');

            if ( '' != this.config.containerClass ) {
                let containerClasses = this.config.containerClass.split(' ');
                appContainer.classList.add(...containerClasses);
            }
        }

        const contentArea = document.querySelector(this.config.selectors.content);

        if ( null !== contentArea ) {

            if ( '' != this.config.contentClass ) {
                let contentClasses = this.config.contentClass.split(' ');
                contentArea.classList.add(...contentClasses);
            }

            if ( this.config.pagination || this.config.loadmore ) {
                contentArea.insertAdjacentHTML('afterend',`<div class="pagination-area"></div>`);

                const paginationArea = document.querySelector(`${this.config.selectors.pagination}`);

                if ( null !== paginationArea && null !== contentArea ) {
                    paginationArea.classList.add(`${this.config.paginate}-pagination`);

                    if ( this.config.pagination && this.config.pagination.arrows == false ) {
                        paginationArea.classList.add('basic-pagination');
                    }

                    if ( this.config.loadmore ) {
                        const loadmoreBtnHtml = `<span class="${this.config.loadmore.btnClassName} btn-load-more d-none"><span>${this.config.loadmore.more}</span></span>`;
                        paginationArea.innerHTML = loadmoreBtnHtml;
                        this.loadmore();
                    }
                }
            }

            if ( this.config.skeleton ) {

                const skeletons = `
                    <div class="skeleton-area">
                        <div class="${this.config.skeleton.className}"></div>
                    </div>
                    <template class="skeleton-template">${this.config.skeleton.template}</template>
                `;

                contentArea.insertAdjacentHTML('afterend',skeletons);

                const items = (this.config.skeleton.nbItems || this.config.query.per_page);
                const skeletonArea = document.querySelector(this.config.selectors.skeleton);

                if ( null !== skeletonArea ) {
                    const skeletonTemplate = document.querySelector(this.config.selectors.skeletonTpl);
                    const skeParent = document.querySelector(`${this.config.selectors.skeleton} > div`);

                    for (let i = 0; i < items; i++) {
                        skeParent.append(skeletonTemplate.content.cloneNode(true));
                    }
                }
            }
        }

        this.render();
        this.filters();
        this.search();
    }

    url(params = this.config.query) {
        const query = Object.keys(params).map(key => key + '=' + params[key]).join('&').toString();
        const appId = this.config.debug ? `app-id=${this.config.id}&` : '';
        const url = `${wp_api.rest_url}/${this.config.endpoint}?${appId}${query}`;
        return url;
    }
    loadmore(parameters = this.config) {
        const loadMoreButton = document.querySelector(parameters.selectors.loadmoreBtn);

        if ( null !== loadMoreButton ) {

            loadMoreButton.addEventListener('click', (e) => {
                e.preventDefault();

                if ( parameters.nextPage && parameters.nextPage > 1  ) {
                    parameters.query.page = parameters.nextPage;
                    this.render();
                }
            });
        }
    }
    filters(parameters = this.config) {
        const filtersCols = document.querySelectorAll(parameters.selectors.filter);

        if ( null !== filtersCols ) {
            const contentArea = document.querySelector(parameters.selectors.content);
            let taxonomies = [];

            const filterTerms = (filters,termsType = '') => {
                return (termsType == 'array') ? Array.from(filters).filter(i => i.checked).map(i => i.value).filter(i => i) : filters.value;
            }
            const setQuery = (col,terms) => {
                let taxonomy = col.dataset.taxonomy;
                parameters.query[taxonomy] = terms.toString();
                parameters.query.page = 1;
                contentArea.innerHTML = '';
            }

            filtersCols.forEach(col => {
                const filtersCheckboxes = col.querySelectorAll('input[type="checkbox"]');
                const filtersRadios = col.querySelectorAll('input[type="radio"]');
                const filtersSelect = col.querySelectorAll('select');
                const checkboxAllContainer = col.querySelector('.form-check-all');
                const checkboxAll = col.querySelector('.form-check-input-all');

                taxonomies.push(col.dataset.taxonomy);

                if ( null !== contentArea && null !== filtersRadios ) {

                    filtersRadios.forEach(radio => {

                        radio.addEventListener('click', () => {
                            setQuery(col,filterTerms(radio));
                            this.render();
                        });
                    });
                }
                if ( null !== contentArea && null !== filtersCheckboxes ) {

                    filtersCheckboxes.forEach(checkbox => {

                        checkbox.addEventListener('click', () => {
                            let terms = filterTerms(filtersCheckboxes,'array');

                            if ( null !== checkboxAll && null !== checkboxAllContainer ) {

                                if ( terms && checkboxAll.checked == true ) {
                                    checkboxAll.checked = false;
                                    checkboxAllContainer.classList.remove('disabled');
                                }
                                if ( !terms.length && checkboxAll.checked == false ) {
                                    checkboxAll.checked = true;
                                    checkboxAllContainer.classList.add('disabled');
                                }
                                if ( checkbox.classList.contains('form-check-input-all') ) {

                                    filtersCheckboxes.forEach(checkbox => {

                                        if ( !checkbox.classList.contains('form-check-input-all') ) {
                                            checkbox.checked = false;
                                            checkboxAllContainer.classList.add('disabled');
                                        }
                                    });
                                    checkboxAll.checked = true;
                                    terms = [''];
                                }
                            }
                            setQuery(col,terms);
                            this.render();
                        });
                    });
                }
                if ( null !== contentArea && null !== filtersSelect ) {

                    filtersSelect.forEach(select => {

                        select.addEventListener('change', () => {
                            setQuery(col,filterTerms(select));
                            this.render();
                        });
                    });
                }
            });

            parameters.filters = taxonomies;
        }
    }
    search(parameters = this.config) {

        const searchInput = document.querySelector(parameters.selectors.searchInput);
        const searchSubmit = document.querySelector(parameters.selectors.searchBtn);
        const contentArea = document.querySelector(parameters.selectors.content);

        if ( null !== searchInput && null !== searchSubmit && contentArea ) {

            searchSubmit.addEventListener('click', (e) => {
                e.preventDefault();

                let currentSearch = searchInput.value && (typeof searchInput.value === 'string') ? searchInput.value.toString() : '';
                parameters.query.page = 1;
                contentArea.innerHTML = '';
                parameters.query.search = currentSearch;
                this.render();
            });
            searchInput.addEventListener('input', (e) => {

                if ( !searchInput.value ) {
                    parameters.query.page = 1;
                    parameters.query.search = '';
                    contentArea.innerHTML = '';
                    this.render();
                }
            });
        }
    }
    informations(parameters = this.config) {
        const infosContainer = document.querySelector(parameters.selectors.informations);

        if ( null !== infosContainer ) {
            const hasPagesOption = this.config.informations.pages;
            const hasResultsOption = this.config.informations.results;
            const itemTitle = `${parameters.totalItems > 1 ? parameters.messages.nbItems : parameters.messages.nbItem}`;
            let status = '';
            let paginateResults = hasPagesOption ? `<span class="ia-pages">${parameters.messages.pageResults} <span>${parameters.currentPage}/${parameters.totalPages}</span></span>` : '';
            let nbTtotalResults = `<b class="ia-nb-results">${parameters.totalItems}</b>`;

            if ( hasResultsOption && hasPagesOption ) {
                paginateResults = `<span class="ia-sep">,&nbsp;</span> ${paginateResults}`;
            }

            if ( parameters.totalItems === 0 ) {
                status = parameters.messages.emptyContent;

                if ( 'search' in parameters.query && '' != parameters.query.search ) {
                    status += ` ${parameters.messages.emptySearch}`;
                }
                else if ( parameters.filtered ) {
                    status += ` ${parameters.messages.emptyFilter}`;
                }

                infosContainer.dataset.status = 'empty';
            }
            else if ( parameters.totalItems > 0 && ('search' in parameters.query && '' !== parameters.query.search) ) {
                infosContainer.dataset.status = 'search-result';
                const searchResultitemTitle = ` <span class="ia-result-item">${parameters.totalItems > 1 ? parameters.messages.results : parameters.messages.result}</span> <b class="ia-query-search">"${parameters.query.search}"</b>`;
                status = `<span class="ia-results ia-search-results">${hasResultsOption ? nbTtotalResults + '' + searchResultitemTitle : ''}</span>${paginateResults}`;
            }
            else if ( parameters.totalItems > 0 ) {
                infosContainer.dataset.status = 'total';

                if (hasResultsOption) {
                    status = `<span class="ia-results">${nbTtotalResults} <span class="ia-result-item">${itemTitle}</span></span>`;
                }
                status += paginateResults;
            }
            else {
                infosContainer.dataset.status = 'error';
                status = parameters.messages.error;
            }

            infosContainer.innerHTML = `${status}`;
        }
    }
    pagination(parameters = this.config) {
        const currentpage = parseInt(parameters.query.page);
        const totalpages = parseInt(parameters.totalPages);
        const paginationArea = document.querySelector(parameters.selectors.pagination);

        if ( (currentpage && totalpages) && totalpages > 1 ) {
            const appId = parameters.id;
            let delta = '';
            let pagesHtml = '';
            const getRange = (start, end) => {
                return Array(end - start + 1)
                    .fill()
                    .map((v, i) => i + start);
            }
            if (totalpages <= 5) {
                delta = 5;
            } else {
                delta = currentpage > 4 && currentpage < totalpages - 3 ? 2 : 4;
            }
            const range = {
                start: Math.round(currentpage - delta / 2),
                end: Math.round(currentpage + delta / 2),
            }
            if (range.start - 1 === 1 || range.end + 1 === totalpages) {
                range.start += 1;
                range.end += 1;
            }
            let pages =
                currentpage > delta ?
                getRange(Math.min(range.start, totalpages - delta), Math.min(range.end, totalpages)) :
                getRange(1, Math.min(totalpages, delta + 1));
            const withDots = (value, pair) => (pages.length + 1 !== totalpages ? pair : [value]);
            if (pages[0] !== 1) {
                pages = withDots(1, [1, '...']).concat(pages);
            }
            if (pages[pages.length - 1] < totalpages) {
                pages = pages.concat(withDots(totalpages, ['...', totalpages]));
            }
            if ( pages ) {

                pages.forEach(page => {

                    let firstPage = page === 1 ? 'first ' : '';
                    let lastPage = page === totalpages ? 'last ' : '';
                    let activePage = page === currentpage ? ` class="page-numbers current" aria-current="page"` : '';

                    if ( page === '...' ) {
                        pagesHtml += `<span class="dots">${page}</span>`;
                    }
                    else {

                        if ( activePage ) {
                            pagesHtml += `<span${activePage}>${page}</span>`;
                        }
                        else {
                            pagesHtml += `<a class="${firstPage}${lastPage}page-numbers" href="${page}"><span>${page}</span></a>`;
                        }
                    }
                });

                let isFirstLink = currentpage && currentpage === 1;
                let isLastLink = currentpage && totalpages && (currentpage === totalpages);
                let prevLink = (parameters.pagination && parameters.pagination.arrows) ? `<a class="nav-links-aside prev${ isFirstLink ? ' disabled' : ''}" href="${ isFirstLink ? currentpage : (currentpage - 1) }"><i class="fa-solid fa-arrow-left"></i><span>${parameters.pagination.prev}</span></a>` : '';
                let nextLink = (parameters.pagination && parameters.pagination.arrows) ? `<a class="nav-links-aside next${ isLastLink ? ' disabled' : ''}" href="${ isLastLink ? totalpages : (currentpage + 1) }"><span>${parameters.pagination.next}</span><i class="fa-solid fa-arrow-right"></i></a>` : '';

                const paginationHtml = pagesHtml ? `<div class="pa-pagination pagination"><div class="nav-links-container">${prevLink}<div class="nav-links">${pagesHtml}</div>${nextLink}</div></div>` : '';

                if ( null !== paginationArea && paginationHtml ) {
                    paginationArea.innerHTML = paginationHtml;
                    const pagesLinks = document.querySelectorAll(`#${appId} .nav-links-container a`);

                    if ( null !== pagesLinks ) {

                        pagesLinks.forEach(link => {

                            link.addEventListener('click', (e) => {
                                e.preventDefault();

                                const current = document.querySelector(`#${appId} .page-numbers.current`);

                                if ( current ) {
                                    current.classList.remove('current');
                                    current.removeAttribute('aria-current');
                                }
                                if ( link.classList.contains('nav-links-aside') ) {
                                    let pageIndex = link.getAttribute('href').replace('#', '');
                                    let classicPages = pageIndex ? document.querySelector(`#${appId} .nav-links a[href="${pageIndex}"]`) : false;

                                    if ( classicPages ) {
                                        classicPages.classList.add('current');
                                    }
                                }
                                else {
                                    link.classList.add('current');
                                }

                                const pageNumber = link.getAttribute('href').replace('#', '');
                                parameters.query.page = pageNumber;
                                this.render();
                            });
                        });
                    }
                }
            }
        }
        else {
            paginationArea.innerHTML = '';
        }
    }
    addLoader(parameters = this.config) {
        const appContainer = document.querySelector(parameters.selectors.container);
        const infosContainer = document.querySelector(parameters.selectors.informations);

        if ( null !== appContainer ) {
            const loadMoreButton = document.querySelector(parameters.selectors.loadmoreBtn);
            const filtersContainer = document.querySelector(parameters.selectors.filters);
            const contentArea = document.querySelector(parameters.selectors.content);

            if ( null !== infosContainer ) {
                infosContainer.dataset.status = 'loading';
                infosContainer.innerText = parameters.informations.loading ? parameters.messages.loading : '';
            }

            if ( null !== contentArea && parameters.pagination ) {
                contentArea.innerHTML = '';
            }

            appContainer.classList.remove('loading-success');

            if ( null !== filtersContainer ) {
                filtersContainer.classList.add('is-filtering');
            }
            if ( null !== loadMoreButton ) {
                loadMoreButton.querySelector('span').innerHTML = `${parameters.loadmore.spinner} ${parameters.loadmore.loading}`;
            }
            if ( parameters.skeleton ) {
                const skeletonsList = document.querySelector(parameters.selectors.skeletonList);

                if ( null !== skeletonsList ) {
                    skeletonsList.classList.remove('d-none');
                }
            }
        }
    }
    removeLoader(parameters = this.config) {
        const appContainer = document.querySelector(parameters.selectors.container);

        if ( null !== appContainer ) {
            const loadMoreButton = document.querySelector(parameters.selectors.loadmoreBtn);
            const filtersContainer = document.querySelector(parameters.selectors.filters);

            if ( parameters.skeleton ) {
                const skeletonsList = document.querySelector(parameters.selectors.skeletonList);

                if ( null !== skeletonsList ) {
                    skeletonsList.classList.add('d-none');
                }
            }

            if ( null !== loadMoreButton ) {
                loadMoreButton.classList.add('d-none');
            }

            appContainer.classList.add('loading-success');

            if ( null !== filtersContainer ) {
                filtersContainer.classList.remove('is-filtering');
            }
            if ( null !== loadMoreButton && parseInt(parameters.nextPage) > 1 ) {
                loadMoreButton.querySelector('span').innerText = parameters.loadmore.more;
                loadMoreButton.classList.remove('d-none');
            }
        }
    }
    request = async (url) => {

        const args = {
            method: 'GET',
            headers: {
                'X-WP-Nonce': wp_api.nonce,
                'content-type': 'application/json',
            },
        };
        const response = await fetch(url, args);
        const searchUrl = new URL(url);
        const parameters = this.config;
        const filters = parameters.filters;

        if (response.ok) {
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const totalItems = parseInt(response.headers.get('X-WP-Total'));
                const totalPages = parseInt(response.headers.get('X-WP-TotalPages'));
                const searchCurrentPage = searchUrl && searchUrl.searchParams.get('page');

                if ( filters ) {
                    filters.forEach(filter => {
                        parameters.filtered = searchUrl && searchUrl.searchParams.get(filter) ? 1 : 0;
                    });
                }

                parameters.totalItems = parseInt(totalItems);
                parameters.totalPages = parseInt(totalPages);
                parameters.currentPage = parseInt(parameters.query.page);

                if ( parameters.paginate ) {
                    const currentPage = searchCurrentPage && searchCurrentPage > 1 ? parseInt(searchCurrentPage) : parseInt(1);
                    parameters.currentPage = parseInt(currentPage);
                    parameters.nextPage = parseInt(totalPages) > 1 && parseInt(currentPage) < parseInt(totalPages) ? (currentPage + 1) : parseInt(0);
                }

                return response.json();
            }
            else {
                return "This is not  JSON!";
            }
        }
        else {
            const contentArea = document.querySelector(parameters.selectors.content);

            if (contentArea) {
                contentArea.innerHTML = '';
            }
        }
    };
    async render(url = this.url()) {

        this.addLoader();

        this.request(url)
        .then( datas => {
            if ( datas ) {
                const parameters = this.config;
                const contentArea = document.querySelector(parameters.selectors.content);
                const paginationArea = document.querySelector(parameters.selectors.pagination);

                if ( parameters && contentArea ) {

                    if ( datas && datas.length ) {
                        let html = '';

                        datas.forEach((data,index) => {
                            let item = this.template(data,index,length = datas.length);
                            html += item;
                        });

                        if ( this.config.pagination || this.config.loadmore ) {

                            if ( this.config.pagination )  {
                                this.pagination();
                                contentArea.innerHTML = html;
                            }
                            else if ( this.config.loadmore ) {

                                if ( parameters.query.page && parameters.query.page <= 1 ) {
                                    contentArea.innerHTML = html;
                                }
                                else {
                                    contentArea.insertAdjacentHTML('beforeend',html);
                                }
                            }
                        }
                        else {
                            contentArea.innerHTML = html;
                        }
                    }
                    else {
                        contentArea.innerHTML = '';

                        if ( this.config.pagination ) {
                            paginationArea.innerHTML = '';
                        }
                    }
                }
            }
            this.js();
            this.removeLoader();
            this.informations();
        });
    }
    template(data,index,length) {
        return `<div class="col-sm-4 mb-4" data-index="${index}" data-length="${length}">
            <div class="card h-100">
                <div class="card-body">
                    <div class="card-title"><b>${data.title.rendered}</b></div>
                </div>
            </div>
        </div>`;
    }
    js() {}
}
