# Template → Package → App: Meeting Users Where They're At
## Full script, slide by slide

**Running total: ~16:35 rehearsed (expect ~18:00 live). Split: Tanya ~8:10 / Jadey ~8:25.**

| # | Slide | Time | Speaker |
|--:|-------|-----:|---------|
| 1 | Title | 0:30 | Tanya → Jadey → Tanya |
| 2 | The Recipe | 0:30 | Tanya |
| 3 | The Cookbook | 0:30 | Tanya |
| 4 | The Store Shelf | 0:30 | Tanya → Jadey |
| 5 | Layering Access | 1:15 | Jadey, one Tanya interjection |
| 6 | Layer 1: Template (report) | 2:00 | Jadey |
| 7 | Layer 1: Template (boundary) | 0:30 | Jadey |
| 8 | Layer 2: Package (build) | 1:30 | Jadey |
| 9 | Layer 2: Package (usage) | 1:00 | Jadey, one Tanya interjection |
| 10 | Layer 3: App | 0:45 | Tanya |
| 11 | Layer 3: App demo | 2:30 | Tanya |
| 12 | What We Saw | 1:00 | Tanya 0:45 / Jadey 0:15 |
| 13 | Lessons Learned | 2:20 | Tanya 1:35 / Jadey 0:45 |
| 14 | Building the Bridge | 1:00 | Jadey → Tanya → Jadey |
| 15 | Thank You | 0:45 | Jadey → Tanya |
| | **Total** | **16:35** | |

---

## 1. Title
*⏱ 0:30 · Tanya → Jadey → Tanya*

**Tanya:** I'm Tanya.

**Jadey:** And I'm Jadey. Our talk today is about how we took a parameterized Quarto template for soil health reports and built layers on top of it to deliver insights to more people.

**Tanya:** We'll walk you through how we took this template from one person's laptop to a fully "baked" web app. But before we get into the weeds, we have to talk about cookies. Specifically, the origin story of the chocolate chip cookie.

---

## 2. The Recipe
*⏱ 0:30 · Tanya*

**Tanya:** Ruth Wakefield ran an inn in Whitman, Massachusetts. **[click: the Inn]** She was a dietitian, she had a kitchen, and one day she had an idea: chop up a chocolate bar and put it in the cookie dough.

**[click: the cookie]** Guests loved it. It was a hit. And it existed in exactly one place: her kitchen. If you wanted the cookie, you drove to the inn.

---

## 3. The Cookbook
*⏱ 0:30 · Tanya*

**Tanya:** Eight years later she published the recipe. **[click: the consequence]** Now anyone could make it. Anyone who owned an oven, had flour and butter in the house, and knew what "cream the sugar" meant.

Which is a lot of people. It's also not everyone.

---

## 4. The Store Shelf
*⏱ 0:30 · Tanya → Jadey*

**Tanya:** Then Nestlé put it in the grocery store. **[click: the consequence]** Ready-to-bake dough. No recipe, no measuring, no mixing. Slice it, pop it in the oven, and eat it.

**Jadey:** So. What does a cookie have to do with a technical talk at posit::conf?

---

## 5. Layering Access: From Recipe to Store Shelf
*⏱ 1:15 · Jadey, one Tanya interjection*

**Jadey:** Ruth's story has strong parallels with our own. But instead of a chocolate chip cookie, our story centers around a soil health report, one that could offer farmers a new way of understanding their data.

**[click: Layer 1, the center figure]** In the beginning, it started off as a recipe. Or in my case, a parameterized Quarto template. It was easy to run and reproduce, but it only lived on my laptop.

**[click: Layer 2, ring 2]** So when other soil scientists started reaching out to ask me for the report, I knew it was time to publish our own cookbook: {soils}, an R package that made it easy for other bakers to run these Quarto reports.

**[click: Layer 3, ring 3]** But not everyone in the agriculture world knows how to code in R. We needed to get these reports onto the store shelf. That was the impetus behind our Shiny app, Dirt Data Reports, a no-code solution that uses our package as the engine, so farm advisors without technical expertise can run their own reports.

In our story, I'm kind of like Ruth. I helped make the original recipe and published it in a cookbook.

**Tanya:** And if she's Ruth, I guess that makes me Nestlé. Together, we brought Jadey's reports to the shelf, and into the hands of more farmers, with a Shiny app.

**[click: takeaway quote]**

**Jadey:** Our main takeaway is that there's no single tool for everyone. Build the layer that meets the user where they are. So let's start at the beginning, with the template.

---

