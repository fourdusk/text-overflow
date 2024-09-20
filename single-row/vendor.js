const observeElement = (ctx, canvas, el, text = '', opt = {}) => {
  const { maxLine = 3, type = 'normal' } = opt
  const dpr = window.devicePixelRatio
  const observer = new ResizeObserver(() => {
    const font = globalThis.getComputedStyle(el).font
    const lineHeight =
      parseInt(globalThis.getComputedStyle(el).lineHeight) ??
      parseInt(globalThis.getComputedStyle(document.body).lineHeight)
    const maxWidth = el.offsetWidth
    const finalText = text.trim()
    canvas.width = Math.round(maxWidth * dpr)
    canvas.height = Math.round(lineHeight * maxLine * dpr)
    canvas.style.width = maxWidth + 'px'
    canvas.style.height = lineHeight * maxLine + 'px'
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const append = '...'
    const clampText = getClampContent(ctx, finalText, {
      font,
      lineHeight,
      maxWidth,
      maxLine,
      append
    })
    el.innerHTML = clampText.clampContent
    let rafId = null
    switch (type) {
      case 'hover':
        el.title = clampText.isOverflow ? finalText : ''
        break
      case 'mid':
        el.title = clampText.isOverflow ? finalText : ''
        if (clampText.isOverflow) {
          const deltaLength = finalText.length - clampText.clampIndex
          const strLeft = finalText.slice(0, Math.floor(finalText.length / 2 - deltaLength / 2) - 1)
          const strRight = finalText.slice(Math.floor(finalText.length / 2 + deltaLength / 2) + 1)
          const str = `${strLeft}${append}${strRight}`
          el.innerHTML = str
        }
        break
      case 'scroll':
        el.addEventListener('mouseenter', () => {
          el.innerHTML = `${finalText}<span style="padding: 0 32px;"></span>${finalText}`
          el.style.whiteSpace = 'nowrap'
          el.style.overflow = 'visible'
          const scrollWidth = el.scrollWidth
          let offset = 0
          const ani = () => {
            offset += 1
            el.style.transform = `translate3d(-${offset}px, 0, 0)`
            if (offset > (scrollWidth + 64) / 2) {
              offset = 0
            }
            rafId = globalThis.requestAnimationFrame(ani)
          }
          rafId = globalThis.requestAnimationFrame(ani)
        })
        el.addEventListener('mouseleave', () => {
          el.innerHTML = clampText.clampContent
          el.style.whiteSpace = ''
          el.style.overflow = ''
          el.style.transform = 'translate3d(0, 0, 0)'
          globalThis.cancelAnimationFrame(rafId)
        })
        break
    }
  })
  observer.observe(el)
}
