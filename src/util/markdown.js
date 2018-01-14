// @SEE https://github.com/markdown-it/markdown-it
let markdown = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,

  /**
   * Wraps the iframe in a preview mask
   * @TODO customize the cover image
   */
  highlight (str, lang) {
    switch (lang) {
      case 'html/run':
        return `<pre class="sandbox-wrap"><div class="overlay"><img src="/static/img/favicon.png"><p>click to run</div><iframe class="sandbox"></iframe><script type="text/template">${markdown.utils.escapeHtml(str)}</script></pre>`
      default:
        return `<pre class="language-${lang}"><code>${markdown.utils.escapeHtml(str)}</code></pre>`
    }
  }
})

export default markdown
