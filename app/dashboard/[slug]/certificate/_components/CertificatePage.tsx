"use client";

import { useEffect, useRef, useState } from "react";
import { CertificateDataType } from "@/app/data/course/get-certificate-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Star,
  Award,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import signatureImg from "@/app/src/assets/signature/signature.png";
import { Inter, Bricolage_Grotesque } from "next/font/google";

const interFont = Inter({ subsets: ["latin"], display: "swap" });
const bricolageFont = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

// ─── Template canvas dimensions (must match certificate-template.png) ──────
const CERT_W = 2000;
const CERT_H = 1414;

// ─── Pixel coordinates — calibrated to the 2000×1414 canvas ───────────────
//
//  Static elements ALREADY IN THE PNG (do NOT re-draw these):
//    "CERTIFICATE"             y ≈  92 – 390 px
//    "OF COMPLETION"           y ≈ 402 – 472 px
//    "This certifies that"     y ≈ 488 – 528 px
//    Static underline          y ≈ 928 – 936 px  ← erased with white below
//    "Madhan Kumar"            y ≈ 1215 – 1245 px  (bottom-left)
//    CEO sig line              y ≈ 1255 – 1260 px
//    "Chief Executive Officer" y ≈ 1270 – 1300 px
//    Right sig line            y ≈ 1305 – 1310 px
//    "Training Coordinator"    y ≈ 1322 – 1352 px
//
//  Blank zone for dynamic content: y = 540 – 1210 (height 670 px)
//
//  Content block height estimate: name(80) + gap(28) + underline + gap(42) + 4 desc lines(188) ≈ 360 px
//  Vertical center start: 540 + (670 – 360) / 2 ≈ 695 px  → NAME top at 695
//  Name baseline (cap-height ≈ 75 % of 80 px = 60 px): 695 + 60 = 755
//
//  Dynamic overlays:
//    Recipient name  baseline  → x=190, y=755
//    Own underline             → y=783
//    Description block         → y starts at 826
// ──────────────────────────────────────────────────────────────────────────
const TEXT_X = 190;   // left margin — lines up with template text
const NAME_Y = 680;   // name baseline — moved up another 40 px
const UNDERLINE_Y = 710;   // underline drawn right below name
const UNDERLINE_W = 760;   // width in px  (≈ 38% of canvas width)
const DESC_Y = 758;   // first description line baseline
const DESC_LH = 48;    // normal line-height for description
const TITLE_LH = 54;    // line-height for Bricolage course title (may wrap)
const MAX_W = 1380;  // max text width before word-wrapping

const C_NAVY = "#0d1b2a";  // matches CERTIFICATE heading dark navy
const C_BODY = "#2a3547";  // matches body text in template

// Word-wrap helper — returns the Y position after the final line
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
): number {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxW && line !== "") {
      ctx.fillText(line.trimEnd(), x, y);
      line = word + " ";
      y += lineH;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trimEnd(), x, y);
  return y + lineH;
}

