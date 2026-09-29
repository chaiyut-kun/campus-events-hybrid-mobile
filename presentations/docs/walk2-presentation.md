# Walkthrough: Campus Events Progress Presentation (Slidev)

Successfully created and exported the **Campus Events Progress & Roadmap Presentation** using **Slidev** and **pnpm** in accordance with [instruction.md](file:///home/kun034/data/cs/4/hybrid-mobile/campus-events/presentations/instruction.md).

---

## 🚀 Key Deliverables

1. **Subproject Setup (`presentations/`)**:
   - Initialized with `pnpm` in an isolated environment to safeguard Expo SDK 57 / React Native 0.86 from dependency collisions.
   - Installed `@slidev/cli`, `@slidev/theme-default`, and `playwright-chromium`.
2. **Slide Deck (`presentations/slides.md`)**:
   - 15 polished, concise slides.
   - **No code snippets**; focused on short objectives and bulleted feature highlights.
   - **Bilingual format**: English technical terms and titles paired with crisp Thai explanations.
   - **Labs 1–4**: Marked as `Completed` on the main branch.
   - **Labs 5–11**: Structured as 1 page per lab under `Planned Features / Future Roadmap`.
   - **Mobile Device Mockup Frame**: Included on every lab slide, pre-styled with a phone bezel and placeholder ready for drop-in app screenshots.
3. **Custom Styles (`presentations/styles/index.css` & `style.css`)**:
   - Phone frame bezel, notch, glassmorphism cards, and status badges (`Completed` vs `Planned`).
4. **Export Artifacts Generated**:
   - **Web SPA**: Built to `presentations/dist/` (`index.html`, assets, etc.)
   - **PDF Document**: [campus-events-progress.pdf](file:///home/kun034/data/cs/4/hybrid-mobile/campus-events/presentations/campus-events-progress.pdf) (888 KB)
   - **PowerPoint Presentation**: [campus-events-progress.pptx](file:///home/kun034/data/cs/4/hybrid-mobile/campus-events/presentations/campus-events-progress.pptx) (2.6 MB)

---

## 📑 Slide Deck Structure

| Slide # | Category | Topic / Lab | Status |
| :---: | :--- | :--- | :--- |
| **1** | Title | Campus Events — Mobile App Development Progress | Cover |
| **2** | Executive Summary | Project Overview, Architecture & Milestones | Overview |
| **3** | Lab 01 | Mobile Foundation, React Native & Expo SDK 57 | `Completed` |
| **4** | Lab 02 | Components, Props, State & Events | `Completed` |
| **5** | Lab 03 | Styling & Responsive Mobile UI (Flexbox, Safe Area) | `Completed` |
| **6** | Lab 04 | Expo Router & Navigation (Bottom Tabs, Dynamic Routes) | `Completed` |
| **7** | Roadmap Overview | Transition to Advanced Modules (Labs 5–11) | Milestone Transition |
| **8** | Lab 05 | Forms & State Management (Validation, Context API) | `Planned` |
| **9** | Lab 06 | REST API & Networking (Async Fetching, States) | `Planned` |
| **10** | Lab 07 | Local Storage & Offline Capability (AsyncStorage) | `Planned` |
| **11** | Lab 08 | Authentication & Mobile Security (SecureStore, Route Guards) | `Planned` |
| **12** | Lab 09 | Camera, Image Picker & Dynamic Permissions | `Planned` |
| **13** | Lab 10 | Location & Interactive Maps (MapView, GPS Markers) | `Planned` |
| **14** | Lab 11 | Notifications & Platform APIs (Local Alarms, Deep Link) | `Planned` |
| **15** | Summary | Quality Assurance, Jest Verification & Next Steps | Conclusion & Q/A |

---

## 🖼️ How to Insert Your Mobile App Screenshots

In each lab slide of [slides.md](file:///home/kun034/data/cs/4/hybrid-mobile/campus-events/presentations/slides.md), a placeholder comment is ready:

```markdown
<!-- To insert your image, place file in presentations/images/lab-1.png and uncomment below: -->
<img src="./images/lab-1.png" alt="Lab 1" class="w-full h-full object-cover rounded-2xl" />
```

Simply:
1. Save your screenshot as e.g. `presentations/images/lab-1.png`.
2. Uncomment the `<img>` tag and remove the placeholder box `<div>`.
3. Run `pnpm run build` or `pnpm run export:all` to re-export!

---

## 🛠️ Commands Reference

Inside `campus-events/presentations/`:

```bash
# Start interactive local presentation preview (browser)
pnpm run dev

# Build production static website (Single Page App)
pnpm run build

# Export presentation to PDF
pnpm run export:pdf

# Export presentation to PowerPoint (.pptx)
pnpm run export:pptx

# Export all (Web + PDF + PPTX)
pnpm run export:all
```

---

## 🧪 Verification Results

- **Slidev Web Build**: Finished with 0 errors (`dist/index.html` created).
- **PDF Export**: Successfully compiled to `presentations/campus-events-progress.pdf`.
- **PPTX Export**: Successfully compiled to `presentations/campus-events-progress.pptx`.
- **Root Project Tests**: Ran `npx tsc --noEmit && npm test` — 24 test suites passed (117/117 tests passing), 0 type errors.