## 6. Layer 1: Template · The Recipe
*⏱ 2:00 · Jadey*

**Jadey:** This story began about three years ago, when I gave my very first presentation at posit::conf in 2023.

During that talk, I showed how we used a parameterized Quarto template to magically render hundreds of soil health reports, one for each farmer who participated in our project in Washington State.

Each of the 350-plus farmers got two versions: an interactive HTML file that lets them click around their plots, and a printable PDF for those who wanted paper. The reports included background on all the soil health measurements, plus plots and tables designed so a farmer could see how their fields compared to similar crops and regions. They were meant to be a decision-support tool, not a data dump.

One farmer told us: *"I was able to see a direct connection between my soil management decisions and the health of the soil I manage."*

So what was the problem?

---

## 7. Layer 1: Template · The Recipe (boundary)
*⏱ 0:30 · Jadey*

**Jadey:** Well, that recipe lived in exactly one kitchen. The template solved the reports problem for our project in Washington State. But there was a growing need to give people outside the project access to the workflow. We had a university in California, an adviser in Idaho, and conservation district staff in Oregon who all wanted to run reports for their own data, for their own farmers.

The template was too bespoke to our project and not easy for them to adapt.

So how did we make it easy for them to use?

---

## 8. Layer 2: Package · The Cookbook
*⏱ 1:30 · Jadey*

**Jadey:** Developing an R package felt like the natural next step. For people with the right technical expertise, we wanted to give them the flexibility to adapt the template to their projects and build their own soil health reports.

We broke our one big report template into smaller, modular Quarto files, and replaced all the Washington-specific pieces with placeholders that users swap in for their own project.

Then we pulled a lot of the R code out of the original template and turned it into reusable functions that handle the core work: validating, processing, and visualizing the data. We also wrote an R script that renders all the reports at once.

The last piece was documentation. Once the Quarto files were modular and the code was reusable, we wanted people to understand what was available and how to use it. We used {roxygen2} to document every function and {pkgdown} to build a website with tutorials.

**[click: bridge line]**

So the shift was from a reporting workflow built for one Washington State project to a reusable toolkit that any R user could adapt for their own soil sampling project.

Let's take a look at how it works.

---

## 9. Layer 2: Package · The Cookbook (usage)
*⏱ 1:00 · Jadey, one Tanya interjection*

**Jadey:** On the left is a screenshot from the {pkgdown} tutorial that shows how to use the RStudio project wizard to create a project. That sets up the {soils} directory with the modular .qmd files, example data, and R scripts. Users then work through the other tutorials to import their data, customize the content and branding of their reports, and use the `render-reports.R` script to generate all of them at once.

**[click: bridge]**

Now we're reaching anyone comfortable in R.

**Tanya:** Not everyone who'd like to run these reports is.

**Jadey:** So how do we reach the farm advisers with zero code experience?

---

## 10. Layer 3: App · The Store Shelf
*⏱ 0:45 · Tanya*

**Tanya:** This is where I come in. In 2024, Jadey reached out for help on the next evolution of the project: a Shiny app to deliver Quarto reports. We'd connected years earlier through Twitter and the R-Ladies community, and I was ecstatic to get to work with her.

The pitch was straightforward: build an intuitive interface that lets non-technical people customize and run their own reports. Together we built Dirt Data Reports, which sits on top of the {soils} package and the parameterized Quarto template. Users don't need to know Quarto. They don't need to know how to spell Quarto. They drop in their data, enter their project information, and click "Build Reports."

No R. No terminal. Let's take a look.

**[next slide: the recorded demo]**

---

## 11. Layer 3: App · The Store Shelf (demo)
*⏱ 2:30 · Tanya, narrating over the recording*

**[The slide arrives on the first frame. The next clicker press starts the recording; back pauses it; arrow keys still work while it plays. Cut: landing page → Build Reports → Download Template → Upload Data → Project Info → Build Reports → HTML output.]**

*Narration is still in draft. The beats below follow the cut; fill each in your own words to the segment lengths.*

**Tanya, landing page (~0:15):** *[Open the app. The landing page explains what {soils} is, in plain language, for someone who will never install it. One click on "Build Reports" starts the process.]*

**Tanya, the spine (~0:10):** *[Form page with four sections in order: Download Template, Upload Data, Project Info, Build Reports. Name them once; the audience will track the rest visually.]*

**Tanya, Download Template (~0:25):** *[English or Spanish. Show what the template looks like: this is how advisers structure their farmers' data and choose which elements to measure. The template is the contract between the adviser's spreadsheet and the report.]*

