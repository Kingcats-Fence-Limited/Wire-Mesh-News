<?xml version="1.0" encoding="UTF-8"?>
<!-- Browsers no longer render RSS, so a feed opened by hand looks like raw code.
     This stylesheet is applied only in a browser; feed readers ignore it and read the XML. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="title" /> — feed</title>
        <style>
          :root{--ink:#15161c;--bg:#ffffff;--paper:#f6f7f9;--line:#e4e5ea;--slate:#6e7384;--grey:#8a8f9e;--red:#ff2f3d}
          @media (prefers-color-scheme:dark){:root{--ink:#f2f3f5;--bg:#111216;--paper:#1a1b22;--line:#2a2c36;--slate:#a7abb8;--grey:#8a8f9e;--red:#ff4a54}}
          *{box-sizing:border-box}
          body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
          .wrap{max-width:760px;margin:0 auto;padding:40px 20px 80px}
          .tag{display:inline-block;background:var(--red);color:#fff;font-size:11px;font-weight:800;letter-spacing:.12em;padding:5px 9px;border-radius:4px}
          h1{font-size:30px;letter-spacing:-.03em;margin:16px 0 6px}
          .sub{color:var(--slate);margin:0 0 24px}
          .box{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:0 0 32px}
          .box p{margin:0 0 10px}
          .box p:last-child{margin:0}
          .box ol{margin:10px 0 0;padding-left:20px}
          code{background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 7px;font-size:13.5px;word-break:break-all}
          .hd{display:flex;align-items:center;gap:12px;margin:0 0 14px}
          .hd span{font-size:11px;font-weight:800;letter-spacing:.12em;color:var(--grey)}
          .hd i{flex:1;height:1px;background:var(--line);display:block}
          article{border-top:1px solid var(--line);padding:18px 0}
          article h2{font-size:18px;margin:0 0 6px;letter-spacing:-.02em}
          article a{color:inherit;text-decoration:none}
          article a:hover{color:var(--red)}
          article p{margin:0 0 8px;color:var(--slate);font-size:15px}
          .meta{font-size:11.5px;font-weight:700;letter-spacing:.06em;color:var(--grey);text-transform:uppercase}
          footer{margin-top:40px;font-size:13.5px;color:var(--slate)}
          footer a{color:var(--red)}
        </style>
      </head>
      <body>
        <div class="wrap">
          <span class="tag">RSS FEED</span>
          <h1><xsl:value-of select="title" /></h1>
          <p class="sub"><xsl:value-of select="description" /></p>

          <div class="box">
            <p><strong>This page is a feed, not an article.</strong> A feed is a machine-readable list of what we publish. Put its address into a news reader and every new article arrives there on its own — no account, no email, no tracking.</p>
            <ol>
              <li>Copy this page's address: <code><xsl:value-of select="link" />/feed.xml</code></li>
              <li>Open a reader — Feedly, Inoreader, NetNewsWire, Thunderbird or any other.</li>
              <li>Choose "Add feed" or "Subscribe" and paste the address.</li>
            </ol>
            <p style="margin-top:12px">Feeds carry headlines and summaries only. Open an article on the site to read it in full.</p>
          </div>

          <div class="hd"><span>LATEST IN THIS FEED</span><i></i></div>
          <xsl:for-each select="item">
            <article>
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <p><xsl:value-of select="description" /></p>
              <div class="meta"><xsl:value-of select="category" /> · <xsl:value-of select="pubDate" /></div>
            </article>
          </xsl:for-each>

          <footer>
            <p>Prefer email? <a href="{link}/subscribe/">Subscribe to the newsletter</a> instead, or go back to <a href="{link}"><xsl:value-of select="title" /></a>.</p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
