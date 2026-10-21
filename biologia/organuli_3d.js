/* organuli_3d.js - forme 3D degli organuli, nello stile delle illustrazioni dei libri di biologia.
   Usato da cellula_3D.html (e in seguito da osmosi_3D.html).
   © 2026 Prof. T. Tutti i diritti riservati.

   Uso:  const ORG = OrganuliCellula(THREE, M);
   M(colore, opacità, extra) è la funzione della pagina che crea i materiali
   (serve perché la pagina li attenua e li illumina quando si sceglie un organulo).
   Ogni funzione restituisce un THREE.Group centrato nell'origine; la pagina lo
   posiziona e lo ruota. I materiali con userData.clip = true vanno tagliati
   insieme agli involucri quando la vista è aperta. */
(function(){
function OrganuliCellula(THREE, M){
 const PI=Math.PI, D2=THREE.DoubleSide, V=(x,y,z)=>new THREE.Vector3(x,y,z);
 // numeri casuali ripetibili: la stessa cellula si ricostruisce sempre uguale
 const rng=seed=>{let s=(seed%2147483646)+1;return()=>(s=s*16807%2147483647)/2147483647;};
 const mesh=(g,m,p,ro)=>{const o=new THREE.Mesh(g,m);if(p)o.position.copy(p);if(ro)o.renderOrder=ro;return o;};
 const clip=m=>{m.userData.clip=true;return m;};
 // copie della stessa forma in tante posizioni (ribosomi, pori): un solo oggetto, più leggero
 function copie(geo,mat,list){const im=new THREE.InstancedMesh(geo,mat,list.length),o=new THREE.Object3D();
  list.forEach((t,i)=>{o.position.copy(t.p);if(t.q)o.quaternion.copy(t.q);else o.quaternion.identity();
   o.scale.setScalar(t.s||1);o.updateMatrix();im.setMatrixAt(i,o.matrix);});
  im.instanceMatrix.needsUpdate=true;return im;}
 const verso=(n,asse)=>new THREE.Quaternion().setFromUnitVectors(asse||V(0,1,0),n.clone().normalize());
 // punti distribuiti in modo uniforme su una sfera (spirale di Fibonacci)
 const fibo=(n,i)=>{const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996;return V(r*Math.cos(a),y,r*Math.sin(a));};

 /* Sacco appiattito ("cisterna"): una superficie a calotta, curva attorno all'origine,
    con uno spessore che si annulla sul bordo, così il sacco è chiuso.
    Rc raggio di curvatura, A ampiezza angolare, asp allungamento, w e k bordo ondulato,
    rip increspatura, T spessore, prof(r) profilo dello spessore dal centro (0) al bordo (1). */
 function sacco(o){
  const A=o.A||.6,Rc=o.Rc||1,T=o.T||.03,asp=o.asp||1,w=o.w||0,k=o.k||3,f0=o.f0||0,rip=o.rip||0,
   prof=o.prof||(r=>Math.sqrt(Math.max(0,1-r*r))),NR=o.nr||12,NA=o.na||44;
  function at(r,a,lato,piu){
   const e=1+w*Math.sin(k*a+f0),dx=A*r*e*asp*Math.cos(a),dz=A*r*e*Math.sin(a);
   const d=V(Math.sin(dx)*Math.cos(dz),Math.cos(dx)*Math.cos(dz),Math.sin(dz)).normalize();
   const R=Rc*(1+rip*Math.sin(3*dx/A+1.3+f0)*Math.sin(3*dz/A+f0));
   return {p:d.clone().multiplyScalar(R+lato*(T*prof(r)+(piu||0))),n:d.clone().multiplyScalar(lato)};}
  const pos=[],idx=[];
  [1,-1].forEach(lato=>{const b=pos.length/3;
   for(let i=0;i<=NR;i++)for(let j=0;j<NA;j++){const q=at(Math.sin(PI/2*i/NR),j/NA*2*PI,lato).p;pos.push(q.x,q.y,q.z);}
   for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const a=b+i*NA+j,c=b+i*NA+(j+1)%NA,d=a+NA,e=c+NA;
    if(lato>0)idx.push(a,d,c,c,d,e);else idx.push(a,c,d,c,e,d);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);g.computeVertexNormals();
  return {geo:g,at};}

 // ---------- membrana: doppio strato (si vede sul taglio) e proteine di trasporto ----------
 // Forma sferica di raggio R, oppure qualsiasi forma con o.interna (geometria dello strato interno)
 // e o.punto(dir) che restituisce {p,n}: punto della superficie nella direzione dir e sua normale.
 function membrana(R,o={}){const g=new THREE.Group(),r=rng(o.seed||3);
  const mi=clip(M(o.col||0xE0A070,o.oi||.22,{side:D2,depthWrite:false}));
  g.add(mesh(o.interna||new THREE.SphereGeometry(R-.035,48,36),mi,null,2));
  const punto=o.punto||(d=>({p:d.clone().multiplyScalar(R),n:d.clone()}));
  const pm=clip(M(o.prot||0xC9773F,1,{shininess:30})),L=[],N=o.n||46;
  for(let i=0;i<N;i++){const n=fibo(N,i);n.x+=(r()-.5)*.08;n.z+=(r()-.5)*.08;n.normalize();
   const q=punto(n);L.push({p:q.p.clone().addScaledVector(q.n,-.018),q:verso(q.n),s:.8+.5*r()});}
  g.add(copie(new THREE.SphereGeometry(.026,10,8),pm,L));
  return g;}

 // ---------- nucleo: sfera con uno spicchio aperto, come nei libri ----------
 // Lo spicchio tolto è quello con x>0 e z>0: la pagina lo ruota verso chi guarda.
 // Sulle due facce del taglio: doppio involucro (tre fasce) e nucleoplasma con la cromatina.
 function faccia(seed,col){ // disegno della faccia del taglio (cromatina), su tela
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),r=rng(seed),C=256;
  x.fillStyle=col.fondo;x.fillRect(0,0,512,512);
  // eucromatina: granuli chiari e fili sottili sparsi
  x.strokeStyle=col.chiara;x.lineWidth=3;x.lineCap='round';
  for(let i=0;i<70;i++){let a=r()*2*PI,d=r()*190,px=C+d*Math.cos(a),py=C+d*Math.sin(a);x.beginPath();x.moveTo(px,py);
   for(let k=0;k<4;k++){a+=(r()-.5)*2;px+=Math.cos(a)*14;py+=Math.sin(a)*14;x.lineTo(px,py);}x.stroke();}
  x.fillStyle=col.chiara;for(let i=0;i<260;i++){const a=r()*2*PI,d=Math.sqrt(r())*215;x.beginPath();x.arc(C+d*Math.cos(a),C+d*Math.sin(a),1.5+2*r(),0,2*PI);x.fill();}
  // eterocromatina: chiazze scure addossate all'involucro e qualche ammasso interno
  x.fillStyle=col.scura;
  for(let i=0;i<34;i++){const a=r()*2*PI,d=200+48*r(),w=10+18*r();
   for(let k=0;k<5;k++){const aa=a+(r()-.5)*.12,dd=d-r()*w;x.beginPath();x.arc(C+dd*Math.cos(aa),C+dd*Math.sin(aa),5+w*.45*r(),0,2*PI);x.fill();}}
  for(let i=0;i<8;i++){const a=r()*2*PI,d=60+120*r();for(let k=0;k<5;k++){x.beginPath();x.arc(C+d*Math.cos(a)+(r()-.5)*24,C+d*Math.sin(a)+(r()-.5)*24,4+7*r(),0,2*PI);x.fill();}}
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;}
 function nucleo(rn,o={}){const g=new THREE.Group(),r=rng(o.seed||11),P0=PI,PL=1.5*PI;
  const cE=o.col||0x8F7BCF,cS=o.spazio||0xE6DEF7,cI=o.int||0x6E5AB8,colF={fondo:'#C9BCEB',chiara:'#E4DCF7',scura:'#5B48A3'};
  const mE=M(cE,1,{side:D2,shininess:60}),mI=M(cI,1,{side:D2}),mS=M(cS,1,{side:D2});
  // superficie esterna e interna dell'involucro, senza lo spicchio
  g.add(mesh(new THREE.SphereGeometry(rn,48,36,P0,PL),mE));
  g.add(mesh(new THREE.SphereGeometry(rn*.9,40,30,P0,PL),M(0xB3A3E0,1,{side:D2})));
  // facce del taglio: mezzo disco sul piano z=0 (x>0) e mezzo disco sul piano x=0 (z>0)
  const facce=[new THREE.Group(),new THREE.Group()];facce[1].rotation.y=-PI/2;
  facce.forEach((fg,i)=>{
   fg.add(mesh(new THREE.CircleGeometry(rn*.9,64,-PI/2,PI),M(0xC8C8C8,1,{side:D2,map:faccia(41+i*7,colF),shininess:5})));
   [[.9,.935,mI],[.935,.965,mS],[.965,1,mE]].forEach(([a,b,m])=>fg.add(mesh(new THREE.RingGeometry(rn*a,rn*b,64,1,-PI/2,PI),m)));
   g.add(fg);});
  // pori nucleari sulla superficie esterna (non nello spicchio aperto)
  const pm=M(0x3E2F7A,1),L=[],N=o.pori||170;
  for(let i=0;i<N;i++){const n=fibo(N,i);if(n.x>-.05&&n.z>-.05)continue;
   L.push({p:n.clone().multiplyScalar(rn*1.003),q:verso(n,V(0,0,1))});}
  g.add(copie(new THREE.TorusGeometry(rn*.034,rn*.013,6,14),pm,L));
  const cm=M(0x231A4D,1);g.add(copie(new THREE.CircleGeometry(rn*.023,10),cm,L.map(t=>({p:t.p.clone().multiplyScalar(1.001),q:t.q}))));
  return g;}
 function nucleolo(rr,o={}){const g=new THREE.Group(),geo=new THREE.SphereGeometry(rr,24,18),p=geo.attributes.position,v=V(0,0,0);
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const f=1+.09*Math.sin(v.x*31)*Math.sin(v.y*27+1)*Math.sin(v.z*23+2);p.setXYZ(i,v.x*f,v.y*f,v.z*f);}
  geo.computeVertexNormals();g.add(mesh(geo,M(o.col||0x4A3990,1,{shininess:25})));return g;}

 // ---------- RER: pila di cisterne ondulate attorno al nucleo, coperte di ribosomi ----------
 // Le cisterne sono calotte attorno all'origine (centro del nucleo), rivolte verso +Y.
 // La prima nasce dalla membrana esterna del nucleo; le altre sono unite tra loro da brevi colli.
 function rer(rn,o={}){const g=new THREE.Group(),r=rng(o.seed||5),n=o.n||4;
  const sm=M(o.col||0x5578A8,1,{side:D2,shininess:50}),rm=M(o.rib||0x22385E,1),L=[],S=[];
  for(let i=0;i<n;i++){const s=sacco({Rc:rn*(1.12+.25*i),A:(o.A||.7)-.05*i,asp:o.asp||1.45,T:rn*.07,w:.15,k:4,f0:i*1.3,rip:.035,nr:18,na:72,
    prof:x=>Math.sqrt(Math.max(0,1-Math.pow(x,6)))});
   g.add(mesh(s.geo,sm));S.push(s);
   for(let j=0;j<(o.ribo||170);j++){const q=s.at(Math.sqrt(r())*.97,r()*2*PI,r()<.5?1:-1,rn*.028);L.push({p:q.p,s:.8+.4*r()});}}
  // colli: brevi tubi larghi di membrana, con le estremità che si allargano nelle cisterne
  const collo=(p1,p2,rr)=>{const pts=[];for(let k=0;k<=6;k++)pts.push(p1.clone().lerp(p2,k/6));
   const c=new THREE.CatmullRomCurve3(pts),tg=new THREE.TubeGeometry(c,8,1,12,false),pp=tg.attributes.position,v=V(0,0,0),cen=V(0,0,0);
   for(let k=0;k<pp.count;k++){v.fromBufferAttribute(pp,k);const t=Math.floor(k/13)/8;c.getPoint(t,cen);
    const f=rr*(1+1.4*Math.pow(Math.abs(2*t-1),3));v.sub(cen).multiplyScalar(f).add(cen);pp.setXYZ(k,v.x,v.y,v.z);}
   tg.computeVertexNormals();g.add(mesh(tg,sm));};
  for(let i=0;i+1<n;i++)for(let j=0;j<3;j++){const a=r()*2*PI,rr=.3+.45*r();collo(S[i].at(rr,a,1).p,S[i+1].at(rr,a,-1).p,rn*.05);}
  for(let j=0;j<4;j++){const a=j*PI/2+.6,q=S[0].at(.35+.3*r(),a,-1).p;collo(q.clone().normalize().multiplyScalar(rn*.995),q,rn*.05);}
  g.add(copie(new THREE.SphereGeometry(rn*.03,8,6),rm,L));
  return g;}

 // ---------- REL: rete di tubuli ramificati, senza ribosomi ----------
 function rel(dim,o={}){const g=new THREE.Group(),r=rng(o.seed||9),m=M(o.col||0x7FA6C9,1,{shininess:60}),nodi=[],nx=4,ny=2,nz=3;
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)
   nodi.push(V((i/(nx-1)-.5)*dim*1.4+(r()-.5)*dim*.25,(j/(ny-1)-.5)*dim*.45+(r()-.5)*dim*.15,(k/(nz-1)-.5)*dim+(r()-.5)*dim*.25));
  const id=(i,j,k)=>(i*ny+j)*nz+k,rt=dim*.042,sg=new THREE.SphereGeometry(rt*1.25,10,8);
  const tubo=(a,b)=>{const mid=a.clone().add(b).multiplyScalar(.5).add(V(r()-.5,r()-.5,r()-.5).multiplyScalar(a.distanceTo(b)*.35));
   g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a,mid,b]),12,rt,7,false),m));};
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++){const a=nodi[id(i,j,k)];
   if(i+1<nx&&r()<.85)tubo(a,nodi[id(i+1,j,k)]);if(k+1<nz&&r()<.75)tubo(a,nodi[id(i,j,k+1)]);if(j+1<ny&&r()<.45)tubo(a,nodi[id(i,j+1,k)]);}
  nodi.forEach(p=>g.add(mesh(sg,m,p)));
  // qualche ramo che termina libero
  for(let i=0;i<5;i++){const a=nodi[Math.floor(r()*nodi.length)];tubo(a,a.clone().add(V(r()-.5,r()-.5,r()-.5).normalize().multiplyScalar(dim*.35)));}
  return g;}

 // ---------- apparato di Golgi: pila di sacchi curvi con i bordi rigonfi e vescicole ----------
 // Lato di entrata (concavo, verso il RER) in basso, lato di uscita (convesso) verso +Y.
 function golgi(o={}){const g=new THREE.Group(),r=rng(o.seed||17),n=o.n||6,sc=o.s||1,Rc0=.9*sc,dR=.07*sc;
  const c1=new THREE.Color(o.cis||0xA34B6C),c2=new THREE.Color(o.trans||0xD99AB2),vm=M(o.ves||0xCC86A1,1,{shininess:70});
  const vg=new THREE.SphereGeometry(.042*sc,14,10),off=V(0,-(Rc0+dR*(n-1)/2),0);
  for(let i=0;i<n;i++){const col=c1.clone().lerp(c2,i/(n-1)),A=.42-.03*i,s=sacco({Rc:Rc0+dR*i,A,asp:1.75,T:.02*sc,w:.1,k:3,f0:i*1.1,rip:.02,nr:18,na:64,
    prof:x=>(.4+1.2*Math.pow(x,6))*Math.sqrt(Math.max(0,1-Math.pow(x,12)))});
   g.add(mesh(s.geo,M(col.getHex(),1,{side:D2,shininess:60}),off));
   // vescicole che si staccano dai bordi
   for(let j=0;j<3;j++){const a=r()*2*PI,q=s.at(1,a,1).p,dir=V(q.x,0,q.z).normalize();
    g.add(mesh(vg,M(col.getHex(),1,{shininess:70}),q.add(off).addScaledVector(dir,.045*sc+.035*sc*r())));}}
  // vescicole sul lato di entrata (dal RER) e sul lato di uscita (verso la membrana)
  for(let j=0;j<4;j++){const a=r()*2*PI,d=.1*sc+.12*sc*r();
   g.add(mesh(vg,M(c1.getHex(),1,{shininess:70}),V(Math.cos(a)*d*1.5,-dR*n*.5-.06*sc-.05*sc*r()-.08*sc,Math.sin(a)*d)));}
  for(let j=0;j<6;j++){const a=r()*2*PI,d=.15*sc+.14*sc*r();
   g.add(mesh(vg,vm,V(Math.cos(a)*d*1.6,dR*n*.5+.1*sc+.07*sc*r(),Math.sin(a)*d)));}
  return g;}

 // ---------- cloroplasto: tagliato a metà, doppia membrana, grani di tilacoidi e lamelle ----------
 // Asse lungo X, la parte aperta rivolta verso +Z.
 function cloroplasto(o={}){const g=new THREE.Group(),a=o.a||.3,b=o.b||.12,c=o.c||.15,r=rng(o.seed||51);
  const mE=M(o.est||0x5E9B3E,1,{side:D2,shininess:45}),mS=M(0xDDEFC8,1,{side:D2}),mI=M(0x3F7F2A,1,{side:D2}),
   mSt=M(o.stroma||0xB9DC93,1,{side:D2,shininess:15});
  const meta=(rr)=>{const ge=new THREE.SphereGeometry(rr,48,24,PI,PI);ge.scale(a,b,c);return ge;};
  g.add(mesh(meta(1),mE),mesh(meta(.88),mSt));
  [[.88,.92,mI],[.92,.95,mS],[.95,1,mE]].forEach(([r1,r2,m])=>{const ge=new THREE.RingGeometry(r1,r2,64,1);ge.scale(a,b,1);g.add(mesh(ge,m));});
  // grani: pile di dischi (tilacoidi), due toni alternati
  const t1=M(0x2E6B1F,1,{shininess:40}),t2=M(0x4C9634,1,{shininess:40}),dg=new THREE.CylinderGeometry(1,1,1,20),gr=[];
  const ng=o.grani||8;
  for(let i=0;i<ng;i++){const x=-a*.7+a*1.4*(i+.5)/ng,lim=Math.sqrt(Math.max(0,1-(x/a)**2)),h=b*.8*lim,ro=Math.min(c*.2,b*.24),
    z=-c*.5*lim,y0=(r()-.5)*b*.25,nd=Math.max(3,Math.floor(h/(b*.1)));
   gr.push({x,y0,z,ro,nd});
   for(let k=0;k<nd;k++){const d=mesh(dg,k%2?t2:t1,V(x,y0+(k-(nd-1)/2)*b*.1,z));d.scale.set(ro,b*.065,ro*.9);g.add(d);}}
  // lamelle dello stroma: nastri sottili che uniscono i grani vicini
  const lm=M(0x4C9634,1,{side:D2});
  for(let i=0;i+1<gr.length;i++)for(let k=0;k<2;k++){const p=gr[i],q=gr[i+1],y1=p.y0+(k?.18:-.12)*b,y2=q.y0+(k?-.1:.2)*b,
    L=Math.hypot(q.x-p.x,y2-y1),bx=new THREE.PlaneGeometry(L,c*.3),m=mesh(bx,lm,V((p.x+q.x)/2,(y1+y2)/2,(p.z+q.z)/2));
   m.rotation.set(PI/2,0,0);m.rotateOnWorldAxis(V(0,0,1),Math.atan2(y2-y1,q.x-p.x));g.add(m);}
  // granulo di amido e qualche ribosoma del cloroplasto
  const am=mesh(new THREE.SphereGeometry(1,16,12),M(0xE8E2C8,1,{shininess:30}),V(a*.05,-b*.45,-c*.55));am.scale.set(a*.16,b*.18,c*.18);g.add(am);
  return g;}

 // ---------- mitocondrio: a fagiolo, tagliato a metà come nei libri ----------
 // Membrana esterna liscia; membrana interna continua, ripiegata verso il centro nelle creste.
 // Sul taglio si vedono le due membrane come due fasce, con lo spazio intermembrana tra loro.
 // Asse lungo X, la parte aperta rivolta verso +Z.
 function mitocondrio(o={}){const g=new THREE.Group(),L=o.L||.46,R=o.R||.16,H=L/2+R,nc=o.creste||9,
   CUR=o.curva==null?.45:o.curva,NY=o.ny||360,NF=o.nf||36;
  // raggio della sezione lungo l'asse: tratto cilindrico e due estremità arrotondate
  const rho=y=>{const e=Math.abs(y)-L/2;return e<=0?R:R*Math.sqrt(Math.max(0,1-(e/R)**2));};
  // creste: posizione lungo l'asse e lato da cui partono (alternato)
  const yc=[];for(let i=0;i<nc;i++)yc.push(-H*.78+H*1.56*(i+.5)/nc);
  const piega=(y,f)=>{let d=0;yc.forEach((c,i)=>{const lato=i%2?(1-Math.cos(f))/2:(1+Math.cos(f))/2,
    k=Math.exp(-Math.pow((y-c)/(R*.085),4));d=Math.max(d,k*(.25+.75*lato));});return d*.62;};
  const E1=1,E2=.9,I1=.8,I2=.72;   // raggi relativi: membrana esterna (fuori, dentro), interna (fuori, dentro)
  // punto della superficie: s raggio relativo, conPiega se segue le creste; poi curvatura a fagiolo
  const P=(y,f,s,conPiega)=>{const r=rho(y),rr=Math.max(r*.02,r*(s-(conPiega?piega(y,f):0)));
   return V(rr*Math.sin(f),y,rr*Math.cos(f)-CUR*R*((y/H)**2-.35));};
  const ys=[];for(let i=0;i<=NY;i++)ys.push(-H*Math.cos(PI*i/NY));
  // superficie a metà (angolo da 0 a PI)
  function superficie(s,conPiega){const pos=[],idx=[];
   ys.forEach(y=>{for(let j=0;j<=NF;j++){const q=P(y,PI*j/NF,s,conPiega);pos.push(q.x,q.y,q.z);}});
   for(let i=0;i<NY;i++)for(let j=0;j<NF;j++){const a=i*(NF+1)+j,b=a+1,c=a+NF+1,d=c+1;idx.push(a,c,b,b,c,d);}
   const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ge.setIndex(idx);ge.computeVertexNormals();return ge;}
  // fascia sul piano del taglio, tra due raggi relativi, sui due bordi (angolo 0 e PI)
  function fascia(s1,p1,s2,p2){const pos=[],idx=[];
   [0,PI].forEach(f=>{const b=pos.length/3;
    ys.forEach(y=>{const a=P(y,f,s1,p1),c=P(y,f,s2,p2);pos.push(a.x,a.y,a.z,c.x,c.y,c.z);});
    for(let i=0;i<NY;i++){const a=b+2*i;idx.push(a,a+1,a+2,a+1,a+3,a+2);}});
   const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ge.setIndex(idx);ge.computeVertexNormals();return ge;}
  const mE=M(o.est||0xE3803F,1,{side:D2,shininess:45}),mS=M(o.spazio||0xFBE0C4,1,{side:D2,shininess:10}),
   mI=M(o.int||0xC8552A,1,{side:D2,shininess:25}),mM=M(o.matrice||0xF4A774,1,{side:D2,shininess:35});
  const inn=new THREE.Group();
  inn.add(mesh(superficie(E1,false),mE));            // superficie esterna, liscia
  inn.add(mesh(superficie(I2,true),mM));             // membrana interna vista dalla matrice, con le creste
  inn.add(mesh(fascia(E1,false,E2,false),mE));       // bordo della membrana esterna
  inn.add(mesh(fascia(E2,false,I1,true),mS));        // spazio intermembrana (entra anche nelle creste)
  inn.add(mesh(fascia(I1,true,I2,true),mI));         // bordo della membrana interna, ondulato
  // poche granulazioni nella matrice (ribosomi e DNA del mitocondrio)
  const dm=M(0x8B3A1A,1),dg=new THREE.SphereGeometry(R*.05,8,6),rr=rng(o.seed||23);
  for(let i=0;i<7;i++){const y=(rr()-.5)*L,f=PI*(.25+.5*rr()),q=P(y,f,.3,false);inn.add(mesh(dg,dm,q));}
  // dal sistema di costruzione (asse Y, apertura verso -X) a quello finale (asse X, apertura verso +Z)
  inn.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0,0,-1),V(1,0,0),V(0,-1,0)));
  g.add(inn);return g;}

 // ---------- vacuolo: sacca d'acqua avvolta dalla sua membrana (tonoplasto) ----------
 function vacuolo(rad,o={}){const g=new THREE.Group();
  g.add(mesh(new THREE.SphereGeometry(1,40,30),M(o.col||0x9CCDE8,o.o||.62,{side:D2,depthWrite:o.o>.75,shininess:90}),null,1));
  const t=mesh(new THREE.SphereGeometry(1.02,40,30),M(o.ton||0x5E9CC4,.25,{side:D2,depthWrite:false}),null,1);g.add(t);
  // qualche cristallo e sostanza disciolta accumulata dentro
  const r=rng(o.seed||61),cm=M(o.dentro||0x6FA3C7,.9),cg=new THREE.OctahedronGeometry(.035,0);
  for(let i=0;i<9;i++)g.add(mesh(cg,cm,fibo(9,i).multiplyScalar(.35+.4*r())));
  g.scale.set(...rad);return g;}
 // ---------- glicogeno: granuli raccolti in rosette ----------
 function glicogeno(rad,o={}){const g=new THREE.Group(),r=rng(o.seed||71),L=[];
  for(let c=0;c<7;c++){const cen=V(r()-.5,r()-.5,r()-.5).normalize().multiplyScalar(rad*Math.sqrt(r()));
   for(let i=0;i<7;i++)L.push({p:cen.clone().add(fibo(7,i).multiplyScalar(rad*.22)),s:.8+.4*r()});}
  g.add(copie(new THREE.SphereGeometry(.03,10,8),M(o.col||0xD9A62E,1,{shininess:55}),L));return g;}

 // ---------- lisosoma: vescicola con enzimi digestivi ----------
 function lisosoma(rr,o={}){const g=new THREE.Group(),r=rng(o.seed||29);
  g.add(mesh(new THREE.SphereGeometry(rr,20,15),M(o.col||0xC9763E,.55,{depthWrite:false,shininess:80}),null,1));
  const dm=M(o.int||0x8A3F14,1),dg=new THREE.SphereGeometry(rr*.16,8,6);
  for(let i=0;i<7;i++)g.add(mesh(dg,dm,fibo(7,i).multiplyScalar(rr*(.25+.4*r()))));
  return g;}

 // ---------- ribosomi liberi: granuli sparsi e piccole catene (poliribosomi) ----------
 function ribosomi(Rmax,o={}){const g=new THREE.Group(),r=rng(o.seed||31),L=[],evita=o.evita||[];
  const libero=p=>evita.every(([c,rad])=>p.distanceTo(c)>rad);
  let t=0;while(L.length<(o.n||60)&&t++<4000){const p=V(r()-.5,r()-.5,r()-.5).multiplyScalar(2*Rmax);
   if(p.length()<Rmax&&libero(p))L.push({p,s:.8+.4*r()});}
  for(let c=0;c<(o.catene||5);c++){let p,u=0;do p=V(r()-.5,r()-.5,r()-.5).multiplyScalar(1.6*Rmax);while((p.length()>Rmax*.9||!libero(p))&&u++<200);
   const a=V(r()-.5,r()-.5,r()-.5).normalize(),b=V(r()-.5,r()-.5,r()-.5).cross(a).normalize();
   for(let i=0;i<6;i++){const f=i*.9;L.push({p:p.clone().addScaledVector(a,Math.cos(f)*.06).addScaledVector(b,Math.sin(f)*.06).addScaledVector(a.clone().cross(b),i*.03)});}}
  g.add(copie(new THREE.SphereGeometry(o.r||.021,8,6),M(o.col||0x843C0C,1),L));
  return g;}

 // ---------- centrioli: due cilindri perpendicolari, ciascuno con 9 triplette di microtubuli ----------
 function centrioli(o={}){const g=new THREE.Group(),s=o.s||1,L=[],h=.2*s;
  const cent=(c,q)=>{for(let k=0;k<9;k++){const a=k*2*PI/9,rad=V(Math.cos(a),0,Math.sin(a)),tg=V(-Math.sin(a),0,Math.cos(a)),
    d=rad.clone().multiplyScalar(Math.cos(.9)).addScaledVector(tg,Math.sin(.9));
    for(let j=0;j<3;j++)L.push({p:rad.clone().multiplyScalar(.072*s).addScaledVector(d,(j-1)*.021*s).applyQuaternion(q).add(c),q});}};
  cent(V(0,0,0),new THREE.Quaternion());
  cent(V(.06*s,h*.62,0),new THREE.Quaternion().setFromAxisAngle(V(0,0,1),PI/2));
  g.add(copie(new THREE.CylinderGeometry(.011*s,.011*s,h,8),M(o.col||0xD4A62A,1,{shininess:60}),L));
  return g;}

 // ---------- citoscheletro: microtubuli che partono dal centrosoma verso la membrana ----------
 function citoscheletro(da,Rmax,o={}){const g=new THREE.Group(),r=rng(o.seed||37),N=o.n||14,m=clip(M(o.col||0x6FA89A,.5,{shininess:30,depthWrite:false}));
  for(let i=0;i<N;i++){const n=fibo(N,i),fine=n.clone().multiplyScalar(Rmax*(.9+.06*r())),pts=[da.clone()];
   for(let s=1;s<=4;s++){const f=s/4;pts.push(da.clone().lerp(fine,f).add(V(r()-.5,r()-.5,r()-.5).multiplyScalar(.12*Math.sin(PI*f))));}
   g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,o.r||.006,5,false),m));}
  return g;}

 return {cloroplasto,vacuolo,glicogeno,sacco,membrana,nucleo,nucleolo,rer,rel,golgi,mitocondrio,lisosoma,ribosomi,centrioli,citoscheletro,rng,fibo,verso};
}
window.OrganuliCellula=OrganuliCellula;
})();