**Tanya, Upload Data (~0:25):** *[Drop the file in. Behind the scenes, several validation checks run to catch the kinds of errors that come with hand-entered data. Say "validation checks" out loud and leave it there; slide 13 will explain that these lived in the app when they belonged in the package.]*

**Tanya, Project Info (~0:20):** *[Text fields, markdown allowed, for the project-specific content: these are the placeholders Jadey pulled out of the template. What used to be edits to a .qmd is now a form.]*

**Tanya, Build Reports (~0:25):** *[Pick the year, pick the producers, pick HTML or docx. Click. It renders. That's the package doing the work underneath, the same functions Jadey showed you.]*

**Tanya, HTML output (~0:10):** *[The interactive report. Point at one thing a farmer would click on.]*

**Tanya, land it (~0:20):** The important thing isn't that this is a Shiny app. It's that the person using it never has to know there's a package, a template, or Quarto underneath.

---

## 12. What We Saw
*⏱ 1:00 · Tanya 0:45 / Jadey 0:15*

**Tanya:** In September 2025 we released Dirt Data Reports into the universe. But the story doesn't stop there. We took inventory of what worked and what didn't, and set up a feedback loop with users.

And we started getting some really useful signals.

**On the positive side:** organizations were using the app and saving real time and effort by automating their reports.

**But there was a negative signal too:** once people used it for different projects, they pushed beyond the assumptions and scope we'd designed for. They needed more customization in some places and more guardrails in others. That meant baking more features into the app to match their needs.

**[click: bridge]**

**Jadey:** The app worked. It also showed us exactly where the package was thin.

---

## 13. Lessons Learned
*⏱ 2:20 · Tanya 1:35 / Jadey 0:45*

**Tanya, three dots (0:20, on arrival):** Now, a quick lesson in expectation versus reality. When we started, the building blocks were obvious: template, package, app. **[point to diagram]** On paper it looks like this. Three tidy boxes. We expected a neat, linear build.

**Tanya, expectation (0:20). [click: the pipeline draws]** But expectation often falls short of reality. Once people started using the app in their own projects, they surfaced gaps. And when those needs came up, the app became the place where we worked around what the package couldn't do yet.

**Tanya, reality (0:55). [click: the tangle]** This is what it actually looked like. **[pause, let them read it]** Every one of these arrows is a fix we rushed into the Shiny app without thinking about how it should flow back to the building blocks underneath. A data validation function that lived in the app belonged in the package. Formatting we patched in the app belonged in the template. I was the first person to build a UI on top of {soils}, and every time the package didn't have what I needed, I patched around it.

It's like a customer walking into the store and asking for an oatmeal raisin cookie. You can improvise one batch at the counter. But if that's what people want, the recipe has to change.

Those workarounds weren't failures. They were loud signals about what the package was missing. And you can't see them from inside the package.

**Jadey, refactoring (0:45). [click: retract and redraw; rings top right light up fully]** That was the real lesson for me as the maintainer. I didn't know what abstractions the package needed until someone built a UI on top of it. Building layer three showed us where layers one and two needed to grow. So now we're taking those lessons back into the package and the template.

---

## 14. Building the Bridge
*⏱ 1:00 · Jadey → Tanya → Jadey*

**Jadey:** All of this comes back to knowing who you're building for. Every layer we built made the same reports available to someone who couldn't get them before, and every layer out, the bar got lower. Edit a Quarto file, then call a function, then click a button. Same analysis the whole way through. The only thing that changed was who could get to it.

**Tanya:** Tanya: Most of us are at the first layer. We built something to make our own work easier, and that's the right layer for a lot of people. Some of us are at the second, because others on our team want to use it and adapt it. And some of us are at the third, because the people who need the answer are never going to open an IDE.

Each layer is the right layer for someone. What determines which one you need isn't the tool, and it isn't what you already know how to build. It's one question, before you build: who is this for?

**[click: quote]**

**Jadey:** Build the layer that gets the insight into their hands. Then let it show you where the other layers need to grow.

---

## 15. Thank You
*⏱ 0:45 · Jadey → Tanya*

**Jadey:** Thank you all for coming to our session, to Posit for hosting and for the speaker coaching from MeadowLark, and to all the people behind the tools we shared today from the Washington State Department of Agriculture, Washington State University, and the Washington Soil Health Initiative.

**Tanya:** Scan the QR code for the repo with these slides, plus links to {soils}, Dirt Data Reports, and Jadey's posit::conf(2023) talk. We're happy to take questions if there's time.

---
