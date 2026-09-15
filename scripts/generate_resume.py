"""Generate public/assets/resume.pdf from the site's own data files.

Usage:  python3 scripts/generate_resume.py
Reads:  public/data/resume.json (summary, experience, education, certifications)
Writes: public/assets/resume.pdf  (the file linked by the Resume section)
Requires: fpdf2  (pip install fpdf2)
"""
import json
from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "public" / "data" / "resume.json").read_text())
OUT = ROOT / "public" / "assets" / "resume.pdf"

INK = (26, 26, 26)
MUTED = (110, 110, 110)
ACCENT = (225, 29, 72)
RULE = (225, 225, 225)

NAME = "Aayush Neupane"
ROLE = "Web Developer & Game Developer"
LOCATION = "Jhapa, Nepal"
PHONE = "+977 9862862023"
EMAIL = "theghostoftheuchiha38@gmail.com"
SITE = "dynamic-aayush38.com.np"
GITHUB = "github.com/aayush-neupane"
LINKEDIN_LABEL = "LinkedIn"
LINKEDIN_URL = "https://www.linkedin.com/in/aayush-neupane-38a9b7240/"

SKILLS = [
    ("Programming", "JavaScript, C++, C#, Python"),
    ("Frontend", "HTML5, CSS3, React, Bootstrap, Responsive Design"),
    ("Backend", "Node.js, Express.js, MongoDB, REST APIs"),
    ("Game Dev", "Unity, C#, Game Design Basics"),
    ("Design & Tools", "Figma, Canva, VS Code, Git & GitHub"),
    ("Creative", "Photography (Basic), Creative Writing"),
    ("Spoken Languages", "English, Nepali, Hindi"),
]

PROJECTS = [
    ("Signature", "Draw-and-download signature pad (React, Canvas API)",
     "https://signature38.netlify.app/"),
    ("Crystal Cabin Detailing", "Business site with online booking (React, Node.js)",
     "https://crystalcabindetailing.ca/"),
    ("RC Panel", "Vehicle HMI cockpit interface (React)",
     "https://aurora-hmi.netlify.app/"),
]


class Resume(FPDF):
    def section(self, title):
        self.set_font("helvetica", "B", 10.5)
        self.set_text_color(*INK)
        self.cell(0, 5.5, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.7)
        self.line(self.l_margin, self.get_y(), self.l_margin + 16, self.get_y())
        self.set_draw_color(*RULE)
        self.set_line_width(0.3)
        self.line(self.l_margin + 16, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(2)

    def bullet(self, text):
        x = self.l_margin
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(*INK)
        self.set_x(x)
        self.cell(5, 4.4, chr(183))
        self.multi_cell(0, 4.4, text)
        self.ln(0.2)


pdf = Resume(format="A4")
pdf.set_margins(15, 10, 15)
pdf.set_auto_page_break(True, margin=10)
pdf.add_page()

# ---- Header ----
pdf.set_font("helvetica", "B", 22)
pdf.set_text_color(*INK)
pdf.cell(0, 9, NAME, new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", "B", 11.5)
pdf.set_text_color(*ACCENT)
pdf.cell(0, 6, ROLE, new_x="LMARGIN", new_y="NEXT")

pdf.set_font("helvetica", "", 9)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, f"{LOCATION}  |  {PHONE}", new_x="LMARGIN", new_y="NEXT")
y = pdf.get_y()
pdf.set_x(pdf.l_margin)
pdf.write(5.5, EMAIL, link=f"mailto:{EMAIL}")
pdf.write(5.5, "  |  ")
pdf.set_font("helvetica", "B", 9.5)
pdf.set_text_color(*ACCENT)
pdf.write(5.5, f"Portfolio: {SITE}", link=f"https://{SITE}")
pdf.set_font("helvetica", "", 9)
pdf.set_text_color(*MUTED)
pdf.write(5.5, "  |  ")
pdf.write(5.5, GITHUB, link=f"https://{GITHUB}")
pdf.ln(4)

# ---- Summary ----
pdf.section("Summary")
pdf.set_font("helvetica", "", 9.5)
pdf.set_text_color(*INK)
pdf.multi_cell(0, 4.8, DATA["summary"])
pdf.ln(1.5)

# ---- Skills ----
pdf.section("Skills")
for label, items in SKILLS:
    pdf.set_font("helvetica", "B", 9.5)
    pdf.set_text_color(*INK)
    pdf.write(5, f"{label}: ")
    pdf.set_font("helvetica", "", 9.5)
    pdf.write(5, items)
    pdf.ln(5)
pdf.ln(1.5)

# ---- Education ----
pdf.section("Education")
for ed in DATA["education"]:
    pdf.set_font("helvetica", "B", 9.5)
    pdf.set_text_color(*INK)
    pdf.cell(118, 5.2, f"{ed['degree']} (GPA {ed['gpa']})")
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 5.2, ed["graduationYear"], align="R",
             new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4.8, f"{ed['institution']} - {ed['location']}",
             new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

# ---- Experience ----
pdf.section("Experience")
for job in DATA["experience"]:
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*INK)
    pdf.cell(118, 5, job["title"])
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 5, f"{job['startDate']} - {job['endDate']}", align="R",
             new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "I", 9.5)
    if job.get("website"):
        pdf.set_text_color(*ACCENT)
        pdf.set_font("helvetica", "IU", 9.5)
        pdf.write(4.8, job["company"], link=job["website"])
        pdf.set_font("helvetica", "I", 9.5)
        pdf.set_text_color(*MUTED)
        pdf.write(4.8, f" - {job['location']}")
        pdf.ln(4.8)
    else:
        pdf.set_text_color(*MUTED)
        pdf.cell(0, 4.8, f"{job['company']} - {job['location']}",
                 new_x="LMARGIN", new_y="NEXT")
    for a in job.get("achievements", []):
        pdf.bullet(a)
    pdf.ln(0.5)

# ---- Projects ----
pdf.section("Projects")
for title, desc, url in PROJECTS:
    pdf.set_font("helvetica", "B", 9.5)
    pdf.set_text_color(*INK)
    pdf.write(5, f"{title}  ")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*MUTED)
    pdf.write(5, f"- {desc}  ")
    pdf.set_text_color(*ACCENT)
    pdf.write(5, url.replace("https://", ""), link=url)
    pdf.ln(5)
pdf.ln(2)

# ---- Awards ----
pdf.section("Awards & Certifications")
for c in DATA["certifications"]:
    pdf.bullet(f"{c['name']} - {c['issuer']} ({c['year']})")

OUT.write_bytes(bytes(pdf.output()))
print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {pdf.pages_count} page(s))")
