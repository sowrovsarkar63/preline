import Component from '../../core/Component'

class HSScrollspy extends Component {
    constructor() {
        super('[data-hs-scrollspy] ')

        this.activeSection = null
    }

    init() {
        document.querySelectorAll(this.selector).forEach($scrollspyEl => {
            const $scrollspyContentEl = document.querySelector($scrollspyEl.getAttribute('data-hs-scrollspy'))
            const links = $scrollspyEl.querySelectorAll('[href]')
            const sections = $scrollspyContentEl.children
            const globalOffset = parseInt($scrollspyEl.getAttribute('data-hs-scrollspy-offset') || 0)
            const $scrollableEl = $scrollspyEl.getAttribute('data-hs-scrollspy-scrollable-parent') ? document.querySelector($scrollspyEl.getAttribute('data-hs-scrollspy-scrollable-parent')) : document

            Array.from(sections).forEach($sectionEl => {
                if (!$sectionEl.getAttribute('id')) return

                $scrollableEl.addEventListener('scroll', ev => this._update({
                    $scrollspyEl,
                    $scrollspyContentEl,
                    links,
                    $sectionEl,
                    globalOffset,
                    sections,
                    ev
                }))
            })

            links.forEach($link => {
                $link.addEventListener('click', e => {
                    e.preventDefault()
                    if ($link.getAttribute('href') === 'javascript:;') return
                    this._scrollTo({$scrollableEl, $link, globalOffset})
                })
            })
        })
    }

    _update({ev, $scrollspyEl, sections, links, $sectionEl, globalOffset}) {
        const userOffset = $sectionEl.getAttribute('data-hs-scrollspy-offset') || globalOffset
        const offsetScrollableParent = ev.target === document ? 0 : parseInt(ev.target.getBoundingClientRect().top)
        const topOffset = (parseInt($sectionEl.getBoundingClientRect().top) - userOffset) - offsetScrollableParent
        const height = $sectionEl.offsetHeight

        if (topOffset <= 0 && (topOffset + height) > 0) {
            if (this.activeSection === $sectionEl) return

            links.forEach($el => {
                $el.classList.remove('active')
            })

            const $relatedLinkEl = $scrollspyEl.querySelector(`[href="#${$sectionEl.getAttribute('id')}"]`)
            if ($relatedLinkEl) {
                $relatedLinkEl.classList.add('active')

                const $groupEl = $relatedLinkEl.closest('[data-hs-scrollspy-group]')
                if ($groupEl) {
                    const $parentLinkEl = $groupEl.querySelector('[href]')
                    if ($parentLinkEl) $parentLinkEl.classList.add('active')
                }
            }

            this.activeSection = $sectionEl
        }
    }

    _scrollTo({$scrollableEl, $link, globalOffset}) {
        const $sectionEl = document.querySelector($link.getAttribute('href'))
        const userOffset = $sectionEl.getAttribute('data-hs-scrollspy-offset') || globalOffset
        const offsetScrollableParent = $scrollableEl === document ? 0 : $scrollableEl.offsetTop
        const topOffset = ($sectionEl.offsetTop - userOffset) - offsetScrollableParent
        const $viewEl = $scrollableEl === document ? window : $scrollableEl

        window.history.replaceState(null, null, $link.getAttribute('href'))

        $viewEl.scrollTo({
            top: topOffset,
            left: 0,
            behavior: 'smooth'
        })
    }
}

window.HSScrollspy = new HSScrollspy()
document.addEventListener('load', window.HSScrollspy.init())