/**
 * Populates the iframe with the content
 */
document.querySelector('body').addEventListener('click', (ev) => {
  let wrap = ev.target
  let script
  let iframe
  let doc
  let str

  if (wrap && wrap.classList.contains('sandbox-wrap') && !wrap.classList.contains('rendered')) {
    wrap.classList.add('rendered')
    script = ev.target.querySelector('script')
    iframe = ev.target.querySelector('iframe')
    doc = iframe.contentWindow.document

    str = script.innerHTML
    str = str.split('&amp;').join('&')
      .split('&lt;').join('<')
      .split('&gt;').join('>')
      .split('&quot;').join('"')

    doc.open()
    doc.write(str)
    doc.close()
  }
}, true)
