const observeElement = (ctx, canvas, resizeEl, textEl, text = '', opt = {}) => {
  const { maxLine = 3, type = 'normal', placeholder = '', fixWidth = 16, append = '...' } = opt
  const dpr = window.devicePixelRatio
  const observer = new ResizeObserver(() => {
    const font = globalThis.getComputedStyle(textEl).font
    const lineHeight =
      parseInt(globalThis.getComputedStyle(textEl).lineHeight) ??
      parseInt(globalThis.getComputedStyle(document.body).lineHeight)
    const maxWidth = textEl.offsetWidth
    const finalText = text.trim()
    canvas.width = Math.round(maxWidth * dpr)
    canvas.height = Math.round(lineHeight * maxLine * dpr)
    canvas.style.width = maxWidth + 'px'
    canvas.style.height = lineHeight * maxLine + 'px'
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const clampText = getClampContent(ctx, finalText, {
      font,
      lineHeight,
      maxWidth,
      maxLine,
      append,
      placeholder,
      fixWidth
    })
    textEl.innerHTML = clampText.clampContent
    switch (type) {
      case 'hover':
        textEl.title = clampText.isOverflow ? finalText : ''
        break
      case 'expand':
        const btnEl = resizeEl.querySelector('.btn')
        const ellipsisEl = resizeEl.querySelector('.ellipsis')
        btnEl.style.display = clampText.isOverflow ? 'initial' : 'none'
        ellipsisEl.style.display = clampText.isOverflow ? 'initial' : 'none'
        if (!clampText.isOverflow) {
          textEl.innerHTML = finalText
        }
        break
    }
  })
  observer.observe(resizeEl)
  return observer
}
