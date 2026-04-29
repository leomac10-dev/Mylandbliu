"""
PDF → WebP Preview Generator
Temas Trabalhistas em Foco

Converte páginas selecionadas de um PDF em imagens WebP com marca d'água.
Requer: pip install pymupdf pillow
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, colorchooser
import threading
import os
import re
from pathlib import Path

try:
    import fitz          # PyMuPDF
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf", "pillow", "--break-system-packages"])
    import fitz
    from PIL import Image, ImageDraw, ImageFont


# ─────────────────────────────────────────────
# Lógica de conversão
# ─────────────────────────────────────────────

def parse_page_selection(text: str, total: int) -> list[int]:
    """
    Converte string de seleção em lista de índices 0-based.
    Exemplos: "1,3,5-10,15" → [0,2,4,5,6,7,8,9,14]
    """
    pages = set()
    parts = [p.strip() for p in text.split(",") if p.strip()]
    for part in parts:
        if "-" in part:
            a, b = part.split("-", 1)
            a, b = int(a.strip()), int(b.strip())
            for i in range(a, b + 1):
                if 1 <= i <= total:
                    pages.add(i - 1)
        else:
            n = int(part)
            if 1 <= n <= total:
                pages.add(n - 1)
    return sorted(pages)


def add_watermark(img: Image.Image, text: str, opacity: int, color: str) -> Image.Image:
    """Adiciona marca d'água diagonal na imagem."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw    = ImageDraw.Draw(overlay)

    # tamanho da fonte proporcional à largura da imagem
    font_size = max(24, img.width // 18)
    font = None
    for fname in ["arial.ttf", "Arial.ttf", "DejaVuSans-Bold.ttf",
                  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                  "/System/Library/Fonts/Helvetica.ttc"]:
        try:
            font = ImageFont.truetype(fname, font_size)
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()

    # converter cor hex para RGB
    try:
        r = int(color[1:3], 16)
        g = int(color[3:5], 16)
        b = int(color[5:7], 16)
    except Exception:
        r, g, b = 180, 30, 30

    fill = (r, g, b, opacity)

    # desenhar texto repetido em diagonal
    w, h   = img.size
    step_x = max(180, w // 3)
    step_y = max(120, h // 5)

    import math
    angle = -25
    tmp = Image.new("RGBA", (w * 3, h * 3), (0, 0, 0, 0))
    td  = ImageDraw.Draw(tmp)

    for xi in range(-w, w * 2, step_x):
        for yi in range(-h, h * 2, step_y):
            td.text((xi, yi), text, font=font, fill=fill)

    tmp = tmp.rotate(angle, expand=False)
    cx  = (tmp.width  - w) // 2
    cy  = (tmp.height - h) // 2
    tmp = tmp.crop((cx, cy, cx + w, cy + h))

    result = Image.alpha_composite(img.convert("RGBA"), tmp)
    return result.convert("RGB")


def convert_pdf(
    pdf_path: str,
    output_dir: str,
    page_selection: str,
    dpi: int,
    quality: int,
    wm_text: str,
    wm_opacity: int,
    wm_color: str,
    prefix: str,
    progress_cb,
    log_cb,
    done_cb
):
    try:
        doc   = fitz.open(pdf_path)
        total = doc.page_count
        pages = parse_page_selection(page_selection, total)

        if not pages:
            log_cb("⚠️  Nenhuma página válida selecionada.")
            done_cb(False)
            return

        os.makedirs(output_dir, exist_ok=True)
        mat = fitz.Matrix(dpi / 72, dpi / 72)

        for i, page_idx in enumerate(pages):
            page   = doc[page_idx]
            pix    = page.get_pixmap(matrix=mat, alpha=False)
            img    = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

            if wm_text.strip():
                img = add_watermark(img, wm_text.strip(), wm_opacity, wm_color)

            fname  = f"{prefix}{str(i + 1).zfill(2)}.webp"
            fpath  = os.path.join(output_dir, fname)
            img.save(fpath, "WEBP", quality=quality, method=6)

            pct = int((i + 1) / len(pages) * 100)
            progress_cb(pct)
            log_cb(f"✓ Página {page_idx + 1:>3} → {fname}")

        doc.close()
        log_cb(f"\n✅ {len(pages)} imagens salvas em:\n   {output_dir}")
        done_cb(True)
    except Exception as e:
        log_cb(f"\n❌ Erro: {e}")
        done_cb(False)


# ─────────────────────────────────────────────
# Interface gráfica
# ─────────────────────────────────────────────

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("PDF → WebP Preview Generator")
        self.resizable(True, True)
        self.minsize(620, 680)
        self.configure(bg="#0d1117")
        self._pdf_path    = tk.StringVar()
        self._out_dir     = tk.StringVar()
        self._page_sel    = tk.StringVar(value="1-20")
        self._dpi         = tk.IntVar(value=150)
        self._quality     = tk.IntVar(value=85)
        self._wm_text     = tk.StringVar(value="PRÉVIA · NÃO COMERCIAL")
        self._wm_opacity  = tk.IntVar(value=55)
        self._wm_color    = "#b41e1e"
        self._prefix      = tk.StringVar(value="page-")
        self._total_pages = 0
        self._build_ui()

    # ── estilos ──────────────────────────────
    C_BG    = "#0d1117"
    C_CARD  = "#161b22"
    C_BORD  = "#30363d"
    C_CYAN  = "#00c8ff"
    C_RED   = "#ff4444"
    C_TEXT  = "#e6edf3"
    C_DIM   = "#8b949e"
    C_GREEN = "#3fb950"

    def _lbl(self, parent, text, **kw):
        return tk.Label(parent, text=text, bg=self.C_CARD, fg=self.C_DIM,
                        font=("Helvetica", 9), **kw)

    def _entry(self, parent, textvariable, **kw):
        return tk.Entry(parent, textvariable=textvariable,
                        bg="#010409", fg=self.C_TEXT,
                        insertbackground=self.C_CYAN,
                        relief="flat", bd=4,
                        font=("Helvetica", 10), **kw)

    def _btn(self, parent, text, cmd, color=None, **kw):
        c = color or self.C_CYAN
        b = tk.Button(parent, text=text, command=cmd,
                      bg=c, fg="#000",
                      activebackground=c, activeforeground="#000",
                      relief="flat", bd=0, padx=12, pady=6,
                      font=("Helvetica", 9, "bold"), cursor="hand2", **kw)
        return b

    def _card(self, parent, title):
        frame = tk.LabelFrame(parent, text=f"  {title}  ",
                              bg=self.C_CARD, fg=self.C_CYAN,
                              font=("Helvetica", 9, "bold"),
                              relief="flat", bd=1,
                              highlightbackground=self.C_BORD,
                              highlightthickness=1)
        return frame

    # ── construção ────────────────────────────
    def _build_ui(self):
        pad = dict(padx=16, pady=6)

        # ── PDF de origem
        c1 = self._card(self, "1 · Arquivo PDF")
        c1.pack(fill="x", **pad)
        r = tk.Frame(c1, bg=self.C_CARD)
        r.pack(fill="x", padx=10, pady=8)
        self._entry(r, self._pdf_path).pack(side="left", fill="x", expand=True, ipady=4)
        self._btn(r, "Abrir…", self._pick_pdf).pack(side="left", padx=(6, 0))

        self._pages_info = tk.Label(c1, text="", bg=self.C_CARD, fg=self.C_DIM,
                                    font=("Helvetica", 9))
        self._pages_info.pack(anchor="w", padx=10, pady=(0, 6))

        # ── seleção de páginas
        c2 = self._card(self, "2 · Seleção de páginas")
        c2.pack(fill="x", **pad)
        inner2 = tk.Frame(c2, bg=self.C_CARD)
        inner2.pack(fill="x", padx=10, pady=8)
        self._lbl(inner2, "Páginas (ex: 1-5, 8, 12-15):").pack(anchor="w")
        er = tk.Frame(inner2, bg=self.C_CARD)
        er.pack(fill="x", pady=(4, 0))
        self._entry(er, self._page_sel, width=30).pack(side="left", ipady=4)
        self._btn(er, "Selecionar todas", self._select_all,
                  color="#21262d").pack(side="left", padx=(8, 0))
        self._btn(er, "Prévia da seleção", self._preview_selection,
                  color="#21262d").pack(side="left", padx=(4, 0))
        self._sel_info = tk.Label(inner2, text="", bg=self.C_CARD, fg=self.C_GREEN,
                                  font=("Helvetica", 9))
        self._sel_info.pack(anchor="w", pady=(4, 0))

        # ── marca d'água
        c3 = self._card(self, "3 · Marca d'água")
        c3.pack(fill="x", **pad)
        g3 = tk.Frame(c3, bg=self.C_CARD)
        g3.pack(fill="x", padx=10, pady=8)

        self._lbl(g3, "Texto:").grid(row=0, column=0, sticky="w", pady=3)
        self._entry(g3, self._wm_text, width=38).grid(row=0, column=1, sticky="ew", padx=(8,0), pady=3, ipady=4)

        self._lbl(g3, "Opacidade (0–255):").grid(row=1, column=0, sticky="w", pady=3)
        op_f = tk.Frame(g3, bg=self.C_CARD)
        op_f.grid(row=1, column=1, sticky="ew", padx=(8,0), pady=3)
        tk.Scale(op_f, variable=self._wm_opacity, from_=0, to=255,
                 orient="horizontal", bg=self.C_CARD, fg=self.C_TEXT,
                 troughcolor="#21262d", highlightthickness=0,
                 length=200).pack(side="left")
        self._lbl(op_f, "").pack(side="left")

        self._lbl(g3, "Cor:").grid(row=2, column=0, sticky="w", pady=3)
        cf = tk.Frame(g3, bg=self.C_CARD)
        cf.grid(row=2, column=1, sticky="w", padx=(8,0), pady=3)
        self._color_preview = tk.Label(cf, bg=self._wm_color, width=4,
                                       relief="flat", bd=1)
        self._color_preview.pack(side="left")
        self._btn(cf, "Escolher cor", self._pick_color,
                  color="#21262d").pack(side="left", padx=(8,0))
        g3.columnconfigure(1, weight=1)

        # ── saída
        c4 = self._card(self, "4 · Saída")
        c4.pack(fill="x", **pad)
        g4 = tk.Frame(c4, bg=self.C_CARD)
        g4.pack(fill="x", padx=10, pady=8)

        self._lbl(g4, "Pasta de saída:").grid(row=0, column=0, sticky="w", pady=3)
        of = tk.Frame(g4, bg=self.C_CARD)
        of.grid(row=0, column=1, sticky="ew", padx=(8,0), pady=3)
        self._entry(of, self._out_dir).pack(side="left", fill="x", expand=True, ipady=4)
        self._btn(of, "Escolher…", self._pick_out_dir).pack(side="left", padx=(6,0))

        self._lbl(g4, "Prefixo dos arquivos:").grid(row=1, column=0, sticky="w", pady=3)
        self._entry(g4, self._prefix, width=16).grid(row=1, column=1, sticky="w",
                                                      padx=(8,0), pady=3, ipady=4)

        self._lbl(g4, "DPI (qualidade):").grid(row=2, column=0, sticky="w", pady=3)
        dpi_f = tk.Frame(g4, bg=self.C_CARD)
        dpi_f.grid(row=2, column=1, sticky="w", padx=(8,0), pady=3)
        for val, lbl in [(100,"Leve"),(150,"Padrão"),(200,"Alta"),(300,"Máxima")]:
            tk.Radiobutton(dpi_f, text=f"{val} ({lbl})", variable=self._dpi, value=val,
                           bg=self.C_CARD, fg=self.C_TEXT, selectcolor="#21262d",
                           activebackground=self.C_CARD,
                           font=("Helvetica", 9)).pack(side="left", padx=4)

        self._lbl(g4, "Qualidade WebP:").grid(row=3, column=0, sticky="w", pady=3)
        qf = tk.Frame(g4, bg=self.C_CARD)
        qf.grid(row=3, column=1, sticky="ew", padx=(8,0), pady=3)
        tk.Scale(qf, variable=self._quality, from_=60, to=100,
                 orient="horizontal", bg=self.C_CARD, fg=self.C_TEXT,
                 troughcolor="#21262d", highlightthickness=0,
                 length=200).pack(side="left")
        g4.columnconfigure(1, weight=1)

        # ── progresso e log
        c5 = self._card(self, "5 · Progresso")
        c5.pack(fill="both", expand=True, **pad)
        self._progress = ttk.Progressbar(c5, mode="determinate", maximum=100)
        self._progress.pack(fill="x", padx=10, pady=(8,4))

        style = ttk.Style()
        style.theme_use("default")
        style.configure("TProgressbar", troughcolor="#21262d",
                        background=self.C_CYAN, thickness=8)

        self._log = tk.Text(c5, height=6, bg="#010409", fg=self.C_DIM,
                            font=("Courier", 9), relief="flat", bd=4,
                            state="disabled")
        self._log.pack(fill="both", expand=True, padx=10, pady=(0,8))

        # ── botão principal
        bottom = tk.Frame(self, bg=self.C_BG)
        bottom.pack(fill="x", padx=16, pady=(4,16))
        self._run_btn = self._btn(bottom, "▶  Gerar Imagens WebP",
                                  self._run, color=self.C_CYAN)
        self._run_btn.pack(side="right")
        self._btn(bottom, "Limpar log", self._clear_log,
                  color="#21262d").pack(side="right", padx=(0,8))

    # ── callbacks ─────────────────────────────
    def _pick_pdf(self):
        path = filedialog.askopenfilename(
            title="Selecione o PDF",
            filetypes=[("PDF", "*.pdf"), ("Todos", "*.*")])
        if path:
            self._pdf_path.set(path)
            # sugerir pasta de saída
            if not self._out_dir.get():
                self._out_dir.set(str(Path(path).parent / "preview_webp"))
            # contar páginas
            try:
                doc = fitz.open(path)
                self._total_pages = doc.page_count
                doc.close()
                self._pages_info.config(
                    text=f"  {self._total_pages} páginas encontradas",
                    fg=self.C_GREEN)
                self._page_sel.set(f"1-{min(20, self._total_pages)}")
                self._update_sel_info()
            except Exception as e:
                self._pages_info.config(text=f"  Erro ao abrir PDF: {e}", fg=self.C_RED)

    def _pick_out_dir(self):
        d = filedialog.askdirectory(title="Pasta de saída")
        if d:
            self._out_dir.set(d)

    def _pick_color(self):
        c = colorchooser.askcolor(color=self._wm_color, title="Cor da marca d'água")
        if c and c[1]:
            self._wm_color = c[1]
            self._color_preview.config(bg=c[1])

    def _select_all(self):
        if self._total_pages:
            self._page_sel.set(f"1-{self._total_pages}")
            self._update_sel_info()

    def _preview_selection(self):
        if not self._total_pages:
            messagebox.showinfo("Aviso", "Abra um PDF primeiro.")
            return
        try:
            pages = parse_page_selection(self._page_sel.get(), self._total_pages)
            messagebox.showinfo(
                "Páginas selecionadas",
                f"{len(pages)} página(s):\n{', '.join(str(p+1) for p in pages)}")
        except Exception as e:
            messagebox.showerror("Erro", f"Seleção inválida: {e}")

    def _update_sel_info(self, *_):
        if not self._total_pages:
            return
        try:
            pages = parse_page_selection(self._page_sel.get(), self._total_pages)
            self._sel_info.config(
                text=f"  {len(pages)} página(s) selecionada(s)")
        except Exception:
            self._sel_info.config(text="  Seleção inválida", fg=self.C_RED)

    def _clear_log(self):
        self._log.config(state="normal")
        self._log.delete("1.0", "end")
        self._log.config(state="disabled")

    def _log_msg(self, msg: str):
        self._log.config(state="normal")
        self._log.insert("end", msg + "\n")
        self._log.see("end")
        self._log.config(state="disabled")

    def _set_progress(self, pct: int):
        self._progress["value"] = pct

    def _run(self):
        if not self._pdf_path.get():
            messagebox.showwarning("Aviso", "Selecione um arquivo PDF.")
            return
        if not self._out_dir.get():
            messagebox.showwarning("Aviso", "Escolha uma pasta de saída.")
            return
        if not self._page_sel.get().strip():
            messagebox.showwarning("Aviso", "Informe as páginas a converter.")
            return

        self._run_btn.config(state="disabled", text="Processando…")
        self._progress["value"] = 0

        def done(ok):
            self._run_btn.config(state="normal", text="▶  Gerar Imagens WebP")
            if ok:
                self._progress["value"] = 100

        threading.Thread(
            target=convert_pdf,
            args=(
                self._pdf_path.get(),
                self._out_dir.get(),
                self._page_sel.get(),
                self._dpi.get(),
                self._quality.get(),
                self._wm_text.get(),
                self._wm_opacity.get(),
                self._wm_color,
                self._prefix.get(),
                lambda p: self.after(0, self._set_progress, p),
                lambda m: self.after(0, self._log_msg, m),
                lambda ok: self.after(0, done, ok),
            ),
            daemon=True
        ).start()


if __name__ == "__main__":
    app = App()
    app._page_sel.trace_add("write", app._update_sel_info)
    app.mainloop()
