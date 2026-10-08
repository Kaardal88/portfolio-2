---
title: StemLock
order: 1
category: Exam project · Artist platform
summary: "StemLock is for all people in the music industry. It makes it easier to collaborate with the band, guest artists, manager or studio engineer."
shortSummary: "A tool for musicians and their network."
role: "Fullstack, designer, product thinker"
year: "2026"
stack: ["Next.js", "React", "Tailwind", "Hono", "Drizzle", "Neon Postgres"]
liveUrl: "https://stemlock.netlify.app"
repoUrl: "https://github.com/Kaardal88/project-exam-2"
cover: "/images/stemlock.png"
badge: "Real product"
brain:
  label: Exam project · 2026
  x: 0.20
  y: 0.22
  mobileX: 0.10
  mobileY: 0.42
  side: right
features:
  - title: "Comment with timestamp"
    icon: lock
    text: "Pause the song where you want, add a comment and assign a task to your band colleague describing what you want to be improved."
  - title: "Stems"
    icon: layout
    text: "Build your song with stems. Each stem added is a new version, giving you total version control. When the song is done a studio engineer can download your files and start mixing."
  - title: "Connect"
    icon: spark
    text: "Find other people in the industry. At registration everyone can add what title they have and where they are located. So if you're in a hunt for a new drummer in Oslo, you can find him."
decisions:
  - choice: "To design it in a way which looks like a analog studio. The design will evolve further with time."
    why: "If you are a modern artist without being signed or have access to a studio, you're all digital - so an illusion of something real may be good."
  - choice: "To use Cloudflare as image and audiofiles database."
    why: "It's easy and scalable as the platform grows."
  - choice: "To have bands/artists invite collaborators to they're profile."
    why: "With roles set in the database you can safely have them as guest. They do not have access to anything other than the project they're involved in. "

reflection:
  learned: "To work with something you care about enables you to find solution after solution."
  failed: "Proud as can be I sent a testlink to another developer, which discovered a major safety hole on profiles. I went back and restructured the database and the file structure quickly!"
  next: "Up next is to design a more hardware feel to elements. The users will also be able to unlock working with WAV files later on. Currently there's Mp3 only with size limit due to storage costs. A lot of WAV files from potentially a lot of people would crash my wallet!"
---

My teacher gave me the oportunity to create my own exam. So, instead of doing the original school project, I went ahead with an idea I already had: to create some kind of platform which solved my challenges with understanding exactly what my vocalist meant all the time, when he was talking on the phone about something in a song I made.

The solution solves many issues beyond that, but that's the original thought which became a whole lot of functions covering many needs an artist has.

The goal was to create something that made collaboration and production more structural by having more control.