export function CertificatePage({ data }: { data: CertificateDataType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(data.completedAt);

  // ── Render template + dynamic text onto canvas ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CERT_W;
    canvas.height = CERT_H;
    ctx.clearRect(0, 0, CERT_W, CERT_H);

    const loadImg = (src: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    };

    Promise.all([
      loadImg("/certificate-template.png"),
      loadImg(signatureImg.src)
    ]).then(async ([img, sigImg]) => {
      // 1. Paint the full template
      ctx.drawImage(img, 0, 0, CERT_W, CERT_H);

      // 1b. Erase the template's static underline (white rectangle)
      //     so it doesn't bleed through when content is repositioned.
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(TEXT_X, 920, 1100, 24);
      ctx.restore();

      // 2. Wait for all CSS fonts (including Bricolage Grotesque loaded via
      //    next/font/google) to be available to the canvas context.
      await document.fonts.ready;

      // ── 3. Recipient Name — Bricolage Grotesque SemiBold ───────────────
      ctx.save();
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = C_NAVY;
      // Use 'bold' or '700' rather than '600' to guarantee weight renders in the downloaded canvas
      ctx.font = `bold 80px ${bricolageFont.style.fontFamily}, serif`;
      ctx.fillText(data.user.name, TEXT_X, NAME_Y);
      ctx.restore();

      // ── 4. Underline drawn directly below the name ──────────────────────
      ctx.save();
      ctx.fillStyle = C_NAVY;
      ctx.fillRect(TEXT_X, UNDERLINE_Y, UNDERLINE_W, 2);
      ctx.restore();

      // ── 5. Description block ────────────────────────────────────────────
      ctx.save();
      ctx.textBaseline = "alphabetic";

      let y = DESC_Y;

      // Line 1 — "has successfully completed the" — Inter
      ctx.fillStyle = C_BODY;
      ctx.font = `400 30px ${interFont.style.fontFamily}, sans-serif`;
      ctx.fillText("has successfully completed the", TEXT_X, y);
      y += DESC_LH;

      // Line 2 — course title — Bricolage Grotesque Medium
      ctx.fillStyle = C_NAVY;
      ctx.font = `500 32px ${bricolageFont.style.fontFamily}, serif`;
      y = wrapText(ctx, `\u201C${data.course.title}\u201D`, TEXT_X, y, MAX_W, TITLE_LH);

      // Line 3 — "conducted by Only Students" — Inter
      ctx.fillStyle = C_BODY;
      ctx.font = `400 30px ${interFont.style.fontFamily}, sans-serif`;
      ctx.fillText("conducted by Only Students", TEXT_X, y);
      y += DESC_LH - 2;

      // Line 4 — "on [date]" — Inter
      ctx.fillText(`on ${formattedDate}`, TEXT_X, y);

      ctx.restore();

      // ── 6. Signature section ────────────────────────────────────────────
      // Erase the template's existing static signature text with white,
      // then redraw with consistent fonts matching the certificate design.
      ctx.save();

      // Erase existing template signatures carefully so it doesn't overlap
      // the dark blue borders at the bottom. The template's bottom border
      // starts around Y=1280.
      ctx.fillStyle = "#ffffff";
      // Erase left signature block (covers original text around y=1215-1275)
      ctx.fillRect(170, 1140, 380, 130);
      // Erase right signature block completely (since we only need CEO)
      ctx.fillRect(1000, 1140, 400, 130);

      // ── Left signature (Chief Executive Officer ONLY) ──
      const SIG_Y_BASE = 1130; // Moved further up

      // Draw signature image
      const maxSigW = 560;
      const maxSigH = 280;
      const scale = Math.min(maxSigW / sigImg.width, maxSigH / sigImg.height);
      const drawW = sigImg.width * scale;
      const drawH = sigImg.height * scale;

      const sigX = TEXT_X + 155 - (drawW / 2);
      // Bring the signature down a bit more, now without the line
      const sigY = SIG_Y_BASE + 100 - drawH;
      ctx.drawImage(sigImg, sigX, sigY, drawW, drawH);

      // Title — Inter
      ctx.fillStyle = C_BODY;
      ctx.font = `400 22px ${interFont.style.fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Chief Executive Officer", TEXT_X + 155, SIG_Y_BASE + 55);
      ctx.textAlign = "left"; // reset for future draws

      // ── 7. Verification ID (Cryptographic Security) ─────────────────────
      if (data.certificateId) {
        ctx.fillStyle = "#888888"; // Subtle grey for security hash
        ctx.font = `400 16px "Mona Sans", "Helvetica Neue", Arial, sans-serif`;
        ctx.textAlign = "right";
        ctx.fillText(`Verification ID: ${data.certificateId}`, 1810, 1330);
        ctx.textAlign = "left"; // reset for future draws if any
      }

      ctx.restore();

      setIsReady(true);
    }).catch(err => {
      console.error("[Certificate] Failed to load images", err);
    });
  }, [data.user.name, data.course.title, formattedDate]);

  // ── Download as full-resolution PNG ────────────────────────────────────
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady) return;

    const a = document.createElement("a");
    a.download = `OnlyStudents-Certificate-${data.course.slug}.png`;
    a.href = canvas.toDataURL("image/png", 1.0);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top nav (hidden on print) ─────────────────────────────────── */}
      <div className="no-print border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href={`/dashboard/${data.course.slug}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="size-4" />
            Back to Course
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md font-medium border border-emerald-500/20">
              <ShieldCheck className="size-3.5" />
              <span>Secured with SHA-256</span>
            </div>
            <Button
              id="download-certificate-btn"
              onClick={handleDownload}
              disabled={!isReady}
              size="sm"
            >
              {!isReady
                ? <Loader2 className="size-4 animate-spin" />
                : <Download className="size-4" />}
              Download Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Hero greeting (hidden on print) */}
        <div className="no-print text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative inline-flex items-center justify-center group mb-2 mt-2"
          >
            {/* Elegant blurred glow */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            />

            {/* Core badge */}
            <div className="relative size-20 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border-2 border-primary/40 flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <Award className="size-10 text-primary drop-shadow-md" strokeWidth={1.5} />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Congratulations,{" "}
              <span className="text-primary">{data.user.name}!</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              You&apos;ve successfully completed{" "}
              <span className="text-foreground font-semibold">
                {data.course.title}
              </span>
              . Your certificate is ready below.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="font-medium">
                {data.course.totalLessons} Lessons Completed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-1.5">
              <BookOpen className="size-4 text-primary" />
              <span className="font-medium">{data.course.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-1.5">
              <Star className="size-4 text-primary" />
              <span className="font-medium">{data.course.level}</span>
            </div>
          </div>
        </div>

        {/* ── Certificate canvas ────────────────────────────────────────────
            Canvas is internally 2000×1414. CSS scales it to container width.
            All text painted at exact pixel coords — no CSS positioning.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-muted"
          style={{ aspectRatio: `${CERT_W} / ${CERT_H}` }}
        >
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse rounded-xl">
              <Loader2 className="size-8 text-muted-foreground animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            id="certificate-card"
            aria-label="Certificate of Completion"
            className="w-full h-full block"
            style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.4s ease" }}
          />
        </div>

        {/* ── Action buttons (hidden on print) ─────────────────────────── */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-3 pb-10">
          <Button
            id="download-certificate-btn-2"
            size="lg"
            onClick={handleDownload}
            disabled={!isReady}
            className="w-full sm:w-auto"
          >
            {!isReady
              ? <Loader2 className="size-4 animate-spin" />
              : <Download className="size-4" />}
            Download Certificate
          </Button>
          <Link 
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            <BookOpen className="size-4" />
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
