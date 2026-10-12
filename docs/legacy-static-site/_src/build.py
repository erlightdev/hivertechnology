#!/usr/bin/env python3
"""Static site generator for the Hiver Technology website.

Run from anywhere:  python3 website/_src/build.py
Writes one index.html per route into the website/ folder, so every URL from the
v3 architecture plan (/about-us/, /services/..., etc.) is preserved.

Edit page copy in content.py. Shared layout lives here.
"""
import html
import json
import os
import re

from content import SITE, NAV, FOOTER, PAGES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
e = html.escape

ICON = {
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    "minus": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12h7"/></svg>',
    "sun": '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    "moon": '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
}


class Page:
    """Renders blocks with links relative to the page's depth."""

    def __init__(self, spec):
        self.spec = spec
        self.path = spec["path"]  # "" for home, "about-us/" etc.
        depth = self.path.count("/")
        self.prefix = "../" * depth

    def url(self, target):
        if target.startswith(("http", "mailto:", "tel:", "#")):
            return target
        out = self.prefix + target
        return out or "./"

    def asset(self, p):
        return self.prefix + "assets/" + p

    # ---------- blocks ----------
    def btn(self, label, href, kind="primary", arrow=True):
        return f'<a class="btn btn-{kind}" href="{self.url(href)}">{e(label)}{ICON["arrow"] if arrow else ""}</a>'

    def b_hero(self, b):
        crumbs = ""
        if b.get("crumbs", True) and self.path:
            parts = ['<a href="%s">Home</a>' % self.url("")]
            for label, href in self.spec.get("trail", []):
                parts.append('<span aria-hidden="true">/</span><a href="%s">%s</a>' % (self.url(href), e(label)))
            parts.append('<span aria-hidden="true">/</span><span aria-current="page">%s</span>' % e(self.spec["nav_label"]))
            crumbs = '<nav class="crumbs" aria-label="Breadcrumb">%s</nav>' % "".join(parts)
        actions = ""
        if b.get("ctas"):
            out = []
            for i, (label, href) in enumerate(b["ctas"]):
                out.append(self.btn(label, href, "primary" if i == 0 else "ghost", arrow=i == 0))
            actions = '<div class="hero-actions">%s</div>' % "".join(out)
        facts = ""
        if b.get("facts"):
            facts = '<div class="facts">%s</div>' % "".join(
                f"<div><strong>{e(t)}</strong><span>{e(s)}</span></div>" for t, s in b["facts"])
        meta = ""
        if b.get("meta"):
            meta = '<div class="meta-line">%s</div>' % "".join(f"<span>{e(m)}</span>" for m in b["meta"])
        cls = "hero" if not self.path else "hero hero-sub"
        return f'''<section class="{cls}">
  <div class="container">
    {crumbs}
    <span class="eyebrow">{e(b["eyebrow"])}</span>
    <h1>{e(b["title"])}</h1>
    <p class="lead">{e(b["lead"])}</p>
    {actions}{meta}{facts}
  </div>
</section>'''

    def head(self, b):
        if not b.get("title"):
            return ""
        text = f'<p>{e(b["text"])}</p>' if b.get("text") else ""
        label = f'<span class="label">{e(b.get("label", ""))}</span>'
        return f'<div class="section-head reveal">{label}<div><h2>{e(b["title"])}</h2>{text}</div></div>'

    def wrap(self, b, inner):
        cls = "section" + (" alt" if b.get("alt") else "") + (" tight" if b.get("tight") else "")
        sid = f' id="{b["id"]}"' if b.get("id") else ""
        return f'<section class="{cls}"{sid}><div class="container">{self.head(b)}{inner}</div></section>'

    def b_cards(self, b):
        cells = []
        for it in b["items"]:
            label = f'<span class="label">{e(it["label"])}</span>' if it.get("label") else ""
            tags = ""
            if it.get("tags"):
                tags = '<div class="tags">%s</div>' % "".join(f'<span class="tag">{e(t)}</span>' for t in it["tags"])
            body = f'{label}<h3>{e(it["title"])}</h3><p>{e(it["text"])}</p>{tags}'
            if it.get("href"):
                more = it.get("more", "Learn more")
                cells.append(f'<a class="cell" href="{self.url(it["href"])}">{body}<span class="link-arrow">{e(more)}{ICON["arrow"]}</span></a>')
            else:
                cells.append(f'<div class="cell">{body}</div>')
        cols = b.get("cols", 3)
        return self.wrap(b, f'<div class="grid grid-{cols} reveal">{"".join(cells)}</div>')

    def b_rows(self, b):
        rows = []
        for i, it in enumerate(b["items"], 1):
            rows.append(f'''<a class="row" href="{self.url(it["href"])}">
  <span class="label">{i:02d}</span>
  <h3>{e(it["title"])}</h3>
  <p>{e(it["text"])}</p>
  <span class="arrow">{ICON["arrow"]}</span>
</a>''')
        return self.wrap(b, f'<div class="rows reveal">{"".join(rows)}</div>')

    def b_steps(self, b):
        n = len(b["items"])
        cls = {3: " steps-3", 5: " steps-5"}.get(n, "")
        steps = "".join(
            f'<div class="step"><span class="label">{i:02d}</span><h3>{e(t)}</h3><p>{e(s)}</p></div>'
            for i, (t, s) in enumerate(b["items"], 1))
        return self.wrap(b, f'<div class="steps{cls} reveal">{steps}</div>')

    def b_checks(self, b):
        lis = []
        for it in b["items"]:
            if isinstance(it, (list, tuple)):
                lis.append(f'<li>{ICON["check"]}<div><strong>{e(it[0])}</strong><span>{e(it[1])}</span></div></li>')
            else:
                lis.append(f'<li>{ICON["check"]}<div>{e(it)}</div></li>')
        cls = " single" if b.get("single") else ""
        return self.wrap(b, f'<ul class="checks{cls} reveal">{"".join(lis)}</ul>')

    def b_compare(self, b):
        fit = "".join(f"<li>{e(x)}</li>" for x in b["fit"])
        nofit = "".join(f"<li>{e(x)}</li>" for x in b["nofit"])
        inner = f'''<div class="compare reveal">
  <div class="panel"><h3>{ICON["check"]}{e(b.get("fit_title", "A good fit"))}</h3><ul>{fit}</ul></div>
  <div class="panel dim"><h3>{ICON["minus"]}{e(b.get("nofit_title", "Not a fit"))}</h3><ul>{nofit}</ul></div>
</div>'''
        return self.wrap(b, inner)

    def b_split(self, b):
        paras = "".join(f"<p>{e(p)}</p>" for p in b["paras"])
        link = ""
        if b.get("link"):
            link = f'<p style="margin-top:28px"><a class="link-arrow" href="{self.url(b["link"][1])}">{e(b["link"][0])}{ICON["arrow"]}</a></p>'
        cls = "section" + (" alt" if b.get("alt") else "")
        return f'''<section class="{cls}"><div class="container"><div class="split reveal">
  <span class="label">{e(b["label"])}</span>
  <div class="body"><h2>{e(b["title"])}</h2>{paras}{link}</div>
</div></div></section>'''

    def b_stack(self, b):
        cells = "".join(
            f'<div><img src="{self.asset("tech/" + f)}" alt="" loading="lazy" width="30" height="30"{" class=invert" if inv else ""}><strong>{e(n)}</strong><span>{e(r)}</span></div>'
            for f, n, r, inv in SITE["stack"])
        return self.wrap(b, f'<div class="stack reveal">{cells}</div>')

    def b_faq(self, b):
        items = "".join(
            f'<details><summary>{e(q)}<span class="plus" aria-hidden="true"></span></summary><div class="answer">{e(a)}</div></details>'
            for q, a in b["items"])
        return self.wrap(b, f'<div class="faq reveal">{items}</div>')

    def b_prose(self, b):
        body = b["html"]
        toc = ""
        heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
        if heads and b.get("toc", True):
            toc = '<nav class="toc" aria-label="On this page"><p>On this page</p>%s</nav>' % "".join(
                f'<a href="#{i}">{t}</a>' for i, t in heads)
        else:
            toc = "<div></div>"
        body = body.replace('href="~/', f'href="{self.prefix}')
        return f'<section class="section"><div class="container"><div class="prose-wrap">{toc}<article class="prose">{body}</article></div></div></section>'

    def b_contact(self, b):
        c = SITE["contact"]
        focus = "".join(f"<option>{e(o)}</option>" for o in b["focus"])
        stage = "".join(f"<option>{e(o)}</option>" for o in b["stage"])
        include = "".join(f"<li>{e(x)}</li>" for x in b["include"])
        return f'''<section class="section"><div class="container"><div class="contact-grid">
  <div class="reveal">
    <span class="label">Direct contact</span>
    <ul class="contact-list" style="margin-top:16px">
      <li><span class="label">Email</span><a href="mailto:{c["email"]}">{c["email"]}</a><br><a href="mailto:{c["email_alt"]}" class="muted" style="font-size:15px;font-weight:400">{c["email_alt"]}</a></li>
      <li><span class="label">Phone / WhatsApp</span><a href="tel:{c["phone_href"]}">{c["phone"]}</a></li>
      <li><span class="label">Office</span><strong>{e(c["address"])}</strong></li>
    </ul>
    <div class="prose" style="margin-top:40px;font-size:15.5px">
      <h3 style="margin-top:0">Helpful to include</h3>
      <ul>{include}</ul>
      <p class="muted" style="font-size:14.5px">Happy to sign a mutual NDA before you share detailed product information.</p>
    </div>
  </div>
  <form class="form reveal" id="enquiry-form" data-to="{c["email"]}" novalidate>
    <div class="form-row">
      <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" required autocomplete="name"></div>
      <div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
    </div>
    <div class="form-row">
      <div class="field"><label for="f-phone">Phone / WhatsApp <em>— optional</em></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field"><label for="f-company">Organisation <em>— optional</em></label><input id="f-company" name="company" autocomplete="organization"></div>
    </div>
    <div class="form-row">
      <div class="field"><label for="f-focus">What do you need?</label><select id="f-focus" name="focus" required><option value="">Select one</option>{focus}</select></div>
      <div class="field"><label for="f-stage">Where are you now?</label><select id="f-stage" name="stage"><option value="">Select one</option>{stage}</select></div>
    </div>
    <div class="field"><label for="f-summary">What should work better?</label><textarea id="f-summary" name="summary" required placeholder="The problem, who uses it, and any deadline or budget range."></textarea></div>
    <button class="btn btn-primary" type="submit">Send enquiry{ICON["arrow"]}</button>
    <p class="form-status" role="status" aria-live="polite"></p>
    <p class="form-note">Used only to reply to your enquiry. See our <a href="{self.url("privacy-policy/")}" style="text-decoration:underline">Privacy Policy</a>.</p>
  </form>
</div></div></section>'''

    def b_cta(self, b):
        title = b.get("title", "Have a defined problem? Let’s scope it.")
        text = b.get("text", "Share what needs to work better. You’ll hear back from the people who would build it.")
        primary = b.get("primary", ("Discuss a project", "contact/"))
        secondary = b.get("secondary", ("Email us", "mailto:" + SITE["contact"]["email"]))
        return f'''<section class="cta"><div class="container"><div class="cta-box reveal">
  <div><h2>{e(title)}</h2><p>{e(text)}</p></div>
  <div class="actions">{self.btn(primary[0], primary[1], "primary")}{self.btn(secondary[0], secondary[1], "ghost", arrow=False)}</div>
</div></div></section>'''

    # ---------- layout ----------
    def header(self):
        active = self.spec.get("section", "")
        links = "".join(
            f'<a href="{self.url(href)}"{" aria-current=page" if key == active else ""}>{e(label)}</a>'
            for key, label, href in NAV)
        mobile = "".join(f'<a href="{self.url(href)}">{e(label)}</a>' for _, label, href in NAV)
        return f'''<header class="site-header">
  <div class="container nav">
    <a class="brand" href="{self.url("")}" aria-label="Hiver Technology home">
      <img src="{self.asset("brand/hiver.webp")}" alt="" width="28" height="28">
      <span>Hiver Technology</span>
    </a>
    <nav class="nav-links" aria-label="Primary">{links}</nav>
    <div class="nav-actions">
      <button class="icon-btn theme-toggle" type="button" aria-label="Toggle colour theme">{ICON["sun"]}{ICON["moon"]}</button>
      <a class="btn btn-primary btn-sm" href="{self.url("contact/")}">Discuss a project</a>
      <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">{ICON["menu"]}</button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">{mobile}<a class="btn btn-primary" href="{self.url("contact/")}">Discuss a project</a></nav>'''

    def footer(self):
        c = SITE["contact"]
        cols = "".join(
            f'<div><h4>{e(title)}</h4><ul>%s</ul></div>' % "".join(
                f'<li><a href="{self.url(h)}">{e(l)}</a></li>' for l, h in links)
            for title, links in FOOTER)
        return f'''<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <a class="brand" href="{self.url("")}"><img src="{self.asset("brand/hiver.webp")}" alt="" width="28" height="28"><span>Hiver Technology</span></a>
        <p>Software and digital delivery from Lalitpur, Nepal.</p>
        <div class="footer-contact">
          <a href="mailto:{c["email"]}">{c["email"]}</a>
          <a href="tel:{c["phone_href"]}">{c["phone"]}</a>
          <span class="muted">{e(c["address"])}</span>
        </div>
      </div>
      {cols}
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Hiver Technology</span>
      <nav aria-label="Legal"><a href="{self.url("privacy-policy/")}">Privacy</a><a href="{self.url("terms-of-service/")}">Terms</a><a href="{self.url("cookie-policy/")}">Cookies</a></nav>
    </div>
  </div>
</footer>'''

    def schema(self):
        base = SITE["base_url"]
        org = {
            "@type": "Organization",
            "@id": base + "#organization",
            "name": "Hiver Technology",
            "url": base,
            "logo": base + "assets/brand/hiver.webp",
            "email": SITE["contact"]["email"],
            "telephone": SITE["contact"]["phone_href"],
            "address": {"@type": "PostalAddress", "streetAddress": "Imadole",
                        "addressLocality": "Lalitpur", "addressCountry": "NP"},
        }
        graph = [org]
        if not self.path:
            graph.append({"@type": "WebSite", "@id": base + "#website", "url": base,
                          "name": "Hiver Technology", "publisher": {"@id": base + "#organization"}})
        else:
            items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": base}]
            for label, href in self.spec.get("trail", []):
                items.append({"@type": "ListItem", "position": len(items) + 1, "name": label, "item": base + href})
            items.append({"@type": "ListItem", "position": len(items) + 1, "name": self.spec["nav_label"], "item": base + self.path})
            graph.append({"@type": "BreadcrumbList", "itemListElement": items})
        for b in self.spec["blocks"]:
            if b["type"] == "faq" and b.get("schema", True):
                graph.append({"@type": "FAQPage", "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in b["items"]]})
        return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)

    def render(self):
        s = self.spec
        canonical = SITE["base_url"] + self.path
        body = "\n".join(getattr(self, "b_" + b["type"])(b) for b in s["blocks"])
        if s.get("cta", True):
            body += self.b_cta(s.get("cta_block", {}))
        robots = s.get("robots", "index,follow")
        return f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(s["title"])}</title>
