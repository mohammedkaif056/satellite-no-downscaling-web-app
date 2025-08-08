"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Satellite,
  Menu,
  Home,
  Upload,
  Map,
  BarChart3,
  BookOpen,
  Info,
  Settings,
  User,
  History,
  LogOut,
  Bell,
  Search,
  Shield,
} from "lucide-react";
import React, { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  adminOnly?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

interface FullwidthIconNavbarProps {
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title: string;
  };
  menu?: MenuItem[];
  user?: UserProfile | null;
  activeJobsCount?: number;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onJobHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onAdminPanelClick?: () => void;
}

const FullwidthIconNavbar = ({
  logo = {
    url: "/",
    title: "NO₂ Downscaler",
  },
  menu = [
    {
      title: "Home",
      url: "/",
      icon: <Home className="size-5 shrink-0" />,
    },
    {
      title: "Upload & Predict",
      url: "/upload",
      icon: <Upload className="size-5 shrink-0" />,
    },
    {
      title: "Map Viewer",
      url: "/map",
      icon: <Map className="size-5 shrink-0" />,
    },
    {
      title: "Validation",
      url: "/validation",
      icon: <BarChart3 className="size-5 shrink-0" />,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: <BookOpen className="size-5 shrink-0" />,
    },
    {
      title: "About",
      url: "/about",
      icon: <Info className="size-5 shrink-0" />,
    },
    {
      title: "Admin Panel",
      url: "/admin",
      icon: <Shield className="size-5 shrink-0" />,
      adminOnly: true,
    },
  ],
  user = null,
  activeJobsCount = 0,
  onSearch,
  onLogout,
  onProfileClick,
  onJobHistoryClick,
  onSettingsClick,
  onAdminPanelClick,
}: FullwidthIconNavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const filteredMenu =
    user?.role === "admin"
      ? menu
      : menu.filter((item) => !item.adminOnly);

  const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger className="flex items-center gap-2">
            {item.icon}
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <Link
                  href={subItem.url}
                  className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors hover:bg-muted hover:text-accent-foreground w-full text-left"
                >
                  <div className="text-muted-foreground">{subItem.icon}</div>
                  <div>
                    <div className="text-sm font-semibold">
                      {subItem.title}
                    </div>
                    {subItem.description && (
                      <p className="text-sm leading-snug text-muted-foreground">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink asChild>
          <Link
            href={item.url}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground gap-2"
          >
            {item.icon}
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const handleNavigation = (url: string) => {
      router.push(url);
    };

    if (item.items) {
      return (
        <AccordionItem key={item.title} value={item.title} className="border-b-0">
          <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline flex items-center gap-2">
            {item.icon}
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            {item.items.map((subItem) => (
              <SubMenuLink key={subItem.title} item={subItem} handleNavigation={handleNavigation} />
            ))}
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <div key={item.title} className="border-b border-border last:border-b-0">
        <button
          onClick={() => handleNavigation(item.url)}
          className="w-full flex items-center gap-3 p-3 text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {item.icon}
          <span className="font-medium">{item.title}</span>
        </button>
      </div>
    );
  };

  return (
    <section className="py-4 bg-background border-b border-border">
      <div className="container">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <a href={logo.url} className="flex items-center gap-2">
            <Satellite className="size-8 text-primary" />
            <span className="text-lg font-semibold tracking-tighter font-display">
              {logo.title}
            </span>
          </a>

          <div className="flex items-center gap-6">
            <NavigationMenuWithoutViewport>
              <NavigationMenuList className="relative">
                {filteredMenu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenuWithoutViewport>

            {/* Search */}
            {onSearch && (
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </form>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="relative">
                  <Bell className="size-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  {activeJobsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center"
                    >
                      {activeJobsCount}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                                            <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="size-6 rounded-full"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="hidden sm:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onProfileClick}>
                      <User className="mr-2 size-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onJobHistoryClick}>
                      <History className="mr-2 size-4" />
                      Job History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onSettingsClick}>
                      <Settings className="mr-2 size-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <Satellite className="size-7 text-primary" />
              <span className="text-base font-semibold tracking-tighter font-display">
                {logo.title}
              </span>
            </a>

            <div className="flex items-center gap-2">
              {user && (
                <div className="relative">
                  <Bell className="size-5 text-muted-foreground" />
                  {activeJobsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center"
                    >
                      {activeJobsCount}
                    </Badge>
                  )}
                </div>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto bg-background">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <Satellite className="size-7 text-primary" />
                        <span className="font-display">{logo.title}</span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    {onSearch && (
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search documentation..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </form>
                    )}

                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {filteredMenu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {user ? (
                      <div className="flex flex-col gap-3 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 p-2">
                          <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="size-8 rounded-full"
                              />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <Button variant="outline" onClick={onProfileClick} className="justify-start gap-2">
                          <User className="size-4" />
                          Profile
                        </Button>
                        <Button variant="outline" onClick={onJobHistoryClick} className="justify-start gap-2">
                          <History className="size-4" />
                          Job History
                        </Button>
                        <Button variant="outline" onClick={onSettingsClick} className="justify-start gap-2">
                          <Settings className="size-4" />
                          Settings
                        </Button>
                        <Button variant="destructive" onClick={onLogout} className="justify-start gap-2">
                          <LogOut className="size-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 pt-4 border-t border-border">
                        <Button asChild variant="outline">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// For nested submenu items in mobile view
const SubMenuLink = ({
  item,
  handleNavigation,
}: {
  item: MenuItem;
  handleNavigation: (url: string) => void;
}) => {
  return (
    <button
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground w-full text-left"
      onClick={() => handleNavigation(item.url)}
    >
      <div className="text-muted-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
};

// Wrapper around Radix navigation root
const NavigationMenuWithoutViewport = ({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
};

export { FullwidthIconNavbar };
