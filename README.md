# 🌐 Personal Portfolio & Blog

A fast, beautiful, data-driven personal portfolio site with a built-in blog — hosted for **free** on GitHub Pages.
Zero build tools · Zero frameworks · Zero dependencies to install.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 Dark / Light mode | Toggle with memory across sessions |
| 📱 Fully Responsive | Mobile, tablet, desktop |
| 🏠 Hero + Profile | Avatar, roles typing animation, social links |
| 📋 Resume Section | Experience / Education timeline + Achievements |
| 🚀 Projects Gallery | Filter by technology tag |
| ✍️ Blog + CMS | Each post is a `.md` file — write via Decap CMS at `/admin/` |
| 🤖 Auto index | GitHub Action rebuilds `posts/index.json` on every push |
| 📬 Contact Form | Opens email client pre-filled |

---

## 🗂 Project Structure

```
/
├── index.html                      ← Main page
├── css/style.css                   ← All styles (dark/light theme)
├── js/app.js                       ← Renders everything from data files
├── data/
│   ├── profile.json                ← YOUR INFO (name, bio, socials)
│   └── resume.json                 ← YOUR CAREER (experience, skills, projects)
├── posts/                          ← BLOG POSTS (one .md file per post)
│   ├── index.json                  ← Auto-generated manifest (do not edit)
│   ├── my-first-post.md            ← A blog post
│   └── another-post.md             ← Another blog post
├── admin/
│   ├── index.html                  ← Decap CMS entry point
│   └── config.yml                  ← CMS configuration ← EDIT THIS
├── scripts/
│   └── build_index.py              ← Rebuilds posts/index.json
└── .github/workflows/
    └── rebuild-posts-index.yml     ← Auto-runs build_index.py on push
```

---

## ✍️ How to Write a Blog Post

### Option A — Use the CMS (Recommended) 🖊️

1. Open `https://YOUR_USERNAME.github.io/admin/` in your browser
2. Log in with GitHub
3. Click **"New Blog Post"**
4. Fill in title, tags, excerpt — write the body in the rich Markdown editor
5. Click **"Publish"**

The CMS commits your post as a `.md` file to the repo. The GitHub Action automatically rebuilds `posts/index.json`. Your post is live in ~60 seconds.

