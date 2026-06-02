import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Smartphone, 
  Droplets, 
  Wind, 
  Sun, 
  Leaf, 
  Cpu,
  Sparkles
} from 'lucide-react';

export default function GreenhouseSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.1);

  // Actuator Toggle States
  const [isAuto, setIsAuto] = useState<boolean>(true);
  const [irrigationOn, setIrrigationOn] = useState<boolean>(false);
  const [fansOn, setFansOn] = useState<boolean>(false);
  const [lampsOn, setLampsOn] = useState<boolean>(false);

  // Environmental Metrics (Simulated real-time values)
  const [temp, setTemp] = useState<number>(24.5);
  const [humidity, setHumidity] = useState<number>(60.0);
  const [light, setLight] = useState<number>(45.0);
  const [plantHealth, setPlantHealth] = useState<number>(95.0);

  // Refs for real-time access inside the animation loop to prevent heavy closure rebuilds
  const isAutoRef = useRef(isAuto);
  const irrigationOnRef = useRef(irrigationOn);
  const fansOnRef = useRef(fansOn);
  const lampsOnRef = useRef(lampsOn);

  const tempRef = useRef(24.5);
  const humidityRef = useRef(60.0);
  const lightRef = useRef(45.0);
  const plantHealthRef = useRef(95.0);

  // Synchronize state values to refs
  useEffect(() => { isAutoRef.current = isAuto; }, [isAuto]);
  useEffect(() => { irrigationOnRef.current = irrigationOn; }, [irrigationOn]);
  useEffect(() => { fansOnRef.current = fansOn; }, [fansOn]);
  useEffect(() => { lampsOnRef.current = lampsOn; }, [lampsOn]);

  // View dragging & orbiting states
  const angleYRef = useRef<number>(-0.6); // Yaw angle
  const angleXRef = useRef<number>(0.35); // Pitch angle
  const panXRef = useRef<number>(0);      // X Panning offset
  const panYRef = useRef<number>(0);      // Y Panning offset

  const isLeftDraggingRef = useRef<boolean>(false);
  const isRightDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Floating coordinates pointing tooltip when mouse shifts over
  const targetRef = useRef({ x: 0, y: 0, z: 0 });
  const mouseInRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Track natural day/night ambient fluctuations
  const cycleTimeRef = useRef<number>(0);

  // Physical geometry sizes of the greenhouse
  const ghWidth = 110;
  const ghLength = 150;
  const ghHeight = 90;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Direct Canvas Sizing Observer
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = 260; // Clean, generous preview height

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();

    // Fan rotation and droplet animation states
    let fanAngle = 0;
    const waterDrops: { x: number, y: number, z: number, speed: number }[] = [];

    // Initialize some water droppers
    for (let i = 0; i < 24; i++) {
      waterDrops.push({
        x: (Math.random() - 0.5) * 40,
        y: ghHeight - 15 - Math.random() * 20,
        z: (Math.random() - 0.5) * 80,
        speed: 1.5 + Math.random() * 2
      });
    }

    const renderLoop = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Clean pure white background as explicitly requested
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Subtle mechanical grid for precision spacing
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      const gridSpacing = 20;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // AUTOMATIC REGULATION AND PHYSICS CO-SIMULATION
      // ----------------------------------------------------
      cycleTimeRef.current += 0.004;
      const wave = Math.sin(cycleTimeRef.current);

      // Natural environmental heat, light, humidity forces
      const ambientLight = Math.max(5, 75 * (wave * 0.5 + 0.5) + (Math.random() - 0.5) * 2);
      const ambientTemp = 18 + 12 * (wave * 0.5 + 0.5) + (Math.random() - 0.5) * 0.5;
      const ambientHumidity = 45 - 15 * (wave * 0.5 + 0.5) + (Math.random() - 0.5) * 1.5;

      // Read current simulated states
      let cTemp = tempRef.current;
      let cHum = humidityRef.current;
      let cLight = lightRef.current;
      let cHealth = plantHealthRef.current;

      if (isAutoRef.current) {
        // AI Control loop
        // Target temp: 22-26°C. If temp > 28°C, activate Fans.
        // Target humidity: 55-70%. If hum < 50%, activate Irrigation.
        // Target light: > 40%. If light < 35%, activate Lamps.
        
        // Automated actuators decisions
        const autoFans = cTemp > 26.5;
        const autoIrrigation = cHum < 52.0;
        const autoLamps = ambientLight < 35.0;

        setIsAuto(true);
        setFansOn(autoFans);
        setIrrigationOn(autoIrrigation);
        setLampsOn(autoLamps);

        // Apply automatic corrections to the system variables
        cLight += ( (autoLamps ? 85 : ambientLight) - cLight ) * 0.08;
        cTemp += ( (autoFans ? ambientTemp - 3.5 : (autoLamps ? ambientTemp + 2.0 : ambientTemp)) - cTemp ) * 0.05;
        cHum += ( (autoIrrigation ? 68.0 : (autoFans ? ambientHumidity - 6.5 : ambientHumidity)) - cHum ) * 0.06;
      } else {
        // Manual control: Actuators directly impact environment
        const targetL = lampsOnRef.current ? 90.0 : ambientLight;
        cLight += (targetL - cLight) * 0.08;

        const fanCooling = fansOnRef.current ? -5.0 : 0.0;
        const lampHeating = lampsOnRef.current ? 4.0 : 0.0;
        cTemp += ( (ambientTemp + fanCooling + lampHeating) - cTemp ) * 0.05;

        const irrMois = irrigationOnRef.current ? 75.0 : ambientHumidity;
        const fanDrying = fansOnRef.current ? -12.0 : 0.0;
        cHum += ( (irrMois + fanDrying) - cHum ) * 0.05;
      }

      // Guard boundaries
      cTemp = Math.max(10, Math.min(50, cTemp));
      cHum = Math.max(10, Math.min(100, cHum));
      cLight = Math.max(0, Math.min(100, cLight));

      // Compute Plant Health (stresses: too hot/cold, too dry/wet, dark)
      let stress = 0;
      if (cTemp < 16 || cTemp > 34) stress += 0.8;
      if (cHum < 40 || cHum > 85) stress += 1.2;
      if (cLight < 25) stress += 0.6;

      if (stress > 0) {
        cHealth = Math.max(25, cHealth - stress * 0.08);
      } else {
        cHealth = Math.min(100, cHealth + 0.15); // Re-heal naturally
      }

      // Update refs & state hooks to mirror calculation output
      tempRef.current = cTemp;
      humidityRef.current = cHum;
      lightRef.current = cLight;
      plantHealthRef.current = cHealth;

      // Throttle bridge hook synchronization to avoid rendering overload
      if (Math.random() < 0.12) {
        setTemp(Math.round(cTemp * 10) / 10);
        setHumidity(Math.round(cHum * 10) / 10);
        setLight(Math.round(cLight * 10) / 10);
        setPlantHealth(Math.round(cHealth * 10) / 10);
      }

      // Increment motor spinners
      if (fansOnRef.current) {
        fanAngle += 0.22;
      }

      // ----------------------------------------------------
      // 3D GRAPHICS PROJECTION CODE
      // ----------------------------------------------------
      const cameraDistance = 380;
      const angleY = angleYRef.current;
      const angleX = angleXRef.current;
      const px = panXRef.current;
      const py = panYRef.current;

      const project = (pt: { x: number, y: number, z: number }) => {
        const centerX = w / 2 + px;
        const centerY = h - 70 + py; // Elevated ground center reference

        // Orbit calculation around Y vector
        let rx = pt.x * Math.cos(angleY) - pt.z * Math.sin(angleY);
        let rz = pt.x * Math.sin(angleY) + pt.z * Math.cos(angleY);
        let ry = pt.y;

        // Orbit calculation around X vector
        let ry2 = ry * Math.cos(angleX) - rz * Math.sin(angleX);
        let rz2 = ry * Math.sin(angleX) + rz * Math.cos(angleX);

        // Standard perspective scale factor
        const scaleVal = (zoom * 190) / (rz2 + cameraDistance);

        return {
          x: centerX + rx * scaleVal,
          y: centerY - ry2 * scaleVal,
          rz: rz2
        };
      };

      // Project floor plane points
      const floorPoints = [
        { x: -ghWidth/2, y: 0, z: -ghLength/2 },
        { x: ghWidth/2, y: 0, z: -ghLength/2 },
        { x: ghWidth/2, y: 0, z: ghLength/2 },
        { x: -ghWidth/2, y: 0, z: ghLength/2 }
      ];
      const pFloor = floorPoints.map(p => project(p));

      // Draw Greenhouse Soil/Floor (Suelo café muy claro)
      ctx.fillStyle = '#f3e8e2'; // Suelo café muy claro cálido / Soft warm tan clay/soil
      ctx.beginPath();
      ctx.moveTo(pFloor[0].x, pFloor[0].y);
      pFloor.forEach(pf => ctx.lineTo(pf.x, pf.y));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ebd6cb';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Configure two distinct plants
      const plants = [
        { x: -24, z: -10, phase: 0, sizeAdjust: 0 },
        { x: 24, z: 15, phase: 1.5, sizeAdjust: -2 }
      ];

      plants.forEach((plConfig) => {
        const plantX = plConfig.x;
        const plantZ = plConfig.z;
        const phase = plConfig.phase;

        // Plot plant pot of each plant
        const potCenter = project({ x: plantX, y: 0, z: plantZ });
        const potTop = project({ x: plantX, y: 14, z: plantZ });

        // Draw clay flower pot in 3D perspective
        ctx.fillStyle = '#c2410c'; // Clay terracotta pot
        ctx.beginPath();
        ctx.ellipse(potTop.x, potTop.y, 16 * zoom, 4.5 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pot structural cone stand
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.moveTo(potTop.x - 16 * zoom, potTop.y);
        ctx.lineTo(potCenter.x - 12 * zoom, potCenter.y);
        ctx.lineTo(potCenter.x + 12 * zoom, potCenter.y);
        ctx.lineTo(potTop.x + 16 * zoom, potTop.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // ----------------------------------------------------
        // DRAW GROWING BIOMASS PLANT WITH MOTION
        // ----------------------------------------------------
        const sway = Math.sin(cycleTimeRef.current * 2 + phase) * 2;
        const leafCount = 8;
        const heightFactor = 12 + (cHealth / 100) * 16 + plConfig.sizeAdjust; 

        const plantBase = { x: plantX, y: 14, z: plantZ };
        const plantTip = { x: plantX + sway, y: 14 + heightFactor, z: plantZ };

        const pBase = project(plantBase);
        const pTip = project(plantTip);

        // Draw main stem
        ctx.strokeStyle = cHealth > 50 ? '#10b981' : '#b45309'; 
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);

        // Interpolated stem curve link
        const pMid = project({ x: plantX + sway * 0.5, y: 14 + heightFactor * 0.5, z: plantZ });
        ctx.quadraticCurveTo(pMid.x, pMid.y, pTip.x, pTip.y);
        ctx.stroke();

        // Draw symmetrical branches & leaves
        for (let i = 1; i <= leafCount; i++) {
          const ratio = i / (leafCount + 1);
          const leafY = 14 + ratio * heightFactor;
          const leafSwayX = sway * ratio;
          
          const sideFactor = i % 2 === 0 ? 1 : -1;
          const leafEndX = leafSwayX + sideFactor * (12 + ratio * 4);
          const leafEndZ = sideFactor * 10 * (1 - ratio);

          const pLeafBase = project({ x: plantX + leafSwayX, y: leafY, z: plantZ });
          const pLeafEnd = project({ x: plantX + leafEndX, y: leafY + 4, z: plantZ + leafEndZ });

          ctx.fillStyle = cHealth > 60 ? '#34d399' : '#d97706'; 
          ctx.beginPath();
          ctx.ellipse(pLeafEnd.x, pLeafEnd.y, 6.5 * zoom, 2.5 * zoom, (sideFactor * Math.PI) / 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = cHealth > 60 ? '#059669' : '#92400e';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Draw healthy flower at the tip if health > 82%
        if (cHealth > 82) {
          ctx.fillStyle = '#f43f5e'; 
          const petalRadius = 4.5 * zoom;
          const petalPositions = [
            { dx: 0, dy: -5 }, { dx: -4.5, dy: -2 }, { dx: 4.5, dy: -2 },
            { dx: -3, dy: 3.5 }, { dx: 3, dy: 3.5 }
          ];
          petalPositions.forEach(pos => {
            const petalProjected = project({
              x: plantTip.x + pos.dx * 0.6,
              y: plantTip.y + pos.dy * 0.6,
              z: plantZ + 0.2
            });
            ctx.beginPath();
            ctx.arc(petalProjected.x, petalProjected.y, petalRadius, 0, Math.PI * 2);
            ctx.fill();
          });

          // Yellow flower core
          const coreProjected = project({ x: plantTip.x, y: plantTip.y, z: plantZ + 0.5 });
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(coreProjected.x, coreProjected.y, 3 * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ----------------------------------------------------
      // DRAW INTUITIVE ENVIRONMENT PIPES SYSTEM
      // ----------------------------------------------------
      const railZ_Start = -ghLength / 2 + 10;
      const railZ_End = ghLength / 2 - 10;

      const pRailS = project({ x: 0, y: ghHeight - 15, z: railZ_Start });
      const pRailE = project({ x: 0, y: ghHeight - 15, z: railZ_End });

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pRailS.x, pRailS.y);
      ctx.lineTo(pRailE.x, pRailE.y);
      ctx.stroke();

      const nozzleCounts = 5;
      for (let j = 0; j < nozzleCounts; j++) {
        const nzRatio = j / (nozzleCounts - 1);
        const nzZ = railZ_Start + nzRatio * (railZ_End - railZ_Start);
        const pNozTop = project({ x: 0, y: ghHeight - 15, z: nzZ });
        const pNozBot = project({ x: 0, y: ghHeight - 20, z: nzZ });

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pNozTop.x, pNozTop.y);
        ctx.lineTo(pNozBot.x, pNozBot.y);
        ctx.stroke();
      }

      // Draw drops falling down if irrigation is toggled on
      if (irrigationOnRef.current) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)'; 
         waterDrops.forEach(drop => {
          drop.y -= drop.speed;
          if (drop.y < 5) {
            drop.y = ghHeight - 20 - Math.random() * 5;
            drop.x = (Math.random() - 0.5) * 22;
            drop.z = (Math.random() - 0.5) * 65;
          }

          const pDrop = project({ x: drop.x, y: drop.y, z: drop.z });
          ctx.beginPath();
          ctx.arc(pDrop.x, pDrop.y, 1.8 * zoom, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------------------
      // DRAW VENTILATION CIRCLING FAN
      // ----------------------------------------------------
      const fanCenter3D = { x: 0, y: ghHeight - 38, z: -ghLength/2 };
      const pFanCenter = project(fanCenter3D);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(pFanCenter.x, pFanCenter.y, 18 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#334155';
      for (let b = 0; b < 3; b++) {
        const bAngle = fanAngle + (b * Math.PI * 2) / 3;
        const bTip3D = {
          x: fanCenter3D.x + Math.sin(bAngle) * 14,
          y: fanCenter3D.y + Math.cos(bAngle) * 14,
          z: fanCenter3D.z + 1
        };
        const pBladeTip = project(bTip3D);

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4 * zoom;
        ctx.beginPath();
        ctx.moveTo(pFanCenter.x, pFanCenter.y);
        ctx.lineTo(pBladeTip.x, pBladeTip.y);
        ctx.stroke();
      }

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(pFanCenter.x, pFanCenter.y, 5 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ----------------------------------------------------
      // DRAW OVERHEAD LIGHTBAR & GROW LAMPS
      // ----------------------------------------------------
      const lampX_Start = -ghWidth / 2 + 30;
      const lampX_End = ghWidth / 2 - 30;

      const pLampS = project({ x: lampX_Start, y: ghHeight - 8, z: 0 });
      const pLampE = project({ x: lampX_End, y: ghHeight - 8, z: 0 });

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pLampS.x, pLampS.y);
      ctx.lineTo(pLampE.x, pLampE.y);
      ctx.stroke();

      if (lampsOnRef.current) {
        const coneTopL = project({ x: lampX_Start - 10, y: ghHeight - 10, z: 10 });
        const coneTopR = project({ x: lampX_End + 10, y: ghHeight - 10, z: -10 });
        const coneBotL = project({ x: -45, y: 15, z: 25 });
        const coneBotR = project({ x: 45, y: 15, z: -25 });

        ctx.fillStyle = 'rgba(253, 224, 71, 0.12)'; 
        ctx.beginPath();
        ctx.moveTo(coneTopL.x, coneTopL.y);
        ctx.lineTo(coneTopR.x, coneTopR.y);
        ctx.lineTo(coneBotR.x, coneBotR.y);
        ctx.lineTo(coneBotL.x, coneBotL.y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
        for (let p = 0; p < 4; p++) {
          const px = (Math.sin(cycleTimeRef.current * 4 + p) * 18);
          const py = 20 + (p * 15 + cycleTimeRef.current * 20) % 50;
          const pP = project({ x: px, y: py, z: Math.cos(cycleTimeRef.current * 4 + p) * 10 });
          ctx.beginPath();
          ctx.arc(pP.x, pP.y, 1.5 * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------
      // DRAW GREENHOUSE HOOP STRUCTURE (GLASS FRAME)
      // ----------------------------------------------------
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)'; 
      ctx.lineWidth = 1.25;

      const archSpacings = [-ghLength/2, -ghLength/4, 0, ghLength/4, ghLength/2];

      archSpacings.forEach(az => {
        ctx.beginPath();
        for (let ax = -ghWidth/2; ax <= ghWidth/2; ax += 10) {
          const ratio = ax / (ghWidth / 2);
          const ay = ghHeight * Math.cos((Math.PI * ratio) / 2);
          const pt = project({ x: ax, y: Math.max(0, ay), z: az });
          
          if (ax === -ghWidth/2) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });

      const connectXCoords = [-ghWidth/2, -ghWidth/4, 0, ghWidth/4, ghWidth/2];
      connectXCoords.forEach(cx => {
        ctx.beginPath();
        archSpacings.forEach((az, sIdx) => {
          const ratio = cx / (ghWidth / 2);
          const cy = ghHeight * Math.cos((Math.PI * ratio) / 2);
          const pt = project({ x: cx, y: Math.max(0, cy), z: az });

          if (sIdx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      });

      if (mouseInRef.current) {
        const mxTarget = project(targetRef.current);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(mxTarget.x, mxTarget.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [zoom]);

  // Handle Dragging Interactions: 
  // - LEFT CLICK drag: ORBITS the camera angle projection (rotar)
  // - RIGHT CLICK drag: PANS the camera view orientation (desplazar)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (e.button === 0) {
      isLeftDraggingRef.current = true;
    } else if (e.button === 2) {
      isRightDraggingRef.current = true;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    if (isLeftDraggingRef.current) {
      // Left click dragging -> Rotates camera orbit
      const sensitivity = 0.0068;
      angleYRef.current += deltaX * sensitivity;
      angleXRef.current = Math.max(0.05, Math.min(1.2, angleXRef.current + deltaY * sensitivity));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else if (isRightDraggingRef.current) {
      // Right click dragging -> Pan/Translate projection alignment
      panXRef.current += deltaX * 0.72;
      panYRef.current += deltaY * 0.72;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const centerX = rect.width / 2 + panXRef.current;
      const centerY = rect.height - 70 + panYRef.current;

      const scale = 1.3 / zoom;
      const computedX = (mx - centerX) * scale;
      const computedZ = (centerY - my) * scale;

      targetRef.current = {
        x: Math.max(-ghWidth/2, Math.min(ghWidth/2, computedX)),
        y: 14 + (Math.sin(cycleTimeRef.current * 4) + 1) * 20, 
        z: Math.max(-ghLength/2, Math.min(ghLength/2, computedZ))
      };
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) isLeftDraggingRef.current = false;
    if (e.button === 2) isRightDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isLeftDraggingRef.current = false;
    isRightDraggingRef.current = false;
    mouseInRef.current = false;
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const incrementZoom = () => setZoom(z => Math.min(2.1, z + 0.15));
  const decrementZoom = () => setZoom(z => Math.max(0.55, z - 0.15));

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-gray-150 bg-white shadow-xs flex flex-col group/gh"
      style={{ height: '260px' }}
    >
      {/* 3D Render Action View viewport */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => { mouseInRef.current = true; }}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        className="block cursor-grab active:cursor-grabbing w-full h-full"
        title="Arrastra click izquierdo para rotar la cámara. Arrastra click derecho para desplazar"
      />

      {/* Floating explanatory user manual tag - Dark layout */}
      <div className="absolute bottom-2.5 left-3 select-none pointer-events-none text-[8.5px] font-bold text-slate-300 bg-slate-900/90 py-1 px-2 rounded-lg border border-slate-700/80 shadow-xs z-10 flex items-center gap-1.5 transition-all">
        <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span>Arrastra Click Izquierdo: Girar cámara | Click Derecho: Desplazar</span>
      </div>

      {/* Left Bottom corner real-time sensor heads - CONTRASTE OSCURO */}
      <div className="absolute top-2.5 left-3 select-none flex flex-row flex-wrap gap-1.5 max-w-[200px] sm:max-w-xs z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-md">
          <Leaf className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-300">Salud:</span>
          <span className="text-[10px] font-bold text-emerald-400">{Math.round(plantHealth)}%</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-md">
          <span className="text-[9px] font-semibold text-slate-300">T: <span className="text-slate-100 font-bold">{temp}°C</span></span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-md">
          <span className="text-[9px] font-semibold text-slate-300">H: <span className="text-slate-100 font-bold">{humidity}%</span></span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-md">
          <span className="text-[9px] font-semibold text-slate-400">Luz: <span className="text-slate-200 font-bold">{light}%</span></span>
        </div>
      </div>

      {/* Floating minimalist utility Zoom corner bar */}
      <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-1 rounded-lg shadow-md z-15">
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

      {/* INTERACTIVE MINI SMARTPHONE CONTROLLER (LOWERED TO AVOID READOUT INDICATORS) */}
      <div 
        className="absolute top-12 right-3 w-[114px] bg-slate-950 border border-slate-800 p-1.5 rounded-[12px] shadow-2xl z-20 transition-all flex flex-col gap-1 hover:border-blue-500 select-none"
        title="Micro-Smartphone de Telecontrol del Invernadero"
      >
        <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto" />

        <div className="flex items-center justify-between px-0.5 mt-0.5">
          <div className="flex items-center gap-0.5">
            <Cpu className="w-2 h-2 text-blue-400 animate-pulse" />
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wide">MobileOS</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <button
          type="button"
          onClick={() => setIsAuto(!isAuto)}
          className={`w-full py-1 rounded-md text-[8.5px] font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer ${
            isAuto 
              ? 'bg-blue-600/90 text-white border-blue-400' 
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          {isAuto ? (
            <>
              <Cpu className="w-2.5 h-2.5" />
              <span>Modo AUTO</span>
            </>
          ) : (
            <>
              <Smartphone className="w-2.5 h-2.5" />
              <span>Modo MANUAL</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-1 gap-1">
          <button
            type="button"
            disabled={isAuto}
            onClick={() => setIrrigationOn(!irrigationOn)}
            className={`w-full py-0.5 px-1 rounded-md text-[8px] font-semibold transition-all flex items-center justify-between border cursor-pointer ${
              isAuto ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              irrigationOn
                ? 'bg-sky-600/20 text-sky-400 border-sky-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-905'
            }`}
          >
            <div className="flex items-center gap-1">
              <Droplets className="w-2.5 h-2.5" />
              <span>Riego</span>
            </div>
            <span className="text-[7.5px] font-extrabold uppercase">{irrigationOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            disabled={isAuto}
            onClick={() => setFansOn(!fansOn)}
            className={`w-full py-0.5 px-1 rounded-md text-[8px] font-semibold transition-all flex items-center justify-between border cursor-pointer ${
              isAuto ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              fansOn
                ? 'bg-teal-600/20 text-teal-400 border-teal-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-905'
            }`}
          >
            <div className="flex items-center gap-1">
              <Wind className="w-2.5 h-2.5" />
              <span>Ventilador</span>
            </div>
            <span className="text-[7.5px] font-extrabold uppercase">{fansOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            disabled={isAuto}
            onClick={() => setLampsOn(!lampsOn)}
            className={`w-full py-0.5 px-1 rounded-md text-[8px] font-semibold transition-all flex items-center justify-between border cursor-pointer ${
              isAuto ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              lampsOn
                ? 'bg-amber-600/20 text-amber-400 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-905'
            }`}
          >
            <div className="flex items-center gap-1">
              <Sun className="w-2.5 h-2.5" />
              <span>Lámparas</span>
            </div>
            <span className="text-[7.5px] font-extrabold uppercase">{lampsOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="w-8 h-0.5 bg-slate-700 rounded-full mx-auto mt-0.5" />
      </div>
    </div>
  );
}
