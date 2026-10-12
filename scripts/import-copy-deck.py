#!/usr/bin/env python3
"""
Convert the v2 Page Copy Deck (docs/research/v2/Hiver Technology - Page Copy Deck.md)
into structured JSON consumed by the site (src/data/generated/copy-deck.json).

Each deck page uses the same template:
  ## <Name> — `<deck path>`
  **Field:** value ...
  ### Hero / **Eyebrow:** / # H1 / hero paragraph / **Primary CTA:** / **Secondary CTA:**
  ## <problem heading>  + paragraph
  ## <approach heading> + paragraph
  ## What is included   + bullet list
  ## How Hiver works    + numbered list
  ## Why Hiver          (editorial instruction — skipped)
  ## Frequently asked questions  + ### question / answer pairs
  ## Related content and internal links + `path` bullets
  ## Final CTA          + ### heading / paragraph

Deck paths are mapped onto the v3 URL architecture (flat, URL-preserving) via PATH_MAP.
Re-run after editing the deck:  python3 scripts/import-copy-deck.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DECK = ROOT / "docs/research/v2/Hiver Technology - Page Copy Deck.md"
OUT = ROOT / "src/data/generated/copy-deck.json"

# v2 deck path -> v3 site path (v3 preserves flat Hiver routes; see docs/research/v3).
PATH_MAP = {
    "/": "/",
    "/services/": "/services/",
    "/services/software-applications/": "group:software",
    "/services/software-applications/web-application-development/": "/services/web-application-development/",
    "/services/software-applications/crm-development/": "/services/crm-web-applications/",
    "/services/software-applications/mobile-app-development/": "/services/mobile-app-development/",
    "/services/software-applications/ui-ux-design/": "/services/ui-ux-design/",
    "/services/web-development/website-design-development/": "/services/website-design-development/",
    "/services/web-development/wordpress-development/": "/services/wordpress-development/",
    "/services/ecommerce/": "/services/ecommerce-development/",
    "/services/ecommerce/shopify-development/": "/services/shopify-development/",
    "/services/ecommerce/shopify-migration/": "/services/shopify-migration/",
    "/services/ecommerce/shopify-seo/": "/services/shopify-seo/",
    "/services/seo/": "/services/seo/",
    "/services/seo/technical-seo/": "/services/technical-seo/",
    "/services/growth-marketing/": "/services/growth-marketing/",
    "/services/growth-marketing/marketing-automation/": "/services/marketing-automation/",
    "/services/growth-marketing/email-lifecycle-marketing/": "/services/email-lifecycle-marketing/",
    "/services/growth-marketing/digital-marketing/": "/services/digital-marketing/",
    "/works/": "/portfolio/",
    "/about/": "/about-us/",
    "/contact/": "/contact/",
    "/insights/": "/insights/",
    "/industries/ecommerce/": "/industries/ecommerce/",
    "/industries/education/": "/industries/education/",
    "/industries/healthcare/": "/industries/healthcare/",
    "/industries/logistics/": "/industries/logistics/",
    "/industries/manufacturing/": "/industries/manufacturing/",
    # Deck links that have no page of their own.
    "/services/web-development/": "/services/website-design-development/",
}

PAGE_RE = re.compile(r"^## (?P<name>.+?) — `(?P<path>[^`]+)`\s*$", re.M)
FIELD_RE = re.compile(r"^\*\*(?P<k>[^*]+?):\*\*\s*(?P<v>.*?)\s*$", re.M)


def map_path(p: str) -> str:
    return PATH_MAP.get(p, p)


def fix_brand(text: str) -> str:
    # v2 strategy: always use the full "Hiver Technology" in titles (brand-collision guidance).
    return re.sub(r"\|\s*Hiver\s*$", "| Hiver Technology", text.strip())


def split_sections(body: str):
    """Split a page body into (heading, text) pairs on '## ' headings."""
    parts = re.split(r"^## (.+)$", body, flags=re.M)
    head = parts[0]
    sections = [(parts[i].strip(), parts[i + 1].strip()) for i in range(1, len(parts), 2)]
    return head, sections


def paragraphs(text: str):
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def parse_page(name: str, deck_path: str, body: str):
    head, sections = split_sections(body)
    fields = {m["k"].strip().lower(): m["v"] for m in FIELD_RE.finditer(head)}

    # Hero block lives in `head` after "### Hero".
    hero = head.split("### Hero", 1)[1] if "### Hero" in head else ""
    hero_fields = {m["k"].strip().lower(): m["v"] for m in FIELD_RE.finditer(hero)}
    h1_match = re.search(r"^# (.+)$", hero, re.M)
    hero_paras = [
        p for p in paragraphs(re.sub(r"^# .+$", "", hero, flags=re.M))
        if not p.startswith("**")
    ]

    page = {
        "name": name.strip(),
        "deckPath": deck_path,
        "path": map_path(deck_path),
        "priority": fields.get("priority", ""),
        "primaryKeyword": fields.get("primary keyword", ""),
        "secondaryKeywords": [s.strip() for s in fields.get("secondary keywords", "").split("|") if s.strip()],
        "intent": fields.get("intent / market", ""),
        "title": fix_brand(fields.get("title", "")),
        "description": fields.get("meta description", ""),
        "eyebrow": hero_fields.get("eyebrow", ""),
        "h1": h1_match.group(1).strip() if h1_match else "",
        "intro": hero_paras[0] if hero_paras else "",
        "primaryCta": hero_fields.get("primary cta", ""),
        "secondaryCta": hero_fields.get("secondary cta", ""),
        "problem": None,
        "approach": None,
        "included": [],
        "steps": [],
        "faqs": [],
        "related": [],
        "finalCta": None,
    }

    free = []  # the two free-form sections: problem then approach
    for heading, text in sections:
        key = heading.lower()
        if key == "what is included":
            page["included"] = [re.sub(r"^-\s*", "", l).strip() for l in text.splitlines() if l.strip().startswith("-")]
        elif key.startswith("how hiver works"):
            page["steps"] = [re.sub(r"^\d+\.\s*", "", l).strip() for l in text.splitlines() if re.match(r"^\d+\.", l.strip())]
        elif key == "why hiver":
            continue  # editorial instruction, not page copy
        elif key == "frequently asked questions":
            for q, a in re.findall(r"^### (.+?)\n+(.+?)(?=\n### |\Z)", text, re.S | re.M):
                page["faqs"].append({"q": q.strip(), "a": " ".join(a.split())})
        elif key.startswith("related content"):
            page["related"] = [map_path(p) for p in re.findall(r"`([^`]+)`", text)]
        elif key == "final cta":
            m = re.search(r"^### (.+?)\n+(.+)", text, re.S | re.M)
            if m:
                page["finalCta"] = {"heading": m.group(1).strip(), "body": " ".join(m.group(2).split()).rstrip("-").strip()}
        else:
            free.append({"heading": heading, "body": " ".join(paragraphs(text))})

    if free:
        page["problem"] = free[0]
    if len(free) > 1:
        page["approach"] = free[1]
    return page


def main():
    text = DECK.read_text(encoding="utf-8")
    matches = list(PAGE_RE.finditer(text))
    pages = []
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[m.end():end].replace("\n---\n", "\n")
        pages.append(parse_page(m["name"], m["path"], body))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": str(DECK.relative_to(ROOT)), "pages": pages}, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(pages)} pages to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
