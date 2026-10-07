---
title: Machine Park
order: 2
category: Client web app · Mjøs Metall
summary: A machine-park overview for Mjøs Metall. Filter, sort and compare heavy equipment by spec, with counters that keep the numbers honest.
shortSummary: A machine-park overview for Mjøs Metall. Filter, sort and compare heavy equipment by spec, with counters that keep the numbers honest.
role: "Fullstack developer, researcher, coffee drinker"
year: "2026"
stack: ["[NextJs]", "[React]", "[SQLite]", "[Tailwind CSS]"]
client: Mjøs Metall
badge: "Real product"
cover: "/images/mm-mpark.png"
brain:
  label: Mjøs Metall · Web app
  x: 0.66
  y: 0.11
  mobileX: 0.86
  mobileY: 0.14
  side: left
features:
  - title: Filtering
    icon: filter
    text: "How users narrow down the list: machine group, capacity, if it has robot and in which building it's in."
  - title: Specs
    icon: specs
    text: "A more detailed list of each machine is shown when you click on a card. With bigger picture and potential internal comments from leaders or operators."

  - title: Live counters
    icon: chart
    text: "The solution counts how many machines they have in total, how many has robots, how many in the various groups."
decisions:
  - choice: "To focus a lot on filters in various ways."
    why: "So they can narrow down what they are looking for. Having a lot of machines in three separate buildings calls for a lot of filtering, and search of course."
  - choice: "I strutcured the machine data by the best possible names I found, and in Norwegian. I spent a lot of time structuring the database for this project."
    why: "If someone else is going in the code, there wont be made-up words. And it makes the filtering functions easier to work with."
  - choice: "The design and layout is clean but not boring. I used icons and colors. The layout grid in the machine card section is grouped by the machinegroups with a headline, telling the user which group it is. The headline follows the scroll until a new group takes over."
    why: "Even though it's really a list over machine specs, it doesn't HAVE to be boring. By using colors and icons it looks more alive. And the customer approved."

reflection:
  learned: "I learned about teamwork, to think about a lot of things at the same time and to have update meetings which made me adjust things along the way. I also used SQLite for the first time."
  failed: "When I handed over the repository for the project to the IT guy, who would implement the webapp on his system for the local network, all the images were lost... And wouldn't you know, it had something to do with the SQLite stuff I used for the first time!"
  next: "The customer already very happy about the product, I went in and change the layout for the machines to what it is today. I wasn't totally happy with the list view, so now it's much cleaner."
---

The leader group wanted a solution which shows an overview of their machine park better. The challenge was to minimalize misplacement of orders to the machines. With this tool they can place orders more correct because they quickly can access the right information rather than looking through a ton of manuals.

My work was "all over the place". I had to gather information from manuals, talk to professionals, talk to the cnc operators, talk to leaders, create and expand a data structure for the data base, understand important information and take pictures of the machines.

In the end I handed over a tool who will make the ordering flow more efficient, correct and because of that they will save money. They have also the oportunity to add or delete machines them self.
