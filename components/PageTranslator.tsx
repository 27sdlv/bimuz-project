"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SITE_DICT } from "@/lib/i18n-dict";

// Barcha sahifalar o'zbekcha yozilgan. Rus yoki ingliz tili tanlanganda sahifadagi
// matnlar (va placeholder/title) lug'at bo'yicha almashtiriladi; o'zbekchaga qaytilganda
// asl matn tiklanadi. Raqamlar kalitda {n} bilan yoziladi va o'z joyiga qaytariladi.

const ATTRS = ["placeholder", "title", "aria-label", "alt"] as const;
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);
const NUM = /\d[\d\s.,]*\d|\d/g;

function translate(text: string, idx: 0 | 1): string | null {
  const core = text.trim();
  if (!core || !/[A-Za-zА-Яа-яЎўҚқҒғҲҳ]/.test(core)) return null;
  const nums = core.match(NUM) ?? [];
  const key = core.replace(NUM, "{n}");
  const pair = SITE_DICT[key];
  if (!pair) return null;
  let i = 0;
  const value = pair[idx].replace(/\{n\}/g, () => nums[i++] ?? "");
  const lead = text.slice(0, text.length - text.trimStart().length);
  const tail = text.slice(text.trimEnd().length);
  return lead + value + tail;
}

export default function PageTranslator() {
  const { lang } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = lang;
    const textOrig = new Map<Text, string>();
    const attrOrig = new Map<Element, Record<string, string>>();
    const idx: 0 | 1 = lang === "en" ? 1 : 0;
    let busy = false;

    const doText = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || SKIP.has(parent.tagName) || parent.closest("[data-no-translate]")) return;
      const current = node.nodeValue ?? "";
      const original = textOrig.get(node) ?? current;
      const tr = translate(original, idx);
      if (tr !== null && tr !== current) {
        textOrig.set(node, original);
        node.nodeValue = tr;
      }
    };

    const doAttrs = (el: Element) => {
      if (el.closest("[data-no-translate]")) return;
      for (const a of ATTRS) {
        const v = el.getAttribute(a);
        if (!v) continue;
        const saved = attrOrig.get(el) ?? {};
        const original = saved[a] ?? v;
        const tr = translate(original, idx);
        if (tr !== null && tr !== v) {
          saved[a] = original;
          attrOrig.set(el, saved);
          el.setAttribute(a, tr);
        }
      }
    };

    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        doText(root as Text);
        return;
      }
      if (!(root instanceof Element) || SKIP.has(root.tagName)) return;
      doAttrs(root);
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let n: Node | null = tw.nextNode();
      while (n) {
        if (n.nodeType === Node.TEXT_NODE) doText(n as Text);
        else doAttrs(n as Element);
        n = tw.nextNode();
      }
    };

    if (lang === "uz") return;

    busy = true;
    walk(document.body);
    busy = false;

    const obs = new MutationObserver((muts) => {
      if (busy) return;
      busy = true;
      for (const m of muts) {
        if (m.type === "characterData") {
          const t = m.target as Text;
          // React matnni o'zgartirdi — yangi asl qiymat.
          textOrig.delete(t);
          doText(t);
        } else if (m.type === "attributes" && m.target instanceof Element) {
          const saved = attrOrig.get(m.target);
          if (saved && m.attributeName) delete saved[m.attributeName];
          doAttrs(m.target);
        } else {
          m.addedNodes.forEach((n) => walk(n));
        }
      }
      busy = false;
    });
    obs.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    });

    return () => {
      obs.disconnect();
      busy = true;
      textOrig.forEach((orig, node) => {
        if (node.isConnected) node.nodeValue = orig;
      });
      attrOrig.forEach((saved, el) => {
        for (const [a, v] of Object.entries(saved)) el.setAttribute(a, v);
      });
      busy = false;
    };
  }, [lang]);

  return null;
}
