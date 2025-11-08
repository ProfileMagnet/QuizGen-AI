var z=Object.defineProperty;var X=(o,n,d)=>n in o?z(o,n,{enumerable:!0,configurable:!0,writable:!0,value:d}):o[n]=d;var s=(o,n,d)=>X(o,typeof n!="symbol"?n+"":n,d);import{r as u,j as l}from"./react-vendor-B9ZGZSHM.js";import"./vendor-DXIr2iB9.js";const I=()=>{const o=u.useRef(null),[n,d]=u.useState({x:window.innerWidth/2,y:window.innerHeight/2}),f=u.useMemo(()=>["#0EA5E9","#7C3AED","#22C55E","#E2E8F0"],[]);u.useEffect(()=>{const e=o.current;if(!e)return;const t=e.getContext("2d");if(!t)return;e.width=window.innerWidth,e.height=window.innerHeight;class v{constructor(){s(this,"x");s(this,"y");s(this,"baseX");s(this,"baseY");s(this,"size");s(this,"speedX");s(this,"speedY");s(this,"opacity");s(this,"color");s(this,"life");s(this,"maxLife");this.x=0,this.y=0,this.baseX=0,this.baseY=0,this.size=0,this.speedX=0,this.speedY=0,this.opacity=0,this.color="",this.life=0,this.maxLife=0,this.reset()}reset(){e&&(this.baseX=Math.random()*e.width,this.baseY=Math.random()*e.height,this.x=this.baseX,this.y=this.baseY,this.size=Math.random()*3+1,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.4+.3,this.color=f[Math.floor(Math.random()*f.length)],this.maxLife=Math.random()*200+200,this.life=0)}update(){if(!e)return;this.x+=this.speedX,this.y+=this.speedY,this.life++;const i=.001;this.x+=(this.baseX-this.x)*i,this.y+=(this.baseY-this.y)*i,this.x<-50&&(this.x=e.width+50),this.x>e.width+50&&(this.x=-50),this.y<-50&&(this.y=e.height+50),this.y>e.height+50&&(this.y=-50);const r=n.x-this.x,c=n.y-this.y,h=Math.sqrt(r*r+c*c);if(h<100){const x=(100-h)/100*.2;this.x+=r/h*x,this.y+=c/h*x}this.life>this.maxLife&&this.reset()}draw(){if(!t)return;let i=this.opacity;this.life<30?i*=this.life/30:this.life>this.maxLife-30&&(i*=(this.maxLife-this.life)/30),t.beginPath(),t.arc(this.x,this.y,this.size,0,Math.PI*2),t.fillStyle=this.color,t.globalAlpha=i,t.fill(),t.globalAlpha=1}}const p=Array.from({length:40},()=>new v),M=()=>{t&&p.forEach((a,i)=>{p.slice(i+1,i+8).forEach(r=>{const c=a.x-r.x,h=a.y-r.y,x=Math.sqrt(c*c+h*h);if(x<80){const A=(1-x/80)*.1;t.beginPath(),t.moveTo(a.x,a.y),t.lineTo(r.x,r.y),t.strokeStyle=a.color,t.globalAlpha=A,t.lineWidth=1,t.stroke(),t.globalAlpha=1}})})};let g=0;const E=1e3/30,y=a=>{if(!(!t||!e)){if(a-g<E){m=requestAnimationFrame(y);return}g=a,t.fillStyle="#0F172A",t.fillRect(0,0,e.width,e.height),M(),p.forEach(i=>{i.update(),i.draw()}),m=requestAnimationFrame(y)}};let m;y(0);const b=()=>{e&&(e.width=window.innerWidth,e.height=window.innerHeight,p.forEach(a=>a.reset()))};return window.addEventListener("resize",b),()=>{cancelAnimationFrame(m),window.removeEventListener("resize",b)}},[n,f]);const w=e=>{d({x:e.clientX,y:e.clientY})};return l.jsxs("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100vh",overflow:"hidden",background:"#0F172A",zIndex:-1},children:[l.jsx("style",{children:`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}),l.jsx("canvas",{ref:o,onMouseMove:w,style:{position:"absolute",top:0,left:0,zIndex:1}}),l.jsx("div",{style:{position:"absolute",inset:0,backgroundImage:`
          linear-gradient(rgba(14, 165, 233, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.02) 1px, transparent 1px)
        `,backgroundSize:"80px 80px",opacity:.3,zIndex:2}}),l.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:3},children:[...Array(5)].map((e,t)=>l.jsx("div",{style:{position:"absolute",width:`${6+t%2*2}px`,height:`${6+t%2*2}px`,backgroundColor:f[t%f.length],borderRadius:"50%",left:`${15+t*15}%`,top:`${20+t*12%60}%`,animation:`float ${6+t*.8}s ease-in-out infinite, pulse ${4+t*.3}s ease-in-out infinite`,animationDelay:`${t*.6}s`}},t))}),l.jsx("div",{style:{position:"absolute",inset:0,background:"radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)",pointerEvents:"none",zIndex:4}})]})};export{I as default};
