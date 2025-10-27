var j=Object.defineProperty;var S=(h,n,d)=>n in h?j(h,n,{enumerable:!0,configurable:!0,writable:!0,value:d}):h[n]=d;var a=(h,n,d)=>S(h,typeof n!="symbol"?n+"":n,d);import{r as y,j as r}from"./react-vendor-W4zfnjO4.js";import"./vendor-k7V_0J0F.js";const Y=()=>{const h=y.useRef(null),[n,d]=y.useState({x:window.innerWidth/2,y:window.innerHeight/2}),c=["#0EA5E9","#7C3AED","#22C55E","#E2E8F0"];y.useEffect(()=>{const e=h.current;if(!e)return;const t=e.getContext("2d");if(!t)return;e.width=window.innerWidth,e.height=window.innerHeight;class M{constructor(){a(this,"x");a(this,"y");a(this,"baseX");a(this,"baseY");a(this,"size");a(this,"speedX");a(this,"speedY");a(this,"opacity");a(this,"color");a(this,"life");a(this,"maxLife");this.x=0,this.y=0,this.baseX=0,this.baseY=0,this.size=0,this.speedX=0,this.speedY=0,this.opacity=0,this.color="",this.life=0,this.maxLife=0,this.reset()}reset(){e&&(this.baseX=Math.random()*e.width,this.baseY=Math.random()*e.height,this.x=this.baseX,this.y=this.baseY,this.size=Math.random()*3+1,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.4+.3,this.color=c[Math.floor(Math.random()*c.length)],this.maxLife=Math.random()*200+200,this.life=0)}update(){if(!e)return;this.x+=this.speedX,this.y+=this.speedY,this.life++;const o=.002;this.x+=(this.baseX-this.x)*o,this.y+=(this.baseY-this.y)*o,this.x<-50&&(this.x=e.width+50),this.x>e.width+50&&(this.x=-50),this.y<-50&&(this.y=e.height+50),this.y>e.height+50&&(this.y=-50);const s=n.x-this.x,x=n.y-this.y,l=Math.sqrt(s*s+x*x);if(l<200){const f=(200-l)/200*.5;this.x+=s/l*f,this.y+=x/l*f}this.life>this.maxLife&&this.reset()}draw(){if(!t)return;let o=this.opacity;this.life<50?o*=this.life/50:this.life>this.maxLife-50&&(o*=(this.maxLife-this.life)/50),t.beginPath(),t.arc(this.x,this.y,this.size,0,Math.PI*2),t.fillStyle=this.color,t.globalAlpha=o,t.fill(),t.shadowBlur=20,t.shadowColor=this.color,t.fill(),t.shadowBlur=0,t.globalAlpha=1}}const p=Array.from({length:80},()=>new M),C=()=>{t&&p.forEach((i,o)=>{p.slice(o+1).forEach(s=>{const x=i.x-s.x,l=i.y-s.y,f=Math.sqrt(x*x+l*l);if(f<150){const E=(1-f/150)*.2;t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(s.x,s.y);const u=t.createLinearGradient(i.x,i.y,s.x,s.y);u.addColorStop(0,i.color),u.addColorStop(1,s.color),t.strokeStyle=u,t.globalAlpha=E,t.lineWidth=1.5,t.stroke(),t.globalAlpha=1}})})};let g=0;const m=()=>{if(!t||!e)return;g+=.005;const i=t.createRadialGradient(e.width/2+Math.sin(g)*100,e.height/2+Math.cos(g)*100,0,e.width/2,e.height/2,Math.max(e.width,e.height)*.7);i.addColorStop(0,"#1e293b"),i.addColorStop(.5,"#0F172A"),i.addColorStop(1,"#020617"),t.fillStyle=i,t.fillRect(0,0,e.width,e.height);const o=t.createLinearGradient(0,0,e.width,e.height);o.addColorStop(0,"rgba(14, 165, 233, 0.05)"),o.addColorStop(.5,"rgba(124, 58, 237, 0.03)"),o.addColorStop(1,"rgba(34, 197, 94, 0.05)"),t.fillStyle=o,t.fillRect(0,0,e.width,e.height),C(),p.forEach(s=>{s.update(),s.draw()}),b=requestAnimationFrame(m)};let b;m();const w=()=>{e&&(e.width=window.innerWidth,e.height=window.innerHeight,p.forEach(i=>i.reset()))};return window.addEventListener("resize",w),()=>{cancelAnimationFrame(b),window.removeEventListener("resize",w)}},[n]);const v=e=>{d({x:e.clientX,y:e.clientY})};return r.jsxs("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100vh",overflow:"hidden",background:"#0F172A",zIndex:-1},children:[r.jsx("style",{children:`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-25px) translateX(15px);
          }
          66% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
          }
          50% {
            box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
          }
        }
      `}),r.jsx("canvas",{ref:h,onMouseMove:v,style:{position:"absolute",top:0,left:0,zIndex:1}}),r.jsx("div",{style:{position:"absolute",inset:0,backgroundImage:`
          linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
        `,backgroundSize:"60px 60px",opacity:.4,zIndex:2}}),r.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:3},children:[...Array(10)].map((e,t)=>r.jsx("div",{style:{position:"absolute",width:`${8+t%3*3}px`,height:`${8+t%3*3}px`,backgroundColor:c[t%c.length],borderRadius:"50%",left:`${8+t*10}%`,top:`${15+t*8%70}%`,animation:`float ${5+t*.5}s ease-in-out infinite, pulse ${3+t*.4}s ease-in-out infinite, glow ${4+t*.3}s ease-in-out infinite`,animationDelay:`${t*.4}s`,color:c[t%c.length]}},t))}),r.jsx("div",{className:"background-container",children:r.jsxs("div",{className:"orbs-container",children:[r.jsx("div",{className:"orb orb-1"}),r.jsx("div",{className:"orb orb-2"}),r.jsx("div",{className:"orb orb-3"})]})}),r.jsx("div",{style:{position:"absolute",inset:0,background:"radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.6) 100%)",pointerEvents:"none",zIndex:4}})]})};export{Y as default};
