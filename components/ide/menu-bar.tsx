"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { socialIcons } from "@/components/icon-map";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { files } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { otherLocalePath, useLocale, usePick, useUi } from "@/lib/locale-context";
import { useThemeStore } from "@/lib/theme-store";
import { useChat } from "@/lib/chat-store";

/**
 * The menu bar. Every item does something real — an earlier version was
 * decorative text, which looked identical and so invited clicks that went
 * nowhere. "Terminal" is gone for the same reason: there was no honest action
 * to put behind it.
 */
export function MenuBar() {
  const openFile = useIde((s) => s.openFile);
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const togglePanel = useIde((s) => s.togglePanel);
  const showPanel = useIde((s) => s.showPanel);
  const setFlash = useIde((s) => s.setFlash);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const send = useChat((s) => s.send);
  const ui = useUi();
  const pick = usePick();
  const locale = useLocale();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlash(ui.menu.copied);
    } catch {
      // Clipboard access can be refused (insecure context, permissions).
      setFlash(text);
    }
  };

  const ask = (prompt: string) => {
    showPanel("copilot");
    void send(prompt, locale);
  };

  return (
    <Menubar className="hidden h-auto items-center gap-0 border-0 bg-transparent p-0 md:flex">
      {/* File */}
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground/90 hover:text-foreground h-6 px-2 text-xs font-normal">
          {ui.menu.file}
        </MenubarTrigger>
        <MenubarContent align="start" className="min-w-56">
          <MenubarItem onClick={() => setQuickOpenOpen(true)}>
            {ui.menu.goToFile}
            <MenubarShortcut>Ctrl P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          {files
            .filter((file) => file.kind === "pane")
            .map((file) => (
              <MenubarItem key={file.id} onClick={() => openFile(file.id)}>
                {file.name}
              </MenubarItem>
            ))}
          <MenubarSeparator />
          <MenubarItem
            render={
              <a href={profile.resumePath} download>
                {ui.chrome.downloadResume}
              </a>
            }
          />
        </MenubarContent>
      </MenubarMenu>

      {/* Edit */}
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground/90 hover:text-foreground h-6 px-2 text-xs font-normal">
          {ui.menu.edit}
        </MenubarTrigger>
        <MenubarContent align="start" className="min-w-56">
          <MenubarItem onClick={() => copy(profile.email)}>
            {ui.menu.copyEmail}
          </MenubarItem>
          <MenubarItem onClick={() => copy(window.location.href)}>
            {ui.menu.copyLink}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* View */}
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground/90 hover:text-foreground h-6 px-2 text-xs font-normal">
          {ui.menu.view}
        </MenubarTrigger>
        <MenubarContent align="start" className="min-w-64">
          <MenubarItem onClick={() => togglePanel("explorer")}>
            {ui.menu.explorer}
            <MenubarShortcut>Ctrl B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => togglePanel("copilot")}>
            {ui.menu.assistantPanel}
            <MenubarShortcut>Ctrl J</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={toggleTheme}>
            {ui.menu.theme}
            <MenubarShortcut>Ctrl K</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            render={
              <a href={otherLocalePath(locale)} hrefLang={locale === "en" ? "fr" : "en"}>
                {ui.menu.language}
                <MenubarShortcut>{ui.chrome.languageSwitch}</MenubarShortcut>
              </a>
            }
          />
        </MenubarContent>
      </MenubarMenu>

      {/* Run — the assistant's preset questions, the one thing here that runs. */}
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground/90 hover:text-foreground h-6 px-2 text-xs font-normal">
          {ui.menu.run}
        </MenubarTrigger>
        <MenubarContent align="start" className="min-w-[21rem]">
          {ui.assistant.prompts.map((prompt) => (
            <MenubarItem key={prompt} onClick={() => ask(prompt)}>
              {prompt}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>

      {/* Help */}
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground/90 hover:text-foreground h-6 px-2 text-xs font-normal">
          {ui.menu.help}
        </MenubarTrigger>
        <MenubarContent align="start" className="min-w-56">
          <MenubarItem onClick={() => openFile("readme")}>
            {ui.menu.aboutSite}
          </MenubarItem>
          <MenubarItem onClick={() => openFile("contact")}>
            {ui.chrome.contact}
          </MenubarItem>
          <MenubarSeparator />
          {socials.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <MenubarItem
                key={social.href}
                render={
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    {pick(social.label)}
                  </a>
                }
              />
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
