"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultLocale, ui, type Dictionary, type L, type Locale } from "@/lib/i18n";

/**
 * The locale comes from the route (`/` is English, `/fr` is French), not from a
 * store. Context rather than Zustand because the value is fixed for the
 * lifetime of the page: server render and first client render agree, so there's
 * no flash of the wrong language and nothing to persist.
 */
const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);

/** UI strings for the active locale. */
export function useUi(): Dictionary {
  return ui(useLocale());
}

/**
 * `const pick = usePick()` then `pick(role.title)` — keeps call sites short in
 * panes that resolve a dozen localized values.
 */
export function usePick() {
  const locale = useLocale();
  return useMemo(() => <T,>(value: L<T>): T => value[locale], [locale]);
}

/** Where the language switcher points, preserving any deep-link hash. */
export function otherLocalePath(locale: Locale, hash = ""): string {
  return (locale === "en" ? "/fr" : "/") + hash;
}