<meta name="description" content="{e(s["description"])}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hiver Technology">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{e(s["title"])}">
<meta property="og:description" content="{e(s["description"])}">
<meta property="og:image" content="{SITE["base_url"]}assets/brand/hiver.webp">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0b0c" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{self.prefix}favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="{self.asset("brand/favicon.png")}">
<link rel="apple-touch-icon" href="{self.asset("brand/hiver.webp")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{self.asset("css/site.css")}">
<script>try{{var t=localStorage.getItem('hiver-theme');if(t)document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<script type="application/ld+json">
{self.schema()}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{self.header()}
<main id="main">
{body}
</main>
{self.footer()}
<script src="{self.asset("js/site.js")}" defer></script>
</body>
</html>
'''


def main():
    sitemap = []
    for spec in PAGES:
        page = Page(spec)
        out_dir = os.path.join(ROOT, spec["path"])
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(page.render())
        if spec.get("robots", "index,follow").startswith("index"):
            sitemap.append(SITE["base_url"] + spec["path"])
        print("built /" + spec["path"])

    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in sitemap:
            f.write(f"  <url><loc>{u}</loc></url>\n")
        f.write("</urlset>\n")
    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE['base_url']}sitemap.xml\n")
    print(f"{len(PAGES)} pages, {len(sitemap)} in sitemap")


if __name__ == "__main__":
    main()