> **First-time CMS setup** — see the [CMS Setup section](#-cms-setup-decap-cms) below.

---

### Option B — Create a `.md` file directly

Create a new file in the `posts/` folder, e.g. `posts/my-new-post.md`:

```markdown
---
title: "My Post Title"
date: "2024-06-15"
author: "Bhargava Pejakala Kakrannaya"
emoji: "🚀"
tags: ["GenAI", "Distributed Systems"]
excerpt: "A 1-2 sentence summary shown on the blog card."
coverImage: ""
---

# My Post Title

Write your post content here in **Markdown**.

## Section Heading

Paragraph text, lists, code blocks — all supported.

```java
// Code blocks work too
public class Hello { }
```

Push to GitHub → the Action auto-rebuilds the index → post appears on the site.

---

### Markdown Reference

| Syntax | Result |
|---|---|
| `# Heading` | Large heading |
| `## Heading` | Section heading |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | inline code |
| ` ```lang ... ``` ` | code block with syntax hint |
| `> text` | blockquote |
| `- item` | unordered list |
| `1. item` | ordered list |
| `[text](url)` | link |
| `![alt](url)` | image |
| `---` | horizontal rule |

---

## 🖥️ CMS Setup (Decap CMS)

Decap CMS gives you a beautiful web editor at `/admin/` — no coding required to write posts.

### Step 1 — Edit `admin/config.yml`

Open `admin/config.yml` and fill in these two lines:

```yaml
backend:
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # e.g. bhargava/bhargava.github.io
  app_id: YOUR_GITHUB_OAUTH_APP_CLIENT_ID     # from step 2 below
```

### Step 2 — Create a GitHub OAuth App (one-time, 2 minutes)

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Portfolio CMS`
   - **Homepage URL:** `https://YOUR_USERNAME.github.io`
   - **Authorization callback URL:** `https://YOUR_USERNAME.github.io/admin/`
4. Click **"Register application"**
5. Copy the **Client ID** → paste it as `app_id` in `admin/config.yml`

### Step 3 — Push and visit `/admin/`

```bash
git add admin/config.yml
git commit -m "chore: configure Decap CMS"
git push
```

Visit `https://YOUR_USERNAME.github.io/admin/` → click **"Login with GitHub"** → you're in!

---

### Local Development (CMS without GitHub auth)

```bash
# Terminal 1 — run the local CMS proxy
npx decap-server

# Terminal 2 — serve the site
python3 -m http.server 3000
```

Open `http://localhost:3000/admin/` → the CMS works locally with no OAuth needed.

---

## ✏️ How to Update Your Profile

Edit `data/profile.json`:

```json
{
  "name": "Your Full Name",
  "tagline": "One-liner about you",
  "avatar": "images/your-photo.jpg",   ← or leave blank for initials
  "about": "2-3 paragraph bio...",
  "roles": ["Software Engineer", "Tech Blogger"],
  "socials": [
    { "platform": "github",   "url": "https://github.com/you" },
    { "platform": "linkedin", "url": "https://linkedin.com/in/you" },
    { "platform": "email",    "url": "you@example.com" }
  ]
}
```

---

## 💼 How to Update Resume / Projects / Skills

Edit `data/resume.json`. Each section is an array — just add, edit, or remove items:

- **`experience`** — job roles
- **`education`** — degrees & certifications
- **`achievements`** — awards, milestones
- **`skills`** — grouped skill tags
- **`projects`** — portfolio projects with links

---

## 🚀 Deploying to GitHub Pages (Free)

### Option A — Your Own Domain-Style URL: `yourusername.github.io`

1. Create a GitHub repo named **exactly** `yourusername.github.io`
   *(replace `yourusername` with your actual GitHub username)*

2. Push all files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "chore: initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

3. GitHub Pages is **automatically enabled** for `*.github.io` repos.
   Your site will be live at `https://yourusername.github.io` within 1–2 minutes.

---

### Option B — Project Repo URL: `yourusername.github.io/profile`

1. Create any GitHub repo (e.g., `profile`)

2. Push all files to `main`

3. Go to **Settings → Pages → Source** → select `main` branch → `/ (root)` → Save

4. Your site will be at `https://yourusername.github.io/profile`

---

### Option C — Custom Domain (e.g., `bhavya.dev`)

1. Follow Option A or B above first

2. In your repo, add a file named `CNAME` with just your domain:
   ```
   bhavya.dev
   ```

3. In your domain registrar (Namecheap, GoDaddy, etc.), add these DNS records:
   ```
   A     @   185.199.108.153
   A     @   185.199.109.153
   A     @   185.199.110.153
   A     @   185.199.111.153
   CNAME www yourusername.github.io.
   ```

4. Back on GitHub: **Settings → Pages → Custom domain** → enter your domain → Save
   Check "Enforce HTTPS" once DNS propagates (~24h)

---

## 🌍 Other Free Hosting Options

| Platform | Notes |
|---|---|
| **GitHub Pages** | ✅ Recommended · Free · Custom domain · Auto-deploy on push |
| **Netlify** | ✅ Excellent alternative · Drag & drop deploy · Form handling |
| **Vercel** | ✅ Fast CDN · Simple deploy · Good free tier |
| **Cloudflare Pages** | ✅ Unlimited bandwidth · Very fast |

For Netlify / Vercel — just drag and drop the project folder into their dashboard, or connect your GitHub repo.

---

## 🛠 Running Locally

Since this is a static site that fetches JSON files via `fetch()`, you need a local server (not just opening `index.html` directly).

```bash
# Option 1 — Python (already installed on most systems)
python3 -m http.server 3000

# Option 2 — Node.js
npx serve .

# Option 3 — VS Code / WebStorm
# Use the built-in "Live Server" feature
```

Then open `http://localhost:3000` in your browser.

---

## 🎨 Customising the Design

Open `css/style.css` and edit the `:root` block at the top:

```css
:root {
  --accent:       #6c63ff;   /* Main purple — change to your brand colour */
  --accent-2:     #ff6584;   /* Secondary pink */
  --accent-3:     #43e97b;   /* Green (status dot) */
}
```

---

## 📷 Adding a Profile Photo

1. Create an `images/` folder in the project root
2. Add your photo (e.g., `images/me.jpg`)
3. In `data/profile.json`, set:
   ```json
   "avatar": "images/me.jpg"
   ```

If `avatar` is blank, the site automatically shows your initials.

---

## 📬 Contact Form

The contact form uses `mailto:` — it opens the visitor's email client with the message pre-filled. No server needed.

To change the destination email, update `data/profile.json`:
```json
{ "platform": "email", "url": "your@email.com" }
```

For a real contact form without a server, you can use [Formspree](https://formspree.io) (free tier available) — just replace the `<form>` action in `index.html`.

---

Made with ❤️ · Hosted on GitHub Pages · 🌀 Magic applied with Wibey JetBrains Plugin 🪄
