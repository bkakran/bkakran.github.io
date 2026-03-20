---
title: "What I Look For When Judging AI Hackathons"
date: "2024-12-01"
author: "Bhargava Pejakala Kakrannaya"
emoji: "⚖️"
tags: ["AI", "Hackathons", "Agentic Systems", "Career"]
excerpt: "After judging four AI hackathons — from agentic AI sprints in Silicon Valley to an international Cursor community event in Germany — here's what separates the projects that get a 9 from the ones that get a 6."
coverImage: ""
---

# What I Look For When Judging AI Hackathons

Over the past year I've had the privilege of judging several AI hackathons — the **Weekend Agent Hack** in Mountain View, the **Robotic Agents Hackathon**, the **Cursor Community Hackathon** in Heilbronn, Germany, and the wonderfully creative **OaklandClaw: The Penthouse Heist**.

Each event had a different flavor, a different community, and a different definition of "winning". But across all of them, I noticed the same patterns separating the top-tier projects from the solid-but-forgettable ones.

Here's my judging framework — and honestly, it applies to product pitches and engineering demos too.

---

## 1. Does it solve a real problem? (Or does it just use AI?)

The single most common failure mode in hackathons: **a solution looking for a problem**.

Teams get excited about a particular AI capability — say, multi-agent orchestration, or a novel use of tool-calling — and build a demo around showing off the capability rather than solving something real.

A great project starts with a *genuine frustration*. At the Cursor hackathon, the best project I saw was built by a developer who was genuinely fed up with a specific part of their workflow. The AI wasn't the point — the solved problem was the point. The AI was just the most elegant way to solve it.

**Red flag**: The team leads with "we used GPT-4 with function calling and a vector database and…" before ever explaining what problem they're solving.

**Green flag**: The team leads with "every day we waste 45 minutes on X, here's how we fixed it."

---

## 2. Is the demo real, or is it a best-case walk-through?

Judges are not naive. We know that in 24-48 hours, you can't build a fully robust system. That's fine.

What I'm looking for is: **does this actually work, or does it only work if you do exactly the right thing in exactly the right order?**

The best hackathon projects I've seen work on the first try with random input. They handle edge cases gracefully. When they fail, they fail informatively rather than silently.

At the Robotic Agents hackathon, one team built an agent that could reason about physical constraints in a robot's environment. In the demo, their agent encountered an unexpected obstacle. Rather than crashing or ignoring it, the agent paused, reasoned aloud about why it couldn't proceed, and asked for human guidance. That *failure* was more impressive than most teams' successes.

**Red flag**: The presenter quickly steers away from any deviation from the rehearsed demo path.

**Green flag**: The presenter invites the judge to break their demo.

---

## 3. How good is the "last mile" thinking?

In agentic AI, the hard problem isn't making the agent do something smart in the happy path. It's answering: **what happens when the agent is wrong, slow, or stuck?**

I ask every team: *"What does your system do when the LLM confidently gives a wrong answer?"*

The teams that have thought deeply about this — with fallback logic, confidence thresholds, human-in-the-loop checkpoints, audit trails — are building something real. The teams that say "oh, we'd tune the prompt" are building a demo.

This matters enormously at production scale. At Walmart, we handle 1B+ events daily. An AI system that works 95% of the time means 50M failures per day. The "last 5%" thinking is actually the first 95% of the engineering.

---

## 4. What's the team dynamic?

I spend a lot of time watching *how* a team presents, not just *what* they present.

Some of the most impressive technical projects fall apart in Q&A because only one person understands the architecture. Some scrappier projects blow me away because every team member can defend any part of the system.

For agentic AI specifically, I look for teams where the technical depth is matched by product thinking. The best projects I've judged had someone who could speak fluently about the AI architecture AND someone who could speak fluently about the user experience and the edge cases a real user would encounter.

---

## 5. What would it take to make this real?

This is my personal tie-breaker. After evaluating the demo, I ask: *"If I gave you a month and a small team, what would it take to ship this?"*

The best teams have a clear answer. They know the blockers: reliability, cost, latency, integration complexity. They've already thought about what "production-ready" means.

The weaker teams describe making the demo bigger, not making it real.

---

## The Meta-Lesson

Every hackathon I've judged has reinforced the same belief: **the best builders are the ones who are genuinely obsessed with the problem, not the technology.**

The AI is just the newest, most powerful tool in the toolbox. The teams that win — in hackathons and in the real world — are the ones who pick up a tool because they have a nail to hit, not because the tool looks exciting.

Go build something. Judge yourself against these criteria. Repeat.
