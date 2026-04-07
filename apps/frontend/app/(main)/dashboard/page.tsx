"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Ticket,
  Building2,
  ArrowRight,
  CheckCircle2,
  Users,
  Bell,
  ShieldCheck,
  Laptop,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

const categories = [
  { title: "Resources", icon: Building2 },
  { title: "Bookings", icon: CalendarDays },
  { title: "Support", icon: Ticket },
  { title: "Learning", icon: GraduationCap },
  { title: "Events", icon: Bell },
  { title: "Campus Life", icon: Users },
];

const faqItems = [
  "How can I reserve a campus resource?",
  "Can I track my booking approval status?",
  "How do I create a support ticket?",
  "Can students access resources anytime?",
  "How can I contact campus support?",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { resources, bookings, tickets } = useApp();

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const approvedBookings = bookings.filter((b) => b.status === "APPROVED").length;
  const openTickets = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  ).length;

  const featuredCards = [
    {
      title: "Reserve Campus Spaces",
      desc: "Book halls, classrooms and study areas quickly.",
      icon: CalendarDays,
      href: "/bookings",
      stat: `${bookings.length} bookings`,
      color: "from-primary-500 to-indigo-500",
    },
    {
      title: "Explore Resources",
      desc: "Find labs, equipment and shared facilities.",
      icon: Building2,
      href: "/resources",
      stat: `${resources.length} resources`,
      color: "from-cyan-500 to-sky-500",
    },
    {
      title: "Get Support Fast",
      desc: "Report issues and track updates in one place.",
      icon: Ticket,
      href: "/tickets",
      stat: `${openTickets} open tickets`,
      color: "from-orange-400 to-rose-500",
    },
    {
      title: "Student Services",
      desc: "Access smarter tools for daily campus needs.",
      icon: Briefcase,
      href: "/dashboard",
      stat: `${approvedBookings} approved`,
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* HERO */}
      <section className="px-4 pb-8 pt-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-[34px] bg-white shadow-sm ring-1 ring-primary-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center px-6 py-10 md:px-10">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700">
                  <Sparkles className="h-4 w-4" />
                  Smart Campus Experience
                </div>

                <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-cyan-500">
                  Home / Student Portal
                </p>

                <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                  Welcome back, {user?.name}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                  Manage bookings, explore resources, access student support,
                  and navigate campus services through a cleaner and more modern experience.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/bookings"
                    className="rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-cyan-500"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/resources"
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-gray-500 transition hover:bg-cyan-50 hover:text-cyan-500"
                  >
                    Explore Campus
                  </Link>
                </div>
              </div>

              {/* IMAGE STYLE AREA */}
              <div className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
                {/* TOP RIGHT CIRCLE */}
                
                <div className="absolute top-2 right-16 h-50 w-50 rounded-full bg-[#2783a6] flex items-center justify-center">
                  <div className="h-40 w-40 rounded-full bg-[#65adcb] flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-[#98d5ee]"></div>
                  </div>
                </div>

                {/* BOTTOM LEFT CIRCLE */}
                <div className="absolute bottom-2 left-10 h-58 w-58 rounded-full bg-[#2783a6] flex items-center justify-center">
                  <div className="h-46 w-46 rounded-full bg-[#65adcb] flex items-center justify-center">
                    <div className="h-28 w-28 rounded-full bg-[#98d5ee]"></div>
                  </div>
                </div>

                {/* IMAGE */}
                <motion.div
                  className="relative z-10"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/girl.jpg"
                    width={300}
                    height={400}
                    
                    alt="Dashboard visual"
                    className="shadow-2xl rounded-4xl object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  className="rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS + IMAGE SECTION */}
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="px-2"
          >
            <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              The advantages of the Smart Campus platform.
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                "Relevant campus tools",
                "Easy booking workflow",
                "1-on-1 support access",
                "Faster ticket handling",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-1 text-cyan-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Designed to simplify daily student interactions and campus operations.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="relative flex justify-center"
          >
            <div className="relative h-[360px] w-[320px] rounded-[34px] bg-gradient-to-br from-cyan-100 to-indigo-200 shadow-sm">
              <div className="absolute inset-6 rounded-[28px] bg-cyan-50 backdrop-blur" />
              <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-cyan-400 text-cyan-700 shadow-lg">
                <Laptop className="h-16 w-16" />
              </div>
              <div className="absolute left-6 top-6 rounded-2xl bg-white px-4 py-3 shadow-md">
                <p className="text-xs text-slate-500">Active Student</p>
                <p className="text-base font-bold text-slate-900">{user?.name}</p>
              </div>
              <div className="absolute bottom-6 right-6 rounded-2xl bg-white px-4 py-3 shadow-md">
                <p className="text-xs text-slate-500">Open Support</p>
                <p className="text-base font-bold text-slate-900">{openTickets}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[#eef5ff] p-6 md:p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Featured Services</h2>
            <p className="mt-2 text-sm text-slate-500">
              Access the most used smart campus features from one page.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  className="overflow-hidden rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`inline-flex rounded-2xl bg-gradient-to-r ${card.color} p-3 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {card.desc}
                  </p>

                  <div className="mt-4 text-sm font-medium text-slate-400">
                    {card.stat}
                  </div>

                  <Link
                    href={card.href}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    Open <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTRA SERVICE BLOCKS */}
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Booking Support",
                desc: "Get quick help for reservations and approvals.",
                icon: CalendarDays,
              },
              {
                title: "Interview & Career Prep",
                desc: "Use campus guidance services for growth.",
                icon: Briefcase,
              },
              {
                title: "Student Community",
                desc: "Stay connected with your academic environment.",
                icon: Users,
              },
              {
                title: "Secure Access",
                desc: "A safer and smarter digital campus experience.",
                icon: ShieldCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[26px] bg-white p-6 text-center shadow-sm ring-1 ring-slate-100"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-3">
            {faqItems.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100"
              >
                <p className="text-sm font-medium text-slate-700">{item}</p>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-200 bg-white px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 text-lg font-bold text-white shadow-md">
                S
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Smart Campus Hub</h3>
                <p className="text-sm text-slate-500">Modern student portal experience</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              A connected platform for bookings, campus resources, support services
              and a smoother student journey.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Navigation
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <Link href="/dashboard" className="block hover:text-cyan-700 hover:underline">Dashboard</Link>
              <Link href="/resources" className="block hover:text-cyan-700 hover:underline">Resources</Link>
              <Link href="/bookings" className="block hover:text-cyan-700 hover:underline">Bookings</Link>
              <Link href="/tickets" className="block hover:text-cyan-700 hover:underline">Tickets</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Services
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p>Space Reservation</p>
              <p>Resource Access</p>
              <p>Support Tickets</p>
              <p>Student Services</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Contact
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p>support@smartcampus.edu</p>
              <p>+94 00 000 0000</p>
              <p>Smart Campus, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-5 text-center text-sm text-slate-400">
          Copyright © 2026 Smart Campus Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}