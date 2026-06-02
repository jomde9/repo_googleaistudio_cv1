import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function RobotArmSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.2);

  // Smooth target tracking coordinates in 3D workspace
  const targetRef = useRef({ x: 40, y: 80, z: 40 });
  const mouseInRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Camera settings (Orbit values with refs to allow drag-and-rotate capability)
  const angleYRef = useRef<number>(-0.6); // Yaw orbit of the camera
  const angleXRef = useRef<number>(0.4);  // Pitch angle of the camera
  const cameraDistance = 350;

  // Joint physical dimensions
  const L0 = 35; // Base height
  const L1 = 70; // Link 1 (Shoulder to Elbow)
  const L2 = 60; // Link 2 (Elbow to Wrist)
  const L3 = 30; // Link 3 (Wrist to Tool tip)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing dynamically using ResizeObserver
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      // Maintain a consistent height for the interactive card header
      const height = 240; 
      
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

    // Robot state for interpolation (making motion smooth)
    const state = {
      curTarget: { x: 0, y: 60, z: 50 },
      gripperOpen: 0.8, // 0 = closed, 1 = open
      pulse: 0
    };

    const renderLoop = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      const angleY = angleYRef.current;
      const angleX = angleXRef.current;

      // Clear with clean layout background
      ctx.clearRect(0, 0, w, h);

      // Subtle blueprint grid lines in the background
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      const gridSize = 25;
      
      // Horizontal and vertical grid
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

      // Smoothly interpolate the 3D target towards the pointer coordinates
      const targetSpeed = 0.12;
      let targetX = targetRef.current.x;
      let targetY = targetRef.current.y;
      let targetZ = targetRef.current.z;

      if (!mouseInRef.current) {
        // Breathe state if idle: make a gentle circles or ellipse
        targetX = Math.sin(state.pulse * 0.4) * 50;
        targetY = 70 + Math.cos(state.pulse * 0.3) * 20;
        targetZ = 40 + Math.cos(state.pulse * 0.4) * 30;
        // Keep the gripper pulsed
        state.gripperOpen = 0.6 + Math.sin(state.pulse * 0.5) * 0.3;
      } else {
        // Close the gripper partially when actively tracking to simulate grab
        state.gripperOpen = 0.3 + Math.sin(state.pulse * 0.2) * 0.15;
      }

      state.curTarget.x += (targetX - state.curTarget.x) * targetSpeed;
      state.curTarget.y += (targetY - state.curTarget.y) * targetSpeed;
      state.curTarget.z += (targetZ - state.curTarget.z) * targetSpeed;

      // Solve Inverse Kinematics for a 5-axis robot arm
      const tx = state.curTarget.x;
      const ty = state.curTarget.y;
      const tz = state.curTarget.z;

      // Axis 1: Base Yaw (horizontal rotation angle)
      const theta1 = Math.atan2(tz, tx);

      // Project target into the vertical plane of the arm
      const r = Math.sqrt(tx * tx + tz * tz);
      const dy = ty - L0; // vertical delta relative to shoulder height

      // Distance from shoulder center to target
      const D = Math.sqrt(r * r + dy * dy);

      // Clamp target within safe physical boundaries
      const maxReach = L1 + L2 + L3 - 5;
      const minReach = Math.abs(L1 - L2) + 15;
      
      let targetReached2D = { r, dy };
      if (D > maxReach) {
        const factor = maxReach / D;
        targetReached2D.r = r * factor;
        targetReached2D.dy = dy * factor;
      } else if (D < minReach) {
        const factor = minReach / D;
        targetReached2D.r = r * factor;
        targetReached2D.dy = dy * factor;
      }

      const r_clamped = targetReached2D.r;
      const dy_clamped = targetReached2D.dy;
      const D_clamped = Math.sqrt(r_clamped * r_clamped + dy_clamped * dy_clamped);

      // Solve elbow and shoulder angles using the law of cosines
      // Cosine of internal elbow angle
      const cosElbow = (L1 * L1 + L2 * L2 - D_clamped * D_clamped) / (2 * L1 * L2);
      const cosElbowClamped = Math.max(-1, Math.min(1, cosElbow));
      const internalElbow = Math.acos(cosElbowClamped);

      // Axis 3: Elbow pitch relative to link 1
      const theta3 = Math.PI - internalElbow;

      // Angle of target relative to shoulder horizontal line
      const phi = Math.atan2(dy_clamped, r_clamped);

      // Internal angle at shoulder
      const cosShoulder = (L1 * L1 + D_clamped * D_clamped - L2 * L2) / (2 * L1 * D_clamped);
      const cosShoulderClamped = Math.max(-1, Math.min(1, cosShoulder));
      const internalShoulder = Math.acos(cosShoulderClamped);

      // Axis 2: Shoulder pitch
      const theta2 = phi + internalShoulder;

      // Calculate 3D joint points
      // P0: Base center
      const p0 = { x: 0, y: 0, z: 0 };

      // P1: Base column top
      const p1 = { x: 0, y: L0, z: 0 };

      // P2: Elbow (Link 1 end point)
      const p2 = {
        x: L1 * Math.cos(theta2) * Math.cos(theta1),
        y: L0 + L1 * Math.sin(theta2),
        z: L1 * Math.cos(theta2) * Math.sin(theta1)
      };

      // Absolute angle of Link 2 (Elbow to Wrist)
      const theta23 = theta2 - theta3;

      // P3: Wrist (Link 2 end point)
      const p3 = {
        x: p2.x + L2 * Math.cos(theta23) * Math.cos(theta1),
        y: p2.y + L2 * Math.sin(theta23),
        z: p2.z + L2 * Math.cos(theta23) * Math.sin(theta1)
      };

      // P4: End Effector / Tool tip (oriented towards the theoretical cursor target to represent axis 4 & 5 pitch/roll)
      // We project the clamped target in absolute 3D
      const p4 = {
        x: r_clamped * Math.cos(theta1),
        y: dy_clamped + L0,
        z: r_clamped * Math.sin(theta1)
      };

      // Projection utilities (transforms a 3D workspace point into a 2D viewport coordinate)
      const project = (pt: { x: number, y: number, z: number }) => {
        // Centering offset
        const centerX = w / 2;
        const centerY = h - 55; // Slightly lower for ground plane spacing

        // Yaw camera orbit
        let rx = pt.x * Math.cos(angleY) - pt.z * Math.sin(angleY);
        let rz = pt.x * Math.sin(angleY) + pt.z * Math.cos(angleY);
        let ry = pt.y;

        // Pitch camera orbit
        let ry2 = ry * Math.cos(angleX) - rz * Math.sin(angleX);
        let rz2 = ry * Math.sin(angleX) + rz * Math.cos(angleX);

        // Perspective projection formula
        const projectionScale = (zoom * 170) / (rz2 + cameraDistance);
        
        return {
          x: centerX + rx * projectionScale,
          y: centerY - ry2 * projectionScale,
          rz: rz2
        };
      };

      // Project all joint vertices
      const j0 = project(p0);
      const j1 = project(p1);
      const j2 = project(p2);
      const j3 = project(p3);
      const j4 = project(p4);

      // Render Floor/Ground circular radar grid for full 3D visual context
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      
      const groundRadii = [30, 70, 110, 150];
      groundRadii.forEach(radius => {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const fx = radius * Math.cos(a);
          const fz = radius * Math.sin(a);
          const gp = project({ x: fx, y: 0, z: fz });
          if (a === 0) ctx.moveTo(gp.x, gp.y);
          else ctx.lineTo(gp.x, gp.y);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Simple ground coordinate axis indicators in gray-blue
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      const xAxisEnd = project({ x: 160, y: 0, z: 0 });
      const xAxisStart = project({ x: -160, y: 0, z: 0 });
      ctx.beginPath();
      ctx.moveTo(xAxisStart.x, xAxisStart.y);
      ctx.lineTo(xAxisEnd.x, xAxisEnd.y);
      ctx.stroke();

      const zAxisEnd = project({ x: 0, y: 0, z: 160 });
      const zAxisStart = project({ x: 0, y: 0, z: -160 });
      ctx.beginPath();
      ctx.moveTo(zAxisStart.x, zAxisStart.y);
      ctx.lineTo(zAxisEnd.x, zAxisEnd.y);
      ctx.stroke();

      // Project and draw the floor shadow of the robotic arm (adds a premium 3D feeling!)
      const s0 = project({ x: p0.x, y: 0, z: p0.z });
      const s1 = project({ x: p1.x, y: 0, z: p1.z });
      const s2 = project({ x: p2.x, y: 0, z: p2.z });
      const s3 = project({ x: p3.x, y: 0, z: p3.z });
      const s4 = project({ x: p4.x, y: 0, z: p4.z });

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s0.x, s0.y);
      ctx.lineTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.lineTo(s3.x, s3.y);
      ctx.lineTo(s4.x, s4.y);
      ctx.stroke();

      // Render Joints and Links with thick industrial robotic style
      // Base link (p0 to p1)
      ctx.strokeStyle = '#334155'; // Dark industrial slate
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(j0.x, j0.y);
      ctx.lineTo(j1.x, j1.y);
      ctx.stroke();

      // Joint 1: Base Swivel Cap
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(j1.x, j1.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Link 1 (Shoulder to Elbow)
      ctx.strokeStyle = '#1e3a8a'; // Deep navy blue link
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(j1.x, j1.y);
      ctx.lineTo(j2.x, j2.y);
      ctx.stroke();

      // Joint 2: Shoulder
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(j2.x, j2.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Link 2 (Elbow to Wrist)
      ctx.strokeStyle = '#0284c7'; // Vivid cyan link
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(j2.x, j2.y);
      ctx.lineTo(j3.x, j3.y);
      ctx.stroke();

      // Joint 3: Elbow
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.arc(j3.x, j3.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Link 3 (Wrist to Tool tip)
      ctx.strokeStyle = '#14b8a6'; // Teal wrist extension
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(j3.x, j3.y);
      ctx.lineTo(j4.x, j4.y);
      ctx.stroke();

      // Joint 4: Wrist Rotation/Pitch
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(j4.x, j4.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Render 5-Axis End Effector (Interactive dual fingers / gripper)
      // Let's compute tangent vector of the tool segment
      const dx1 = p4.x - p3.x;
      const dy1 = p4.y - p3.y;
      const dz1 = p4.z - p3.z;
      const toolLen = Math.sqrt(dx1 * dx1 + dy1 * dy1 + dz1 * dz1) || 1;
      
      // Directions orthogonal to tool vector for gripper fingers spreads
      const upX = -dz1 / toolLen;
      const upY = 0;
      const upZ = dx1 / toolLen;

      const fingerDist = 9 * state.gripperOpen;

      // Finger Tips Left and Right in 3D
      const fLeft3D = {
        x: p4.x + upX * fingerDist + (dx1 / toolLen) * 8,
        y: p4.y + upY * fingerDist + (dy1 / toolLen) * 8,
        z: p4.z + upZ * fingerDist + (dz1 / toolLen) * 8
      };
      const fRight3D = {
        x: p4.x - upX * fingerDist + (dx1 / toolLen) * 8,
        y: p4.y - upY * fingerDist + (dy1 / toolLen) * 8,
        z: p4.z - upZ * fingerDist + (dz1 / toolLen) * 8
      };

      const jfLeft = project(fLeft3D);
      const jfRight = project(fRight3D);

      // Draw elegant gripper fingers
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Left finger
      ctx.moveTo(j4.x, j4.y);
      ctx.lineTo(jfLeft.x, jfLeft.y);
      // Right finger
      ctx.moveTo(j4.x, j4.y);
      ctx.lineTo(jfRight.x, jfRight.y);
      ctx.stroke();

      // Small gripper pads inside
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.arc(jfLeft.x, jfLeft.y, 2, 0, Math.PI * 2);
      ctx.arc(jfRight.x, jfRight.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Render the current Target indicator to guide the user's eye
      const targetScreen = project({ x: targetX, y: targetY, z: targetZ });
      
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Soft translucent red
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.arc(targetScreen.x, targetScreen.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Subtle target tracking crosshair
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(targetScreen.x, targetScreen.y, 3, 0, Math.PI * 2);
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

  // Handle dragging (cam orbit rotation) and hover (arm tracking targets)
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
      // Orbit camera rotation
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      // Sensitivity factor
      const sensitivity = 0.007;
      angleYRef.current += deltaX * sensitivity;
      // Clamp pitch to avoid extreme vertical flipping
      angleXRef.current = Math.max(-1.1, Math.min(0.9, angleXRef.current + deltaY * sensitivity));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Arm tracking target coordinates
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height - 55;

      const scaleFactor = 1.35 / zoom;
      const clickX = (mx - centerX) * scaleFactor;
      const clickY = (centerY - my) * scaleFactor;
      const clickZ = (mx - centerX) * 0.4 * scaleFactor;

      targetRef.current = {
        x: clickX,
        y: Math.max(10, Math.min(190, clickY)),
        z: clickZ
      };
    }
  };

  const incrementZoom = () => {
    setZoom((prev) => Math.min(2.5, prev + 0.15));
  };

  const decrementZoom = () => {
    setZoom((prev) => Math.max(0.6, prev - 0.15));
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full rounded-xl overflow-hidden border border-gray-100 bg-linear-to-b from-slate-50 to-white flex flex-col group/arm"
      style={{ height: '240px' }}
    >
      {/* 3D Action Canvas View with grab cursors */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => { mouseInRef.current = true; }}
        onMouseLeave={handleMouseLeave}
        className="block cursor-grab active:cursor-grabbing w-full h-full"
        title="Arrastra el puntero para rotar la cámara 3D, o muévelo libremente para guiar el brazo robótico"
      />

      {/* Elegant minimalist Zoom corner controller in dark high contrast theme */}
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

      {/* Floating tag indicating active drag-and-rotate controls in dark style */}
      <div className="absolute bottom-2 left-3 mt-1 select-none pointer-events-none text-[9px] font-bold text-slate-300 bg-slate-900/90 p-1 px-1.5 rounded-md border border-slate-700 z-20">
        Simulador 5 Ejes (Cursor: Guiar brazo | Arrastrar click: Girar vista)
      </div>
    </div>
  );
}
