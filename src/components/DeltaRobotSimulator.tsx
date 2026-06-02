import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function DeltaRobotSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.25);

  // Drag and rotate states for orbiting the camera
  const angleYRef = useRef<number>(-0.5); // Yaw rotation matrix orientation
  const angleXRef = useRef<number>(0.35); // Pitch rotation matrix orientation
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Workspace targets for cursor-following
  const targetRef = useRef({ x: 0, y: 15, z: 0 });
  const mouseInRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Geometric Constants for a Hanging Delta Robot
  const H_base = 100;      // Height of the overhead base center plate
  const R_base = 50;       // Radius of base pivots
  const R_plate = 16;      // Radius of end-effector platform pivots
  const L_bicep = 45;      // Upper bicep arm length
  const L_forearm = 85;    // Lower dual forearm / parallelogram length
  const rodWidth = 7;      // Parallelogram link separation offset

  // Base angles (spaced 120° apart)
  const phiAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle initial resize and handle layout responsiveness
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = 240; // Desktop/mobile consistent height

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    handleResize();

    // Smooth state interpolation target points
    const state = {
      curTarget: { x: 0, y: 15, z: 0 },
      pulse: 0
    };

    const renderLoop = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Clean default white background as requested
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Add a very subtle mathematical radial/rectangular plotting coordinate grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;

      // Grid columns and rows
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      state.pulse += 0.05;

      // Target position: cursor tracking or idle heartbeat breathing motion
      let targetX = targetRef.current.x;
      let targetY = targetRef.current.y;
      let targetZ = targetRef.current.z;

      if (!mouseInRef.current) {
        // Idle state: Make an elegant circular scan path or spiral
        targetX = Math.sin(state.pulse * 0.5) * 35;
        targetY = 15 + Math.cos(state.pulse * 0.3) * 12;
        targetZ = Math.cos(state.pulse * 0.5) * 35;
      }

      // Smoothly interpolate current coordinates towards target
      const lerpFactor = 0.15;
      state.curTarget.x += (targetX - state.curTarget.x) * lerpFactor;
      state.curTarget.y += (targetY - state.curTarget.y) * lerpFactor;
      state.curTarget.z += (targetZ - state.curTarget.z) * lerpFactor;

      const T = state.curTarget;

      // Camera Orbit Rotations & Projections
      const cameraDistance = 350;
      const angleY = angleYRef.current;
      const angleX = angleXRef.current;

      const project = (pt: { x: number, y: number, z: number }) => {
        const centerX = w / 2;
        const centerY = h - 65; // Positioned lower on the canvas to account for suspended structure

        // Yaw camera orbit
        let rx = pt.x * Math.cos(angleY) - pt.z * Math.sin(angleY);
        let rz = pt.x * Math.sin(angleY) + pt.z * Math.cos(angleY);
        let ry = pt.y;

        // Pitch camera orbit
        let ry2 = ry * Math.cos(angleX) - rz * Math.sin(angleX);
        let rz2 = ry * Math.sin(angleX) + rz * Math.cos(angleX);

        // Perspective scale logic
        const scaleVal = (zoom * 170) / (rz2 + cameraDistance);

        return {
          x: centerX + rx * scaleVal,
          y: centerY - ry2 * scaleVal,
          rz: rz2
        };
      };

      // Project the workspace shadow on the floor (y = 0)
      const shadowCenter = project({ x: T.x, y: 0, z: T.z });
      ctx.fillStyle = 'rgba(71, 85, 105, 0.07)';
      ctx.beginPath();
      ctx.arc(shadowCenter.x, shadowCenter.y, 16 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Outer boundary shadow ring for reference
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const rx = 55 * Math.cos(a);
        const rz = 55 * Math.sin(a);
        const pt = project({ x: rx, y: 0, z: rz });
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();

      // Plot Overhead Mounting Frame (Support Pillars)
      const frameHeight = H_base + 30;
      const pillarRadius = 75;
      const pillarPoints = [
        { x: pillarRadius * Math.cos(Math.PI/6), y: 0, z: pillarRadius * Math.sin(Math.PI/6) },
        { x: pillarRadius * Math.cos(5*Math.PI/6), y: 0, z: pillarRadius * Math.sin(5*Math.PI/6) },
        { x: pillarRadius * Math.cos(3*Math.PI/2), y: 0, z: pillarRadius * Math.sin(3*Math.PI/2) }
      ];

      // Draw pillars stretching down from upper structure to floor
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      pillarPoints.forEach(p => {
        const topPt = project({ x: p.x, y: frameHeight, z: p.z });
        const bottomPt = project({ x: p.x, y: 0, z: p.z });
        ctx.beginPath();
        ctx.moveTo(bottomPt.x, bottomPt.y);
        ctx.lineTo(topPt.x, topPt.y);
        ctx.stroke();
      });

      // Overhead Triangular Frame Connecting Pillars
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      pillarPoints.forEach((p, idx) => {
        const pt = project({ x: p.x, y: frameHeight, z: p.z });
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Setup Base Attachment Pivots, Platform Attachment Pivots, and Elbow joints computation
      const projectedBasePivots: { x: number, y: number }[] = [];
      const projectedElbows: { x: number, y: number }[] = [];
      const projectedElbowsL: { x: number, y: number }[] = [];
      const projectedElbowsR: { x: number, y: number }[] = [];
      const projectedPlatformsL: { x: number, y: number }[] = [];
      const projectedPlatformsR: { x: number, y: number }[] = [];

      phiAngles.forEach((phi) => {
        // Base joint 3D position
        const B = {
          x: R_base * Math.cos(phi),
          y: H_base,
          z: R_base * Math.sin(phi)
        };
        projectedBasePivots.push(project(B));

        // Moving platform joint 3D position (un-offset)
        const P_center = {
          x: T.x + R_plate * Math.cos(phi),
          y: T.y,
          z: T.z + R_plate * Math.sin(phi)
        };

        // Standard inverse kinematics projection in vertical slice of arm i
        const T_par = T.x * Math.cos(phi) + T.z * Math.sin(phi);
        const T_perp = -T.x * Math.sin(phi) + T.z * Math.cos(phi);

        const X = R_base - R_plate - T_par;
        const Y = H_base - T.y;

        const A_coeff = 2 * L_bicep * X;
        const B_coeff = 2 * L_bicep * Y;
        const C_coeff = L_forearm * L_forearm - T_perp * T_perp - L_bicep * L_bicep - X * X - Y * Y;

        const radical = A_coeff * A_coeff + B_coeff * B_coeff;
        let theta = -Math.PI / 6; // Reasonable fallback orientation angle if out of workspace limits

        if (radical > 0 && Math.abs(C_coeff) <= Math.sqrt(radical)) {
          const gamma = Math.atan2(B_coeff, A_coeff);
          const acosVal = Math.acos(C_coeff / Math.sqrt(radical));
          // Delta robot upper arm curves outwards/downwards, so we use minus solution
          theta = gamma - acosVal;
        }

        // Elbow joint 3D position
        const E = {
          x: (R_base + L_bicep * Math.cos(theta)) * Math.cos(phi),
          y: H_base + L_bicep * Math.sin(theta),
          z: (R_base + L_bicep * Math.cos(theta)) * Math.sin(phi)
        };
        projectedElbows.push(project(E));

        // Calculate parallel link offsets (parallelogram rods)
        // Offset direction vector is perpendicular horizontally to phi in 3D: (-sin(phi), 0, cos(phi))
        const p_offset_x = -Math.sin(phi) * rodWidth;
        const p_offset_z = Math.cos(phi) * rodWidth;

        const E_L = { x: E.x + p_offset_x, y: E.y, z: E.z + p_offset_z };
        const E_R = { x: E.x - p_offset_x, y: E.y, z: E.z - p_offset_z };

        const P_L = { x: P_center.x + p_offset_x, y: P_center.y, z: P_center.z + p_offset_z };
        const P_R = { x: P_center.x - p_offset_x, y: P_center.y, z: P_center.z - p_offset_z };

        projectedElbowsL.push(project(E_L));
        projectedElbowsR.push(project(E_R));
        projectedPlatformsL.push(project(P_L));
        projectedPlatformsR.push(project(P_R));
      });

      // Draw Overhead Base Plate (Suspended Delta Head)
      ctx.fillStyle = '#f8fafc'; // Clean white base housing plate
      ctx.strokeStyle = '#475569'; // High contrast charcoal stroke
      ctx.lineWidth = 3;
      ctx.beginPath();
      phiAngles.forEach((_, idx) => {
        const bp = projectedBasePivots[idx];
        if (idx === 0) ctx.moveTo(bp.x, bp.y);
        else ctx.lineTo(bp.x, bp.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner details on base plate (servomotor caps / mechanical housing)
      phiAngles.forEach((_, idx) => {
        const bp = projectedBasePivots[idx];
        ctx.fillStyle = '#1e293b'; // Servos are dark charcoal blocks
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw Upper Biceps (Active linkages rotating down from base)
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      phiAngles.forEach((_, idx) => {
        const bp = projectedBasePivots[idx];
        const ep = projectedElbows[idx];

        // Linear gradient style using simple stroke coloring
        ctx.strokeStyle = '#1e3a8a'; // Deep mechanical navy blue
        ctx.beginPath();
        ctx.moveTo(bp.x, bp.y);
        ctx.lineTo(ep.x, ep.y);
        ctx.stroke();
      });

      // Draw Elbow Joint Crossbars
      ctx.lineWidth = 2;
      phiAngles.forEach((_, idx) => {
        const el = projectedElbowsL[idx];
        const er = projectedElbowsR[idx];
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(er.x, er.y);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(el.x, el.y, 3.5, 0, Math.PI * 2);
        ctx.arc(er.x, er.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Lower Forearms (Carbon fiber parallel rods of the delta arm)
      ctx.lineWidth = 2;
      phiAngles.forEach((_, idx) => {
        const el = projectedElbowsL[idx];
        const er = projectedElbowsR[idx];
        const pl = projectedPlatformsL[idx];
        const pr = projectedPlatformsR[idx];

        ctx.strokeStyle = '#0284c7'; // Vibrant cyan carbon fiber linkages
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(pl.x, pl.y);
        ctx.moveTo(er.x, er.y);
        ctx.lineTo(pr.x, pr.y);
        ctx.stroke();
      });

      // Draw End Effector (Payload / Moving Tool Table)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0f766e'; // Teal casing accent color
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      // We connect the platform dual joint centers
      phiAngles.forEach((_, idx) => {
        const pl = projectedPlatformsL[idx];
        const pr = projectedPlatformsR[idx];
        const nextIdx = (idx + 1) % phiAngles.length;
        const nextPl = projectedPlatformsL[nextIdx];

        ctx.lineTo(pl.x, pl.y);
        ctx.lineTo(pr.x, pr.y);
        ctx.lineTo(nextPl.x, nextPl.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Platform joints decoration
      phiAngles.forEach((_, idx) => {
        const pl = projectedPlatformsL[idx];
        const pr = projectedPlatformsR[idx];
        ctx.fillStyle = '#10b981'; // Green ball joint housing
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, 2.5, 0, Math.PI * 2);
        ctx.arc(pr.x, pr.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw TCP suction cup / Tool tip at the very center of moving platform
      const tcp_3D = { x: T.x, y: T.y - 12, z: T.z }; // Hanging downwards from the moving plate
      const projectedTCP = project(tcp_3D);
      const projectedPlateCtr = project(T);

      // Tool connector line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(projectedPlateCtr.x, projectedPlateCtr.y);
      ctx.lineTo(projectedTCP.x, projectedTCP.y);
      ctx.stroke();

      // Suction cup mouth
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(projectedTCP.x, projectedTCP.y, 8 * zoom, 3 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soft target placeholder to trace action
      const targetS = project({ x: targetX, y: targetY - 12, z: targetZ });
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.arc(targetS.x, targetS.y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(targetS.x, targetS.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [zoom]);

  // Interaction handlers to allow drag-rotate & hovering pointer targets tracking
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    mouseInRef.current = false;
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      // Rotation calculations
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      const sensitivity = 0.007;
      angleYRef.current += deltaX * sensitivity;
      // Clamp vertical camera angle limits
      angleXRef.current = Math.max(-0.6, Math.min(1.1, angleXRef.current + deltaY * sensitivity));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Cartesian coordinates tracing
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height - 65;

      const scale = 1.3 / zoom;
      const computedX = (mx - centerX) * scale;
      const computedY = (centerY - my) * -scale; 
      const computedZ = (mx - centerX) * 0.45 * scale;

      targetRef.current = {
        x: Math.max(-65, Math.min(65, computedX)),
        y: Math.max(0, Math.min(65, computedY)), // Safety height limits below the gimbal
        z: Math.max(-65, Math.min(65, computedZ))
      };
    }
  };

  const incrementZoom = () => {
    setZoom((p) => Math.min(2.5, p + 0.15));
  };
  const decrementZoom = () => {
    setZoom((p) => Math.max(0.6, p - 0.15));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden border border-gray-100 bg-white flex flex-col group/delta"
      style={{ height: '240px' }}
    >
      {/* Simulation action viewport, with responsive drag controls */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => { mouseInRef.current = true; }}
        onMouseLeave={handleMouseLeave}
        className="block cursor-grab active:cursor-grabbing w-full h-full"
        title="Arrastra para orbitar la cámara. Pasa el cursor por encima para guiar el efector final del robot Delta"
      />

      {/* Minimalism corner zoom control - High contrast dark styling */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-1 rounded-lg shadow-md z-20">
        <button
          type="button"
          onClick={decrementZoom}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all rounded-md cursor-pointer"
          title="Alejar Zoom"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[9px] font-bold text-slate-200 uppercase select-none w-8 text-center bg-slate-800/80 py-0.5 rounded">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={incrementZoom}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all rounded-md cursor-pointer"
          title="Acercar Zoom"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating explanatory tag indicating controls */}
      <div className="absolute bottom-2 left-3 mt-1 select-none pointer-events-none text-[9px] font-bold text-slate-300 bg-slate-900/90 p-1 px-1.5 rounded-md border border-slate-700 z-20">
        Cinemática Delta 3D (Cursor: Controlar robot | Arrastrar: Girar cámara)
      </div>
    </div>
  );
}
