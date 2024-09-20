const getClampContent = (ctx, text = '', opt = {}) => {
  const { maxWidth = 200, lineHeight = 20, maxLine = 3, append = '...', placeholder = '' } = opt
  const font = opt.font ?? `16px sans-serif`
  const fontSize = Number(/(?<size>\d+)px.*/.exec(font)?.groups?.size ?? 0)
  const fixWidth = opt.fixWidth ?? fontSize
  const textList = text.trim().split('')
  let content = ''
  let lineContentList = []
  let currLine = 1
  let resultIndex = 0
  let isOverflow = false
  let isOverFlowAfterFixed = false
  ctx.font = font
  ctx.textBaseline = 'bottom'
  for (let i = 0; i < textList.length; i++) {
    let currContent = content + textList[i]
    const metrics = ctx.measureText(currContent)
    if (metrics.width > maxWidth && i > 0) {
      if (currLine >= maxLine) {
        resultIndex = i
        isOverflow = true
        break
      } else {
        ctx.fillText(content, 0, currLine * lineHeight)
        lineContentList.push(content)
        content = textList[i]
        currLine += 1
      }
    } else {
      resultIndex = i
      content = currContent
    }
  }
  lineContentList.push(content)

  /**
   * 溢出，追加 append
   */
  if (isOverflow) {
    const lastContentIndex = lineContentList.length - 1
    let lastContent = lineContentList[lastContentIndex]
    while (
      lastContent.length > 0 &&
      ctx.measureText(lastContent + append + placeholder).width + fixWidth > maxWidth
    ) {
      lastContent = lastContent.slice(0, lastContent.length - 1)
    }
    lineContentList[lastContentIndex] = lastContent + append
  } else {
    if (lineContentList.length >= maxLine && (placeholder.length > 0 || fixWidth > 0)) {
      const lastContentIndex = lineContentList.length - 1
      let lastContent = lineContentList[lastContentIndex]
      isOverFlowAfterFixed = ctx.measureText(lastContent + placeholder).width + fixWidth > maxWidth
      while (
        lastContent.length > 0 &&
        ctx.measureText(lastContent + append + placeholder).width + fixWidth > maxWidth
      ) {
        lastContent = lastContent.slice(0, lastContent.length - 1)
      }
      lineContentList[lastContentIndex] = lastContent + (isOverFlowAfterFixed ? append : '')
    }
  }
  ctx.fillText(content, 0, currLine * lineHeight)
  return {
    isOverflow,
    isOverFlowAfterFixed,
    clampIndex: resultIndex,
    clampContent: lineContentList.join('')
  }
}
