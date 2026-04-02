"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { QrCode, Download, Copy, CheckCircle2, Printer, ExternalLink, MapPin, Calendar, Clock, Users, Settings } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

// Simple QR Code generator using canvas (no external dependency)
function generateQRMatrix(data: string): boolean[][] {
  // Simplified QR-like pattern for display. In production, use a proper QR library.
  // This creates a visual QR code representation using a simple encoding.
  const size = 33;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data encoding (simplified visual representation)
  const hash = data.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  let seed = Math.abs(hash);
  for (let r = 8; r < size - 8; r++) {
    for (let c = 8; c < size - 8; c++) {
      if (c === 6 || r === 6) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      matrix[r][c] = seed % 3 !== 0;
    }
  }

  // Alignment pattern
  const ap = size - 9;
  for (let r = ap; r < ap + 5; r++) {
    for (let c = ap; c < ap + 5; c++) {
      if (r === ap || r === ap + 4 || c === ap || c === ap + 4 || (r === ap + 2 && c === ap + 2)) {
        matrix[r][c] = true;
      } else {
        matrix[r][c] = false;
      }
    }
  }

  return matrix;
}

function QRCodeCanvas({ data, size = 200, darkColor = "#000000", lightColor = "#FFFFFF" }: { data: string; size?: number; darkColor?: string; lightColor?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrix = generateQRMatrix(data);
    const cellSize = size / matrix.length;

    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = darkColor;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize + 0.5, cellSize + 0.5);
        }
      }
    }
  }, [data, size, darkColor, lightColor]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />;
}

export default function WalkInQRPage() {
  const [baseUrl, setBaseUrl] = useState("https://recruit.tp-malaysia.com");
  const [copied, setCopied] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "Walk-In Interview Day",
    date: "2026-03-29",
    time: "9:00 AM - 4:00 PM",
    location: "Teleperformance Malaysia, Level 15, Menara Shell, KL Sentral",
    positions: "Customer Service (EN/BM/Mandarin), Tech Support (Japanese), Sales Agent",
  });

  const walkinUrl = `${baseUrl}/walkin`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walkinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <QrCode className="w-5 h-5" />
              <h1 className="text-lg font-bold">Walk-in QR Code Generator</h1>
            </div>
            <p className="text-xs text-white/60">Generate QR codes for walk-in candidate self-registration</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sourcing" className="text-xs text-white/70 hover:text-white">← Sourcing Hub</Link>
            <Link href="/walkin" className="text-xs text-white/70 hover:text-white" target="_blank">
              <ExternalLink className="w-3 h-3 inline mr-1" />Walk-in Form
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Config */}
          <div className="space-y-5 print:hidden">
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" /> QR Code Settings
                <InfoTooltip text="Customize the QR code URL and event details for walk-in registrations" />
              </h2>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Base URL</label>
                <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="https://recruit.tp-malaysia.com" />
                <p className="text-[10px] text-gray-400 mt-1">QR will point to: {walkinUrl}</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={eventMode} onChange={e => setEventMode(e.target.checked)}
                    className="rounded border-gray-300" />
                  Event Mode (add event details to printout)
                </label>
              </div>

              {eventMode && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Event Name</label>
                    <input value={eventDetails.name} onChange={e => setEventDetails({ ...eventDetails, name: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input type="date" value={eventDetails.date} onChange={e => setEventDetails({ ...eventDetails, date: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                      <input value={eventDetails.time} onChange={e => setEventDetails({ ...eventDetails, time: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                    <input value={eventDetails.location} onChange={e => setEventDetails({ ...eventDetails, location: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Positions Available</label>
                    <input value={eventDetails.positions} onChange={e => setEventDetails({ ...eventDetails, positions: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-800">Actions</h2>
                <InfoTooltip text="Copy the walk-in URL or print the QR code poster for display at recruitment events" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleCopy}
                  className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  {copied ? <><CheckCircle2 className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy URL</>}
                </button>
                <button onClick={handlePrint}
                  className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <Printer className="w-4 h-4" /> Print Poster
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">How it works</h2>
              <div className="space-y-2">
                {[
                  { step: "1", text: "Print this QR code and place it at reception/walk-in area" },
                  { step: "2", text: "Candidates scan with their phone camera" },
                  { step: "3", text: "They fill in the self-registration form on their phone" },
                  { step: "4", text: "Data is automatically added to the recruitment system" },
                  { step: "5", text: "Recruiter gets notified and candidate receives portal access" },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#4B4C6A] text-white text-xs flex items-center justify-center flex-shrink-0">{s.step}</span>
                    <p className="text-xs text-gray-600 pt-1">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR Preview / Printable Poster */}
          <div>
            <div className="bg-white rounded-2xl border-2 border-[#4B4C6A]/10 p-8 text-center print:border-none print:shadow-none" id="qr-poster">
              {/* TP Branding */}
              <div className="mb-6">
                <div className="mx-auto mb-3 flex justify-center">
                  <img src="/tp-logo-white.png" alt="TP" className="h-14 w-auto" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Teleperformance Malaysia</h2>
                <p className="text-sm text-gray-500 mt-1">We're Hiring! Scan to Apply</p>
              </div>

              {/* QR Code */}
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
                <QRCodeCanvas data={walkinUrl} size={220} darkColor="#4B4C6A" />
              </div>

              <p className="text-xs text-gray-500 mb-2">Scan with your phone camera</p>
              <p className="text-[10px] text-gray-400 font-mono mb-6">{walkinUrl}</p>

              {/* Event Details (if enabled) */}
              {eventMode && (
                <div className="bg-[#f8f7f5] rounded-xl p-4 text-left space-y-2 mb-6">
                  <h3 className="text-sm font-bold text-[#4B4C6A] text-center">{eventDetails.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#4B4C6A]" />
                      {eventDetails.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#4B4C6A]" />
                      {eventDetails.time}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#4B4C6A] mt-0.5 flex-shrink-0" />
                    {eventDetails.location}
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                    <Users className="w-3.5 h-3.5 text-[#4B4C6A] mt-0.5 flex-shrink-0" />
                    {eventDetails.positions}
                  </div>
                </div>
              )}

              {/* Bottom Info */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#4B4C6A]">Quick Apply — No Resume Needed!</p>
                <p className="text-[10px] text-gray-400">Register in under 2 minutes</p>
                <p className="text-[10px] text-gray-400 mt-3">careers.teleperformance.com.my</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
